import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearCart, clearCartServer, fetchCartFromDB } from '../redux/slices/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart); 

  const [formData, setFormData] = useState({ 
    streetAddress: '', city: '', phoneNumber: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(fetchCartFromDB());
    }
  }, [dispatch, userInfo]);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.qty || 1), 0);
  };

  const handlePlaceOrder = async (e) => {
    if(e) e.preventDefault();
    if (!formData.streetAddress || !formData.city || !formData.phoneNumber) {
      return toast.warn("Please fill all required billing fields");
    }
    if (cartItems.length === 0) return toast.error("Your cart is empty!");

    setLoading(true);
    try {
      const config = { 
        headers: { 
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        } 
      };

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: Number(item.qty),
          image: item.image,
          price: Number(item.price),
          product: item._id 
        })),
        shippingAddress: { address: formData.streetAddress, city: formData.city },
        totalPrice: Number(calculateTotal()),
        phoneNumber: formData.phoneNumber
      };

      await axios.post('http://localhost:5000/api/orders', orderData, config);
      await dispatch(clearCartServer()).unwrap();
      dispatch(clearCart());
      toast.success("Order Placed Successfully! 🛒");
      navigate('/orders'); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="py-40 text-center">
      <div className="inline-block w-10 h-10 border-4 border-[#DB4444] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-[#DB4444] tracking-widest uppercase">Processing Order...</p>
    </div>
  );

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20 font-['Inter']">
      <h2 className="text-2xl md:text-3xl font-medium mb-8 md:mb-12">Billing Details</h2>
      
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
        {/* --- Left: Billing Form --- */}
        <form className="w-full lg:flex-1 space-y-6" onSubmit={handlePlaceOrder}>
          <div className="space-y-2">
            <label className="block text-gray-400 text-sm">Street Address*</label>
            <input 
              type="text" 
              className="w-full bg-[#F5F5F5] p-3 rounded-sm outline-none border border-transparent focus:border-[#DB4444] focus:bg-white transition-all" 
              placeholder="House number and street name"
              required
              onChange={(e) => setFormData({...formData, streetAddress: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="block text-gray-400 text-sm">Town/City*</label>
                <input 
                  type="text" 
                  className="w-full bg-[#F5F5F5] p-3 rounded-sm outline-none border border-transparent focus:border-[#DB4444] focus:bg-white transition-all" 
                  required
                  onChange={(e) => setFormData({...formData, city: e.target.value})} 
                />
             </div>
             <div className="space-y-2">
                <label className="block text-gray-400 text-sm">Phone Number*</label>
                <input 
                  type="tel" 
                  className="w-full bg-[#F5F5F5] p-3 rounded-sm outline-none border border-transparent focus:border-[#DB4444] focus:bg-white transition-all" 
                  required
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                />
             </div>
          </div>
        </form>

        {/* --- Right: Order Summary --- */}
        <div className="w-full lg:w-[450px]">
          <div className="bg-white border md:border-none p-4 md:p-0 rounded-sm">
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-8">
              {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-14 h-14 object-contain bg-[#F5F5F5] p-1 rounded-sm" />
                        <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                          {item.qty}
                        </span>
                      </div>
                      <span className="text-xs md:text-sm font-medium line-clamp-1 w-32 md:w-40">{item.name}</span>
                    </div>
                    <span className="font-semibold text-sm md:text-base whitespace-nowrap">
                      ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="space-y-4 border-t pt-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-4">
                <span>Total:</span>
                <span className="text-[#DB4444]">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button 
                type="button" 
                disabled={loading}
                onClick={handlePlaceOrder} 
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#DB4444]'} text-white py-4 mt-8 rounded-sm font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;