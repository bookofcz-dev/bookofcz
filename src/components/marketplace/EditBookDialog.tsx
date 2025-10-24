import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Loader2 } from 'lucide-react';
import { bookUploadSchema, fileValidation } from '@/lib/validation/bookSchemas';
import { useWallet } from '@/contexts/WalletContext';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  price_bnb: number;
  isbn?: string;
  cover_url: string;
  pdf_url: string;
}

interface EditBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onBookUpdated: () => void;
}

export const EditBookDialog = ({ open, onOpenChange, book, onBookUpdated }: EditBookDialogProps) => {
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    price_bnb: '0',
    isbn: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { account } = useWallet();

  const categories = ['crypto', 'binance', 'defi', 'nft', 'trading', 'education', 'technology'];

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        description: book.description,
        author: book.author,
        category: book.category,
        price_bnb: book.price_bnb.toString(),
        isbn: book.isbn || '',
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !account) return;

    setErrors({});

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

    // Validate cover file if provided
    if (coverFile) {
      const coverError = fileValidation.coverImage.getMessage(coverFile);
      if (coverError) {
        toast({
          title: "Invalid Cover Image",
          description: coverError,
          variant: "destructive",
        });
        return;
      }
    }

    // Validate PDF file if provided
    if (pdfFile) {
      const pdfError = fileValidation.pdf.getMessage(pdfFile);
      if (pdfError) {
        toast({
          title: "Invalid PDF File",
          description: pdfError,
          variant: "destructive",
        });
        return;
      }
    }

    setUpdating(true);

    try {
      let coverUrl = book.cover_url;
      let pdfUrl = book.pdf_url;

      // Upload new cover if provided
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop();
        const coverPath = `${book.id}/${Date.now()}-cover.${coverExt}`;
        const { error: coverError } = await supabase.storage
          .from('book-covers')
          .upload(coverPath, coverFile);

        if (coverError) throw coverError;

        const { data: coverData } = supabase.storage
          .from('book-covers')
          .getPublicUrl(coverPath);
        
        coverUrl = coverData.publicUrl;
      }

      // Upload new PDF if provided
      if (pdfFile) {
        const pdfPath = `${book.id}/${Date.now()}-book.pdf`;
        const { error: pdfError } = await supabase.storage
          .from('book-pdfs')
          .upload(pdfPath, pdfFile);

        if (pdfError) throw pdfError;

        // Store path only (not public URL) for secure signed URL generation
        pdfUrl = pdfPath;
      }

      // Use secure function to update book
      const { error: updateError } = await supabase.rpc('update_book_as_creator', {
        _book_id: book.id,
        _creator_wallet: account.toLowerCase(),
        _title: formData.title,
        _author: formData.author,
        _description: formData.description,
        _category: formData.category,
        _price_bnb: parseFloat(formData.price_bnb),
        _isbn: formData.isbn || null,
        _cover_url: coverUrl,
        _pdf_url: pdfUrl,
      });

      if (updateError) throw updateError;

      toast({
        title: "Book Updated Successfully",
        description: "Your changes have been saved",
      });

      setCoverFile(null);
      setPdfFile(null);
      setErrors({});
      onBookUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating book:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update book",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update your book details. Leave file uploads empty to keep existing files.
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
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
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
              <Label htmlFor="price">Price (BNB) *</Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                min="0"
                required
                value={formData.price_bnb}
                onChange={(e) => setFormData({ ...formData, price_bnb: e.target.value })}
                placeholder="0.00"
              />
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
            <Label htmlFor="cover">New Cover Image (JPG/PNG) - Optional</Label>
            <Input
              id="cover"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to keep current cover
            </p>
          </div>

          <div>
            <Label htmlFor="pdf">New Book PDF - Optional</Label>
            <Input
              id="pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to keep current PDF
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={updating}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};