import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, syncCartWithDB } from "../redux/slices/cartSlice";
import { FiHeart, FiTruck, FiRotateCcw } from "react-icons/fi";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        toast.error("Product not found");
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0); // Page load par top par scroll kare
  }, [id, BASE_URL]);

  const hasDiscount = product?.onSale && product?.discountPercentage > 0;
  const finalPrice = hasDiscount 
    ? (product.price - (product.price * product.discountPercentage / 100)).toFixed(0)
    : product?.price;

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/500";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  const handleAddToWishlist = async () => {
    if (!userInfo?.token) return toast.warn("Please login first");
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`${BASE_URL}/api/wishlist`, { productId: product._id }, config);
      toast.success("Added to Wishlist! ❤️");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding to wishlist");
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      ...product, 
      price: Number(finalPrice),
      image: getImageUrl(product.image), 
      qty 
    }));

    if (userInfo?.token) {
      const existItem = cartItems.find(x => x._id === product._id);
      const newQty = existItem ? (existItem.qty + qty) : qty;
      dispatch(syncCartWithDB({ productId: product._id, quantity: newQty, actionType: 'update' }));
    }
    toast.success("Added to Cart! 🛒");
  };

  if (loading) return <div className="py-40 text-center text-xl animate-pulse">Loading Product...</div>;
  if (!product) return <div className="py-40 text-center text-red-500 font-bold">Product not found!</div>;

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-20 font-['Inter']">
      
      {/* Layout Grid: Mobile (1 col) | Tablet/Desktop (2 cols) */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
        
        {/* --- Left: Product Image Section --- */}
        <div className="w-full lg:w-[60%] bg-[#F5F5F5] p-6 md:p-10 rounded-sm flex items-center justify-center min-h-[350px] md:min-h-[500px]">
          <img 
            src={getImageUrl(product.image)} 
            alt={product.name} 
            className="max-h-[300px] md:max-h-[500px] w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105" 
          />
        </div>

        {/* --- Right: Product Info Section --- */}
        <div className="w-full lg:w-[40%] flex flex-col">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 md:mb-4">{product.name}</h1>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
            <div className="flex text-yellow-400 text-sm">★★★★★</div>
            <span className="text-gray-400 text-xs md:text-sm">
              (150 Reviews) | <span className="text-green-500 font-medium">In Stock</span>
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <p className="text-2xl font-bold text-[#DB4444]">${finalPrice}</p>
            {hasDiscount && (
              <p className="text-xl text-gray-400 line-through">${product.price}</p>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-6 md:mb-8 leading-relaxed border-b pb-6 md:pb-8">
            {product.description}
          </p>

          {/* Qty and Actions Wrapper */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 md:mb-10">
            {/* Quantity Selector */}
            <div className="flex border border-gray-400 rounded-sm overflow-hidden h-12">
              <button 
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)} 
                className="flex-1 px-4 hover:bg-[#DB4444] hover:text-white transition-all border-r border-gray-400"
              >-</button>
              <span className="flex items-center justify-center px-6 font-bold min-w-[60px]">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)} 
                className="flex-1 px-4 hover:bg-[#DB4444] hover:text-white transition-all border-l border-gray-400"
              >+</button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-1 gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#DB4444] text-white py-3 rounded-sm font-medium hover:bg-black transition-all active:scale-95"
              >
                Buy Now
              </button>
              
              <button 
                onClick={handleAddToWishlist}
                className="border border-gray-400 p-3 rounded-sm hover:bg-[#DB4444] hover:border-[#DB4444] hover:text-white transition-all group"
              >
                <FiHeart size={20} className="group-active:scale-125 transition-transform" />
              </button>
            </div>
          </div>

          {/* Delivery Box - Full width on mobile */}
          <div className="border border-gray-400 rounded-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-gray-400 hover:bg-gray-50 transition-colors">
              <FiTruck size={28} className="text-black shrink-0" />
              <div>
                <p className="font-bold text-sm">Free Delivery</p>
                <p className="underline text-[10px] text-gray-500 cursor-pointer">Check availability in your area</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <FiRotateCcw size={28} className="text-black shrink-0" />
              <div>
                <p className="font-bold text-sm">Return Delivery</p>
                <p className="text-[10px] text-gray-500">Free 30 Days Returns. <span className="underline cursor-pointer">Details</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;