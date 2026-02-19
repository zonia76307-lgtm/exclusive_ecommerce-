import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, syncCartWithDB } from '../redux/slices/cartSlice';
import { addToWishlistServer } from '../redux/slices/wishlistSlice'; 
import { FiHeart, FiEye, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductCard = ({ product, showBadge }) => {
  const dispatch = useDispatch();
  
  // Selectors with fallbacks to prevent crashes
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { wishlistItems = [] } = useSelector((state) => state.wishlist) || {};

  // 1. WISHLIST CHECK
  const isWishlisted = wishlistItems?.some(item => item._id === product._id);

  // 2. DYNAMIC PRICE LOGIC (Calculated once)
  const hasDiscount = product.onSale && product.discountPercentage > 0;
  const rawFinalPrice = hasDiscount 
    ? product.price - (product.price * product.discountPercentage / 100)
    : product.price;
  
  // Final rounded price for UI and Backend
  const finalPrice = Math.round(rawFinalPrice);

  // 3. IMAGE PATH LOGIC
  const imageUrl = product.image?.startsWith('http') 
    ? product.image 
    : `http://localhost:5000${product.image}`;

  // 4. HANDLERS
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!userInfo?.token) {
      return toast.warn("Please login to manage wishlist! 🔑");
    }

    // Sending correct price (discounted) to Redux/DB
    dispatch(addToWishlistServer({ 
      ...product, 
      price: finalPrice 
    }));
    
    // Toggle toast message
    isWishlisted ? toast.info("Removed! 🤍") : toast.success("Added! ❤️");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Redux update with discounted price
    dispatch(addToCart({ ...product, price: finalPrice }));
    
    // Database Sync if logged in
    if (userInfo?.token) {
      const existItem = cartItems.find(x => x._id === product._id);
      const newQty = existItem ? (existItem.qty || 1) + 1 : 1;
      
      dispatch(syncCartWithDB({ 
        productId: product._id, 
        quantity: newQty, 
        actionType: existItem ? 'update' : 'add' 
      }));
    }
    toast.success(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="w-full font-['Inter'] group bg-white relative">
      {/* Product Image & Overlays */}
      <div className="relative w-full h-[270px] bg-[#F5F5F5] rounded-sm flex items-center justify-center overflow-hidden">
        
        {/* SALE BADGE */}
        {showBadge && hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-[12px] px-3 py-1 rounded-sm z-20 font-medium">
            -{product.discountPercentage}%
          </div>
        )}

        {/* TOP RIGHT ACTIONS */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleAddToWishlist} 
            className={`p-2 rounded-full shadow-md transition-colors ${
              isWishlisted ? 'bg-[#DB4444] text-white' : 'bg-white text-black hover:bg-[#DB4444] hover:text-white'
            }`}
            title="Add to Wishlist"
          >
            <FiHeart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          
          <Link 
            to={`/product/${product._id}`}
            className="bg-white p-2 rounded-full shadow-md hover:bg-[#DB4444] hover:text-white transition-colors flex items-center justify-center"
            title="Quick View"
          >
            <FiEye size={18} />
          </Link>
        </div>

        {/* IMAGE */}
        <Link to={`/product/${product._id}`} className="block p-8 transition-transform duration-500 group-hover:scale-105">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="max-h-[180px] w-auto object-contain"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Product'; }}
          />
        </Link>

        {/* BOTTOM CART BUTTON */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 w-full bg-black text-white py-3 flex items-center justify-center gap-2 
                     translate-y-full group-hover:translate-y-0 transition-transform duration-300 
                     font-medium text-[13px] z-10 active:bg-gray-800"
        >
          <FiShoppingCart size={18} /> Add To Cart
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="pt-4 space-y-1">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-[16px] text-black hover:text-[#DB4444] transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Current Price */}
          <span className="text-[#DB4444] font-bold text-[16px]">
            ${finalPrice}
          </span>
          
          {/* Old Price */}
          {hasDiscount && (
            <span className="text-gray-400 line-through font-medium text-[15px]">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;