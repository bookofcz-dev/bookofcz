import { z } from 'zod';

export const bookUploadSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  author: z.string()
    .trim()
    .min(1, 'Author is required')
    .max(100, 'Author name must be less than 100 characters'),
  
  description: z.string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  
  category: z.enum(['crypto', 'binance', 'defi', 'nft', 'trading', 'education', 'technology'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  
  price_usdt: z.string()
    .refine((val) => !isNaN(parseFloat(val)), 'Price must be a valid number')
    .refine((val) => parseFloat(val) >= 0, 'Price cannot be negative')
    .refine((val) => parseFloat(val) <= 10000, 'Price cannot exceed 10000 USDT'),
  
  isbn: z.string()
    .trim()
    .max(20, 'ISBN must be less than 20 characters')
    .optional()
    .or(z.literal('')),
});

export const reviewSchema = z.object({
  rating: z.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  
  review_text: z.string()
    .trim()
    .max(1000, 'Review must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

export const fileValidation = {
  coverImage: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png'],
    getMessage: (file: File) => {
      if (file.size > fileValidation.coverImage.maxSize) {
        return 'Cover image must be less than 5MB';
      }
      if (!fileValidation.coverImage.allowedTypes.includes(file.type)) {
        return 'Cover must be JPG or PNG format';
      }
      return null;
    }
  },
  pdf: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf'],
    getMessage: (file: File) => {
      if (file.size > fileValidation.pdf.maxSize) {
        return 'PDF must be less than 50MB';
      }
      if (!fileValidation.pdf.allowedTypes.includes(file.type)) {
        return 'File must be PDF format';
      }
      return null;
    }
  }
};

export type BookUploadFormData = z.infer<typeof bookUploadSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
