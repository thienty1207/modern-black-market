import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.7,
        delay: custom * 0.1,
        ease: "easeOut"
      }
    })
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-8 md:pt-12 pb-6 md:pb-8 px-4 md:px-8 mt-8 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        <motion.div 
          className="space-y-4 col-span-2 sm:col-span-2 md:col-span-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={fadeInUpVariants}
          custom={0}
        >
          <h2 className="text-xl font-display font-bold tracking-tight">
            <span className="text-gradient">TECHSHOP</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Premium tech products with minimalist design and exceptional performance.
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={fadeInUpVariants}
          custom={1}
          className="col-span-1"
        >
          <h3 className="text-sm font-medium mb-4">Categories</h3>
          <ul className="space-y-2 md:space-y-3">
            <li>
              <Link to="/products/phones" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Phones
              </Link>
            </li>
            <li>
              <Link to="/products/laptops" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Laptops
              </Link>
            </li>
            <li>
              <Link to="/products/cameras" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Cameras
              </Link>
            </li>
          </ul>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={fadeInUpVariants}
          custom={2}
          className="col-span-1"
        >
          <h3 className="text-sm font-medium mb-4">Support</h3>
          <ul className="space-y-2 md:space-y-3">
            <li>
              <Link to="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Shipping & Returns
              </Link>
            </li>
          </ul>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={fadeInUpVariants}
          custom={3}
          className="col-span-2 sm:col-span-2 md:col-span-1"
        >
          <h3 className="text-sm font-medium mb-4">Contact</h3>
          <ul className="space-y-2 md:space-y-3">
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground break-all">contact@techshop.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">+1 (234) 567-8901</span>
            </li>
          </ul>
        </motion.div>
      </div>
      
      <motion.div 
        className="max-w-7xl mx-auto mt-8 md:mt-12 pt-4 md:pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
        variants={fadeInUpVariants}
        custom={4}
      >
        <p className="text-xs text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} TechShop. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="#" className="text-xs text-muted-foreground hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="text-xs text-muted-foreground hover:text-accent transition-colors">
            Terms of Service
          </Link>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
