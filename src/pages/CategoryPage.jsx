import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5000";

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
    <div className="max-w-[1170px] mx-auto py-10 md:py-20 px-4 font-['Inter']">
      
      {/* RESPONSIVE BREADCRUMBS */}
      <div className="flex flex-wrap items-center gap-2 text-[12px] md:text-sm text-gray-400 mb-6 md:mb-10">
        <Link to="/" className="hover:text-black transition-all">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-black capitalize font-semibold truncate max-w-[150px] md:max-w-none">
            {categoryName.replace(/-/g, ' ')}
        </span>
      </div>

      {/* HEADER SECTION */}
      <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
        <div className="w-4 h-8 md:w-5 md:h-10 bg-[#DB4444] rounded-sm shadow-sm shrink-0"></div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight truncate">
            {categoryName.replace(/-/g, ' ')}
          </h2>
          <p className="text-[11px] md:text-sm text-gray-500 font-medium mt-0.5">
            Showing {products.length} results
          </p>
        </div>
      </div>

      {/* SKELETON LOADING - Responsive Columns */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
           {[1,2,3,4,5,6,7,8].map(n => (
             <div key={n} className="h-[250px] md:h-[350px] bg-gray-100 animate-pulse rounded-sm border border-gray-50"></div>
           ))}
        </div>
      ) : products.length === 0 ? (
        /* EMPTY STATE */
        <div className="py-16 md:py-24 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center">
          <div className="text-5xl md:text-6xl mb-6 grayscale opacity-50">🔍</div>
          <h3 className="text-lg md:text-xl text-gray-800 font-black italic max-w-[280px] md:max-w-none">
            "We couldn't find any products in this category."
          </h3>
          <p className="text-gray-400 text-sm mt-2 px-6">Check back later or explore other sections.</p>
          <Link to="/" className="inline-block mt-8 bg-black text-white px-8 md:px-12 py-3.5 rounded-sm hover:bg-[#DB4444] transition-all font-bold text-sm tracking-widest active:scale-95 shadow-lg">
            BACK TO SHOP
          </Link>
        </div>
      ) : (
        /* PRODUCT GRID - Optimized for small screens */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-8">
          {products.map(product => (
            <div key={product._id} className="transition-transform duration-300 hover:-translate-y-1">
               <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;