
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FeaturedCategoryProps {
  title: string;
  description: string;
  image: string;
  link: string;
  reverse?: boolean;
  className?: string;
}

const FeaturedCategory = ({ 
  title, 
  description, 
  image, 
  link, 
  reverse = false,
  className 
}: FeaturedCategoryProps) => {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 lg:py-24",
        className
      )}
    >
      <div className={cn("order-2", reverse ? "lg:order-2" : "lg:order-1")}>
        <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {description}
          </p>
          <Button asChild size="lg" className="mt-4 rounded-full">
            <Link to={link}>
              Discover
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "order-1 flex items-center justify-center",
        reverse ? "lg:order-1" : "lg:order-2"
      )}>
        <div className="relative">
          <div className="w-full aspect-square rounded-2xl overflow-hidden border border-white/10">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-full h-full border border-accent/20 rounded-2xl" />
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 backdrop-blur-xl rounded-full animate-float" />
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategory;
