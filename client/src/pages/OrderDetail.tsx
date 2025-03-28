import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/services/productService';

// Định nghĩa các trạng thái đơn hàng
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Interface cho đơn hàng
interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
}

// Mock data cho đơn hàng - trong thực tế sẽ lấy từ backend
const mockOrders: Record<string, Order> = {
  '100001': {
    id: '100001',
    date: 'June 12, 2023',
    status: 'delivered',
    items: [
      {
        id: 1,
        productId: 1,
        name: 'iPhone 13 Pro',
        price: 999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 2,
        productId: 4,
        name: 'MacBook Pro 16',
        price: 2499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 3498,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    paymentMethod: 'Credit Card (**** 1234)'
  },
  '100002': {
    id: '100002',
    date: 'May 29, 2023',
    status: 'shipped',
    items: [
      {
        id: 1,
        productId: 5,
        name: 'Dell XPS 15',
        price: 1799,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 1799,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    paymentMethod: 'PayPal'
  },
  '100003': {
    id: '100003',
    date: 'April 15, 2023',
    status: 'processing',
    items: [
      {
        id: 1,
        productId: 7,
        name: 'Sony Alpha a7 IV',
        price: 2499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 2,
        productId: 3,
        name: 'Google Pixel 6 Pro',
        price: 899,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1635870723802-e88d76ae324c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      }
    ],
    total: 3398,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    paymentMethod: 'Credit Card (**** 5678)'
  }
};

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mô phỏng việc tải dữ liệu từ API
    const fetchOrder = () => {
      setIsLoading(true);
      // Giả lập thời gian gọi API
      setTimeout(() => {
        if (orderId && mockOrders[orderId]) {
          setOrder(mockOrders[orderId]);
        }
        setIsLoading(false);
      }, 800);
    };

    fetchOrder();
  }, [orderId]);

  // Hàm hiển thị trạng thái đơn hàng
  const renderOrderStatus = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-amber-500">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Pending Approval</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-2 text-blue-500">
            <Package className="h-5 w-5" />
            <span className="font-medium">Processing</span>
          </div>
        );
      case 'shipped':
        return (
          <div className="flex items-center gap-2 text-indigo-500">
            <Truck className="h-5 w-5" />
            <span className="font-medium">Shipped</span>
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Delivered</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Hiển thị thông báo dựa trên trạng thái
  const renderStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg p-4 mb-6">
            Your order is awaiting approval from our team. We'll notify you once it's been processed.
          </div>
        );
      case 'processing':
        return (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg p-4 mb-6">
            Good news! Your order has been approved and is now being processed. We're preparing your items for shipping.
          </div>
        );
      case 'shipped':
        return (
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-lg p-4 mb-6">
            Your order is on its way! You can track your shipment with the tracking information provided in your email.
          </div>
        );
      case 'delivered':
        return (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg p-4 mb-6">
            Your order has been delivered successfully. Enjoy your new products!
          </div>
        );
      case 'cancelled':
        return (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-4 mb-6">
            This order has been cancelled. If you have any questions, please contact our customer support.
          </div>
        );
      default:
        return null;
    }
  };

  // Hiển thị tiến trình đơn hàng
  const renderOrderProgress = (status: OrderStatus) => {
    const steps = [
      { id: 'pending', label: 'Pending' },
      { id: 'processing', label: 'Processing' },
      { id: 'shipped', label: 'Shipped' },
      { id: 'delivered', label: 'Delivered' }
    ];

    const statusIndex = steps.findIndex(step => step.id === status);
    
    return (
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= statusIndex ? 'bg-accent text-accent-foreground' : 'bg-white/10 text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1">{step.label}</span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-accent"
            style={{ 
              width: `${statusIndex === -1 ? 0 : (statusIndex / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/user" className="inline-flex items-center text-muted-foreground hover:text-accent transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Account
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mt-4 mb-2">
            Order Details
          </h1>
          <p className="text-muted-foreground">
            View the details and status of your order
          </p>
        </motion.div>

        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : order ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <div>
                  <h2 className="text-xl font-medium mb-1">Order #{order.id}</h2>
                  <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  {renderOrderStatus(order.status)}
                </div>
              </div>

              {/* Order status message */}
              {renderStatusMessage(order.status)}

              {/* Order progress */}
              {order.status !== 'cancelled' && renderOrderProgress(order.status)}

              <Separator className="mb-6" />

              {/* Order items */}
              <h3 className="text-lg font-medium mb-4">Items in Your Order</h3>
              <div className="space-y-4 mb-8">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-right font-medium">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-6" />

              {/* Order summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Information</h3>
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <p className="text-muted-foreground mb-1">Payment Method</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-3 border-t border-white/10">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 md:p-8">
              <h3 className="text-lg font-medium mb-4">Need Help With Your Order?</h3>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns about your order, please don't hesitate to contact our customer support team.
              </p>
              <Button variant="outline" className="mr-4">Contact Support</Button>
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                  Cancel Order
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 className="text-xl font-medium mb-2">Order Not Found</h3>
            <p className="text-muted-foreground">
              We couldn't find the order you're looking for. Please check the order ID and try again.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/user">Return to My Account</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 