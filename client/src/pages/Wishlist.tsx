
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getProducts, Product } from '@/services/productService';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Giả lập dữ liệu wishlist từ localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        // Trong thực tế, bạn sẽ lấy danh sách ID từ localStorage hoặc từ database
        // và sau đó gọi API để lấy thông tin chi tiết sản phẩm
        const savedWishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        if (savedWishlistIds.length === 0) {
          setWishlistItems([]);
          setIsLoading(false);
          return;
        }
        
        // Lấy danh sách sản phẩm và lọc theo ID trong wishlist
        const allProducts = await getProducts();
        const wishlistProducts = allProducts.filter(product => 
          savedWishlistIds.includes(product.id)
        );
        
        setWishlistItems(wishlistProducts);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        toast.error('Failed to load your wishlist');
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleRemoveFromWishlist = (productId: number) => {
    // Cập nhật state
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    
    // Cập nhật localStorage
    const savedWishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = savedWishlistIds.filter((id: number) => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: Product) => {
    // Giả lập thêm vào giỏ hàng
    toast.success(`${product.name} added to cart`);
    
    // Trong thực tế, bạn sẽ cập nhật giỏ hàng trong localStorage hoặc state
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <div className="pt-24 pb-20 px-4 md:px-8">
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
          <div className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20 mb-4">
            <span className="text-xs font-medium text-accent-foreground">Your Wishlist</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-gradient mb-6">
            Saved Items
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Keep track of products you love and want to purchase later.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : wishlistItems.length > 0 ? (
          <motion.div className="space-y-4" variants={containerVariants}>
            {wishlistItems.map((item) => (
              <motion.div 
                key={item.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/4 h-48 sm:h-auto">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-accent/80">{item.category}</span>
                          <h3 className="text-xl font-medium mt-1">{item.name}</h3>
                        </div>
                        <span className="text-xl font-semibold">${item.price.toLocaleString()}</span>
                      </div>
                      <p className="text-muted-foreground mt-4 line-clamp-2">
                        {item.description || "High-quality product with premium features and elegant design."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6 justify-between items-center">
                      <div className="flex gap-3">
                        <Button onClick={() => handleAddToCart(item)}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="border-white/20 hover:bg-destructive hover:text-white hover:border-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-white/20" 
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-8">Start adding items you love to your wishlist</p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Wishlist;
