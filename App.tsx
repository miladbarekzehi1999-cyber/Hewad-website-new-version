import Support from "./pages/Support";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

import Index from "./pages/Index";
import CryptoPage from "./pages/CryptoPage";
import ForexPage from "./pages/ForexPage";
import NotFound from "./pages/NotFound";

// BLOG PAGES
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

// ⭐ ADD THIS
import { Header } from "@/components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            {/* ⭐ HEADER IS NOW GLOBAL */}
            <Header />

            {/* ⭐ ALL ROUTES KEEP THEIR CONTENT */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/crypto" element={<CryptoPage />} />
              <Route path="/forex" element={<ForexPage />} />
              <Route path="/support" element={<Support />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
