import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/services/productService';

// Sample cart data
const initialCart = [
  {
    id: 1,
    name: "Premium Smartphone X",
    price: 899 * 24500,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    quantity: 1
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 199 * 24500,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    quantity: 1
  }
];

const Cart = () => {
  const [cart, setCart] = useState(initialCart);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

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

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) } 
        : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setDiscount(10);
      toast.success('Đã áp dụng mã khuyến mãi!', {
        description: 'Giảm giá 10% đã được áp dụng cho đơn hàng của bạn.',
      });
    } else {
      toast.error('Mã khuyến mãi không hợp lệ', {
        description: 'Vui lòng nhập mã khuyến mãi hợp lệ.',
      });
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  const checkout = () => {
    toast.success('Đặt hàng thành công!', {
      description: 'Đơn hàng của bạn đã được đặt và sẽ sớm được xử lý.',
    });
  };

  if (cart.length === 0) {
    return (
      <motion.div 
        className="pt-32 pb-20 px-4 md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-6">
            Giỏ Hàng Của Bạn Đang Trống
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tiếp Tục Mua Sắm
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="pt-32 pb-20 px-4 md:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient">
            Giỏ Hàng Của Bạn
          </h1>
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/5">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tiếp Tục Mua Sắm
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                custom={index}
                className="flex flex-col md:flex-row gap-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="w-full md:w-1/4">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                    <p className="text-2xl font-bold">{formatCurrency(item.price)}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <div className="flex items-center border border-white/20 rounded-full">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 -mr-2"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-fit sticky top-24"
          >
            <h2 className="text-xl font-medium mb-4">Tổng Đơn Hàng</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Giảm giá ({discount}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              
              <Separator className="bg-white/10 my-4" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Mã khuyến mãi" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-transparent border-white/20"
                />
                <Button variant="outline" onClick={applyPromo}>Áp dụng</Button>
              </div>
              
              <Button 
                size="lg" 
                className="w-full rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all"
                onClick={checkout}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Thanh Toán
              </Button>
              
              <div className="text-xs text-center text-muted-foreground mt-4">
                <p>Thanh toán an toàn qua Stripe</p>
                <p className="mt-1">Miễn phí vận chuyển cho tất cả đơn hàng</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
