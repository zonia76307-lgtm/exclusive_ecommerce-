import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // 🔥 .env se API URL uthaya
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const queryParams = new URLSearchParams(location.search);
  const filterType = queryParams.get('filter');

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/products`);
        
        let filteredData = data;

        if (filterType === 'flash-sale') {
          filteredData = data.filter(p => p.onSale === true);
        } else if (filterType === 'best-selling') {
          filteredData = [...data].sort((a, b) => (b.sold || 0) - (a.sold || 0));
        }

        setProducts(filteredData);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
    window.scrollTo(0, 0);
  }, [filterType, BASE_URL]);

  const getTitle = () => {
    if (filterType === 'flash-sale') return "Flash Sales";
    if (filterType === 'best-selling') return "Best Selling Products";
    return "Explore All Products";
  };

  // Loading State with Skeleton Grid
  if (loading) {
    return (
      <div className="max-w-[1170px] mx-auto px-4 py-16">
        <div className="h-10 w-48 bg-gray-200 animate-pulse mb-10 rounded-sm"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-[350px] bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto px-4 md:px-6 py-8 md:py-16 font-['Inter'] min-h-screen">
      
      {/* --- Responsive Header Section --- */}
      <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
        <div className="w-4 h-8 md:w-5 md:h-10 bg-[#DB4444] rounded-sm shrink-0"></div>
        <div className="flex flex-col">
           <span className="text-[#DB4444] text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Our Products</span>
           <h1 className="text-xl md:text-3xl font-bold text-black tracking-tight leading-tight">
            {getTitle()}
          </h1>
        </div>
      </div>

      {/* --- Responsive Products Grid --- */}
      {products.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <span className="text-3xl">🛍️</span>
          </div>
          <h2 className="text-lg md:text-xl text-gray-500 font-medium">No products found in this category.</h2>
          <Link to="/" className="mt-6 text-[#DB4444] hover:underline">Back to Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
          {products.map((p) => (
            <div key={p._id} className="w-full">
              <ProductCard 
                product={p} 
                showBadge={filterType === 'flash-sale' || p.onSale} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;