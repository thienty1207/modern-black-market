
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductGridProps {
  products: Product[];
  className?: string;
}

const ProductGrid = ({ products, className }: ProductGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false,
    amount: 0.1
  });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const isMobile = useIsMobile();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6", className)}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {products.map((product, index) => {
        // Tính toán các tham số hoạt ảnh phụ thuộc vào vị trí sản phẩm
        const column = index % (isMobile ? 2 : 4);
        const yOffset = (column % 2 === 0) ? 20 : -20;
        
        // Sử dụng useTransform để tạo hiệu ứng liên tục khi cuộn
        const y = useTransform(
          scrollYProgress, 
          [0, 0.5, 1], 
          [yOffset, 0, -yOffset]
        );
        
        const opacity = useTransform(
          scrollYProgress,
          [0, 0.2, 0.8, 1],
          [0.6, 1, 1, 0.6]
        );
        
        const scale = useTransform(
          scrollYProgress,
          [0, 0.2, 0.8, 1],
          [0.9, 1, 1, 0.9]
        );

        return (
          <motion.div
            key={product.id}
            style={{ 
              y,
              scale,
              opacity
            }}
            whileHover={{ 
              scale: 1.05, 
              transition: { duration: 0.3 } 
            }}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 30 
              },
              show: { 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }
              }
            }}
          >
            <motion.div
              whileHover={{ 
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
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
  );
};

export default ProductGrid;
