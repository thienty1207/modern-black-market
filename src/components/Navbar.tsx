
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

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
  
  // Theo dõi số lượng sản phẩm trong wishlist và giỏ hàng
  useEffect(() => {
    const updateCounts = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
      
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const cartItemCount = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
      setCartCount(cartItemCount);
    };
    
    updateCounts();
    
    // Lắng nghe sự kiện storage changes
    window.addEventListener('storage', updateCounts);
    
    // Custom event để cập nhật khi có thay đổi trong cùng tab
    const handleCustomEvent = () => updateCounts();
    window.addEventListener('cartUpdated', handleCustomEvent);
    window.addEventListener('wishlistUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cartUpdated', handleCustomEvent);
      window.removeEventListener('wishlistUpdated', handleCustomEvent);
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'All Products', path: '/products' },
    { name: 'Phones', path: '/products/phones' },
    { name: 'Laptops', path: '/products/laptops' },
    { name: 'Cameras', path: '/products/cameras' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

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
        <nav className="hidden md:flex items-center space-x-6">
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
        <div className="hidden md:flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5 relative"
            asChild
          >
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-accent text-black font-medium rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5"
            asChild
          >
            <Link to="/user">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5 relative"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-accent text-black font-medium rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5 relative"
            asChild
          >
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-accent text-black font-medium rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5 relative"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-accent text-black font-medium rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
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
          "fixed inset-0 md:hidden bg-background flex flex-col pt-20 px-6 transition-all duration-300 ease-in-out transform z-40",
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
          <div className="flex flex-col space-y-4 mt-8">
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5 mr-3" />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-accent text-black text-xs font-medium rounded-full px-2 py-0.5">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link to="/user">
                <User className="h-5 w-5 mr-3" />
                My Account
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5 mr-3" />
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-accent text-black text-xs font-medium rounded-full px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <form onSubmit={handleSearch}>
          <CommandInput 
            placeholder="Search products..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </form>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => {
              navigate('/products');
              setIsSearchOpen(false);
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>All Products</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate('/products/phones');
              setIsSearchOpen(false);
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Phones</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate('/products/laptops');
              setIsSearchOpen(false);
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Laptops</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate('/products/cameras');
              setIsSearchOpen(false);
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Cameras</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default Navbar;
