import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      // 1. Local storage se info direct yahan li taake loop na bane
      const savedInfo = localStorage.getItem('userInfo');
      const userInfo = savedInfo ? JSON.parse(savedInfo) : null;

      if (!userInfo || !userInfo.token) {
        console.log("No user info or token found");
        setLoading(false);
        return;
      }

      try {
        console.log("Hitting API now..."); // Check karein console mein
        const config = { 
          headers: { Authorization: `Bearer ${userInfo.token}` } 
        };
        
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
      } catch (err) { 
        console.error("Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Dependency array empty [] rakhi hai taake sirf component load hone par chale
  }, []); 

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#DB4444] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 animate-pulse">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto py-[80px] px-4 font-['Inter'] min-h-screen">
      {/* Breadcrumb */}
      <div className="text-[14px] text-gray-500 mb-[40px]">
        <Link to="/" className="hover:text-[#DB4444] transition-colors">Home</Link> / <span className="text-black">My Orders</span>
      </div>

      <h2 className="text-[24px] font-bold mb-8 border-l-4 border-[#DB4444] pl-4 uppercase tracking-tight">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-6 italic">No orders found in your history.</p>
          <Link to="/" className="bg-[#DB4444] text-white px-10 py-4 rounded-[4px] font-medium inline-block hover:bg-black transition-all">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="w-full overflow-x-auto shadow-sm rounded-lg border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="p-4 font-semibold border-b text-sm">ORDER ID</th>
                <th className="p-4 font-semibold border-b text-sm">DATE</th>
                <th className="p-4 font-semibold border-b text-sm">STATUS</th>
                <th className="p-4 font-semibold border-b text-right text-sm">TOTAL</th>
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
                    <span className={`px-3 py-1 rounded-[4px] text-[11px] font-bold uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Cancelled' ? 'bg-gray-100 text-gray-500' :
                      'bg-[#DB4444]/10 text-[#DB4444]'
                    }`}>
                      {order.status || 'Processing'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-right text-black">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;