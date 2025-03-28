import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      title: "Experience Next-Gen Technology",
      subtitle: "Discover the ultimate smartphone experience with our premium selection.",
      image: "https://i.pinimg.com/736x/23/6f/11/236f1130cc4965656e4d68349f703ef1.jpg",
      category: "phones",
    },
    {
      title: "Premium Laptops",
      subtitle: "Elevate your productivity with cutting-edge laptops crafted for performance.",
      image: "https://i.pinimg.com/736x/3b/40/1c/3b401ceb37213d3409fb4d8d392204db.jpg",
      category: "laptops",
    },
    {
      title: "Capture Every Moment",
      subtitle: "Professional-grade cameras for breathtaking photography.",
      image: "https://i.pinimg.com/736x/51/f1/07/51f107561840feac4727b64981703204.jpg",
      category: "cameras",
    },
  ];

  useEffect(() => {
    // Tăng tốc độ chuyển slide từ 6000ms xuống 4000ms
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2300);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const scrollToProducts = () => {
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle navigation directly instead of using Link
  const handleShopNowClick = (category: string) => {
    navigate(`/products/${category}`);
  };

  const handleExploreAllClick = () => {
    navigate('/products');
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            activeSlide === index ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background z-10" />
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="h-full w-full object-cover object-center transform scale-110 transition-transform duration-10000 hover:scale-105"
            style={{ minHeight: '110vh', objectPosition: 'center' }}
          />
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "transition-all duration-500",
              activeSlide === index 
                ? "opacity-100 translate-y-0 z-10" 
                : "opacity-0 translate-y-8 -z-10",
              "absolute max-w-4xl px-4"
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
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-6 tracking-tight text-gradient"
            >
              {slide.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 40, opacity: 0 }}
              animate={activeSlide === index ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl lg:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto"
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
                onClick={() => handleShopNowClick(slide.category)}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent to-accent/50 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                Shop Now
                <motion.span
                  className="ml-2 inline-flex items-center"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/20 hover:bg-white/10 w-full sm:w-auto group overflow-hidden relative"
                onClick={handleExploreAllClick}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                Explore All
              </Button>
            </motion.div>

            {/* Slide indicators - moved inside the slide content */}
            <motion.div 
              initial={{ y: 60, opacity: 0 }}
              animate={activeSlide === index ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center mt-10 space-x-10"
              style={{ marginLeft: "40px" }}
            >
              {slides.map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === activeSlide 
                      ? "bg-white w-8" 
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </motion.div>
          </div>
        ))}
        
        {/* Scroll down indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block"
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
            <ChevronDown className="h-12 w-12" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
