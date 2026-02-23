import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Use BASE_URL from .env
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrders = async () => {
      const savedInfo = localStorage.getItem('userInfo');
      const userInfo = savedInfo ? JSON.parse(savedInfo) : null;

      if (!userInfo || !userInfo.token) {
        setLoading(false);
        return;
      }

      try {
        const config = { 
          headers: { Authorization: `Bearer ${userInfo.token}` } 
        };
        
        const { data } = await axios.get(`${BASE_URL}/api/orders/myorders`, config);
        setOrders(data);
      } catch (err) { 
        console.error("Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [BASE_URL]); // Add BASE_URL to dependency array

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#DB4444] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 animate-pulse font-medium">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto py-10 md:py-[80px] px-4 font-['Inter'] min-h-screen">
      
      {/* Breadcrumb */}
      <div className="text-[12px] md:text-[14px] text-gray-500 mb-6 md:mb-[40px]">
        <Link to="/" className="hover:text-[#DB4444] transition-colors">Home</Link> 
        <span className="mx-2">/</span> 
        <span className="text-black">My Orders</span>
      </div>

      <h2 className="text-[20px] md:text-[24px] font-bold mb-8 border-l-4 border-[#DB4444] pl-4 uppercase tracking-tight">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 md:py-20 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-6 italic">No orders found in your history.</p>
          <Link to="/" className="bg-[#DB4444] text-white px-8 py-3 rounded-[4px] font-medium inline-block hover:bg-black transition-all">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-hidden shadow-sm rounded-lg border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="p-4 font-semibold text-sm">ORDER ID</th>
                  <th className="p-4 font-semibold text-sm">DATE</th>
                  <th className="p-4 font-semibold text-sm">STATUS</th>
                  <th className="p-4 font-semibold text-right text-sm">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono text-[12px] text-gray-600">
                      #{order._id.toUpperCase()}
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4">
                       <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 font-bold text-right text-black">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-5 bg-white shadow-sm border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-mono text-xs font-bold text-gray-700">#{order._id.toUpperCase()}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Date</p>
                    <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-[#DB4444]">${order.totalPrice?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Sub-component for Status Badge
const StatusBadge = ({ status }) => {
  const isDelivered = status === 'Delivered';
  const isCancelled = status === 'Cancelled';
  
  return (
    <span className={`px-3 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
      isDelivered ? 'bg-green-100 text-green-700' : 
      isCancelled ? 'bg-gray-100 text-gray-500' :
      'bg-[#DB4444]/10 text-[#DB4444]'
    }`}>
      {status || 'Processing'}
    </span>
  );
};

export default Orders;