import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiClock } from 'react-icons/fi';

const AdminOrders = ({ orders, fetchOrders }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const updateStatus = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      // Status update karne ki API call
      await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config);
      toast.success("Order status updated to Delivered!");
      fetchOrders(); // Dashboard refresh karein
    } catch (err) {
      toast.error("Status update fail ho gaya. Backend check karein.");
    }
  };

  return (
    <div className="bg-white border rounded-sm shadow-sm overflow-hidden mt-10">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
          <div className="w-2 h-6 bg-[#DB4444]"></div> Recent Orders
        </h2>
        <span className="text-xs text-gray-400 font-bold">{orders?.length || 0} Total Orders</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F5] text-[12px] uppercase text-gray-600">
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
              <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-medium">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{order.user?.name || "Guest User"}</td>
                  <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-black">${order.totalPrice?.toFixed(2)}</td>
                  <td className="p-4">
                    {order.isDelivered ? (
                      <span className="flex items-center gap-1 text-green-600 font-bold text-[10px] bg-green-50 w-fit px-2 py-1 rounded">
                        <FiCheckCircle size={12} /> DELIVERED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#DB4444] font-bold text-[10px] bg-red-50 w-fit px-2 py-1 rounded">
                        <FiClock size={12} /> PENDING
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {!order.isDelivered && (
                      <button 
                        onClick={() => updateStatus(order._id)}
                        className="bg-black text-white text-[10px] px-4 py-2 rounded-sm hover:bg-[#DB4444] transition-all font-bold tracking-wider"
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
    </div>
  );
};

export default AdminOrders;