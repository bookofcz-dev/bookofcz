import book8Cover from "@/assets/book8-cover.png";

interface BookPage {
  title: string;
  content: string;
  chapter?: string;
  image?: string;
  link?: string;
}

export const bookContent: BookPage[] = [
  {
    title: "The CZ Bible",
    content: "Book of CZ - Chapter 8\n\nThe CZ Bible\n\nA sacred collection of wisdom, teachings, and insights from CZ's journey in the world of cryptocurrency and beyond.\n\n---\n\nThis book is token-gated. To access the full content, you need to hold at least 44,444 tokens of the Book of CZ token on BSC.\n\nToken Address: 0x701bE97c604A35aB7BCF6C75cA6de3aba0704444",
    chapter: "Cover",
    image: book8Cover
  },
  {
    title: "Access Required",
    content: "🔒 Token Gated Content\n\nThis is a preview. The full CZ Bible is only accessible to holders of the Book of CZ token on Binance Smart Chain.\n\nRequirements:\n• Minimum Balance: 44,444 tokens\n• Network: BSC (BNB Smart Chain)\n• Token: 0x701bE97c604A35aB7BCF6C75cA6de3aba0704444\n\nConnect your wallet to verify your holdings and unlock the complete collection of wisdom."
  }
];

export const title = "Book of CZ - Chapter 8: The CZ Bible";
export const coverImage = book8Cover;
