import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2 } from 'lucide-react';
import { bookUploadSchema, fileValidation } from '@/lib/validation/bookSchemas';

interface UploadBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorWallet: string;
}

export const UploadBookDialog = ({ open, onOpenChange, creatorWallet }: UploadBookDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    price_usdt: '0',
    isbn: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const categories = ['crypto', 'binance', 'defi', 'nft', 'trading', 'education', 'technology'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    if (!creatorWallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!coverFile || !bookFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both cover image and book file (PDF or EPUB)",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    const validation = bookUploadSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    // Validate cover file
    const coverError = fileValidation.coverImage.getMessage(coverFile);
    if (coverError) {
      toast({
        title: "Invalid Cover Image",
        description: coverError,
        variant: "destructive",
      });
      return;
    }

    // Validate book file (PDF or EPUB)
    const bookError = fileValidation.bookFile.getMessage(bookFile);
    if (bookError) {
      toast({
        title: "Invalid Book File",
        description: bookError,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Generate book ID upfront for consistent path structure
      const bookId = crypto.randomUUID();
      
      // Upload cover image
      const coverExt = coverFile.name.split('.').pop();
      const coverPath = `${creatorWallet}/${Date.now()}-cover.${coverExt}`;
      const { error: coverError } = await supabase.storage
        .from('book-covers')
        .upload(coverPath, coverFile);

      if (coverError) throw coverError;

      // Upload book file (PDF or EPUB) with book_id structure for secure downloads
      const fileExt = bookFile.name.split('.').pop();
      const bookPath = `${bookId}/${Date.now()}-book.${fileExt}`;
      const { error: bookUploadError } = await supabase.storage
        .from('book-pdfs')
        .upload(bookPath, bookFile);

      if (bookUploadError) throw bookUploadError;

      // Get public URL for cover only
      const { data: coverUrl } = supabase.storage
        .from('book-covers')
        .getPublicUrl(coverPath);

      // Store only the path for book file (not public URL) for secure signed URL generation
      // Insert book record
      const { error: insertError } = await supabase
        .from('marketplace_books')
        .insert({
          id: bookId,
          creator_wallet: creatorWallet,
          title: formData.title,
          description: formData.description,
          author: formData.author,
          category: formData.category,
          price_usdt: parseFloat(formData.price_usdt),
          price_bnb: 0, // Legacy field
          isbn: formData.isbn || null,
          cover_url: coverUrl.publicUrl,
          pdf_url: bookPath,
          approval_status: 'pending',
        });

      if (insertError) throw insertError;

      toast({
        title: "Book Uploaded Successfully",
        description: "Your book is pending admin approval",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        author: '',
        category: '',
        price_usdt: '0',
        isbn: '',
      });
      setCoverFile(null);
      setBookFile(null);
      setErrors({});
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error uploading book:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload book",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Your Book</DialogTitle>
          <DialogDescription>
            Fill in the details below to upload your digital book to the marketplace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Book Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter book title"
            />
          </div>

          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter author name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your book"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price (USDT) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price_usdt}
                onChange={(e) => setFormData({ ...formData, price_usdt: e.target.value })}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set your price in USDT. Buyers can pay with BNB (4% fee) or BOCZ (0% fee)
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="isbn">ISBN (Optional)</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              placeholder="Enter ISBN if applicable"
            />
          </div>

          <div>
            <Label htmlFor="cover">Cover Image * (JPG/PNG)</Label>
            <Input
              id="cover"
              type="file"
              accept="image/jpeg,image/png"
              required
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label htmlFor="bookFile">Book File * (PDF or EPUB)</Label>
            <Input
              id="bookFile"
              type="file"
              accept="application/pdf,application/epub+zip"
              required
              onChange={(e) => setBookFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload PDF for layout-critical books or EPUB for better mobile reading
            </p>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Your book will be reviewed by our admin team before being published.
              Platform fees: 4% for BNB payments, 0% for BOCZ payments. Direct payment to your wallet.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Book
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
