
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';
import { motion, useInView, useScroll, MotionValue } from 'framer-motion';
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

  // Create simpler animation configs that don't rely on conditional useTransform hooks
  const [animationConfigs, setAnimationConfigs] = useState<Array<{
    column: number;
    yOffset: number;
  }>>([]);

  // Create these animation configs once when the component mounts
  useEffect(() => {
    if (products.length === 0) return;
    
    const configs = products.map((_, index) => {
      const column = index % (isMobile ? 2 : 4);
      const yOffset = (column % 2 === 0) ? 20 : -20;
      
      return { column, yOffset };
    });
    
    setAnimationConfigs(configs);
  }, [products.length, isMobile]);

  // If animation configs haven't been calculated yet, return a simple loading state
  if (products.length > 0 && animationConfigs.length === 0) {
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
      style={{ position: 'relative' }}
    >
      {products.map((product, index) => {
        // Apply animation styles directly in the render loop
        // This is fine since we're not calling hooks conditionally
        const config = animationConfigs[index] || { yOffset: 0 };
        
        return (
          <motion.div
            key={product.id}
            style={{
              // Use simpler animation approach without creating hooks in loops
              y: scrollYProgress.get() * config.yOffset,
              opacity: 1 - (0.4 * Math.abs(scrollYProgress.get() - 0.5)),
              scale: 0.9 + (0.1 * (1 - Math.abs(scrollYProgress.get() - 0.5)))
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
