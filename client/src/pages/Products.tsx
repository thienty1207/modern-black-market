import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ProductGrid from '@/components/ProductGrid';
import { getProducts, getProductsByCategory, Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import Pagination from '@/components/ui/pagination';

const Categories = [
  { id: 'all', name: 'All Products' },
  { id: 'phones', name: 'Phones' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'cameras', name: 'Cameras' },
];

const ITEMS_PER_PAGE = 5;

// This is the direct data from the service - used as fallback
const directProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: 999,
    originalPrice: 1099,
    description: "Experience the ultimate iPhone with our most advanced camera system and stunning Super Retina XDR display with ProMotion.",
    features: [
      "A15 Bionic chip with 5-core GPU",
      "Super Retina XDR display with ProMotion",
      "Pro camera system with new 12MP Telephoto, Wide, and Ultra Wide",
      "Up to 28 hours of video playback"
    ],
    specs: {
      display: "6.1-inch Super Retina XDR",
      chip: "A15 Bionic",
      camera: "Pro 12MP camera system",
      battery: "Up to 28 hours",
      storage: "128GB, 256GB, 512GB, 1TB"
    },
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones",
    featured: true
  },
  {
    id: 2,
    name: "Samsung Galaxy S22 Ultra",
    price: 1199,
    description: "The ultimate combination of the S series and Note series, with built-in S Pen, powerful camera, and long-lasting battery.",
    features: [
      "Dynamic AMOLED 2X display",
      "108MP wide camera",
      "S Pen included",
      "5000mAh battery"
    ],
    specs: {
      display: "6.8-inch Dynamic AMOLED 2X",
      chip: "Snapdragon 8 Gen 1",
      camera: "108MP wide, 12MP ultra-wide",
      battery: "5000mAh",
      storage: "128GB, 256GB, 512GB, 1TB"
    },
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones"
  },
  {
    id: 3,
    name: "Google Pixel 6 Pro",
    price: 899,
    description: "Experience the best of Google with the custom-built Google Tensor processor and advanced camera system.",
    features: [
      "Google Tensor chip",
      "50MP wide camera",
      "Android with Pixel exclusives",
      "4500mAh battery"
    ],
    specs: {
      display: "6.7-inch LTPO OLED",
      chip: "Google Tensor",
      camera: "50MP wide, 12MP ultra-wide",
      battery: "4500mAh",
      storage: "128GB, 256GB, 512GB"
    },
    images: [
      "https://images.unsplash.com/photo-1635870723802-e88d76ae324c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598965402089-897e93a166f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones"
  },
  {
    id: 4,
    name: "MacBook Pro 16",
    price: 2499,
    description: "Supercharged for pros. The most powerful MacBook Pro ever is here with the blazing-fast M1 Pro or M1 Max chip.",
    features: [
      "Apple M1 Pro or M1 Max chip",
      "Up to 64GB unified memory",
      "Up to 8TB storage",
      "Up to 21 hours battery life"
    ],
    specs: {
      display: "16-inch Liquid Retina XDR",
      chip: "M1 Pro or M1 Max",
      memory: "16GB, 32GB, or 64GB",
      storage: "512GB to 8TB SSD",
      battery: "Up to 21 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops",
    featured: true
  },
  {
    id: 5,
    name: "Dell XPS 15",
    price: 1799,
    description: "A stunning 15.6-inch InfinityEdge display in a compact form factor powered by 11th Gen Intel Core processors.",
    features: [
      "11th Gen Intel Core processors",
      "NVIDIA GeForce RTX 3050 Ti",
      "15.6-inch 4K UHD+ InfinityEdge display",
      "Up to 16 hours battery life"
    ],
    specs: {
      display: "15.6-inch 4K UHD+",
      processor: "11th Gen Intel Core i7/i9",
      graphics: "NVIDIA GeForce RTX 3050 Ti",
      memory: "16GB, 32GB, or 64GB",
      storage: "512GB to 2TB SSD"
    },
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops"
  },
  {
    id: 6,
    name: "Razer Blade 15",
    price: 1999,
    originalPrice: 2199,
    description: "The world's smallest 15.6-inch gaming laptop with NVIDIA GeForce RTX graphics and 10th Gen Intel Core i7.",
    features: [
      "10th Gen Intel Core i7",
      "NVIDIA GeForce RTX 3080",
      "15.6-inch 360Hz display",
      "Per-key RGB lighting"
    ],
    specs: {
      display: "15.6-inch FHD 360Hz",
      processor: "10th Gen Intel Core i7",
      graphics: "NVIDIA GeForce RTX 3080",
      memory: "16GB or 32GB",
      storage: "1TB SSD"
    },
    images: [
      "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601406984081-bd6b491c0436?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops"
  },
  {
    id: 7,
    name: "Sony Alpha a7 IV",
    price: 2499,
    description: "A full-frame hybrid camera with outstanding still image quality and evolved video technology for creators.",
    features: [
      "33MP full-frame Exmor R CMOS sensor",
      "BIONZ XR processor",
      "4K 60p video recording",
      "10-bit 4:2:2 color sampling"
    ],
    specs: {
      sensor: "33MP full-frame Exmor R CMOS",
      processor: "BIONZ XR",
      iso: "100-51,200 (expandable)",
      autofocus: "759-point phase-detection AF",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras",
    featured: true
  },
  {
    id: 8,
    name: "Canon EOS R5",
    price: 3899,
    description: "A revolutionary full-frame mirrorless camera that delivers uncompromising image quality and 8K video recording.",
    features: [
      "45MP full-frame CMOS sensor",
      "DIGIC X processor",
      "8K RAW video recording",
      "5-axis in-body image stabilization"
    ],
    specs: {
      sensor: "45MP full-frame CMOS",
      processor: "DIGIC X",
      iso: "100-51,200 (expandable)",
      autofocus: "Dual Pixel CMOS AF II",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1491796014055-e6835cdcd4c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras"
  },
  {
    id: 9,
    name: "Nikon Z6 II",
    price: 1999,
    originalPrice: 2199,
    description: "A versatile full-frame mirrorless camera built for demanding creators with improved speed, power, and low-light performance.",
    features: [
      "24.5MP BSI CMOS sensor",
      "Dual EXPEED 6 processors",
      "4K UHD video at 60p",
      "5-axis in-body image stabilization"
    ],
    specs: {
      sensor: "24.5MP BSI CMOS",
      processor: "Dual EXPEED 6",
      iso: "100-51,200 (expandable)",
      autofocus: "273-point phase-detection AF",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras"
  }
];

const Products = () => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(category || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userChangedPage, setUserChangedPage] = useState(false);
  const [sortOption, setSortOption] = useState<string>("default"); // default, newest, popular

  // SIMPLE DIRECT LOADING FUNCTION - NO CACHE SYSTEM
  const loadProducts = useCallback((selectedCategory: string, preservePage = false) => {
    // First, immediately set some products to display - directly from the fallback data
    const immediateProducts = selectedCategory === 'all' 
      ? directProducts 
      : directProducts.filter(p => p.category === selectedCategory);
      
    setProducts(immediateProducts);
    setFilteredProducts(immediateProducts);
    setTotalPages(Math.ceil(immediateProducts.length / ITEMS_PER_PAGE));
    
    // This ensures we have something to display immediately
    const pageToUse = preservePage ? currentPage : 1;
    const startIndex = (pageToUse - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    if (!preservePage) {
      setCurrentPage(1);
    }
    
    setDisplayedProducts(immediateProducts.slice(startIndex, endIndex));
    
    // Then set loading to false after a small delay to ensure UI updates
    setIsLoading(false);
  }, [currentPage]);

  // Handle category change from button clicks
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchTerm('');
    setSortOption('default');
    setUserChangedPage(false);
    
    // Update URL
    if (categoryId === 'all') {
      navigate('/products', { replace: true });
    } else {
      navigate(`/products/${categoryId}`, { replace: true });
    }
    
    // Set loading state and load products
    setIsLoading(true);
    setTimeout(() => {
      loadProducts(categoryId, false);
    }, 10);
  }, [navigate, loadProducts]);

  // Handle initial load and URL changes
  useEffect(() => {
    const currentCategory = category || 'all';
    
    // Only reset page if category changed
    const categoryChanged = currentCategory !== activeCategory;
    
    setActiveCategory(currentCategory);
    
    // Reset filters but not page if user manually changed page
    setSearchTerm('');
    setSortOption('default');
    
    if (categoryChanged) {
      setUserChangedPage(false);
    }
    
    // Set loading state and load products
    setIsLoading(true);
    setTimeout(() => {
      loadProducts(currentCategory, !categoryChanged && userChangedPage);
    }, 10);
  }, [category, loadProducts, activeCategory, userChangedPage]);

  // Filter products when search changes
  useEffect(() => {
    if (products.length === 0) return;
    
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    
    // Apply sorting if needed
    const sortedFiltered = sortProducts(filtered, sortOption);
    
    setFilteredProducts(sortedFiltered);
    
    // Update pagination
    const newTotalPages = Math.ceil(sortedFiltered.length / ITEMS_PER_PAGE);
    setTotalPages(newTotalPages);
    
    // Reset to page 1 if current page is now out of bounds
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
      setUserChangedPage(false);
    }
  }, [products, searchTerm, sortOption]); // Added sortOption to dependencies

  // Update displayed products when page or filtered products change
  useEffect(() => {
    if (filteredProducts.length === 0) {
      setDisplayedProducts([]);
      return;
    }
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  // Toggle filter visibility (mobile)
  const toggleFilter = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);
  
  // Page change handler
  const handlePageChange = useCallback((page: number) => {
    console.log("Changing to page:", page);
    setCurrentPage(page);
    setUserChangedPage(true);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoized values
  const categoryTitle = useMemo(() => {
    const categoryObj = Categories.find(cat => cat.id === activeCategory);
    return categoryObj ? categoryObj.name : 'Products';
  }, [activeCategory]);

  // Memoized components
  const categoryButtons = useMemo(() => {
    return Categories.map((cat) => (
      <Button
        key={cat.id}
        variant={activeCategory === cat.id ? "default" : "outline"}
        onClick={() => handleCategoryChange(cat.id)}
        className="rounded-full transition-all"
      >
        {cat.name}
      </Button>
    ));
  }, [activeCategory, handleCategoryChange]);

  // Pagination component
  const paginationComponent = useMemo(() => {
    if (!filteredProducts.length) return null;
    
    return (
      <div className="mt-8">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Showing {Math.min(filteredProducts.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(filteredProducts.length, currentPage * ITEMS_PER_PAGE)} of {filteredProducts.length} products
        </div>
      </div>
    );
  }, [filteredProducts.length, currentPage, totalPages, handlePageChange]);

  // Log current state for debugging
  console.log("Current state:", { currentPage, totalPages, userChangedPage, activeCategory });

  // Hàm xử lý sắp xếp sản phẩm
  const sortProducts = useCallback((products: Product[], option: string) => {
    let sorted = [...products];
    
    switch(option) {
      case "newest":
        // Sắp xếp theo ngày cập nhật mới nhất
        sorted = sorted.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || "").getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || "").getTime();
          return dateB - dateA; // Mới nhất đến cũ nhất
        });
        break;
      case "oldest":
        // Sắp xếp theo ngày cập nhật cũ nhất
        sorted = sorted.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || "").getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || "").getTime();
          return dateA - dateB; // Cũ nhất đến mới nhất
        });
        break;
      case "popular":
        // Sắp xếp theo lượt mua nhiều nhất
        sorted = sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case "priceHighToLow":
        // Sắp xếp theo giá từ cao đến thấp
        sorted = sorted.sort((a, b) => b.price - a.price);
        break;
      case "priceLowToHigh":
        // Sắp xếp theo giá từ thấp đến cao
        sorted = sorted.sort((a, b) => a.price - b.price);
        break;
      default:
        // Giữ nguyên thứ tự mặc định
        break;
    }
    
    return sorted;
  }, []);

  // Cập nhật hàm handleSearch để kết hợp với chức năng lọc
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (products.length > 0) {
      let filtered = products;
      
      // Lọc theo từ khóa tìm kiếm
      if (searchTerm.trim()) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Lọc theo danh mục
      if (activeCategory !== 'all') {
        filtered = filtered.filter(product => product.category === activeCategory);
      }
      
      // Sắp xếp sản phẩm theo tùy chọn đã chọn
      filtered = sortProducts(filtered, sortOption);
      
      setFilteredProducts(filtered);
      
      // Tính toán tổng số trang mới
      const newTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
      setTotalPages(newTotalPages);
      
      // Chỉ reset về trang 1 nếu trang hiện tại lớn hơn tổng số trang mới
      // hoặc nếu không tìm thấy kết quả nào
      if (currentPage > newTotalPages || filtered.length === 0) {
        setCurrentPage(1);
        setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
      } else {
        // Nếu không, giữ nguyên trang hiện tại
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedProducts(filtered.slice(startIndex, endIndex));
      }
    }
  }, [products, searchTerm, activeCategory, sortOption, sortProducts, currentPage]);

  // Tạo handler cho việc thay đổi tùy chọn sắp xếp
  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
    
    // Áp dụng sắp xếp cho sản phẩm đã lọc
    const sorted = sortProducts(filteredProducts, option);
    setFilteredProducts(sorted);
    
    // Giữ nguyên trang hiện tại thay vì reset về trang 1
    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Chỉ reset trang nếu trang hiện tại lớn hơn tổng số trang mới
    if (currentPage > totalPages) {
      setCurrentPage(1);
      setDisplayedProducts(sorted.slice(0, ITEMS_PER_PAGE));
    } else {
      // Nếu không, giữ nguyên trang hiện tại
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDisplayedProducts(sorted.slice(startIndex, endIndex));
    }
    
    setTotalPages(totalPages);
  }, [filteredProducts, sortProducts, currentPage]);

  return (
    <div className="pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20 mb-4">
            <span className="text-xs font-medium text-accent-foreground">Our Collection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-gradient mb-6">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated selection of premium tech products, designed with precision and built for excellence.
          </p>
        </div>
        
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categoryButtons}
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="relative w-full sm:w-2/3 md:w-3/4 mb-3 sm:mb-0">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-black/60 border border-white/20 rounded-md focus-visible:ring-accent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            <div className="relative w-full sm:w-1/3 md:w-1/4">
              <div className="relative">
                <select
                  id="sort-options"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full py-2 pl-4 pr-10 bg-black/60 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
                >
                  <option value="default">Default</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
              
          {/* Filter tags - hiển thị các bộ lọc đang áp dụng */}
          <div className="flex flex-wrap gap-2 mt-3">
            {sortOption !== 'default' && (
              <div className="px-3 py-1 rounded-full bg-accent/20 text-xs flex items-center">
                <span className="mr-2">
                  {sortOption === 'newest' ? 'Newest' : 
                   sortOption === 'popular' ? 'Most Popular' : 
                   sortOption === 'priceHighToLow' ? 'Price: High to Low' :
                   'Price: Low to High'}
                </span>
                <button onClick={() => handleSortChange('default')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {searchTerm.trim() && (
              <div className="px-3 py-1 rounded-full bg-accent/20 text-xs flex items-center">
                <span className="mr-2">Search: {searchTerm}</span>
                <button onClick={() => {
                  setSearchTerm('');
                  // Xử lý tương tự như handleSearch nhưng với searchTerm rỗng
                  let filtered = products;
                  if (activeCategory !== 'all') {
                    filtered = filtered.filter(product => product.category === activeCategory);
                  }
                  filtered = sortProducts(filtered, sortOption);
                  setFilteredProducts(filtered);
                  
                  const newTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                  setTotalPages(newTotalPages);
                  
                  if (currentPage > newTotalPages) {
                    setCurrentPage(1);
                    setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
                  } else {
                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                    const endIndex = startIndex + ITEMS_PER_PAGE;
                    setDisplayedProducts(filtered.slice(startIndex, endIndex));
                  }
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Nút xóa tất cả bộ lọc */}
            {(sortOption !== 'default' || searchTerm.trim()) && (
              <button
                onClick={() => {
                  setSortOption('default');
                  setSearchTerm('');
                  
                  // Reset về trạng thái ban đầu nhưng giữ danh mục hiện tại
                  let resetFiltered = products;
                  if (activeCategory !== 'all') {
                    resetFiltered = resetFiltered.filter(product => product.category === activeCategory);
                  }
                  
                  setFilteredProducts(resetFiltered);
                  
                  // Tính toán tổng số trang mới
                  const newTotalPages = Math.ceil(resetFiltered.length / ITEMS_PER_PAGE);
                  setTotalPages(newTotalPages);
                  
                  // Chỉ về trang 1 nếu trang hiện tại > tổng số trang mới
                  if (currentPage > newTotalPages) {
                    setCurrentPage(1);
                    setDisplayedProducts(resetFiltered.slice(0, ITEMS_PER_PAGE));
                  } else {
                    // Giữ nguyên trang hiện tại
                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                    const endIndex = startIndex + ITEMS_PER_PAGE;
                    setDisplayedProducts(resetFiltered.slice(startIndex, endIndex));
                  }
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
        
        {/* Products Display */}
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <ProductGrid products={displayedProducts} />
            {paginationComponent}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or selecting a different category</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSortOption('default');
                setSearchTerm('');
                loadProducts(activeCategory, false);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
