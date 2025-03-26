
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '@/components/ProductGrid';
import { getProducts, getProductsByCategory, Product } from '@/services/productService';
import { Button } from '@/components/ui/button';

const Categories = [
  { id: 'all', name: 'All Products' },
  { id: 'phones', name: 'Phones' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'cameras', name: 'Cameras' },
];

const Products = () => {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(category || 'all');

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
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const getCategoryTitle = () => {
    const categoryObj = Categories.find(cat => cat.id === activeCategory);
    return categoryObj ? categoryObj.name : 'Products';
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20 mb-4">
            <span className="text-xs font-medium text-accent-foreground">Our Collection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-gradient mb-6">
            {getCategoryTitle()}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated selection of premium tech products, designed with precision and built for excellence.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Categories.map(cat => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(cat.id)}
              className="rounded-full"
            >
              {cat.name}
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
