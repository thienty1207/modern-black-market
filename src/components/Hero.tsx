
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

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
    // Tăng tốc độ chuyển slide từ 6000ms xuống 4000ms
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    
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
            "absolute inset-0 transition-opacity duration-700", // Tăng tốc độ transition
            activeSlide === index ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background z-10" />
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="h-full w-full object-cover transform scale-105 transition-transform duration-10000 hover:scale-100"
          />
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "transition-all duration-500", // Tăng tốc độ transition
              activeSlide === index 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8",
              "absolute max-w-3xl px-4"
            )}
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={activeSlide === index ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block mb-4 px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20"
            >
              <span className="text-xs font-medium text-accent-foreground">New Collection</span>
            </motion.div>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={activeSlide === index ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight text-gradient"
            >
              {slide.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 40, opacity: 0 }}
              animate={activeSlide === index ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl mx-auto"
            >
              {slide.subtitle}
            </motion.p>
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={activeSlide === index ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all w-full sm:w-auto group overflow-hidden relative"
                asChild
              >
                <Link to={`/products/${slide.category}`}>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent to-accent/50 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  Shop Now
                  <motion.span
                    className="ml-2 inline-flex items-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/20 hover:bg-white/10 w-full sm:w-auto group overflow-hidden relative"
                asChild
              >
                <Link to="/products">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  Explore All
                </Link>
              </Button>
            </motion.div>
          </div>
        ))}
        
        {/* Slide indicators */}
        <div className="absolute bottom-10 flex space-x-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
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
        <motion.div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:block"
          animate={{ 
            y: [0, 6, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5 
          }}
        >
          <button 
            onClick={scrollToProducts}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Scroll to products"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
