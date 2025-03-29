import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import OrderDetail from "./pages/OrderDetail";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect } from "react";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

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
      
      /* Đảm bảo apple icon luôn sáng */
      .cl-socialButtonsIconButton[data-provider="apple"] {
        color: white !important;
        border: 1px solid rgba(139, 92, 246, 0.8) !important;
        box-shadow: 0 0 10px rgba(139, 92, 246, 0.6) !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider 
          publishableKey={clerkPubKey}
          appearance={{
            variables: {
              colorBackground: 'rgb(0, 0, 0)',
              colorInputBackground: 'rgba(0, 0, 0, 0.7)',
              colorText: 'rgb(216, 180, 254)',
              colorPrimary: 'rgb(139, 92, 246)',
              colorDanger: 'rgb(244, 63, 94)',
              colorSuccess: 'rgb(16, 185, 129)'
            },
            elements: {
              card: "bg-black/40 backdrop-blur-sm border border-purple-500/30",
              socialButtonsIconButton: "border-2 border-purple-500/50 hover:bg-purple-900/20",
              formButtonPrimary: "bg-gradient-to-r from-violet-500 to-purple-600"
            }
          }}
        >
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignIn />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:category" element={<Products />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="search" element={<Search />} />
                  <Route path="user" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="cart" element={<Cart />} />
                  <Route path="wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  <Route path="order/:orderId" element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
