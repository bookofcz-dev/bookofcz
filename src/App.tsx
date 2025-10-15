import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookPage from "./pages/BookPage";
import BookPage2 from "./pages/BookPage2";
import BookPage3 from "./pages/BookPage3";
import BookPage4 from "./pages/BookPage4";
import BookPage5 from "./pages/BookPage5";
import BookPageCN from "./pages/BookPageCN";
import BookPage2CN from "./pages/BookPage2CN";
import BookPage3CN from "./pages/BookPage3CN";
import BookPage4CN from "./pages/BookPage4CN";
import BookPage5CN from "./pages/BookPage5CN";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/book2" element={<BookPage2 />} />
          <Route path="/book3" element={<BookPage3 />} />
          <Route path="/book4" element={<BookPage4 />} />
          <Route path="/book5" element={<BookPage5 />} />
          <Route path="/book-cn" element={<BookPageCN />} />
          <Route path="/book2-cn" element={<BookPage2CN />} />
          <Route path="/book3-cn" element={<BookPage3CN />} />
          <Route path="/book4-cn" element={<BookPage4CN />} />
          <Route path="/book5-cn" element={<BookPage5CN />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
