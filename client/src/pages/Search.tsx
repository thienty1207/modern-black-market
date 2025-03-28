import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/ProductGrid';
import { getProducts, Product } from '@/services/productService';
import { Search as SearchIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Pagination from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 5;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);
        
        if (initialQuery) {
          filterProducts(allProducts, initialQuery);
        } else {
          setFilteredProducts([]);
          setDisplayedProducts([]);
          setTotalPages(1);
        }
        
        // Reset trang về 1 khi thay đổi query
        setCurrentPage(1);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [initialQuery]);
  
  // Cập nhật sản phẩm hiển thị khi thay đổi trang hoặc kết quả tìm kiếm
  useEffect(() => {
    if (filteredProducts.length === 0) {
      setDisplayedProducts([]);
      return;
    }
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
    
    // Cuộn lên đầu khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filteredProducts, currentPage]);

  const filterProducts = (productList: Product[], searchQuery: string) => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      setDisplayedProducts([]);
      setTotalPages(1);
      return;
    }
    
    const filtered = productList.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      filterProducts(products, query);
      setCurrentPage(1); // Reset trang về 1 khi tìm kiếm mới
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchParams({});
    setFilteredProducts([]);
    setDisplayedProducts([]);
    setTotalPages(1);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-gradient mb-6">
            Search Products
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Find your perfect tech match from our premium collection
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
            <Input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-24 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-lg"
            />
            {query && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Button 
              type="submit"
              className="absolute right-1 top-1 h-12 rounded-full"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Search
            </Button>
          </form>
        </motion.div>
        
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{initialQuery}"
              </h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <ProductGrid products={displayedProducts} />
              
              {/* Phân trang */}
              {filteredProducts.length > ITEMS_PER_PAGE && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Showing {Math.min(filteredProducts.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(filteredProducts.length, currentPage * ITEMS_PER_PAGE)} of {filteredProducts.length} results
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : initialQuery ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-medium mb-2">Start searching</h3>
            <p className="text-muted-foreground">Enter a term to search our products</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Search;
