import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductTypePage = () => {
  const { type } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/products`);
        
        let filteredData = [];
        if (type === 'flash-sales') {
          // Sirf Sale wale products
          filteredData = res.data.filter(p => p.onSale);
        } else if (type === 'best-selling') {
          // Sold ki buniyad par sorting
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
  }, [type]);

  const pageTitle = type === 'flash-sales' ? "Flash Sales" : "Best Selling Products";
  const subTitle = type === 'flash-sales' ? "Today's" : "This Month";

  if (loading) return <div className="h-screen flex items-center justify-center text-2xl font-bold italic uppercase tracking-tighter">Loading {pageTitle}...</div>;

  return (
    <div className="max-w-[1170px] mx-auto px-4 xl:px-0 py-20 font-['Inter'] min-h-screen">
      
      {/* Dynamic Heading Section matching Home.jsx */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-5 h-10 bg-[#DB4444] rounded-sm"></div>
          <span className="text-[#DB4444] font-semibold text-[16px]">{subTitle}</span>
        </div>
        <h1 className="text-3xl font-semibold uppercase tracking-tight">{pageTitle}</h1>
      </div>

      {/* Grid Section */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500 italic text-xl">"No products found here yet."</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTypePage;