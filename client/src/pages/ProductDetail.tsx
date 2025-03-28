
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Heart, Share2, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const foundProduct = await getProductById(parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(0);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Product added to cart', {
        description: `${product.name} has been added to your cart.`,
      });
      setIsAddingToCart(false);
    }, 800);
  };

  const handleWishlist = () => {
    if (!product) return;
    
    toast.success('Added to wishlist', {
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  const handleShare = () => {
    if (!product) return;
    
    // In a real app, this would use the Web Share API if available
    toast.success('Product link copied!', {
      description: `Share link for ${product.name} copied to clipboard.`,
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground text-lg mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/5">
            <Link to={`/products/${product.category}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <motion.div 
              className="aspect-square overflow-hidden rounded-xl border border-white/10 glass-morphism"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
            
            <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  className={`relative overflow-hidden rounded-lg border transition-all ${
                    selectedImage === index 
                      ? 'border-accent ring-2 ring-accent/20' 
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setSelectedImage(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="aspect-square w-20">
                    <img 
                      src={image} 
                      alt={`${product.name} - View ${index + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20 mb-3">
                <span className="text-xs font-medium text-accent-foreground">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-4">
                {product.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-baseline space-x-4">
              <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-sm px-2 py-1 bg-accent/20 rounded-full text-accent-foreground font-medium">
                  Save ${(product.originalPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Check className="text-green-500 h-4 w-4" />
              <span>In stock and ready to ship</span>
            </div>
            
            <Separator className="bg-white/10" />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <Separator className="bg-white/10" />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                {Object.entries(product.specs).map(([key, value], index) => (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <span className="block text-sm text-muted-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span className="font-medium">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="flex-1 rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all"
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleWishlist}
                variant="outline" 
                size="icon" 
                className="rounded-full border-white/20 hover:bg-white/10"
              >
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={handleShare}
                variant="outline" 
                size="icon" 
                className="rounded-full border-white/20 hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
