import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { FiMoreVertical, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  useEffect(() => { 
    fetchOrders(); 
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const updateStatus = async (e, id, newStatus) => {
    e.stopPropagation();
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus }, config);
      fetchOrders();
      setActiveMenu(null);
    } catch (err) { alert("Fail!"); }
  };

  const getStatusColor = (status) => {
    const colors = { 
      'Pending': 'bg-yellow-100 text-yellow-700', 
      'Shipped': 'bg-blue-100 text-blue-700', 
      'Delivered': 'bg-green-100 text-green-700', 
      'Cancelled': 'bg-red-100 text-red-700' 
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AdminLayout title="Orders" subtitle="Manage fulfillments">
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200 mx-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-gray-50 text-[11px] uppercase font-black text-gray-500">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center animate-pulse">Loading...</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-xs text-gray-400">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{order.user?.name || 'Guest'}</div>
                    <div className="text-[10px] text-gray-400">{order.user?.email}</div>
                  </td>
                  <td className="p-4 font-black text-black">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right relative">
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === order._id ? null : order._id); }} className="p-2 hover:bg-gray-100 rounded-full"><FiMoreVertical /></button>
                    {activeMenu === order._id && (
                      <div className="absolute right-12 top-0 bg-white shadow-2xl border rounded z-[100] w-40 py-1 text-left">
                        {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                          <button key={s} onClick={(e) => updateStatus(e, order._id, s)} className="w-full px-4 py-2 hover:bg-gray-50 text-[11px] font-bold uppercase">{s}</button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;