import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        delay: custom * 0.05,
        ease: "easeOut"
      }
    })
  };

  const motionConfig = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-10%" },
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-8 md:pt-12 pb-6 md:pb-8 px-4 md:px-8 mt-8 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
        <motion.div 
          className="space-y-4 col-span-1"
          {...motionConfig}
          variants={fadeInUpVariants}
          custom={0}
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          <h2 className="text-xl font-display font-bold tracking-tight">
            <span className="text-gradient">Thien Ty Shop</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Sản phẩm công nghệ cao cấp với thiết kế tối giản và hiệu suất vượt trội.
          </p>
        </motion.div>
        
        <motion.div
          {...motionConfig}
          variants={fadeInUpVariants}
          custom={1}
          className="col-span-1"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          <h3 className="text-sm font-medium mb-4">Danh Mục</h3>
          <ul className="space-y-2 md:space-y-3">
            <li>
              <Link to="/products/phones" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Điện Thoại
              </Link>
            </li>
            <li>
              <Link to="/products/laptops" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Laptop
              </Link>
            </li>
            <li>
              <Link to="/products/cameras" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Máy Ảnh
              </Link>
            </li>
          </ul>
        </motion.div>
        
        <motion.div
          {...motionConfig}
          variants={fadeInUpVariants}
          custom={2}
          className="col-span-1"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          <h3 className="text-sm font-medium mb-4">Liên Hệ</h3>
          <ul className="space-y-2 md:space-y-3">
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground break-all">tytybill123@gmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">+84 399 623 947</span>
            </li>
            <li className="flex items-center space-x-2">
              <Facebook className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Link to="https://www.facebook.com/tienhoan00/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Facebook
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
      
      <motion.div 
        className="max-w-7xl mx-auto mt-8 md:mt-12 pt-4 md:pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center"
        {...motionConfig}
        variants={fadeInUpVariants}
        custom={3}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        <p className="text-xs text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} Thien Ty Shop. Đã đăng ký bản quyền.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="#" className="text-xs text-muted-foreground hover:text-accent transition-colors">
            Chính Sách Bảo Mật
          </Link>
          <Link to="#" className="text-xs text-muted-foreground hover:text-accent transition-colors">
            Điều Khoản Dịch Vụ
          </Link>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
