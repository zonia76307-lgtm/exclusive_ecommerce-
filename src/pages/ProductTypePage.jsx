import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductTypePage = () => {
  const { type } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 .env se API URL uthaya
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/products`);
        
        let filteredData = [];
        if (type === 'flash-sales') {
          filteredData = res.data.filter(p => p.onSale);
        } else if (type === 'best-selling') {
          filteredData = [...res.data].sort((a, b) => (b.sold || 0) - (a.sold || 0));
        } else {
          filteredData = res.data;
        }
        
        setProducts(filteredData);
      } catch (err) {
        console.error("Error fetching filtered products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, [type, BASE_URL]);

  const pageTitle = type === 'flash-sales' ? "Flash Sales" : "Best Selling Products";
  const subTitle = type === 'flash-sales' ? "Today's" : "This Month";

  // Loading State with Skeleton UI
  if (loading) {
    return (
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20 animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-5 h-10 bg-gray-200 rounded-sm"></div>
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-64 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto px-4 xl:px-0 py-10 md:py-20 font-['Inter'] min-h-screen">
      
      {/* --- Responsive Heading Section --- */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
          <div className="w-4 h-8 md:w-5 md:h-10 bg-[#DB4444] rounded-sm"></div>
          <span className="text-[#DB4444] font-semibold text-sm md:text-[16px]">{subTitle}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black">
          {pageTitle}
        </h1>
      </div>

      {/* --- Responsive Grid Section --- */}
      {products.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-gray-50 rounded-lg border-2 border-dashed flex flex-col items-center">
          <p className="text-gray-400 italic text-lg md:text-xl mb-6">"No products found here yet."</p>
          <Link to="/" className="bg-[#DB4444] text-white px-8 py-3 rounded-sm hover:bg-black transition-all">
            Back to Home
          </Link>
        </div>
      ) : (
        /* Mobile: 2 items per row | Tablet: 3 items | Desktop: 4 items */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTypePage;