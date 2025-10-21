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
    price_bnb: '0',
    isbn: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();

  const categories = ['crypto', 'binance', 'defi', 'nft', 'trading', 'education', 'technology'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!creatorWallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!coverFile || !pdfFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both cover image and PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload cover image
      const coverExt = coverFile.name.split('.').pop();
      const coverPath = `${creatorWallet}/${Date.now()}-cover.${coverExt}`;
      const { error: coverError } = await supabase.storage
        .from('marketplace')
        .upload(coverPath, coverFile);

      if (coverError) throw coverError;

      // Upload PDF
      const pdfPath = `${creatorWallet}/${Date.now()}-book.pdf`;
      const { error: pdfError } = await supabase.storage
        .from('marketplace')
        .upload(pdfPath, pdfFile);

      if (pdfError) throw pdfError;

      // Get public URLs
      const { data: coverUrl } = supabase.storage
        .from('marketplace')
        .getPublicUrl(coverPath);

      const { data: pdfUrl } = supabase.storage
        .from('marketplace')
        .getPublicUrl(pdfPath);

      // Insert book record
      const { error: insertError } = await supabase
        .from('marketplace_books')
        .insert({
          creator_wallet: creatorWallet,
          title: formData.title,
          description: formData.description,
          author: formData.author,
          category: formData.category,
          price_bnb: parseFloat(formData.price_bnb),
          isbn: formData.isbn || null,
          cover_url: coverUrl.publicUrl,
          pdf_url: pdfUrl.publicUrl,
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
        price_bnb: '0',
        isbn: '',
      });
      setCoverFile(null);
      setPdfFile(null);
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
            <Label htmlFor="pdf">Book PDF *</Label>
            <Input
              id="pdf"
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Your book will be reviewed by our admin team before being published.
              Platform fee: 4% of each sale. You'll receive 96% directly to your wallet.
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
