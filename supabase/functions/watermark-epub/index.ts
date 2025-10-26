import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    const { bookId, buyerWallet, transactionHash } = await req.json();

    if (!bookId || !buyerWallet || !transactionHash) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Watermarking EPUB for:', { bookId, buyerWallet, transactionHash });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Check if file is EPUB
    if (!book.pdf_url.endsWith('.epub')) {
      return new Response(
        JSON.stringify({ error: 'Not an EPUB file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download the EPUB file
    const { data: epubData, error: downloadError } = await supabase.storage
      .from('book-pdfs')
      .download(book.pdf_url);

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
