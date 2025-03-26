
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      title: "Experience Next-Gen Technology",
      subtitle: "Discover the ultimate smartphone experience with our premium selection.",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
      category: "phones",
    },
    {
      title: "Premium Laptops",
      subtitle: "Elevate your productivity with cutting-edge laptops crafted for performance.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
      category: "laptops",
    },
    {
      title: "Capture Every Moment",
      subtitle: "Professional-grade cameras for breathtaking photography.",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
      category: "cameras",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const scrollToProducts = () => {
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            activeSlide === index ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background z-10" />
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "transition-all duration-700 absolute max-w-3xl px-4",
              activeSlide === index 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            )}
          >
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20">
              <span className="text-xs font-medium text-accent-foreground">New Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight text-gradient">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl mx-auto">
              {slide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all w-full sm:w-auto"
              >
                <Link to={`/products/${slide.category}`} className="flex items-center justify-center w-full h-full">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/20 hover:bg-white/10 w-full sm:w-auto"
              >
                <Link to="/products" className="flex items-center justify-center w-full h-full">
                  Explore All
                </Link>
              </Button>
            </div>
          </div>
        ))}
        
        {/* Slide indicators */}
        <div className="absolute bottom-10 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                activeSlide === index 
                  ? "bg-white w-8" 
                  : "bg-white/50 hover:bg-white/80"
              )}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <button 
            onClick={scrollToProducts}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Scroll to products"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
