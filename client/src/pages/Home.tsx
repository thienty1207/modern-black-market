import React, { useEffect, useState, useCallback } from 'react';
import Hero from '@/components/Hero';
import FeaturedCategory from '@/components/FeaturedCategory';
import ProductGrid from '@/components/ProductGrid';
import { getFeaturedProducts, Product, formatCurrency } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import ProductCard from '@/components/ProductCard';
import { type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { handleAsyncError, showErrorToast, showSuccessToast, AppError } from '@/utils/errorHandler';

// Thêm dữ liệu sản phẩm mẫu để hiển thị đầy đủ
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: 999 * 24500,
    originalPrice: 1099 * 24500,
    description: "Trải nghiệm iPhone tối ưu với hệ thống camera tiên tiến nhất của chúng tôi.",
    features: ["Chip A15 Bionic", "Hệ thống camera Pro", "Lên tới 28 giờ xem video"],
    specs: {
      display: "6.1-inch Super Retina XDR",
      chip: "A15 Bionic",
      camera: "Pro 12MP camera system",
      battery: "Up to 28 hours",
      storage: "128GB, 256GB, 512GB, 1TB"
    },
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones",
    featured: true
  },
  {
    id: 2,
    name: "Samsung Galaxy S22 Ultra",
    price: 1199 * 24500,
    description: "Sự kết hợp tối ưu của dòng S và Note series.",
    features: ["Màn hình Dynamic AMOLED 2X", "Camera 108MP", "Bút S Pen tích hợp"],
    specs: {
      display: "6.8-inch Dynamic AMOLED 2X",
      chip: "Snapdragon 8 Gen 1",
      camera: "108MP wide, 12MP ultra-wide",
      battery: "5000mAh",
      storage: "128GB, 256GB, 512GB, 1TB"
    },
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones",
    featured: true
  },
  {
    id: 3,
    name: "Sam Sung 20",
    price: 899 * 24500,
    description: "Trải nghiệm tinh hoa Google với bộ vi xử lý Google Tensor được thiết kế riêng.",
    features: ["Chip Google Tensor", "Camera rộng 50MP", "Android với tính năng độc quyền của Pixel"],
    specs: {
      display: "6.7-inch LTPO OLED",
      chip: "Google Tensor",
      camera: "50MP wide, 12MP ultra-wide",
      battery: "4500mAh",
      storage: "128GB, 256GB, 512GB"
    },
    images: [
      "https://i.pinimg.com/736x/93/c3/5c/93c35c1f28deac8697b5476a29b0a6c1.jpg",
      "https://i.pinimg.com/736x/a1/bb/be/a1bbbee85fbbf0cceb1c8f02031d78fd.jpg"
    ],
    category: "phones",
    featured: true
  },
  {
    id: 4,
    name: "MacBook Pro 16",
    price: 2499 * 24500,
    description: "Hiệu suất vượt trội dành cho các chuyên gia. MacBook Pro mạnh mẽ nhất đã có mặt.",
    features: ["Chip Apple M1 Pro hoặc M1 Max", "Bộ nhớ thống nhất lên đến 64GB", "Lưu trữ lên đến 8TB"],
    specs: {
      display: "16-inch Liquid Retina XDR",
      chip: "M1 Pro or M1 Max",
      memory: "16GB, 32GB, or 64GB",
      storage: "512GB to 8TB SSD",
      battery: "Up to 21 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops",
    featured: true
  },
  {
    id: 5,
    name: "Dell XPS 15",
    price: 1799 * 24500,
    description: "Màn hình InfinityEdge 15,6 inch ấn tượng trong thiết kế nhỏ gọn.",
    features: ["Bộ vi xử lý Intel Core thế hệ 11", "NVIDIA GeForce RTX 3050 Ti", "Màn hình 4K UHD+ 15,6 inch"],
    specs: {
      display: "15.6-inch 4K UHD+",
      processor: "11th Gen Intel Core i7/i9",
      graphics: "NVIDIA GeForce RTX 3050 Ti",
      memory: "16GB, 32GB, or 64GB",
      storage: "512GB to 2TB SSD"
    },
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops",
    featured: true
  },
  {
    id: 6,
    name: "Sony Alpha a7 IV",
    price: 2499 * 24500,
    description: "Máy ảnh hybrid full-frame với chất lượng hình ảnh tĩnh vượt trội.",
    features: ["Cảm biến CMOS Exmor R full-frame 33MP", "Bộ xử lý BIONZ XR", "Quay video 4K 60p"],
    specs: {
      sensor: "33MP full-frame Exmor R CMOS",
      processor: "BIONZ XR",
      iso: "100-51,200 (expandable)",
      autofocus: "759-point phase-detection AF",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras",
    featured: true
  }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [error, setError] = useState<string | null>(null);

  // Function to manually control slides
  const handleNext = useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollNext();
  }, [carouselApi]);

  const handlePrev = useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollPrev();
  }, [carouselApi]);

  // Function to load products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Thử tải sản phẩm từ service
      const products = await getFeaturedProducts();
      
      // Nếu trả về ít hơn 6 sản phẩm, bổ sung bằng sản phẩm mẫu
      if (products.length < 6) {
        const combinedProducts = [...products];
        
        // Đảm bảo không trùng ID với sản phẩm hiện có
        const existingIds = new Set(products.map(p => p.id));
        const filteredSamples = sampleProducts.filter(p => !existingIds.has(p.id));
        
        // Thêm vào đủ 6-8 sản phẩm
        const neededSamples = Math.max(0, 8 - combinedProducts.length);
        combinedProducts.push(...filteredSamples.slice(0, neededSamples));
        
        setFeaturedProducts(combinedProducts);
      } else {
        setFeaturedProducts(products);
      }
    } catch (error) {
      console.error('Failed to load featured products:', error);
      
      // Xử lý lỗi với errorHandler
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải sản phẩm.';
      setError(errorMessage);
      showErrorToast(error, 'Lỗi tải sản phẩm');
      
      // Sử dụng dữ liệu mẫu khi gặp lỗi
      setFeaturedProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const retryLoading = () => {
    loadProducts();
    showSuccessToast('Đang tải lại dữ liệu', 'Thử lại');
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.7,
        delay: custom * 0.1,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUpVariants}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-4">
              Danh Mục Nổi Bật
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Khám phá bộ sưu tập sản phẩm công nghệ cao cấp được thiết kế cho hiệu suất và sự thanh lịch.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUpVariants}
            custom={1}
          >
            <FeaturedCategory 
              title="Điện Thoại Cao Cấp"
              description="Khám phá bộ sưu tập smartphone tiên tiến với camera hiện đại, màn hình đẹp mắt và pin dùng cả ngày."
              image="https://i.pinimg.com/736x/f8/21/d5/f821d500c6b948e4d32bf0e61eea1b48.jpg"
              link="/products/phones"
            />
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUpVariants}
            custom={2}
          >
            <FeaturedCategory 
              title="Laptop Hiệu Năng Cao"
              description="Khám phá tiềm năng của bạn với các dòng laptop mạnh mẽ được thiết kế cho người sáng tạo, game thủ và chuyên gia."
              image="https://i.pinimg.com/736x/6c/f7/d3/6cf7d3c1aefd776a8c3df0612642d8cb.jpg"
              link="/products/laptops"
              reverse
            />
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUpVariants}
            custom={3}
          >
            <FeaturedCategory 
              title="Máy Ảnh Chuyên Nghiệp"
              description="Ghi lại khoảnh khắc cuộc sống với độ rõ nét và chi tiết đặc biệt bằng thiết bị và máy ảnh chuyên nghiệp."
              image="https://i.pinimg.com/736x/24/e6/53/24e653f589559dc34db312464dbb5036.jpg"
              link="/products/cameras"
            />
          </motion.div>
        </div>
      </section>
      
      <section id="featured-products" className="py-20 px-4 md:px-8 bg-gradient-to-t from-zinc-950 to-zinc-900 relative overflow-hidden">
        {/* Background shimmer effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ 
            opacity: 1,
            background: [
              "linear-gradient(135deg, rgba(180, 132, 253, 0.05) 0%, transparent 100%)",
              "linear-gradient(135deg, rgba(180, 132, 253, 0.12) 0%, transparent 100%)",
              "linear-gradient(135deg, rgba(180, 132, 253, 0.05) 0%, transparent 100%)"
            ]
          }}
          transition={{ 
            opacity: { duration: 0.8 },
            background: { duration: 8, repeat: Infinity, repeatType: "reverse" }
          }}
          viewport={{ once: false, margin: "-100px" }}
        />
        
        {/* Animated light ray */}
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          <motion.div
            className="absolute h-[300%] w-[100px] bg-gradient-to-b from-transparent via-accent/10 to-transparent -rotate-45"
            animate={{ 
              left: ['-20%', '120%'],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2
            }}
          />
        </motion.div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              duration: 0.8
            }}
            viewport={{ once: false, margin: "-150px" }}
          >
            <motion.div
              className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20 mb-4"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              animate={{ 
                boxShadow: [
                  "0 0 0 rgba(180, 132, 253, 0.2)",
                  "0 0 15px rgba(180, 132, 253, 0.5)",
                  "0 0 0 rgba(180, 132, 253, 0.2)"
                ],
                transition: {
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }
              }}
            >
              <span className="text-xs font-medium text-accent-foreground">Lựa Chọn Hàng Đầu</span>
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: false }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                transition: {
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "loop"
                }
              }}
            >
              Sản Phẩm Nổi Bật
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: false }}
            >
              Khám phá bộ sưu tập sản phẩm công nghệ cao cấp, được chế tác tỉ mỉ và thiết kế đỉnh cao.
            </motion.p>
          </motion.div>
          
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : error ? (
            <div className="h-96 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Đã xảy ra lỗi</h3>
              <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
              <Button 
                variant="outline" 
                onClick={retryLoading}
                className="bg-black/20 backdrop-blur-sm hover:bg-accent/80 border-white/10"
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                className="flex justify-center w-full"
              >
                <motion.div 
                  className="w-full max-w-6xl relative px-2 md:px-4"
                  initial={{ opacity: 0, y: 100, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 50, 
                    damping: 20,
                    duration: 0.8,
                    delay: 0.3
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                >
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute -top-20 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      scale: { duration: 0.5 },
                      animate: { 
                        duration: 6, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }
                    }}
                  />
                  <motion.div 
                    className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ 
                      scale: { duration: 0.5 },
                      animate: { 
                        duration: 8, 
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1
                      }
                    }}
                  />
                
                  <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm shadow-xl">
                    <motion.div
                      className="absolute inset-0 z-0"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      animate={{
                        background: [
                          "linear-gradient(45deg, rgba(0,0,0,0) 0%, rgba(180, 132, 253,0.05) 50%, rgba(0,0,0,0) 100%)",
                          "linear-gradient(45deg, rgba(0,0,0,0) 100%, rgba(180, 132, 253,0.05) 50%, rgba(0,0,0,0) 0%)"
                        ]
                      }}
                      transition={{
                        opacity: { duration: 0.3 },
                        background: {
                          duration: 5,
                          repeat: Infinity,
                          repeatType: "mirror"
                        }
                      }}
                    />
                    <Carousel
                      opts={{
                        align: "center",
                        loop: true,
                        containScroll: false,
                      }}
                      className="w-full"
                      setApi={setCarouselApi}
                      onDragStart={() => {
                        console.log('Carousel drag started');
                      }}
                      onDragEnd={() => {
                        console.log('Carousel drag ended');
                      }}
                    >
                      <CarouselContent className="-ml-2 md:-ml-4 p-2">
                        {featuredProducts.map((product, index) => (
                          <CarouselItem 
                            key={product.id} 
                            className="pl-4 pr-4 pt-4 pb-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
                          >
                            <motion.div 
                              className="h-full"
                              initial={{ 
                                opacity: 0, 
                                y: 40,
                                scale: 0.9
                              }}
                              whileInView={{ 
                                opacity: 1, 
                                y: 0,
                                scale: 1,
                                transition: {
                                  type: "spring",
                                  stiffness: 70,
                                  damping: 15,
                                  delay: index * 0.1
                                }
                              }}
                              viewport={{ once: false, margin: "-50px" }}
                              animate={{ 
                                opacity: 1,
                                boxShadow: [
                                  "0 10px 20px -15px rgba(0, 0, 0, 0.2)",
                                  "0 15px 30px -10px rgba(180, 132, 253, 0.3)",
                                  "0 10px 20px -15px rgba(0, 0, 0, 0.2)"
                                ] 
                              }}
                              transition={{
                                opacity: { duration: 0.5 },
                                boxShadow: {
                                  duration: 3 + index * 0.2,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  ease: "easeInOut"
                                }
                              }}
                            >
                              {/* Card content wrapper */}
                              <motion.div
                                className="relative h-full overflow-visible rounded-xl" 
                                animate={{ 
                                  boxShadow: [
                                    "0 5px 15px rgba(0,0,0,0.1)",
                                    "0 8px 25px rgba(180, 132, 253,0.15)",
                                    "0 5px 15px rgba(0,0,0,0.1)"
                                  ],
                                  background: [
                                    "linear-gradient(to bottom, rgba(255,255,255,0.01) 0%, rgba(0,0,0,0.2) 100%)",
                                    "linear-gradient(to bottom, rgba(180, 132, 253,0.03) 0%, rgba(0,0,0,0.2) 100%)",
                                    "linear-gradient(to bottom, rgba(255,255,255,0.01) 0%, rgba(0,0,0,0.2) 100%)"
                                  ]
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  delay: index * 0.2
                                }}
                                whileHover={{ 
                                  scale: 1.05,
                                  boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                                  transition: { duration: 0.3, ease: "easeOut" }
                                }}
                                style={{ padding: "10px" }}
                              >
                                {/* Shine effect */}
                                <motion.div
                                  className="absolute inset-0 z-10 opacity-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                  animate={{
                                    opacity: [0, 0.4, 0],
                                    left: ['-100%', '100%', '100%']
                                  }}
                                  transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    repeatDelay: 4 + index,
                                    ease: "easeInOut"
                                  }}
                                />
                                <ProductCard
                                  id={product.id}
                                  name={product.name}
                                  price={product.price}
                                  image={product.images[0]} 
                                  category={product.category}
                                  className="h-full transform transition-all duration-300 relative z-20"
                                />
                              </motion.div>
                            </motion.div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>
                  
                  {/* Auto scroll indicator */}
                  <motion.div
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1 items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      opacity: { duration: 0.5 },
                      animate: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <motion.div 
                      className="h-1 w-8 bg-accent/30 rounded-full"
                      animate={{ 
                        width: ['8px', '24px', '8px'],
                        opacity: [0.3, 0.7, 0.3] 
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </motion.div>
                  
                  {/* Custom Controls */}
                  <motion.div 
                    className="flex items-center justify-center gap-6 mt-10"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.3, 
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    viewport={{ once: false }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ 
                        boxShadow: [
                          "0 0 0 rgba(180, 132, 253, 0.2)",
                          "0 0 15px rgba(180, 132, 253, 0.3)",
                          "0 0 0 rgba(180, 132, 253, 0.2)"
                        ]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrev}
                        className="bg-black/40 backdrop-blur-sm hover:bg-accent/80 border-white/10 h-12 w-12 rounded-full shadow-lg hover:shadow-accent/30 transition-all" 
                        aria-label="Previous slide"
                      >
                        <div className="h-5 w-5 flex items-center justify-center rotate-180">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ 
                        boxShadow: [
                          "0 0 0 rgba(180, 132, 253, 0.2)",
                          "0 0 15px rgba(180, 132, 253, 0.3)",
                          "0 0 0 rgba(180, 132, 253, 0.2)"
                        ]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1.5
                      }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        className="bg-black/40 backdrop-blur-sm hover:bg-accent/80 border-white/10 h-12 w-12 rounded-full shadow-lg hover:shadow-accent/30 transition-all" 
                        aria-label="Next slide"
                      >
                        <div className="h-5 w-5 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.6,
                  type: "spring", 
                  stiffness: 100 
                }}
                viewport={{ once: false, margin: "-50px" }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 4px 6px rgba(0, 0, 0, 0.1)", 
                      "0 10px 15px rgba(180, 132, 253, 0.3)", 
                      "0 4px 6px rgba(0, 0, 0, 0.1)"
                    ]
                  }}
                  transition={{ 
                    opacity: { duration: 0.3 },
                    animate: {
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }
                  }}
                >
                  <Button asChild size="lg" className="rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all">
                    <Link to="/products" className="group">
                      Xem Tất Cả Sản Phẩm
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </motion.span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>

        {/* Floating particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-accent/20 blur-[1px]"
          animate={{ 
            opacity: [0, 0.5, 0],
            y: [0, -100, -200],
            x: [0, 20, 40]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-accent/15 blur-[1px]"
          animate={{ 
            opacity: [0, 0.4, 0],
            y: [0, -80, -160],
            x: [0, -15, -30]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-accent/10 blur-[1px]"
          animate={{ 
            opacity: [0, 0.5, 0],
            y: [0, -120, -240],
            x: [0, 10, 20]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-accent/15 blur-[1px]"
          animate={{ 
            opacity: [0, 0.4, 0],
            y: [0, -60, -120],
            x: [0, -8, -16]
          }}
          transition={{ 
            duration: 6.5, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/5 w-3 h-3 rounded-full bg-accent/20 blur-[1px]"
          animate={{ 
            opacity: [0, 0.5, 0],
            y: [0, -70, -140],
            x: [0, 15, 30]
          }}
          transition={{ 
            duration: 8.5, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 2.5
          }}
        />
      </section>
      
      <section className="py-20 px-4 md:px-8 glass-morphism relative overflow-hidden">
        {/* Background animation elements */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full bg-accent/5 blur-xl"
          style={{ top: '20%', left: '10%' }}
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0], 
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute w-40 h-40 rounded-full bg-primary/5 blur-xl"
          style={{ bottom: '15%', right: '15%' }}
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 40, 0], 
            opacity: [0.4, 0.7, 0.4] 
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Light beam animation */}
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          <motion.div
            className="absolute h-[300%] w-[100px] bg-gradient-to-b from-transparent via-accent/10 to-transparent -rotate-45"
            animate={{ 
              left: ['-20%', '120%'],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2
            }}
          />
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8
            }
          }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.7,
                delay: 0.1
              }
            }}
            viewport={{ once: false, amount: 0.6 }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            Trải Nghiệm Công Nghệ Cao Cấp
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground text-lg mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.7,
                delay: 0.2
              }
            }}
            viewport={{ once: false, amount: 0.6 }}
          >
            Tham gia cùng hàng nghìn khách hàng hài lòng đã nâng cao trải nghiệm kỹ thuật số với bộ sưu tập sản phẩm công nghệ cao cấp của chúng tôi.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.7,
                delay: 0.3
              }
            }}
            viewport={{ once: false, amount: 0.6 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Button asChild size="lg" className="rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all">
              <Link to="/products" className="group">
                Mua Ngay
                <motion.span 
                  className="ml-2 inline-flex items-center"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 1, duration: 0.8 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Floating particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-accent/20 blur-[2px]"
          animate={{ 
            opacity: [0, 0.5, 0],
            y: [0, -100, -200],
            x: [0, 20, 40]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-accent/15 blur-[2px]"
          animate={{ 
            opacity: [0, 0.4, 0],
            y: [0, -80, -160],
            x: [0, -15, -30]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 1
          }}
        />
      </section>
    </div>
  );
};

export default Home;
