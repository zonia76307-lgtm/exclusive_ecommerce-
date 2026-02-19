import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartQty, syncCartWithDB, fetchCartFromDB } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  
  // 🔥 Ref for Debouncing
  const timeoutRef = useRef(null);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(fetchCartFromDB());
    }
  }, [dispatch, userInfo]);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/100";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  const updateQty = (item, newQty) => {
    if (newQty < 1) return;

    // 1. Pehle Redux/Frontend update karein (Foran response ke liye)
    dispatch(updateCartQty({ _id: item._id, qty: newQty }));

    // 2. Backend Sync with Debounce (500ms wait)
    if (userInfo?.token) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        dispatch(syncCartWithDB({ 
          productId: item._id, 
          quantity: newQty, 
          actionType: 'update' 
        }));
      }, 500);
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    if (userInfo?.token) {
      dispatch(syncCartWithDB({ productId: id, actionType: 'remove' }));
    }
    toast.info("Removed from cart");
  };

  const calculateTotal = () => cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);

  return (
    <div className="max-w-[1170px] mx-auto py-20 px-4 font-['Inter']">
      <div className="text-gray-400 mb-10">
        <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black">Cart</span>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl mb-10 italic text-gray-400">Your cart is empty.</p>
          <Link to="/" className="bg-[#DB4444] text-white px-12 py-4 rounded-sm inline-block hover:bg-black transition-all font-medium">
            Return To Shop
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-4 shadow-sm p-6 mb-10 font-medium bg-white border border-gray-100">
            <span>Product</span>
            <span>Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Subtotal</span>
          </div>

          {cartItems.map((item) => (
            <div key={item._id} className="grid grid-cols-2 md:grid-cols-4 items-center shadow-sm p-6 mb-5 bg-white border border-gray-100 relative group rounded-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-12 h-12 object-contain bg-[#F5F5F5] p-1" />
                  <button onClick={() => handleRemove(item._id)} className="absolute -top-2 -left-2 bg-[#DB4444] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiTrash2 size={12}/>
                  </button>
                </div>
                <span className="font-medium truncate w-32 md:w-40">{item.name}</span>
              </div>
              
              <span className="hidden md:block">${item.price}</span>
              
              <div className="flex justify-center">
                <div className="flex items-center border border-gray-300 rounded px-3 py-2 gap-4">
                  <span className="font-bold min-w-[20px] text-center">{item.qty || 1}</span>
                  <div className="flex flex-col border-l pl-2 border-gray-200">
                    <button onClick={() => updateQty(item, (item.qty || 1) + 1)} className="hover:text-[#DB4444]"><FiChevronUp size={16}/></button>
                    <button onClick={() => updateQty(item, (item.qty || 1) - 1)} className="hover:text-[#DB4444]"><FiChevronDown size={16}/></button>
                  </div>
                </div>
              </div>
              
              <span className="text-right font-bold">${((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex flex-col lg:flex-row justify-between items-start mt-10 gap-10">
            <Link to="/" className="border border-black/30 px-12 py-4 rounded-sm font-medium hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] transition-all">
              Return To Shop
            </Link>

            <div className="w-full lg:w-[470px] border-2 border-black p-8 rounded-sm">
              <h3 className="text-xl font-medium mb-6">Cart Total</h3>
              <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between mb-8 text-xl font-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full bg-[#DB4444] text-white py-4 rounded-sm font-medium hover:bg-black transition-all">
                Process to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;