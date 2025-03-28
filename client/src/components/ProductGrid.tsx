import React, { useRef, useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';
import { motion, useInView, useScroll } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Helper to generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5; // Hiển thị ít trang hơn trên mobile
    
    if (totalPages <= maxPagesToShow) {
      // Hiển thị tất cả các trang nếu tổng số trang < maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu, trang cuối, trang hiện tại, và 1-2 trang kế cận
      if (window.innerWidth < 640) {
        // Mobile: Hiển thị trang hiện tại và các nút prev/next
        pageNumbers.push(currentPage);
      } else {
        // Desktop: Hiển thị nhiều trang hơn
        // Trang đầu
        pageNumbers.push(1);
        
        // Trang ở giữa
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        // Thêm dấu "..." nếu cần thiết
        if (startPage > 2) {
          pageNumbers.push(-1); // -1 đại diện cho "..."
        }
        
        // Thêm các trang ở giữa
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        
        // Thêm dấu "..." nếu cần thiết
        if (endPage < totalPages - 1) {
          pageNumbers.push(-2); // -2 đại diện cho "..." thứ hai
        }
        
        // Trang cuối
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Sử dụng useMemo để tránh tính toán lại trừ khi cần thiết
  const pageNumbers = useMemo(getPageNumbers, [currentPage, totalPages, window.innerWidth]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8 md:mt-10 px-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 p-0 flex-shrink-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pageNumbers.map((pageNum, index) => {
        // Hiển thị dấu "..."
        if (pageNum < 0) {
          return (
            <span key={`ellipsis-${index}`} className="mx-1 text-muted-foreground">
              ...
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${pageNum}`}
            variant={currentPage === pageNum ? "default" : "outline"}
            onClick={() => onPageChange(pageNum)}
            className="w-8 h-8 p-0 flex-shrink-0"
            aria-label={`Go to page ${pageNum}`}
            aria-current={currentPage === pageNum ? "page" : undefined}
          >
            {pageNum}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 p-0 flex-shrink-0" 
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

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
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or selecting a different category</p>
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
