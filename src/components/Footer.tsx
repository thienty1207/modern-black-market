
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-12 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold tracking-tight">
            <span className="text-gradient">TECHSHOP</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Premium tech products with minimalist design and exceptional performance.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Categories</h3>
          <ul className="space-y-3">
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
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Support</h3>
          <ul className="space-y-3">
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
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">contact@techshop.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">+1 (234) 567-8901</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-muted-foreground">
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
      </div>
    </footer>
  );
};

export default Footer;
