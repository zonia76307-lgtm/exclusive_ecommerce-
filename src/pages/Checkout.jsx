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

  // Sync with DB to get latest Sale Prices
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

    if (cartItems.length === 0) {
      return toast.error("Your cart is empty!");
    }

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
          price: Number(item.price), // backend se discounted price hi aa rahi hogi ab
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
      toast.error(err.response?.data?.message || "Order fail ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-40 text-center font-bold text-[#DB4444]">Processing Order...</div>;

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-20 font-['Inter']">
      <h2 className="text-3xl font-medium mb-12">Billing Details</h2>
      <div className="flex flex-col lg:flex-row gap-20">
        <form className="lg:w-1/2 space-y-6" onSubmit={handlePlaceOrder}>
          <div>
            <label className="block text-gray-400 mb-2">Street Address*</label>
            <input type="text" className="w-full bg-[#F5F5F5] p-3 outline-none border border-transparent focus:border-gray-300 transition-all" required
              onChange={(e) => setFormData({...formData, streetAddress: e.target.value})} />
          </div>
          <div className="flex gap-4">
             <div className="w-1/2">
                <label className="block text-gray-400 mb-2">Town/City*</label>
                <input type="text" className="w-full bg-[#F5F5F5] p-3 outline-none border border-transparent focus:border-gray-300" required
                  onChange={(e) => setFormData({...formData, city: e.target.value})} />
             </div>
             <div className="w-1/2">
                <label className="block text-gray-400 mb-2">Phone Number*</label>
                <input type="text" className="w-full bg-[#F5F5F5] p-3 outline-none border border-transparent focus:border-gray-300" required
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
             </div>
          </div>
        </form>

        <div className="lg:w-[450px]">
          <div className="bg-white p-2">
            {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <img src={`http://localhost:5000${item.image}`} alt="" className="w-14 h-14 object-contain bg-[#F5F5F5] p-1 rounded-sm" />
                    <span className="text-sm truncate w-40 font-medium">{item.name}</span>
                  </div>
                  <span className="font-medium">${(Number(item.price) * Number(item.qty)).toFixed(2)}</span>
                </div>
              )
            )}
            <div className="mt-8 space-y-4 border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-[#DB4444]">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <button 
                type="button" 
                disabled={loading}
                onClick={handlePlaceOrder} 
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#DB4444]'} text-white py-4 mt-8 rounded-sm font-medium hover:bg-black transition-all`}
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