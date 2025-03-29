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
        /* Thay đổi màu nền cho các nút mạng xã hội thành màu tím sáng với opacity cao hơn */
        .cl-socialButtonsIconButton {
          background-color: rgba(139, 92, 246, 0.7) !important;
          border: 1px solid rgba(139, 92, 246, 0.8) !important;
          box-shadow: 0 0 8px rgba(139, 92, 246, 0.6) !important;
          color: white !important;
        }
        
        /* Xóa bỏ các style mặc định có thể gây xung đột */
        .cl-socialButtonsIconButton::before,
        .cl-socialButtonsIconButton::after {
          background-color: transparent !important;
        }
        
        /* Hiệu ứng hover cho các nút social với màu tím đậm hơn */
        .cl-socialButtonsIconButton:hover {
          background-color: rgba(139, 92, 246, 0.8) !important;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.9) !important;
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
        
        /* Cải thiện căn giữa container của nút social */
        .cl-socialButtonsIconButtonsContainer, 
        .cl-socialButtonsBlockButtonsContainer {
          display: flex !important;
          justify-content: center !important;
          gap: 16px !important;
        }
        
        /* Tùy chỉnh cho nút Facebook */
        .cl-socialButtonsIconButton[data-provider="facebook"] {
          background-color: rgba(139, 92, 246, 0.7) !important;
          margin: 0 5px !important;
        }
        
        /* Tùy chỉnh cho nút Google */
        .cl-socialButtonsIconButton[data-provider="google"] {
          background-color: rgba(139, 92, 246, 0.7) !important;
          margin: 0 5px !important;
        }
        
        /* Ẩn nút đăng ký */
        .cl-footerActionLink, 
        .cl-footerText {
          display: none !important;
        }
        
        /* Tùy chỉnh phân cách và đảm bảo text màu trắng */
        .cl-dividerText {
          color: white !important;
        }
        
        /* Đảm bảo tất cả văn bản có màu trắng */
        .cl-headerTitle, 
        .cl-headerSubtitle, 
        .cl-formFieldLabel, 
        .cl-formFieldInput::placeholder,
        .cl-formButtonPrimary,
        .cl-formFieldAction,
        .cl-formFieldActionText {
          color: white !important;
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
        
        /* Thay đổi text trong card sang tiếng Việt */
        .cl-headerTitle {
          visibility: hidden;
          position: relative;
        }
        
        .cl-headerTitle::after {
          content: 'Đăng nhập vào Thien Ty Shop';
          visibility: visible;
          position: absolute;
          left: 0;
          right: 0;
        }
        
        .cl-headerSubtitle {
          visibility: hidden;
          position: relative;
        }
        
        .cl-headerSubtitle::after {
          content: 'Xin chào! Vui lòng đăng nhập để tiếp tục';
          visibility: visible;
          position: absolute;
          left: 0;
          right: 0;
        }
        
        .cl-formButtonPrimary {
          visibility: hidden;
          position: relative;
        }
        
        .cl-formButtonPrimary::after {
          content: 'Đăng nhập';
          visibility: visible;
          position: absolute;
        }
        
        .cl-dividerText {
          visibility: hidden;
          position: relative;
        }
        
        .cl-dividerText::after {
          content: 'hoặc';
          visibility: visible;
          position: absolute;
          left: 0;
          right: 0;
        }
        
        .cl-formFieldAction {
          visibility: hidden;
          position: relative;
        }
        
        .cl-formFieldAction::after {
          content: 'Quên mật khẩu?';
          visibility: visible;
          position: absolute;
          right: 0;
        }
        
        /* Placeholder cho email */
        .cl-formFieldInput[name="identifier"]::placeholder {
          visibility: hidden;
          position: relative;
        }
        
        .cl-formFieldInput[name="identifier"]::placeholder::after {
          content: 'Email của bạn';
          visibility: visible;
          position: absolute;
          left: 0;
        }
        
        /* Phần label cho input */
        .cl-formFieldLabel[for="identifier"] {
          visibility: hidden;
          position: relative;
        }
        
        .cl-formFieldLabel[for="identifier"]::after {
          content: 'Email';
          visibility: visible;
          position: absolute;
          left: 0;
        }
        
        .cl-formFieldLabel[for="password"] {
          visibility: hidden;
          position: relative;
        }
        
        .cl-formFieldLabel[for="password"]::after {
          content: 'Mật khẩu';
          visibility: visible;
          position: absolute;
          left: 0;
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
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-xl overflow-hidden shadow-purple-900/30 glow-purple">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "text-lg font-display text-white",
                headerSubtitle: "text-white/70",
                formButtonPrimary: "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white",
                formFieldLabel: "text-white",
                formFieldInput: "bg-black/50 border-purple-500/30 text-white",
                footer: "hidden",
                dividerText: "text-white/50",
                socialButtonsBlockButton: "border-purple-500/30 text-white hover:bg-purple-900/20",
                socialButtonsIconButton: "bg-purple-500/70 border-2 border-purple-500/60 hover:bg-purple-500/90 text-white",
                formFieldAction: "text-white",
                formFieldActionText: "text-white hover:text-purple-300",
                alert: "bg-red-900/20 border-red-800 text-red-300"
              },
              variables: {
                colorBackground: 'black',
                colorInputBackground: 'rgba(0, 0, 0, 0.7)',
                colorText: 'white',
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