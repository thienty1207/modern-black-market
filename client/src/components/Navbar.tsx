import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, ShoppingCart, User, Menu, X, Heart, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Chuyển danh sách điều hướng thành hằng số để tái sử dụng
const navItems = [
  { name: 'Sản Phẩm', path: '/products' },
  { name: 'Giới Thiệu', path: '/about' },
  { name: 'Liên Hệ', path: '/contact' },
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
  const isMobile = width < 1024; // Sử dụng breakpoint lg (1024px)
  const isSmallScreen = width < 640; // Breakpoint nhỏ hơn (sm) cho việc ẩn icon

  // Ngăn scroll khi menu mở
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Thêm CSS để ẩn thanh scroll và ngăn các phần tử chồng nhau
  useEffect(() => {
    // Tạo style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* Ẩn thanh scroll cho tất cả browser */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      
      .no-scrollbar {
        -ms-overflow-style: none;  /* IE và Edge */
        scrollbar-width: none;  /* Firefox */
        overflow-x: hidden !important;
      }
      
      /* Ngăn không cho các phần tử vượt quá chiều rộng viewport */
      body {
        overflow-x: hidden;
        width: 100%;
        box-sizing: border-box;
        position: relative;
      }
      
      /* Đảm bảo các container đều có width cố định, không bị tràn */
      .container, .container-fluid, main, header, section, div {
        max-width: 100vw;
        box-sizing: border-box;
      }
      
      /* Đảm bảo các phần tử tuyệt đối nằm trong giới hạn của cha */
      .sidebar-menu {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 320px;
        z-index: 100;
        overflow: hidden;
      }
    `;
    
    // Thêm vào head
    document.head.appendChild(styleEl);
    
    // Cleanup
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Theo dõi scroll để thay đổi giao diện header khi scroll xuống
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
      {/* Fixed header - Trong suốt khi mới load trang, có viền khi cuộn */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-black border-b border-white/10" : "bg-transparent"
        )}
        style={{
          height: '56px', /* Chiều cao cố định */
          width: '100%',
        }}
      >
        <div className="h-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Menu Button - Sát mép trái - Ẩn khi menu đã mở */}
          <div className={cn("flex items-center", isMobileMenuOpen ? "invisible" : "visible")}>
            <Button 
              variant="ghost"
              className="h-10 w-10 min-w-[40px] p-0 rounded-full text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="side-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Hiển thị text "MENU" bên cạnh icon khi ở desktop */}
            {!isMobile && (
              <span className="hidden lg:inline-block text-white text-xs font-bold tracking-wider">MENU</span>
            )}
          </div>

          {/* Logo - Ở giữa trang - Ẩn khi menu mở */}
          <div className={cn(
            "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
            isMobileMenuOpen ? "invisible" : "visible"
          )}>
            <Link to="/" className="flex-shrink-0 z-10">
              <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold tracking-tight">
                <span className="text-gradient">Thien Ty Shop</span>
              </h1>
            </Link>
          </div>

          {/* Action Buttons - Sát mép phải, chỉ ẩn khi màn hình thực sự nhỏ */}
          <div className={cn("flex items-center gap-1 lg:gap-3", isSmallScreen ? "invisible" : "visible")}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-white/10 focus:outline-none text-white"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-white/10 relative focus:outline-none text-white"
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
              className="hover:bg-white/10 relative focus:outline-none text-white"
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
              className="hover:bg-white/10 focus:outline-none text-white"
              asChild
            >
              <Link to="/user" aria-label="User account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Side Menu - Hiển thị bên trái */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            // Đóng menu khi click vào overlay
            if (e.target === e.currentTarget) {
              setIsMobileMenuOpen(false);
            }
          }}
        >
          <div 
            className="fixed top-0 left-0 bottom-0 w-[320px] bg-black border-r border-white/10 flex flex-col no-scrollbar sidebar-menu"
            style={{ 
              maxWidth: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              maxHeight: '100%',
              height: '100%',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Menu Header */}
            <div className="p-6 pb-4 border-b border-white/10">
              {/* Logo trong menu */}
              <div className="flex justify-center items-center mb-4">
                <Link to="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Thien Ty Shop</span>
                  </h1>
                </Link>
              </div>
              
              {isMobile && (
                <div className="w-full">
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
              )}
            </div>
            
            {/* Menu Content */}
            <div className="flex-grow overflow-y-auto p-8 no-scrollbar">
              <h3 className="text-xs uppercase tracking-widest text-accent mb-6">Menu</h3>
              <nav className="flex flex-col space-y-5">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "text-lg font-medium py-2 transition-colors hover:text-accent",
                      location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) 
                        ? "text-accent" 
                        : "text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {/* Hiển thị các tùy chọn tài khoản khi màn hình nhỏ */}
              {isSmallScreen && (
                <>
                  <h3 className="text-xs uppercase tracking-widest text-accent mt-12 mb-6">Tài khoản</h3>
                  <div className="flex flex-col space-y-5">
                    <Button className="w-full justify-start px-0 py-2 h-auto" variant="ghost" asChild>
                      <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                        <Heart className="h-5 w-5 mr-3" />
                        Danh sách yêu thích
                        {wishlistCount > 0 && (
                          <span className="ml-auto bg-accent text-black text-xs font-medium rounded-full px-2 py-0.5">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                    <Button className="w-full justify-start px-0 py-2 h-auto" variant="ghost" asChild>
                      <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShoppingCart className="h-5 w-5 mr-3" />
                        Giỏ hàng
                        {cartCount > 0 && (
                          <span className="ml-auto bg-accent text-black text-xs font-medium rounded-full px-2 py-0.5">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                    <Button className="w-full justify-start px-0 py-2 h-auto" variant="ghost" asChild>
                      <Link to="/user" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="h-5 w-5 mr-3" />
                        Tài khoản của tôi
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Nút đóng menu ở phía dưới */}
            <div className="p-6 border-t border-white/10">
              <Button 
                className="w-full justify-center" 
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Đóng menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
          onClick={(e) => {
            // Đóng dialog khi click vào backdrop
            if (e.target === e.currentTarget) {
              setIsSearchOpen(false);
            }
          }}
        >
          <div className="w-full max-w-lg mx-4 bg-background border border-white/10 rounded-lg overflow-hidden shadow-xl">
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
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
            
            <div className="max-h-[40vh] overflow-y-auto no-scrollbar">
              <div className="p-2">
                <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">Gợi ý</h3>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left"
                  onClick={() => {
                    navigate('/products');
                    setIsSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Tất cả sản phẩm</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left"
                  onClick={() => {
                    navigate('/products/phones');
                    setIsSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Điện thoại</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left"
                  onClick={() => {
                    navigate('/products/laptops');
                    setIsSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Laptop</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left"
                  onClick={() => {
                    navigate('/products/cameras');
                    setIsSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Máy ảnh</span>
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
                Đóng tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
