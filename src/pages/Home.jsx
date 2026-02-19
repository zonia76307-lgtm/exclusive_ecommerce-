import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiGrid, FiArrowLeft, FiArrowRight, FiTruck, FiHeadphones, FiShield } from 'react-icons/fi';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]); 
  const [bestSelling, setBestSelling] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef(null);
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resProducts, resCategories, resArrivals, resBestSelling] = await Promise.all([
          axios.get(`${BASE_URL}/api/products`),
          axios.get(`${BASE_URL}/api/categories`),
          axios.get(`${BASE_URL}/api/products/new-arrivals`),
          axios.get(`${BASE_URL}/api/products/best-selling`) 
        ]);

        setProducts(resProducts.data);
        setCategories(resCategories.data);
        setNewArrivals(resArrivals.data);
        
        // 🔥 Filter: Frontend par bhi check laga diya ke sirf sold > 0 wale ayen
        const actualSales = resBestSelling.data.filter(p => (p.sold || 0) > 0);
        setBestSelling(actualSales);
        
      } catch (err) {
        console.error("Data fetching error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const flashSales = products.filter(p => p.onSale).slice(0, 4);
  const exploreProducts = products.slice(0, 8);

  const getImg = (path) => path?.startsWith('http') ? path : `${BASE_URL}${path}`;

  if (loading) return <div className="h-screen flex items-center justify-center text-xl md:text-2xl font-bold font-['Inter']">Loading Store...</div>;

  return (
    <div className="max-w-[1170px] mx-auto px-4 md:px-6 xl:px-0 font-['Inter'] pb-10 md:pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="flex flex-col md:flex-row gap-0 lg:gap-10 mb-12 md:mb-20">
        <div className="md:w-[23%] border-r border-gray-200 pt-6 md:pt-10 hidden md:block">
          <ul className="space-y-3 lg:space-y-4 pr-6">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link 
                  to={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} 
                  className="flex items-center justify-between text-black hover:text-[#DB4444] transition-all text-sm lg:text-[16px] font-normal"
                >
                  <span>{cat.name}</span>
                  <svg width="8" height="13" viewBox="0 0 8 13" fill="none" className="opacity-50"><path d="M1.5 1L7 6.5L1.5 12" stroke="black" strokeWidth="1.5"/></svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="md:w-[77%] pt-6 md:pt-10">
          <div className="bg-black w-full min-h-[250px] md:min-h-[344px] flex flex-col sm:flex-row items-center justify-between px-6 md:px-10 lg:px-16 text-white relative overflow-hidden group rounded-sm">
            <div className="z-10 py-8 md:py-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-3 md:mb-5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-8 md:w-10 invert" alt="apple" />
                <span className="text-xs md:text-[16px]">iPhone 14 Series</span>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 leading-tight">Up to 10% <br className="hidden md:block" /> off Voucher</h1>
              <button className="flex items-center mx-auto sm:mx-0 gap-2 underline underline-offset-8 font-medium hover:text-gray-300 text-sm md:text-base">Shop Now <span className="text-lg md:text-xl">→</span></button>
            </div>
            <img src={"/hero.png"} className="w-[200px] md:w-[300px] lg:w-[400px] object-contain transition-transform duration-700 group-hover:scale-105" alt="hero" />
          </div>
        </div>
      </div>

      {/* 2. FLASH SALES */}
      <section className="mb-12 md:mb-20">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <div className="w-4 md:w-5 h-8 md:h-10 bg-[#DB4444] rounded-sm"></div>
          <span className="text-[#DB4444] font-semibold text-sm md:text-[16px]">Today's</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-10 tracking-tight">Flash Sales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {flashSales.map((p) => <ProductCard key={p._id} product={p} showBadge={true} />)}
        </div>
        
        <div className="text-center mt-10 md:mt-14">
            <Link 
              to="/products?filter=flash-sale" 
              className="inline-block bg-[#DB4444] text-white px-8 md:px-12 py-3 md:py-4 rounded-sm hover:bg-black transition-all font-medium uppercase text-xs md:text-sm"
            >
              View All Products
            </Link>
        </div>
      </section>

      <hr className="border-gray-200 mb-12 md:mb-20" />

      {/* 3. BROWSE BY CATEGORY */}
      <section className="mb-12 md:mb-20">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <div className="w-4 md:w-5 h-8 md:h-10 bg-[#DB4444] rounded-sm"></div>
          <span className="text-[#DB4444] font-semibold text-sm md:text-[16px]">Categories</span>
        </div>
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold">Browse By Category</h2>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"><FiArrowLeft size={20} /></button>
            <button onClick={() => scroll('right')} className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"><FiArrowRight size={20} /></button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((cat) => (
            <Link 
              key={cat._id} 
              to={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} 
              className="min-w-[120px] md:min-w-[170px] border border-gray-200 p-4 md:p-8 flex flex-col items-center justify-center gap-3 md:gap-4 hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] transition-all group rounded-sm"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 group-hover:scale-110 transition-transform flex items-center justify-center">
                {cat.image ? <img src={getImg(cat.image)} alt={cat.name} className="w-full h-full object-contain" /> : <FiGrid className="text-2xl md:text-4xl" />}
              </div>
              <span className="text-[10px] md:text-sm font-medium uppercase text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLING - Ab sirf sold products ayenge */}
      {bestSelling.length > 0 && (
        <section className="mb-12 md:mb-20">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <div className="w-4 md:w-5 h-8 md:h-10 bg-[#DB4444] rounded-sm"></div>
            <span className="text-[#DB4444] font-semibold text-sm md:text-[16px]">This Month</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold">Best Selling Products</h2>
            
            <Link 
              to="/products?filter=best-selling" 
              className="bg-[#DB4444] text-white px-8 md:px-10 py-2 md:py-3 rounded-sm hover:bg-black transition-all font-medium uppercase text-xs md:text-sm"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {bestSelling.map((p) => <ProductCard key={p._id} product={p} showBadge={false} />)}
          </div>
        </section>
      )}

      {/* 5. EXPLORE OUR PRODUCTS */}
      <section className="mb-12 md:mb-20">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <div className="w-4 md:w-5 h-8 md:h-10 bg-[#DB4444] rounded-sm"></div>
          <span className="text-[#DB4444] font-semibold text-sm md:text-[16px]">Our Products</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-10">Explore Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-12 gap-x-6 md:gap-x-8">
          {exploreProducts.map((p) => <ProductCard key={p._id} product={p} showBadge={false} />)}
        </div>
        
        <div className="text-center mt-10 md:mt-14">
            <Link 
              to="/products?filter=all" 
              className="inline-block bg-[#DB4444] text-white px-8 md:px-12 py-3 md:py-4 rounded-sm hover:bg-black transition-all font-medium uppercase text-xs md:text-sm"
            >
              View All Products
            </Link>
        </div>
      </section>

      {/* 6. NEW ARRIVAL */}
      <section className="mb-16 md:mb-28">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <div className="w-4 md:w-5 h-8 md:h-10 bg-[#DB4444] rounded-sm"></div>
          <span className="text-[#DB4444] font-semibold text-sm md:text-[16px]">Featured</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-10">New Arrival</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
           {newArrivals[0] && (
             <div className="bg-black relative rounded-sm overflow-hidden group min-h-[300px] md:h-[600px]">
                <img src={getImg(newArrivals[0].image)} className="absolute bottom-0 w-full h-[80%] md:h-full object-contain p-6 md:p-10 group-hover:scale-105 transition-all duration-700" alt="New 1" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white z-10 max-w-[200px] md:max-w-[250px]">
                   <h3 className="text-xl md:text-2xl font-semibold mb-2">{newArrivals[0].name}</h3>
                   <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">{newArrivals[0].description?.substring(0,60)}...</p>
                   <Link to={`/product/${newArrivals[0]._id}`} className="underline text-sm md:text-base font-medium hover:text-[#DB4444]">Shop Now</Link>
                </div>
             </div>
           )}
           
           <div className="flex flex-col gap-4 md:gap-8">
              {newArrivals[1] && (
                <div className="bg-[#0D0D0D] min-h-[200px] md:h-1/2 relative rounded-sm overflow-hidden group">
                   <img src={getImg(newArrivals[1].image)} className="absolute right-0 bottom-0 h-full w-1/2 object-contain group-hover:scale-105 transition-all duration-700" alt="New 2" />
                   <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white z-10 max-w-[50%]">
                      <h3 className="text-xl md:text-2xl font-semibold mb-2">{newArrivals[1].name}</h3>
                      <Link to={`/product/${newArrivals[1]._id}`} className="underline text-sm md:text-base font-medium hover:text-[#DB4444]">Shop Now</Link>
                   </div>
                </div>
              )}
              
              <div className="flex gap-4 md:gap-8 h-1/2">
                 {newArrivals[2] && (
                   <div className="bg-black w-1/2 relative rounded-sm overflow-hidden flex items-center justify-center group min-h-[150px]">
                      <img src={getImg(newArrivals[2].image)} className="w-2/3 object-contain group-hover:scale-110 transition-all duration-500" alt="New 3" />
                      <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-sm md:text-lg font-semibold truncate w-24">{newArrivals[2].name}</h3>
                          <Link to={`/product/${newArrivals[2]._id}`} className="text-[10px] md:text-xs underline hover:text-[#DB4444]">Shop Now</Link>
                      </div>
                   </div>
                 )}
                 {newArrivals[3] && (
                   <div className="bg-black w-1/2 relative rounded-sm overflow-hidden flex items-center justify-center group min-h-[150px]">
                      <img src={getImg(newArrivals[3].image)} className="w-2/3 object-contain group-hover:scale-110 transition-all duration-500" alt="New 4" />
                      <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-sm md:text-lg font-semibold truncate w-24">{newArrivals[3].name}</h3>
                          <Link to={`/product/${newArrivals[3]._id}`} className="text-[10px] md:text-xs underline hover:text-[#DB4444]">Shop Now</Link>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </section>

      {/* 7. SERVICES SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-8 text-center pt-10">
        <ServiceBox icon={<FiTruck />} title="Free and Fast Delivery" desc="Free delivery for all orders over $140" />
        <ServiceBox icon={<FiHeadphones />} title="24/7 Customer Service" desc="Friendly 24/7 customer support" />
        <ServiceBox icon={<FiShield />} title="Money Back Guarantee" desc="We return money within 30 days" />
      </div>

    </div>
  );
};

const ServiceBox = ({ icon, title, desc }) => (
  <div className="space-y-3 md:space-y-4">
    <div className="bg-black text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto border-[6px] md:border-[10px] border-gray-300">
      <span className="text-2xl md:text-4xl">{icon}</span>
    </div>
    <h3 className="font-bold text-lg md:text-xl uppercase tracking-wider">{title}</h3>
    <p className="text-xs md:text-sm text-gray-600">{desc}</p>
  </div>
);

export default Home;