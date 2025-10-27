import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
}

interface SecurityReport {
  safe: boolean;
  score: number; // 0-100
  issues: SecurityIssue[];
  metadata: {
    fileSize: number;
    isPDFValid: boolean;
    hasJavaScript: boolean;
    hasEmbeddedFiles: boolean;
    hasExternalLinks: boolean;
    isEncrypted: boolean;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfUrl } = await req.json();

    if (!pdfUrl) {
      throw new Error('PDF URL is required');
    }

    console.log('Scanning PDF:', pdfUrl);
    console.log('PDF URL type:', typeof pdfUrl);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract bucket and path from URL
    // Handle three formats:
    // 1. Full URL: https://xxx.supabase.co/storage/v1/object/public/bucket/path
    // 2. Relative URL: /storage/v1/object/public/bucket/path  
    // 3. Just path: bucket/path or uuid/filename
    let bucket: string;
    let path: string;

    const fullUrlMatch = pdfUrl.match(/https?:\/\/[^\/]+\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    const relativeUrlMatch = pdfUrl.match(/^\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    
    if (fullUrlMatch) {
      [, bucket, path] = fullUrlMatch;
      console.log('Parsed as full URL - Bucket:', bucket, 'Path:', path);
    } else if (relativeUrlMatch) {
      [, bucket, path] = relativeUrlMatch;
      console.log('Parsed as relative URL - Bucket:', bucket, 'Path:', path);
    } else {
      // Assume it's just a path - try book-pdfs bucket (current default for uploads)
      path = pdfUrl;
      bucket = 'book-pdfs';
      console.log('Parsed as direct path - Trying bucket:', bucket, 'Path:', path);
    }
    
    // Validate bucket is from trusted sources only
    const allowedBuckets = ['book-pdfs', 'marketplace'];
    if (!allowedBuckets.includes(bucket)) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized bucket access',
          message: 'PDF scanning is only allowed for marketplace content'
        }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download PDF file
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(path);

    if (downloadError) throw downloadError;

    // Convert blob to array buffer for analysis
    const arrayBuffer = await pdfData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const fileSize = uint8Array.length;

    console.log(`PDF file size: ${fileSize} bytes`);

    // Perform security checks
    const report: SecurityReport = {
      safe: true,
      score: 100,
      issues: [],
      metadata: {
        fileSize,
        isPDFValid: false,
        hasJavaScript: false,
        hasEmbeddedFiles: false,
        hasExternalLinks: false,
        isEncrypted: false,
      }
    };

    // Check 1: Verify PDF header
    const header = String.fromCharCode(...uint8Array.slice(0, 5));
    if (header === '%PDF-') {
      report.metadata.isPDFValid = true;
    } else {
      report.issues.push({
        severity: 'critical',
        category: 'File Format',
        message: 'File does not have a valid PDF header'
      });
      report.safe = false;
      report.score -= 50;
    }

    // Check 2: File size validation
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (fileSize > maxSize) {
      report.issues.push({
        severity: 'medium',
        category: 'File Size',
        message: `File size (${(fileSize / 1024 / 1024).toFixed(2)}MB) exceeds recommended maximum (100MB)`
      });
      report.score -= 10;
    }

    if (fileSize < 100) {
      report.issues.push({
        severity: 'high',
        category: 'File Size',
        message: 'File is suspiciously small and may be corrupted'
      });
      report.safe = false;
      report.score -= 30;
    }

    // Convert to text for pattern analysis
    const textContent = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);

    // Check 3: JavaScript detection
    const jsPatterns = [
      '/JavaScript',
      '/JS',
      'app.alert',
      'this.submitForm',
      'this.exportDataObject'
    ];
    
    for (const pattern of jsPatterns) {
      if (textContent.includes(pattern)) {
        report.metadata.hasJavaScript = true;
        report.issues.push({
          severity: 'high',
          category: 'JavaScript',
          message: `PDF contains JavaScript code (${pattern}). This can be used for malicious purposes.`
        });
        report.safe = false;
        report.score -= 40;
        break;
      }
    }

    // Check 4: Embedded files detection
    const embeddedPatterns = ['/EmbeddedFile', '/FileAttachment'];
    for (const pattern of embeddedPatterns) {
      if (textContent.includes(pattern)) {
        report.metadata.hasEmbeddedFiles = true;
        report.issues.push({
          severity: 'medium',
          category: 'Embedded Files',
          message: 'PDF contains embedded files which could pose security risks'
        });
        report.score -= 20;
        break;
      }
    }

    // Check 5: External links detection
    const urlPattern = /https?:\/\/[^\s)>]+/g;
    const urls = textContent.match(urlPattern);
    if (urls && urls.length > 0) {
      report.metadata.hasExternalLinks = true;
      
      // Check for suspicious domains
      const suspiciousDomains = urls.filter(url => 
        !url.includes('binance.com') && 
        !url.includes('supabase.co') &&
        !url.includes('github.com')
      );

      if (suspiciousDomains.length > 10) {
        report.issues.push({
          severity: 'medium',
          category: 'External Links',
          message: `PDF contains ${suspiciousDomains.length} external links. Review for phishing attempts.`
        });
        report.score -= 15;
      }
    }

    // Check 6: Encryption detection
    if (textContent.includes('/Encrypt')) {
      report.metadata.isEncrypted = true;
      report.issues.push({
        severity: 'low',
        category: 'Encryption',
        message: 'PDF is encrypted or password-protected'
      });
      report.score -= 5;
    }

    // Check 7: Launch actions (can execute external programs)
    if (textContent.includes('/Launch')) {
      report.issues.push({
        severity: 'critical',
        category: 'Launch Action',
        message: 'PDF contains launch actions that can execute external programs'
      });
      report.safe = false;
      report.score -= 50;
    }

    // Check 8: GoToR actions (can open external files)
    if (textContent.includes('/GoToR')) {
      report.issues.push({
        severity: 'high',
        category: 'Remote Actions',
        message: 'PDF contains remote actions that can access external files'
      });
      report.safe = false;
      report.score -= 35;
    }

    // Ensure score doesn't go below 0
    report.score = Math.max(0, report.score);

    console.log('Security scan completed:', {
      safe: report.safe,
      score: report.score,
      issuesCount: report.issues.length
    });

    return new Response(
      JSON.stringify(report),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error in scan-pdf-security function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        safe: false,
        score: 0,
        issues: [{
          severity: 'critical',
          category: 'Scan Error',
          message: 'Failed to scan PDF: ' + error.message
        }]
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
