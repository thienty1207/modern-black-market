import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/services/productService';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  className?: string;
}

const ProductCard = ({ id, name, price, image, category, className }: ProductCardProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Kiểm tra xem sản phẩm có trong wishlist không khi component mount
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(savedWishlist.includes(id));
    
    // Kiểm tra kích thước màn hình
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Thêm sản phẩm vào giỏ hàng (giả lập)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ 
        id, 
        name, 
        price, 
        image, 
        category, 
        quantity: 1 
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Kích hoạt sự kiện để cập nhật giỏ hàng trong navbar
    window.dispatchEvent(new Event('storage'));
    
    toast.success('Đã thêm vào giỏ hàng', {
      description: `${name} đã được thêm vào giỏ hàng của bạn.`,
    });
  };
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let newWishlist;
    
    if (isInWishlist) {
      // Xóa khỏi wishlist
      newWishlist = savedWishlist.filter((itemId: number) => itemId !== id);
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      // Thêm vào wishlist
      newWishlist = [...savedWishlist, id];
      toast.success('Đã thêm vào danh sách yêu thích', {
        description: `${name} đã được thêm vào danh sách yêu thích của bạn.`,
      });
    }
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    // Kích hoạt sự kiện để cập nhật wishlist trong navbar
    window.dispatchEvent(new Event('storage'));
    
    setIsInWishlist(!isInWishlist);
  };

  return (
    /* Outer container with extra padding to ensure buttons don't get clipped */
    <div className="p-4">
      {/* Card with scale effect */}
      <div 
        className={cn(
          "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:scale-105 hover:z-10",
          className
        )}
      >
        {/* Buttons that stay in fixed positions with higher z-index */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Wishlist Button (Always visible) */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/70 hover:bg-accent transition-all duration-300 shadow-md pointer-events-auto"
            aria-label={isInWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors", 
                isInWishlist ? "fill-accent text-accent" : "text-white"
              )} 
            />
          </button>

          {/* Detail button (Eye icon) */}
          <div className={cn(
            "absolute top-2 left-2 pointer-events-auto",
            isMobile 
              ? "opacity-100" 
              : "opacity-0 group-hover:opacity-100 duration-300"
          )}>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-black/70 text-white border-none hover:bg-white hover:text-black rounded-full shadow-md h-8 w-8"
              asChild
            >
              <Link to={`/product/${id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Link to={`/product/${id}`} className="block">
            <div className="aspect-square overflow-hidden">
              <img 
                src={image} 
                alt={name} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            
            <div className="p-3 sm:p-4">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-accent/80 block truncate">{category}</span>
                <h3 className="mt-1 text-sm sm:text-base font-medium leading-tight line-clamp-2 group-hover:text-accent transition-colors">{name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base sm:text-lg font-semibold">{typeof price === 'number' ? formatCurrency(price) : 'N/A'}</span>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Cart button - Now outside of the Link component with higher z-index */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-40">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full bg-black/40 hover:bg-accent hover:text-white text-white shadow-md"
              onClick={handleAddToCart}
              aria-label="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tối ưu hóa với React.memo để ngăn re-render không cần thiết
export default React.memo(ProductCard, (prevProps, nextProps) => {
  // Chỉ re-render khi thuộc tính thay đổi
  return (
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.price === nextProps.price &&
    prevProps.image === nextProps.image &&
    prevProps.category === nextProps.category &&
    prevProps.className === nextProps.className
  );
});
