
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const BASE_URL = "http://localhost:5000";

  // URL se query parameter pakadne ke liye (e.g. ?filter=flash-sale)
  const queryParams = new URLSearchParams(location.search);
  const filterType = queryParams.get('filter');

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/products`);
        
        let filteredData = data;

        // Filter Logic based on URL params
        if (filterType === 'flash-sale') {
          filteredData = data.filter(p => p.onSale === true);
        } else if (filterType === 'best-selling') {
          // Sorting by 'sold' count (assuming your backend has this field)
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
    // Screen ko top par scroll karne ke liye jab filter badle
    window.scrollTo(0, 0);
  }, [filterType]);

  const getTitle = () => {
    if (filterType === 'flash-sale') return "Flash Sales";
    if (filterType === 'best-selling') return "Best Selling Products";
    return "Explore All Products";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DB4444]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto px-4 md:px-6 py-10 md:py-16 font-['Inter']">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8 md:mb-12">
        <div className="w-5 h-10 bg-[#DB4444] rounded-sm"></div>
        <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
          {getTitle()}
        </h1>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl text-gray-500">No products found in this category.</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
          {products.map((p) => (
            <ProductCard 
              key={p._id} 
              product={p} 
              // Flash sale filter ho toh badge hamesha dikhao
              showBadge={filterType === 'flash-sale' || p.onSale} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;