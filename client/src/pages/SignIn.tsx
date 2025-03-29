import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SignInPage = () => {
  // State để theo dõi việc CSS tùy chỉnh đã được áp dụng chưa
  const [cssApplied, setCssApplied] = useState(false);

  // Effect để thêm CSS tùy chỉnh vào trang
  useEffect(() => {
    if (!cssApplied) {
      // Thêm style để cải thiện social buttons và ẩn sign-up link
      const style = document.createElement('style');
      style.innerHTML = `
        /* Tùy chỉnh màu và thêm viền sáng cho nút Apple */
        .cl-socialButtonsIconButton[data-provider="apple"] {
          color: white !important;
          border: 1px solid rgba(139, 92, 246, 0.8) !important;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.6) !important;
        }
        
        /* Thêm viền sáng cho tất cả các nút social */
        .cl-socialButtonsIconButton {
          border: 1px solid rgba(139, 92, 246, 0.6) !important;
          box-shadow: 0 0 8px rgba(139, 92, 246, 0.4) !important;
        }
        
        /* Hiệu ứng hover cho các nút social */
        .cl-socialButtonsIconButton:hover {
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.8) !important;
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
        
        /* Ẩn nút đăng ký */
        .cl-footerActionLink, 
        .cl-footerText {
          display: none !important;
        }
        
        /* Tùy chỉnh phân cách và đảm bảo text màu tím */
        .cl-dividerText {
          color: rgb(216, 180, 254, 0.5) !important;
        }
        
        /* Làm cho thẻ input không bị trắng */
        .cl-formFieldInput {
          background-color: rgba(0, 0, 0, 0.5) !important;
          color: white !important;
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
        }
        
        /* Tùy chỉnh nền của card */
        .cl-card {
          background-color: transparent !important;
        }
        
        /* Tùy chỉnh màu viền input khi focus */
        .cl-formFieldInput:focus {
          border-color: rgb(139, 92, 246) !important;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3) !important;
        }
        
        /* Tùy chỉnh nút đăng nhập với icon */
        .cl-formButtonPrimary {
          background: linear-gradient(to right, rgb(139, 92, 246), rgb(124, 58, 237)) !important;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
        }
        
        .cl-formButtonPrimary:hover {
          background: linear-gradient(to right, rgb(124, 58, 237), rgb(109, 40, 217)) !important;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.7) !important;
        }
        
        /* Thêm icon người vào nút đăng nhập */
        .cl-formButtonPrimary::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 20px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'%3E%3C/path%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
        }
      `;
      document.head.appendChild(style);
      setCssApplied(true);
    }
  }, [cssApplied]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2 bg-gradient-to-r from-violet-400 to-purple-600 text-transparent bg-clip-text">
            Đăng Nhập
          </h1>
          <p className="text-purple-300/80">
            Đăng nhập để truy cập vào tài khoản của bạn
          </p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-xl overflow-hidden shadow-purple-900/30 glow-purple">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "text-lg font-display text-purple-300",
                headerSubtitle: "text-purple-300/70",
                formButtonPrimary: "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white",
                formFieldLabel: "text-purple-300",
                formFieldInput: "bg-black/50 border-purple-500/30 text-white",
                footer: "hidden",
                dividerText: "text-purple-300/50",
                socialButtonsBlockButton: "border-purple-500/30 text-white hover:bg-purple-900/20",
                socialButtonsIconButton: "border-2 border-purple-500/50 hover:bg-purple-900/20",
                formFieldAction: "text-purple-400",
                formFieldActionText: "text-purple-400 hover:text-purple-300",
                alert: "bg-red-900/20 border-red-800 text-red-300"
              },
              variables: {
                colorBackground: 'black',
                colorInputBackground: 'rgba(0, 0, 0, 0.7)',
                colorText: 'rgb(216, 180, 254)',
                colorPrimary: 'rgb(139, 92, 246)',
                colorDanger: 'rgb(244, 63, 94)',
                colorSuccess: 'rgb(16, 185, 129)'
              },
              layout: {
                socialButtonsVariant: "iconButton",
                socialButtonsPlacement: "bottom",
                showOptionalFields: false
              }
            }}
            redirectUrl="/"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage; 