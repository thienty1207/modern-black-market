
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Phones', path: '/products/phones' },
    { name: 'Laptops', path: '/products/laptops' },
    { name: 'Cameras', path: '/products/cameras' }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
        isScrolled ? "py-3 backdrop-blur-xl bg-black/70 border-b border-white/10" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-10">
          <h1 className="text-2xl font-display font-bold tracking-tight">
            <span className="text-gradient">TECHSHOP</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors duration-200 hover:text-accent",
                location.pathname === item.path ? "text-accent" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "fixed inset-0 md:hidden bg-background flex flex-col pt-20 px-6 transition-all duration-300 ease-in-out transform",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <nav className="flex flex-col space-y-5 mt-8">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className={cn(
                  "text-lg font-medium py-2 border-b border-white/10 transition-colors hover:text-accent",
                  location.pathname === item.path ? "text-accent" : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4 mt-8">
            <Button variant="ghost" size="icon" className="hover:bg-white/5">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/5">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
