
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';
import { motion, useInView, useScroll } from 'framer-motion';
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
    offset: ["start end", "end start"],
    layoutEffect: false // Add this to prevent warning
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

  // Create simpler animation configs once
  const [animationConfigs, setAnimationConfigs] = useState<Array<{
    column: number;
    yOffset: number;
  }>>([]);

  // Create these animation configs once when the component mounts or products change
  useEffect(() => {
    if (products.length === 0) return;
    
    const configs = products.map((_, index) => {
      const column = index % (isMobile ? 2 : 4);
      const yOffset = (column % 2 === 0) ? 20 : -20;
      
      return { column, yOffset };
    });
    
    setAnimationConfigs(configs);
  }, [products.length, isMobile]);

  // Simplified rendering to avoid conditional hooks
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or selecting a different category</p>
      </div>
    );
  }

  return (
    <motion.div 
      ref={ref}
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 relative", className)}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {products.map((product, index) => {
        const config = animationConfigs[index] || { yOffset: 0 };
        
        return (
          <motion.div
            key={product.id}
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
