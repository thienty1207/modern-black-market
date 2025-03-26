
// Mock product data
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  specs: {
    [key: string]: string;
  };
  images: string[];
  category: string;
  featured?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: 999,
    originalPrice: 1099,
    description: "Experience the ultimate iPhone with our most advanced camera system and stunning Super Retina XDR display with ProMotion.",
    features: [
      "A15 Bionic chip with 5-core GPU",
      "Super Retina XDR display with ProMotion",
      "Pro camera system with new 12MP Telephoto, Wide, and Ultra Wide",
      "Up to 28 hours of video playback"
    ],
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
    price: 1199,
    description: "The ultimate combination of the S series and Note series, with built-in S Pen, powerful camera, and long-lasting battery.",
    features: [
      "Dynamic AMOLED 2X display",
      "108MP wide camera",
      "S Pen included",
      "5000mAh battery"
    ],
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
    category: "phones"
  },
  {
    id: 3,
    name: "Google Pixel 6 Pro",
    price: 899,
    description: "Experience the best of Google with the custom-built Google Tensor processor and advanced camera system.",
    features: [
      "Google Tensor chip",
      "50MP wide camera",
      "Android with Pixel exclusives",
      "4500mAh battery"
    ],
    specs: {
      display: "6.7-inch LTPO OLED",
      chip: "Google Tensor",
      camera: "50MP wide, 12MP ultra-wide",
      battery: "4500mAh",
      storage: "128GB, 256GB, 512GB"
    },
    images: [
      "https://images.unsplash.com/photo-1635870723802-e88d76ae324c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598965402089-897e93a166f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones"
  },
  {
    id: 4,
    name: "MacBook Pro 16",
    price: 2499,
    description: "Supercharged for pros. The most powerful MacBook Pro ever is here with the blazing-fast M1 Pro or M1 Max chip.",
    features: [
      "Apple M1 Pro or M1 Max chip",
      "Up to 64GB unified memory",
      "Up to 8TB storage",
      "Up to 21 hours battery life"
    ],
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
    price: 1799,
    description: "A stunning 15.6-inch InfinityEdge display in a compact form factor powered by 11th Gen Intel Core processors.",
    features: [
      "11th Gen Intel Core processors",
      "NVIDIA GeForce RTX 3050 Ti",
      "15.6-inch 4K UHD+ InfinityEdge display",
      "Up to 16 hours battery life"
    ],
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
    category: "laptops"
  },
  {
    id: 6,
    name: "Razer Blade 15",
    price: 1999,
    originalPrice: 2199,
    description: "The world's smallest 15.6-inch gaming laptop with NVIDIA GeForce RTX graphics and 10th Gen Intel Core i7.",
    features: [
      "10th Gen Intel Core i7",
      "NVIDIA GeForce RTX 3080",
      "15.6-inch 360Hz display",
      "Per-key RGB lighting"
    ],
    specs: {
      display: "15.6-inch FHD 360Hz",
      processor: "10th Gen Intel Core i7",
      graphics: "NVIDIA GeForce RTX 3080",
      memory: "16GB or 32GB",
      storage: "1TB SSD"
    },
    images: [
      "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601406984081-bd6b491c0436?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops"
  },
  {
    id: 7,
    name: "Sony Alpha a7 IV",
    price: 2499,
    description: "A full-frame hybrid camera with outstanding still image quality and evolved video technology for creators.",
    features: [
      "33MP full-frame Exmor R CMOS sensor",
      "BIONZ XR processor",
      "4K 60p video recording",
      "10-bit 4:2:2 color sampling"
    ],
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
  },
  {
    id: 8,
    name: "Canon EOS R5",
    price: 3899,
    description: "A revolutionary full-frame mirrorless camera that delivers uncompromising image quality and 8K video recording.",
    features: [
      "45MP full-frame CMOS sensor",
      "DIGIC X processor",
      "8K RAW video recording",
      "5-axis in-body image stabilization"
    ],
    specs: {
      sensor: "45MP full-frame CMOS",
      processor: "DIGIC X",
      iso: "100-51,200 (expandable)",
      autofocus: "Dual Pixel CMOS AF II",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1491796014055-e6835cdcd4c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras"
  },
  {
    id: 9,
    name: "Nikon Z6 II",
    price: 1999,
    originalPrice: 2199,
    description: "A versatile full-frame mirrorless camera built for demanding creators with improved speed, power, and low-light performance.",
    features: [
      "24.5MP BSI CMOS sensor",
      "Dual EXPEED 6 processors",
      "4K UHD video at 60p",
      "5-axis in-body image stabilization"
    ],
    specs: {
      sensor: "24.5MP BSI CMOS",
      processor: "Dual EXPEED 6",
      iso: "100-51,200 (expandable)",
      autofocus: "273-point phase-detection AF",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras"
  }
];

// Service functions
export const getProducts = (): Promise<Product[]> => {
  return Promise.resolve(products);
};

export const getProductById = (id: number): Promise<Product | undefined> => {
  return Promise.resolve(products.find(product => product.id === id));
};

export const getProductsByCategory = (category: string): Promise<Product[]> => {
  return Promise.resolve(products.filter(product => product.category === category));
};

export const getFeaturedProducts = (): Promise<Product[]> => {
  return Promise.resolve(products.filter(product => product.featured));
};
