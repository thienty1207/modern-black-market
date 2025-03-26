
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  className?: string;
}

const ProductCard = ({ id, name, price, image, category, className }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to cart', {
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-white/10 hover:shadow-lg hover:shadow-accent/5",
        className
      )}
    >
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-accent/80">{category}</span>
              <h3 className="mt-1 font-medium leading-tight group-hover:text-accent transition-colors">{name}</h3>
            </div>
            <span className="text-lg font-semibold">${price.toLocaleString()}</span>
          </div>
        </div>
      </Link>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <Button 
          variant="secondary" 
          size="sm" 
          className="backdrop-blur-md bg-white/10 hover:bg-white/20"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="backdrop-blur-md border-white/20 hover:bg-white/10"
          asChild
        >
          <Link to={`/product/${id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
