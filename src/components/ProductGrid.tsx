
import React, { useRef, useEffect, useState } from 'react';
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
  
  // Define animation constants
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

  // Create a stable array of animation properties
  const [animationProps, setAnimationProps] = useState<Array<{
    y: any;
    opacity: any;
    scale: any;
  }>>([]);

  // Calculate animation properties once when component mounts or dependencies change
  useEffect(() => {
    if (products.length === 0) return;
    
    const newAnimationProps = products.map((_, index) => {
      const column = index % (isMobile ? 2 : 4);
      const yOffset = (column % 2 === 0) ? 20 : -20;
      
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

      return { y, opacity, scale };
    });
    
    setAnimationProps(newAnimationProps);
  }, [products.length, isMobile, scrollYProgress]);

  // If animation props haven't been calculated yet, return a simple loading state
  if (products.length > 0 && animationProps.length === 0) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 relative", className)}>
        {products.map((product) => (
          <div key={product.id} className="opacity-0">
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.images[0]} 
              category={product.category}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      ref={ref}
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6", className)}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      style={{ position: 'relative' }} // Ensure correct position for scroll calculations
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          style={animationProps[index] || {}}
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
      ))}
    </motion.div>
  );
};

export default ProductGrid;
