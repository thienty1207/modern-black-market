
import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import FeaturedCategory from '@/components/FeaturedCategory';
import ProductGrid from '@/components/ProductGrid';
import { getFeaturedProducts, Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-4">
              Featured Categories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our premium selection of cutting-edge tech products designed for performance and elegance.
            </p>
          </div>
          
          <FeaturedCategory 
            title="Premium Smartphones"
            description="Discover our collection of cutting-edge smartphones featuring advanced cameras, stunning displays, and all-day battery life."
            image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            link="/products/phones"
          />
          
          <FeaturedCategory 
            title="High-Performance Laptops"
            description="Unleash your potential with our range of powerful laptops designed for creators, gamers, and professionals alike."
            image="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            link="/products/laptops"
            reverse
          />
          
          <FeaturedCategory 
            title="Professional Cameras"
            description="Capture life's moments with exceptional clarity and detail using our professional-grade cameras and equipment."
            image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            link="/products/cameras"
          />
        </div>
      </section>
      
      <section id="featured-products" className="py-20 px-4 md:px-8 bg-gradient-to-t from-zinc-950 to-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20 mb-4">
              <span className="text-xs font-medium text-accent-foreground">Top Picks</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our selection of premium tech products, crafted with precision and designed for excellence.
            </p>
          </div>
          
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <>
              <ProductGrid products={featuredProducts} className="mb-12" />
              <div className="text-center">
                <Button asChild size="lg" className="rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all">
                  <Link to="/products" className="group">
                    View All Products
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      <section className="py-20 px-4 md:px-8 glass-morphism">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-6">
            Experience Premium Technology
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of satisfied customers who have elevated their digital experience with our curated selection of premium tech products.
          </p>
          <Button asChild size="lg" className="rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all">
            <Link to="/products" className="group">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
