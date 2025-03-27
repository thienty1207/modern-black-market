
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/ProductGrid';
import { getProducts, Product } from '@/services/productService';
import { Search as SearchIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [initialQuery]);

  const filterProducts = (productList: Product[], searchQuery: string) => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }
    
    const filtered = productList.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      filterProducts(products, query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchParams({});
    setFilteredProducts([]);
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
              <ProductGrid products={filteredProducts} />
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
