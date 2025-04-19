import React, { useEffect, useState } from 'react';
import { getProducts, Product } from '../api/products';
import { Link } from 'react-router-dom';
import { Spinner } from './ui/spinner';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ page });
        setProducts((prev) => (page === 1 ? response.results : [...prev, ...response.results]));
        setHasMore(!!response.next);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error && products.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => { setError(null); setPage(1); }}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Our Products</h2>
      
      {products.length === 0 && loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images.find(img => img.is_primary)?.image || product.images[0].image} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No image available</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {product.discount_price ? (
                        <div className="flex items-center">
                          <span className="text-primary font-bold">${product.discount_price}</span>
                          <span className="text-gray-400 line-through text-sm ml-2">${product.price}</span>
                        </div>
                      ) : (
                        <span className="text-primary font-bold">${product.price}</span>
                      )}
                    </div>
                    <Link 
                      to={`/products/${product.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {(loading || hasMore) && (
            <div className="mt-8 text-center">
              {loading ? (
                <Spinner className="text-primary" />
              ) : (
                <button
                  onClick={loadMore}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  disabled={loading}
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 