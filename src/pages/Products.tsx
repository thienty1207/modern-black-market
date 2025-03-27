import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '@/components/ProductGrid';
import { getProducts, getProductsByCategory, Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal } from 'lucide-react';

const Categories = [
  { id: 'all', name: 'All Products' },
  { id: 'phones', name: 'Phones' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'cameras', name: 'Cameras' },
];

const Products = () => {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
  }, [category]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        let fetchedProducts;
        if (activeCategory === 'all') {
          fetchedProducts = await getProducts();
        } else {
          fetchedProducts = await getProductsByCategory(activeCategory);
        }
        console.log('Fetched products:', fetchedProducts);
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [activeCategory]);

  useEffect(() => {
    console.log('Filtering products:', products.length);
    if (products.length === 0) return;
    
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesPrice;
    });
    
    console.log('Filtered products:', filtered.length);
    setFilteredProducts(filtered);
  }, [products, searchTerm, priceRange]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchTerm('');
    setPriceRange([0, 5000]);
  };

  const getCategoryTitle = () => {
    const categoryObj = Categories.find(cat => cat.id === activeCategory);
    return categoryObj ? categoryObj.name : 'Products';
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }
          }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20 mb-4">
            <span className="text-xs font-medium text-accent-foreground">Our Collection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-gradient mb-6">
            {getCategoryTitle()}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated selection of premium tech products, designed with precision and built for excellence.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }
          }}
        >
          {Categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(cat.id)}
                className="rounded-full transition-all"
              >
                {cat.name}
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mb-8"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="relative w-full md:w-1/3">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 focus-visible:ring-accent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Button
              variant="outline"
              className="md:hidden w-full border-white/20"
              onClick={toggleFilter}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
            
            <div className={`${isFilterOpen || window.innerWidth >= 768 ? 'block' : 'hidden'} w-full md:w-2/3 space-y-4 md:space-y-0 md:flex items-center gap-4`}>
              <div className="flex-1">
                <Label htmlFor="price-range" className="text-sm">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
                <Slider
                  id="price-range"
                  defaultValue={[0, 5000]}
                  value={priceRange}
                  max={5000}
                  step={100}
                  onValueChange={handlePriceChange}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGrid products={filteredProducts} />
          </motion.div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5 }
              }
            }}
            className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or selecting a different category</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Products;
