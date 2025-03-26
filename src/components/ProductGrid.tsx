
import React from 'react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';

interface ProductGridProps {
  products: Product[];
  className?: string;
}

const ProductGrid = ({ products, className }: ProductGridProps) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.images[0]} // Use the first image from the images array
          category={product.category}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
