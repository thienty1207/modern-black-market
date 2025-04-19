import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ProductGrid from '@/components/ProductGrid';
// import { useProducts, useProductsByCategory, Product, formatCurrency } from '@/services/productService'; // Tạm vô hiệu hóa
import { formatCurrency } from '@/services/productService'; // Giữ lại formatCurrency nếu cần
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal, RefreshCw, Loader2 } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Định nghĩa lại kiểu Product nếu cần (vì đã comment import ở trên)
interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features?: string[];
  specs?: Record<string, string>;
  images: string[];
  category: string;
  featured?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const Categories = [
  { id: 'all', name: 'Tất Cả Sản Phẩm' },
  { id: 'phones', name: 'Điện Thoại' },
  { id: 'laptops', name: 'Laptop' },
  { id: 'cameras', name: 'Máy Ảnh' },
];

const ITEMS_PER_PAGE = 8;

// This is the direct data from the service - used as fallback
const directProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: 999 * 24500,
    originalPrice: 1099 * 24500,
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
    price: 1199 * 24500,
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
    name: "Sam Sung 20",
    price: 899 * 24500,
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
      "https://i.pinimg.com/736x/93/c3/5c/93c35c1f28deac8697b5476a29b0a6c1.jpg",
      "https://i.pinimg.com/736x/a1/bb/be/a1bbbee85fbbf0cceb1c8f02031d78fd.jpg"
    ],
    category: "phones"
  },
  {
    id: 4,
    name: "MacBook Pro 16",
    price: 2499 * 24500,
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
    price: 1799 * 24500,
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
    price: 1999 * 24500,
    originalPrice: 2199 * 24500,
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
    price: 2499 * 24500,
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
    price: 3899 * 24500,
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
    price: 1999 * 24500,
    originalPrice: 2199 * 24500,
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<string>("default");
  const [activeCategory, setActiveCategory] = useState<string>(category || 'all');
  
  // Tạm thời vô hiệu hóa các hook gọi API
  // const { 
  //   data: allProducts = [], 
  //   isLoading: isLoadingAll,
  //   refetch: refetchAll
  // } = useProducts();
  
  // const {
  //   data: categoryProducts = [],
  //   isLoading: isLoadingCategory,
  //   refetch: refetchCategory
  // } = useProductsByCategory(activeCategory === 'all' ? '' : activeCategory);
  
  // Luôn sử dụng dữ liệu mẫu
  const products = directProducts; // Luôn dùng directProducts
  const isLoading = false; // Giả định không loading
  
  // Lọc theo category nếu không phải 'all'
  const categoryFilteredProducts = useMemo(() => {
      if (activeCategory === 'all') return products;
      return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  // Tìm kiếm và lọc sản phẩm từ categoryFilteredProducts
  const filteredProducts = useMemo(() => {
    if (!categoryFilteredProducts.length) return [];
    
    let result = [...categoryFilteredProducts];
    
    if (searchTerm) {
      result = result.filter(product => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.description.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    return sortProducts(result, sortOption);
  }, [categoryFilteredProducts, searchTerm, sortOption]);
  
  // Tính toán số trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  // Phân trang
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);
  
  // Thay đổi category
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchTerm('');
    setSortOption('default');
    setCurrentPage(1);
    
    // Cập nhật URL
    if (categoryId === 'all') {
      navigate('/products', { replace: true });
    } else {
      navigate(`/products/${categoryId}`, { replace: true });
    }
  }, [navigate]);
  
  // Cập nhật activeCategory khi URL thay đổi
  useEffect(() => {
    const currentCategory = category || 'all';
    setActiveCategory(currentCategory);
    setCurrentPage(1);
  }, [category]);

  // Toggle filter visibility (mobile)
  const toggleFilter = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);
  
  // Page change handler
  const handlePageChange = useCallback((page: number) => {
    console.log("Changing to page:", page);
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoized values
  const categoryTitle = useMemo(() => {
    const categoryObj = Categories.find(cat => cat.id === activeCategory);
    return categoryObj ? categoryObj.name : 'Products';
  }, [activeCategory]);

  // Memoized components
  const categoryButtons = useMemo(() => (
    <div className="overflow-x-auto whitespace-nowrap pb-3 scrollbar-thin">
      <div className="inline-flex space-x-2">
        {[{ id: 'all', name: 'Tất cả' }, ...Categories].map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            onClick={() => handleCategoryChange(cat.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              activeCategory === cat.id ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  ), [activeCategory, handleCategoryChange]);

  // Pagination component
  const paginationComponent = useMemo(() => (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  ), [currentPage, totalPages, handlePageChange]);

  // Log current state for debugging
  console.log("Current state:", { currentPage, totalPages, activeCategory });

  // Hàm xử lý sắp xếp sản phẩm
  function sortProducts(products: Product[], option: string) {
    const sorted = [...products];
    
    switch (option) {
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = a.updatedAt || a.createdAt || new Date(0);
          const dateB = b.updatedAt || b.createdAt || new Date(0);
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted; // Default sorting (could be by relevance or featured)
    }
  }

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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Sản phẩm</h1>
      
      {/* Mobile Filter Toggle */}
      <div className="block md:hidden mb-4">
        <Button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span>Bộ lọc & Danh mục</span>
          {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Filters Section - Hidden on mobile unless toggled */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block mb-6`}>
        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Danh mục</h2>
          {categoryButtons}
        </div>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Sort Options */}
        <div className="mb-4">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Mặc định</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
              <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Grid */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSortOption('default');
                setActiveCategory('all');
                navigate('/products', { replace: true });
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && paginationComponent}
    </div>
  );
};

export default Products;
