
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

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
    toast.success('Product added to cart', {
      description: `${product?.name} has been added to your cart.`,
      position: 'bottom-right',
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
            <div className="aspect-square overflow-hidden rounded-xl border border-white/10 glass-morphism">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative overflow-hidden rounded-lg border transition-all ${
                    selectedImage === index 
                      ? 'border-accent/50 ring-2 ring-accent/20' 
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="aspect-square w-20">
                    <img 
                      src={image} 
                      alt={`${product.name} - View ${index + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-8">
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
            </div>
            
            <Separator className="bg-white/10" />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator className="bg-white/10" />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <span className="block text-sm text-muted-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto rounded-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
