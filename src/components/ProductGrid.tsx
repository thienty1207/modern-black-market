
import React from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';
import { motion } from 'framer-motion';

interface ProductGridProps {
  products: Product[];
  className?: string;
}

const ProductGrid = ({ products, className }: ProductGridProps) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.images[0]} 
            category={product.category}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
