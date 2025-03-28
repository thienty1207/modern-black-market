import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, ShoppingCart, User, Menu, X, Heart, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Chuyển danh sách điều hướng thành hằng số để tái sử dụng
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

// Custom hook để phát hiện kích thước màn hình
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  
  // Sử dụng custom hook để theo dõi kích thước cửa sổ
  const { width } = useWindowSize();
  const isMobile = width < 768; // md breakpoint là 768px

  // Theo dõi scroll để thay đổi giao diện header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Đóng menu khi di chuyển đến trang khác
    setIsMobileMenuOpen(false);
    // Đóng tìm kiếm khi di chuyển đến trang khác
    setIsSearchOpen(false);
  }, [location]);
  
  // Đóng menu khi chuyển từ mobile sang desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  // Lấy dữ liệu giỏ hàng và wishlist từ localStorage
  useEffect(() => {
    const getCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart.length;
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        return 0;
      }
    };

    const getWishlistCount = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        return wishlist.length;
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        return 0;
      }
    };

    const updateCounts = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
    };

    // Cập nhật ngay lần đầu
    updateCounts();

    // Cập nhật khi storage thay đổi
    window.addEventListener('storage', updateCounts);
    
    // Cập nhật định kỳ (phòng trường hợp component khác thay đổi localStorage)
    const interval = setInterval(updateCounts, 2000);

    return () => {
      window.removeEventListener('storage', updateCounts);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <>
      {/* Fixed header - Cấu trúc tối ưu cho responsive */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-background/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        )}
        style={{
          WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
          height: '56px', /* Chiều cao cố định */
        }}
      >
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo - Luôn hiển thị */}
          <Link to="/" className="flex-shrink-0 z-10">
            <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold tracking-tight">
              <span className="text-gradient">Thien Ty Shop</span>
            </h1>
          </Link>

          {/* Desktop Navigation - Chỉ hiển thị từ md breakpoint trở lên */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-accent whitespace-nowrap",
                  location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) 
                    ? "text-accent" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons - Chỉ hiển thị từ md breakpoint trở lên */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-accent/20"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-white/5 relative focus:outline-none focus:ring-2 focus:ring-accent/20"
              asChild
            >
              <Link to="/wishlist" aria-label="Wishlist">
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
              className="hover:bg-white/5 relative focus:outline-none focus:ring-2 focus:ring-accent/20"
              asChild
            >
              <Link to="/cart" aria-label="Cart">
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
              className="hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-accent/20"
              asChild
            >
              <Link to="/user" aria-label="User account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button - Chỉ hiển thị dưới md breakpoint */}
          <div className="md:hidden pr-3 z-10">
            <Button 
              variant="ghost"
              className="h-10 w-10 min-w-[40px] p-0 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <>
                  <Menu className="h-5 w-5" />
                  {(cartCount > 0 || wishlistCount > 0) && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-accent text-black font-medium rounded-full">
                      {cartCount + wishlistCount}
                    </span>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Cải tiến cấu trúc và tính năng */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden">
          <div 
            className="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-background border-l border-white/10 flex flex-col overflow-hidden"
            style={{ height: '100dvh' }} // Dynamic viewport height
          >
            <div className="p-4 pb-0">
              <div className="w-full mb-4">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border-white/10"
                  />
                  <Button 
                    type="submit"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto mt-2 px-4">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "text-lg font-medium py-3 border-b border-white/10 transition-colors hover:text-accent",
                      location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) 
                        ? "text-accent" 
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-1 mt-4">
                <Button className="w-full justify-start py-3 h-auto" variant="ghost" asChild>
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="h-5 w-5 mr-3" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-accent text-black text-xs font-medium rounded-full px-2 py-0.5">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button className="w-full justify-start py-3 h-auto" variant="ghost" asChild>
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-accent text-black text-xs font-medium rounded-full px-2 py-0.5">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button className="w-full justify-start py-3 h-auto" variant="ghost" asChild>
                  <Link to="/user" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="h-5 w-5 mr-3" />
                    My Account
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="py-4 px-4 border-t border-white/10 mt-auto">
              <Button 
                className="w-full justify-center" 
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Close Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search Dialog - Chỉ hiển thị trên màn hình lớn */}
      {isSearchOpen && !isMobile && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
          <div className="w-full max-w-lg bg-background border border-white/10 rounded-lg overflow-hidden shadow-xl">
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border-white/10 pr-10"
                  autoFocus
                />
                <Button 
                  type="submit"
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
            </div>
            
            <div className="max-h-[40vh] overflow-y-auto">
              <div className="p-2">
                <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">Suggestions</h3>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left"
                  onClick={() => {
                    navigate('/products');
                    setIsSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>All Products</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left"
                  onClick={() => {
                    navigate('/products/phones');
                    setIsSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Phones</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left"
                  onClick={() => {
                    navigate('/products/laptops');
                    setIsSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Laptops</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left"
                  onClick={() => {
                    navigate('/products/cameras');
                    setIsSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Cameras</span>
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-white/10">
              <Button 
                className="w-full justify-center" 
                variant="ghost"
                onClick={() => setIsSearchOpen(false)}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Close Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
