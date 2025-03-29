import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, ShoppingCart, User, Menu, X, Heart, XCircle, LogIn, ChevronDown, ChevronRight, Settings, LogOut as LogOutIcon, Shield, Plus, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserButton, SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-react';

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

// Custom hook để đóng dropdown khi click ra ngoài
const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  
  // Form values for profile editing
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Sử dụng custom hook để theo dõi kích thước cửa sổ
  const { width } = useWindowSize();
  const isMobile = width < 1024; // Sử dụng breakpoint lg (1024px)
  const isSmallScreen = width < 640; // Breakpoint nhỏ hơn (sm) cho việc ẩn icon
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  
  // Ref để đóng user menu khi click ra ngoài
  const userMenuRef = useOutsideClick(() => setIsUserMenuOpen(false));
  const accountModalRef = useOutsideClick(() => {
    if (isAccountModalOpen && !isEditingProfile) {
      setIsAccountModalOpen(false);
    }
  });

  // Update firstName, lastName when user data is loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  // Ngăn scroll khi menu mở
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen || isAccountModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isSearchOpen, isAccountModalOpen]);

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
      // Không đóng menu khi tìm kiếm từ popup
      // Để người dùng có thể tiếp tục duyệt menu sau khi tìm kiếm
    }
  };

  const handleUpdateProfile = () => {
    // Thực hiện cập nhật thông tin hồ sơ
    setIsEditingProfile(false);
  };

  const renderAccountTabContent = () => {
    return (
      <div className="space-y-8">
        {isEditingProfile ? (
          <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg p-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center mb-2">
                <div className="w-20 h-20 relative rounded-full overflow-hidden mr-6 flex-shrink-0 flex items-center justify-center bg-purple-600/50 border-2 border-purple-500/50">
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName || ''}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-white">
                      {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs bg-black/30 hover:bg-purple-900/30 border-purple-500/40 text-white"
                    >
                      Tải lên
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-red-500/40 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    >
                      Xóa
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">Kích thước đề xuất 1:1, tối đa 10MB.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm text-gray-300">Họ</Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm text-gray-300">Tên</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 border-t border-purple-500/20 pt-4 mt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsEditingProfile(false)}
                  className="text-white/70 hover:text-white hover:bg-black/40"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleUpdateProfile}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-none"
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg">
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Hồ sơ</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Cập nhật hồ sơ
                </Button>
              </div>
            </div>
            
            <div className="p-6 flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center bg-purple-600/50 border-2 border-purple-500/50">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || ''}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-xl font-semibold text-white">
                    {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{user?.fullName}</h3>
              </div>
            </div>
          </div>
        )}
        
        <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="p-6 border-b border-purple-500/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Địa chỉ email</h2>
              <div className="text-xs font-medium bg-purple-900/30 border border-purple-500/30 px-2 py-1 rounded text-purple-300">
                Chính
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="p-6 border-b border-purple-500/20">
            <h2 className="text-xl font-semibold text-white">Số điện thoại</h2>
          </div>
          
          <div className="p-6">
            <Button 
              variant="ghost" 
              className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm số điện thoại
            </Button>
          </div>
        </div>
      </div>
    );
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
          <div className="flex items-center gap-1 lg:gap-3">
            {/* Ẩn icon tìm kiếm khi menu mở */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "hover:bg-white/10 focus:outline-none text-white",
                isMobileMenuOpen ? "hidden" : "block"
              )}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <div className={isSmallScreen ? "hidden" : "flex items-center gap-1 lg:gap-3"}>
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
              
              {/* User button - Hiển thị dropdown menu khi đăng nhập, nút Sign In khi chưa đăng nhập */}
              <SignedIn>
                <div className="relative" ref={userMenuRef}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-white/10 focus:outline-none text-white rounded-full w-9 h-9 p-0 overflow-hidden"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || 'User'} 
                        className="h-full w-full object-cover rounded-full border-2 border-transparent hover:border-accent transition-colors"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-purple-600 text-white font-semibold">
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </div>
                    )}
                  </Button>
                  
                  {/* User dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-black/95 backdrop-blur-md border border-purple-500/30 overflow-hidden z-50">
                      <div className="p-3 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            {user?.imageUrl ? (
                              <img 
                                src={user.imageUrl} 
                                alt={user.fullName || 'User'} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-purple-600 text-white font-semibold">
                                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {user?.fullName || user?.username}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {user?.primaryEmailAddress?.emailAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start px-4 py-2 h-auto text-sm"
                          onClick={() => {
                            setIsAccountModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-3 text-purple-400" />
                          <span>Quản lý tài khoản</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start px-4 py-2 h-auto text-sm"
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <LogOutIcon className="h-4 w-4 mr-3 text-purple-400" />
                          <span>Đăng xuất</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SignedIn>
              <SignedOut>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-white/10 focus:outline-none text-white"
                  asChild
                >
                  <Link to="/sign-in" aria-label="Đăng nhập">
                    <LogIn className="h-5 w-5" />
                  </Link>
                </Button>
              </SignedOut>
            </div>
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
            </div>
            
            {/* Menu Content */}
            <div className="flex-grow overflow-y-auto p-8 no-scrollbar">
              {/* Đặt phần tìm kiếm lên trước menu */}
              <h3 className="text-xs uppercase tracking-widest text-accent mb-4">Tìm kiếm</h3>
              <div className="mb-8">
                <div className="relative">
                  <Button 
                    className="w-full flex justify-between items-center py-3 px-4 h-auto bg-black/40 border-2 border-white/20 hover:border-accent/60 rounded-lg text-white shadow-sm shadow-accent/20 hover:shadow-accent/30 transition-all duration-200"
                    onClick={() => {
                      setIsSearchOpen(true);
                      // Giữ menu mở khi hiển thị popup tìm kiếm
                    }}
                  >
                    <span className="text-white/70">Tìm kiếm sản phẩm...</span>
                    <Search className="h-4 w-4 text-accent" />
                  </Button>
                </div>
              </div>

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
                    <SignedIn>
                      <Button 
                        className="w-full justify-start px-0 py-2 h-auto" 
                        variant="ghost"
                        onClick={() => {
                          setIsAccountModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User className="h-5 w-5 mr-3" />
                        Tài khoản của tôi
                      </Button>
                      <Button 
                        className="w-full justify-start px-0 py-2 h-auto" 
                        variant="ghost"
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogIn className="h-5 w-5 mr-3 rotate-180" />
                        Đăng xuất
                      </Button>
                    </SignedIn>
                    <SignedOut>
                      <Button className="w-full justify-start px-0 py-2 h-auto" variant="ghost" asChild>
                        <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                          <LogIn className="h-5 w-5 mr-3" />
                          Đăng nhập
                        </Link>
                      </Button>
                    </SignedOut>
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
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
                  className="w-full bg-black/40 border-white/20 border-2 focus:border-accent/60 pr-10 text-white shadow-sm shadow-accent/20 focus:shadow-accent/30"
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
                <h3 className="text-xs uppercase tracking-widest text-accent px-2 mb-3">Gợi ý</h3>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left text-white/80 hover:text-white transition-colors"
                  onClick={() => {
                    navigate('/products');
                    setIsSearchOpen(false);
                    // Không đóng menu khi chọn từ gợi ý tìm kiếm
                  }}
                >
                  <Search className="mr-2 h-4 w-4 text-accent" />
                  <span>Tất cả sản phẩm</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left text-white/80 hover:text-white transition-colors"
                  onClick={() => {
                    navigate('/products/phones');
                    setIsSearchOpen(false);
                    // Không đóng menu khi chọn từ gợi ý tìm kiếm
                  }}
                >
                  <Search className="mr-2 h-4 w-4 text-accent" />
                  <span>Điện thoại</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left text-white/80 hover:text-white transition-colors"
                  onClick={() => {
                    navigate('/products/laptops');
                    setIsSearchOpen(false);
                    // Không đóng menu khi chọn từ gợi ý tìm kiếm
                  }}
                >
                  <Search className="mr-2 h-4 w-4 text-accent" />
                  <span>Laptop</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 w-full hover:bg-accent/10 rounded-md text-left text-white/80 hover:text-white transition-colors"
                  onClick={() => {
                    navigate('/products/cameras');
                    setIsSearchOpen(false);
                    // Không đóng menu khi chọn từ gợi ý tìm kiếm
                  }}
                >
                  <Search className="mr-2 h-4 w-4 text-accent" />
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

      {/* Account Modal - Similar to the image shown */}
      {isAccountModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isEditingProfile) {
              setIsAccountModalOpen(false);
              setIsEditingProfile(false);
            }
          }}
        >
          <div 
            ref={accountModalRef}
            className="w-full max-w-7xl mx-4 bg-black/95 border border-purple-500/30 rounded-lg overflow-hidden shadow-xl flex flex-col md:flex-row no-scrollbar"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - Làm to và thêm hiệu ứng hover */}
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-3 rounded-full hover:bg-purple-900/30 transition-colors z-10"
              onClick={() => {
                setIsAccountModalOpen(false);
                setIsEditingProfile(false);
              }}
              aria-label="Đóng"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Sidebar - Loại bỏ phần Security */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-purple-500/30 p-4">
              <div className="flex flex-col space-y-1">
                <div className="text-lg font-semibold p-4 text-white mb-2">
                  Tài khoản
                </div>
                <p className="px-4 text-sm text-gray-400 mb-4">
                  Quản lý thông tin tài khoản của bạn.
                </p>
                <button
                  className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors bg-purple-900/30 text-white"
                >
                  <User className="h-4 w-4 mr-3 text-purple-400" />
                  Hồ sơ
                </button>
              </div>
            </div>
            
            {/* Content Area - Cấu trúc lại để không bị overflow */}
            <div className="flex-1 md:overflow-y-auto no-scrollbar">
              <div className="p-8">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Chi tiết hồ sơ
                  </h2>
                </div>
                
                <div>
                  {renderAccountTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
