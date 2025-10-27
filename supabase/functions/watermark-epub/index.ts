import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate input parameters
    const requestSchema = z.object({
      bookId: z.string().uuid('Invalid book ID format'),
      buyerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address'),
      transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
    });

    const body = await req.json();
    const validation = requestSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('Validation error:', validation.error.format());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input parameters',
          details: validation.error.format()
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { bookId, buyerWallet, transactionHash } = validation.data;
    console.log('Watermarking EPUB for:', { bookId, buyerWallet: buyerWallet.substring(0, 10) + '...' });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // SECURITY: Verify purchase exists and check download limits
    const { data: purchase, error: purchaseError } = await supabase
      .from('marketplace_purchases')
      .select('download_count')
      .eq('book_id', bookId)
      .eq('buyer_wallet', buyerWallet.toLowerCase())
      .eq('transaction_hash', transactionHash)
      .single();

    if (purchaseError || !purchase) {
      console.error('Purchase verification failed:', purchaseError);
      return new Response(
        JSON.stringify({ error: 'Purchase not found or invalid. Please ensure you have purchased this book.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check download limit
    if (purchase.download_count >= 5) {
      console.error('Download limit exceeded for purchase');
      return new Response(
        JSON.stringify({ error: 'Download limit exceeded. You have reached the maximum of 5 downloads for this purchase.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Purchase verified. Download count:', purchase.download_count);

    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('marketplace_books')
      .select('pdf_url, title')
      .eq('id', bookId)
      .single();

    if (bookError || !book) {
      console.error('Book not found:', bookError);
      return new Response(
        JSON.stringify({ error: 'Book not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract file path from URL if it's a full URL
    let filePath = book.pdf_url;
    if (filePath.includes('/storage/v1/object/')) {
      const urlParts = filePath.split('/storage/v1/object/public/book-pdfs/');
      if (urlParts.length > 1) {
        filePath = urlParts[1];
      }
    } else if (filePath.startsWith('http')) {
      const match = filePath.match(/book-pdfs\/(.+)$/);
      if (match) {
        filePath = match[1];
      }
    }

    console.log('📥 Downloading file from path:', filePath);

    // Check if file is EPUB
    if (!filePath.endsWith('.epub')) {
      return new Response(
        JSON.stringify({ error: 'Not an EPUB file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download the EPUB file
    const { data: epubData, error: downloadError } = await supabase.storage
      .from('book-pdfs')
      .download(filePath);

    if (downloadError || !epubData) {
      console.error('Failed to download EPUB:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Failed to download EPUB' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // EPUB is a ZIP file, we need to extract, modify, and repackage
    // For now, we'll use JSZip to manipulate the EPUB
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default;
    
    const zip = new JSZip();
    const epubZip = await zip.loadAsync(await epubData.arrayBuffer());

    // Create watermark text
    const watermarkText = `
    <!-- Digital Rights Management Watermark -->
    <!-- Purchased by: ${buyerWallet} -->
    <!-- Transaction: ${transactionHash} -->
    <!-- Book ID: ${bookId} -->
    <!-- Timestamp: ${new Date().toISOString()} -->
    `;

    // Add watermark to content.opf (metadata file)
    const contentOpf = await epubZip.file('OEBPS/content.opf')?.async('string') ||
                       await epubZip.file('content.opf')?.async('string');
    
    if (contentOpf) {
      const watermarkedContent = contentOpf.replace(
        '</metadata>',
        `  <meta property="watermark:wallet">${buyerWallet}</meta>
  <meta property="watermark:transaction">${transactionHash}</meta>
  <meta property="watermark:timestamp">${new Date().toISOString()}</meta>
</metadata>`
      );
      
      const opfPath = epubZip.file('OEBPS/content.opf') ? 'OEBPS/content.opf' : 'content.opf';
      epubZip.file(opfPath, watermarkedContent);
    }

    // Add watermark HTML comment to all HTML/XHTML files
    const htmlFiles = Object.keys(epubZip.files).filter(
      name => name.endsWith('.html') || name.endsWith('.xhtml')
    );

    for (const filename of htmlFiles) {
      const content = await epubZip.file(filename)?.async('string');
      if (content) {
        const watermarkedHtml = content.replace(
          '<body',
          `${watermarkText}\n<body`
        );
        epubZip.file(filename, watermarkedHtml);
      }
    }

    // Generate watermarked EPUB
    const watermarkedEpub = await epubZip.generateAsync({ 
      type: 'arraybuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    // Upload watermarked EPUB
    const watermarkedPath = `watermarked/${buyerWallet}/${bookId}-${Date.now()}.epub`;
    const { error: uploadError } = await supabase.storage
      .from('book-pdfs')
      .upload(watermarkedPath, watermarkedEpub, {
        contentType: 'application/epub+zip',
        upsert: false
      });

    if (uploadError) {
      console.error('Failed to upload watermarked EPUB:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload watermarked EPUB' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate signed URL for download (valid for 1 hour)
    const { data: signedUrl, error: signError } = await supabase.storage
      .from('book-pdfs')
      .createSignedUrl(watermarkedPath, 3600);

    if (signError || !signedUrl) {
      console.error('Failed to generate signed URL:', signError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate download URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('EPUB watermarked successfully:', watermarkedPath);

    return new Response(
      JSON.stringify({ 
        downloadUrl: signedUrl.signedUrl,
        message: 'EPUB watermarked successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in watermark-epub function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
