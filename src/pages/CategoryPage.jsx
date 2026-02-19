import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5000"; // Backend ka URL

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products`);
        
        const filtered = data.filter(p => {
          const backendCat = (p.category?.name || p.category || "").toLowerCase().trim();
          const formattedURLCat = categoryName.split('-').join(' ').toLowerCase().trim();

          if (formattedURLCat === "electronics") {
            const electronicsSubs = ["electronics", "phones", "computers", "smartwatch", "camera", "headphones", "gaming"];
            return electronicsSubs.includes(backendCat);
          }

          if (formattedURLCat.includes("fashion")) {
             return backendCat.includes(formattedURLCat) || backendCat.includes("fashion");
          }

          return backendCat === formattedURLCat;
        });

        setProducts(filtered);
      } catch (err) {
        console.error("Filtering error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName, BASE_URL]);

  return (
    <div className="max-w-[1170px] mx-auto py-20 px-4 font-['Inter']">
      <div className="flex gap-2 text-sm text-gray-400 mb-10">
        <Link to="/" className="hover:text-black transition-all">Home</Link>
        <span>/</span>
        <span className="text-black capitalize font-medium">
            {categoryName.replace(/-/g, ' ')}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <div className="w-5 h-10 bg-[#DB4444] rounded-sm shadow-sm"></div>
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            {categoryName.replace(/-/g, ' ')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{products.length} Products found</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[1,2,3,4,5,6,7,8].map(n => (
             <div key={n} className="h-[350px] bg-gray-100 animate-pulse rounded-sm border border-gray-50"></div>
           ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-xl text-gray-600 font-semibold italic">
            "Oops! We couldn't find any products in this category."
          </h3>
          <Link to="/" className="inline-block mt-8 bg-black text-white px-10 py-3 rounded-sm hover:bg-[#DB4444] transition-all">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;