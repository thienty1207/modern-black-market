import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    amount: 0.2,
    margin: "-100px 0px" 
  });
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.9]);
  
  const contentAnimation = {
    hidden: { opacity: 0, x: reverse ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };
  
  const imageAnimation = {
    hidden: { opacity: 0, x: reverse ? -50 : 50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0, 
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.1 }
    }
  };
  
  const decorativeCircleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 lg:py-24 relative",
        className
      )}
      style={{ opacity }}
    >
      <motion.div 
        ref={ref}
        className={cn("order-2", reverse ? "lg:order-2" : "lg:order-1")}
        variants={contentAnimation}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient relative"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="relative z-10">{title}</span>
            <motion.span 
              className="absolute -z-10 bottom-0 left-0 h-2 bg-accent/30 rounded-full"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "40%" } : { width: "0%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild size="lg" className="mt-4 rounded-full group relative overflow-hidden">
              <Link to={link}>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent to-accent/50 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                Khám Phá
                <motion.span
                  className="ml-2 inline-flex items-center"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className={cn(
          "order-1 flex items-center justify-center",
          reverse ? "lg:order-1" : "lg:order-2"
        )}
        variants={imageAnimation}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ 
          y: reverse ? useTransform(scrollYProgress, [0, 1], [20, -20]) : useTransform(scrollYProgress, [0, 1], [-20, 20]), 
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
        }}
      >
        <div className="relative">
          <motion.div 
            className="w-full aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-xl"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transform transition-transform duration-10000 hover:scale-110"
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          
          {/* Decorative elements with enhanced animations */}
          <motion.div 
            className="absolute -bottom-6 -right-6 w-full h-full border border-accent/20 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <motion.div 
            className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 backdrop-blur-xl rounded-full"
            variants={decorativeCircleVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, -20])
            }}
          />
          
          {/* New floating elements */}
          <motion.div 
            className="absolute -top-10 right-10 w-16 h-16 bg-accent/5 backdrop-blur-sm rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, -30])
            }}
          />
          <motion.div 
            className="absolute bottom-10 -right-10 w-12 h-12 bg-primary/5 backdrop-blur-sm rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, 20])
            }}
          />
        </div>
      </motion.div>
      
      {/* Add subtle particle effects */}
      <motion.div 
        className="absolute top-1/4 left-0 w-2 h-2 rounded-full bg-accent/30"
        animate={{ 
          y: [0, 50, 0],
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-0 w-3 h-3 rounded-full bg-primary/30"
        animate={{ 
          y: [0, -50, 0],
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </motion.div>
  );
};

export default FeaturedCategory;
