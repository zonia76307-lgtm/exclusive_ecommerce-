import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar'; 
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiBox, 
  FiSearch, FiHome, FiUser, FiMenu, FiX,
  FiBell 
} from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0, ordersCount: 0, customersCount: 0, productsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/orders`, config),
          axios.get(`${BASE_URL}/api/users`, config),
          axios.get(`${BASE_URL}/api/products`, config)
        ]);

        const sales = ordersRes.data.reduce((acc, order) => acc + order.totalPrice, 0);
        const customers = usersRes.data.filter(user => user.role !== 'admin').length;

        setStats({
          totalSales: sales,
          ordersCount: ordersRes.data.length,
          customersCount: customers,
          productsCount: productsRes.data.length
        });
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [1200, 1900, 3000, 2500, 4200, stats.totalSales],
        borderColor: '#DB4444',
        backgroundColor: 'rgba(219, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const statCards = [
    { title: 'Total Sales', value: `$${stats.totalSales.toLocaleString()}`, icon: <FiDollarSign />, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.ordersCount, icon: <FiShoppingBag />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Customers', value: stats.customersCount, icon: <FiUsers />, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Active Products', value: stats.productsCount, icon: <FiBox />, color: 'text-[#DB4444]', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex overflow-hidden">
      
      {/* SIDEBAR - Mobile Drawer Logic */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[260px] bg-white shadow-2xl transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        
        {/* RESPONSIVE NAVBAR */}
        <nav className="h-[64px] md:h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiMenu size={22} />
            </button>
            <h1 className="lg:hidden font-black text-[#DB4444] text-lg tracking-tighter italic">EX.ADMIN</h1>
            
            {/* Search - Hidden on Small Mobile */}
            <div className="relative hidden sm:block w-48 md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiSearch size={14} />
              </span>
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-9 pr-4 focus:outline-none focus:border-[#DB4444] text-xs transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/" className="p-2 text-gray-500 hover:text-[#DB4444] rounded-full hover:bg-red-50 transition-all">
              <FiHome size={20} />
            </Link>
            
            <div className="flex items-center gap-3 border-l pl-4 ml-2">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-gray-900 leading-none">{userInfo?.name || 'Admin'}</p>
                <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-widest">Online</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#DB4444] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {userInfo?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-8 w-full max-w-[1400px] mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Overview</h2>
              <p className="text-gray-500 text-[11px] md:text-xs font-semibold tracking-wide">SYSTEM ANALYTICS FOR {new Date().getFullYear()}</p>
            </div>
            <div className="flex gap-2">
               <button className="bg-white border border-gray-200 px-3 py-1.5 text-[11px] font-bold rounded shadow-sm hover:bg-gray-50">EXPORT PDF</button>
               <button className="bg-black text-white px-3 py-1.5 text-[11px] font-bold rounded shadow-sm hover:opacity-80">REFRESH</button>
            </div>
          </div>

          {/* STATS CARDS - 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">{card.title}</p>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 truncate">{loading ? '...' : card.value}</h3>
                </div>
                <div className={`shrink-0 w-12 h-12 ${card.bg} ${card.color} rounded-lg flex items-center justify-center text-xl shadow-inner`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS & PROGRESS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-xs uppercase text-gray-900 tracking-widest">Revenue Growth</h4>
                  <select className="text-[10px] font-bold border rounded p-1 outline-none">
                    <option>Last 6 Months</option>
                  </select>
               </div>
               <div className="h-[250px] md:h-[350px] w-full">
                  <Line 
                    data={lineChartData} 
                    options={{ 
                      maintainAspectRatio: false, 
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: { 
                        y: { beginAtZero: true, grid: { color: '#f0f0f0' }, border: { display: false } },
                        x: { grid: { display: false }, border: { display: false } }
                      }
                    }} 
                  />
               </div>
            </div>

            {/* Health Status */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h4 className="font-bold text-xs uppercase text-gray-900 mb-8 tracking-widest">Operations Health</h4>
              
              <div className="space-y-10">
                <div className="relative">
                  <div className="flex justify-between text-[11px] font-black mb-3 italic">
                    <span className="text-gray-400">INVENTORY STATUS</span>
                    <span className="text-green-600">OPTIMAL</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[85%] rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between text-[11px] font-black mb-3 italic">
                    <span className="text-gray-400">ORDER LOGISTICS</span>
                    <span className="text-[#DB4444]">94% EFFICIENCY</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#DB4444] h-full w-[94%] rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="mt-auto pt-10 text-center">
                  <div className="inline-block p-4 bg-red-50 rounded-full mb-4">
                    <FiBell className="text-[#DB4444] animate-bounce" size={24} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">System Alerts</p>
                  <p className="text-xs font-medium text-gray-600">Everything looks great today.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;