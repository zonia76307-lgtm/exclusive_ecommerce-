import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiClock, FiUser, FiCalendar, FiDollarSign } from 'react-icons/fi';

const AdminOrders = ({ orders, fetchOrders }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const updateStatus = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${BASE_URL}/api/orders/${id}/deliver`, {}, config);
      toast.success("Order status updated to Delivered!");
      fetchOrders(); 
    } catch (err) {
      toast.error("Status update fail ho gaya. Backend check karein.");
    }
  };

  return (
    <div className="bg-white border rounded-sm shadow-sm overflow-hidden mt-6 md:mt-10">
      {/* Header Section */}
      <div className="p-4 md:p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight flex items-center gap-2">
          <div className="w-1.5 h-5 md:w-2 md:h-6 bg-[#DB4444]"></div> Recent Orders
        </h2>
        <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
          {orders?.length || 0} Total Orders
        </span>
      </div>

      {/* --- DESKTOP TABLE VIEW (Visible on md screens and up) --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F5] text-[11px] lg:text-[12px] uppercase text-gray-600 font-black">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {!orders || orders.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-medium italic">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{order.user?.name || "Guest User"}</div>
                    <div className="text-[10px] text-gray-400 font-mono">ID: {order._id.slice(-6).toUpperCase()}</div>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-black">${order.totalPrice?.toFixed(2)}</td>
                  <td className="p-4">
                    <StatusBadge isDelivered={order.isDelivered} />
                  </td>
                  <td className="p-4 text-center">
                    {!order.isDelivered && (
                      <button 
                        onClick={() => updateStatus(order._id)}
                        className="bg-black text-white text-[10px] px-4 py-2 rounded-sm hover:bg-[#DB4444] transition-all font-bold tracking-wider active:scale-95"
                      >
                        MARK DELIVERED
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW (Visible on small screens only) --- */}
      <div className="md:hidden divide-y divide-gray-100">
        {!orders || orders.length === 0 ? (
          <div className="p-10 text-center text-gray-400 italic">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <FiUser size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{order.user?.name || "Guest User"}</p>
                    <p className="text-[10px] text-gray-400 font-mono tracking-tighter">#{order._id.toUpperCase()}</p>
                  </div>
                </div>
                <StatusBadge isDelivered={order.isDelivered} />
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiCalendar size={14} className="shrink-0" />
                  <span className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-900 justify-end">
                  <FiDollarSign size={14} className="text-green-600" />
                  <span className="text-sm font-black">{order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>

              {!order.isDelivered && (
                <button 
                  onClick={() => updateStatus(order._id)}
                  className="w-full bg-black text-white text-xs py-3 rounded-sm font-black tracking-widest active:bg-[#DB4444]"
                >
                  MARK AS DELIVERED
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Reusable Status Badge Component
const StatusBadge = ({ isDelivered }) => (
  isDelivered ? (
    <span className="flex items-center gap-1 text-green-600 font-black text-[9px] md:text-[10px] bg-green-50 w-fit px-2 py-1 rounded-full border border-green-100">
      <FiCheckCircle size={12} /> DELIVERED
    </span>
  ) : (
    <span className="flex items-center gap-1 text-[#DB4444] font-black text-[9px] md:text-[10px] bg-red-50 w-fit px-2 py-1 rounded-full border border-red-100">
      <FiClock size={12} /> PENDING
    </span>
  )
);

export default AdminOrders;