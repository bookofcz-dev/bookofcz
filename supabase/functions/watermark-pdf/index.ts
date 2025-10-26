import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

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

    console.log('Watermarking PDF for:', { bookId, buyerWallet, transactionHash });

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

    // Check if file is PDF
    if (!book.pdf_url.endsWith('.pdf')) {
      return new Response(
        JSON.stringify({ error: 'Not a PDF file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download the PDF file
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('book-pdfs')
      .download(book.pdf_url);

    if (downloadError || !pdfData) {
      console.error('Failed to download PDF:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Failed to download PDF' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Load the PDF
    const pdfBytes = await pdfData.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Get font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 8;

    // Create watermark text
    const watermarkText = `Purchased by: ${buyerWallet.substring(0, 10)}...${buyerWallet.substring(buyerWallet.length - 8)} | TX: ${transactionHash.substring(0, 10)}...`;
    const timestamp = new Date().toISOString();

    // Add watermark to all pages
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      
      // Bottom watermark
      page.drawText(watermarkText, {
        x: 50,
        y: 20,
        size: fontSize,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.5,
      });

      // Top right corner - timestamp
      page.drawText(timestamp, {
        x: width - 150,
        y: height - 20,
        size: fontSize - 2,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.3,
      });
    });

    // Add metadata
    pdfDoc.setTitle(book.title);
    pdfDoc.setSubject(`Purchased by ${buyerWallet}`);
    pdfDoc.setKeywords([buyerWallet, transactionHash, bookId]);
    pdfDoc.setProducer('BookofCZ Marketplace');
    pdfDoc.setCreator('BookofCZ DRM System');

    // Save watermarked PDF
    const watermarkedPdfBytes = await pdfDoc.save();

    // Upload watermarked PDF
    const watermarkedPath = `watermarked/${buyerWallet}/${bookId}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('book-pdfs')
      .upload(watermarkedPath, watermarkedPdfBytes, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Failed to upload watermarked PDF:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload watermarked PDF' }),
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

    console.log('PDF watermarked successfully:', watermarkedPath);

    return new Response(
      JSON.stringify({ 
        downloadUrl: signedUrl.signedUrl,
        message: 'PDF watermarked successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in watermark-pdf function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
