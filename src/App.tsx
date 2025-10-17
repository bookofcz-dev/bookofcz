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
import BookPage6 from "./pages/BookPage6";
import BookPage7 from "./pages/BookPage7";
import BookPage8 from "./pages/BookPage8";
import BookPage9 from "./pages/BookPage9";
import BookPageCN from "./pages/BookPageCN";
import BookPage2CN from "./pages/BookPage2CN";
import BookPage3CN from "./pages/BookPage3CN";
import BookPage4CN from "./pages/BookPage4CN";
import BookPage5CN from "./pages/BookPage5CN";
import BookPage6CN from "./pages/BookPage6CN";
import BookPage7CN from "./pages/BookPage7CN";
import BookPage8CN from "./pages/BookPage8CN";
import BookPage9CN from "./pages/BookPage9CN";
import BookPageES from "./pages/BookPageES";
import BookPage2ES from "./pages/BookPage2ES";
import BookPage3ES from "./pages/BookPage3ES";
import BookPage4ES from "./pages/BookPage4ES";
import BookPage5ES from "./pages/BookPage5ES";
import BookPage6ES from "./pages/BookPage6ES";
import BookPage7ES from "./pages/BookPage7ES";
import BookPage8ES from "./pages/BookPage8ES";
import BookPage9ES from "./pages/BookPage9ES";
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
          <Route path="/book6" element={<BookPage6 />} />
          <Route path="/book7" element={<BookPage7 />} />
          <Route path="/book8" element={<BookPage8 />} />
          <Route path="/book9" element={<BookPage9 />} />
          <Route path="/book-cn" element={<BookPageCN />} />
          <Route path="/book2-cn" element={<BookPage2CN />} />
          <Route path="/book3-cn" element={<BookPage3CN />} />
          <Route path="/book4-cn" element={<BookPage4CN />} />
          <Route path="/book5-cn" element={<BookPage5CN />} />
          <Route path="/book6-cn" element={<BookPage6CN />} />
          <Route path="/book7-cn" element={<BookPage7CN />} />
          <Route path="/book8-cn" element={<BookPage8CN />} />
          <Route path="/book9-cn" element={<BookPage9CN />} />
          <Route path="/book-es" element={<BookPageES />} />
          <Route path="/book2-es" element={<BookPage2ES />} />
          <Route path="/book3-es" element={<BookPage3ES />} />
          <Route path="/book4-es" element={<BookPage4ES />} />
          <Route path="/book5-es" element={<BookPage5ES />} />
          <Route path="/book6-es" element={<BookPage6ES />} />
          <Route path="/book7-es" element={<BookPage7ES />} />
          <Route path="/book8-es" element={<BookPage8ES />} />
          <Route path="/book9-es" element={<BookPage9ES />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
