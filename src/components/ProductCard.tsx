
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  className?: string;
}

const ProductCard = ({ id, name, price, image, category, className }: ProductCardProps) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/20 hover:bg-white/10",
        className
      )}
    >
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="p-5">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{category}</span>
          <h3 className="mt-1 font-medium leading-tight">{name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold">${price.toLocaleString()}</span>
          </div>
        </div>
      </Link>

      <Button 
        variant="secondary" 
        size="sm" 
        className="absolute bottom-5 right-5 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductCard;
