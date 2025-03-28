import React, { useRef, useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';
import { motion, useInView, useScroll } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from '@/components/ui/pagination';

interface ProductGridProps {
  products: Product[];
  className?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const ProductGrid = ({ products, className, pagination }: ProductGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false,
    amount: 0.1
  });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
    layoutEffect: false // Add this to prevent warning
  });
  
  const isMobile = useIsMobile();
  
  // Define animation constants - sử dụng useMemo để tránh tạo lại object
  const container = useMemo(() => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Giảm thời gian để animation mượt hơn
        delayChildren: 0.1
      }
    }
  }), []);

  // Create simpler animation configs once
  const [animationConfigs, setAnimationConfigs] = useState<Array<{
    column: number;
    yOffset: number;
  }>>([]);

  // Create these animation configs once when the component mounts or products change
  useEffect(() => {
    if (products.length === 0) return;
    
    const configs = products.map((_, index) => {
      // Điều chỉnh số cột dựa trên kích thước màn hình
      const columns = isMobile ? 2 : window.innerWidth < 1024 ? 3 : 4;
      const column = index % columns;
      const yOffset = (column % 2 === 0) ? 20 : -20;
      
      return { column, yOffset };
    });
    
    setAnimationConfigs(configs);
  }, [products.length, isMobile]);

  // Simplified rendering to avoid conditional hooks
  if (products.length === 0) {
    return (
      <div className="text-center py-8 md:py-12 px-4">
        <h3 className="text-lg font-medium mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-muted-foreground">Hãy thử điều chỉnh bộ lọc hoặc chọn danh mục khác</p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-0">
      <motion.div 
        ref={ref}
        className={cn(
          "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-6 relative", 
          className
        )}
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {products.map((product, index) => {
          // Đảm bảo animation config có sẵn hoặc fallback
          const config = animationConfigs[index] || { yOffset: 0 };
          
          return (
            <motion.div
              key={product.id}
              whileHover={{ 
                scale: 1.03, // Giảm độ scale xuống để không bị overflow trên mobile
                transition: { duration: 0.3 } 
              }}
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 20 // Giảm khoảng cách di chuyển cho mượt hơn
                },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }
                }
              }}
            >
              <motion.div
                whileHover={{ 
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]} 
                  category={product.category}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Hiển thị phân trang nếu được cung cấp */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
};

export default ProductGrid;
