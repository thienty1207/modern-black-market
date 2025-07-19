import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PortfolioHome from "./pages/PortfolioHome";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect } from "react";

// Đơn giản hóa component App 
const App = () => {
  // Thêm style global cho toàn bộ ứng dụng
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Style toàn cục cho glow effect màu tím */
      .glow-purple {
        box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PortfolioHome />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
