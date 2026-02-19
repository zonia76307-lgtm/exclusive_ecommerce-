import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar'; 
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiBox, 
  FiSearch, FiBell, FiHome, FiUser, FiMenu, FiX 
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders', config),
          axios.get('http://localhost:5000/api/users', config),
          axios.get('http://localhost:5000/api/products', config)
        ]);

        const sales = ordersRes.data.reduce((acc, order) => acc + order.totalPrice, 0);
        const customers = usersRes.data.filter(user => user.role !== 'admin').length;

        setStats({
          totalSales: sales,
          ordersCount: ordersRes.data.length,
          customersCount: customers,
          productsCount: productsRes.data.length
        });
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales ($)',
        data: [1200, 1900, 3000, 2500, 4200, stats.totalSales],
        borderColor: '#DB4444',
        backgroundColor: 'rgba(219, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const statCards = [
    { title: 'Total Sales', value: `$${stats.totalSales.toFixed(2)}`, icon: <FiDollarSign />, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.ordersCount, icon: <FiShoppingBag />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Customers', value: stats.customersCount, icon: <FiUsers />, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Active Products', value: stats.productsCount, icon: <FiBox />, color: 'text-[#DB4444]', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex overflow-hidden">
      
      {/* SIDEBAR WRAPPER */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[240px] bg-white transition-transform duration-300 transform
        lg:relative lg:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
        {/* Close button for mobile inside sidebar */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-500"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        
        {/* NAVBAR */}
        <nav className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            >
              <FiMenu size={24} />
            </button>
            <div className="relative hidden sm:block w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiSearch size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1.5 pl-10 pr-4 focus:outline-none focus:border-[#DB4444] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-[#DB4444] text-sm font-medium">
              <FiHome size={18} />
              <span className="hidden xs:block">Home</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-4 ml-2 border-l pl-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-black leading-none">{userInfo?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Admin Panel</p>
              </div>
              <div className="w-9 h-9 bg-red-50 text-[#DB4444] rounded-full flex items-center justify-center border border-red-100">
                <FiUser size={18} />
              </div>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-8 w-full max-w-[1600px] mx-auto overflow-x-hidden">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-black text-black uppercase italic tracking-tighter">Dashboard Overview</h2>
            <p className="text-gray-500 text-xs font-medium">Live system monitoring and analytics.</p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#DB4444] transition-all">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 truncate">{card.title}</p>
                  <h3 className="text-lg md:text-xl font-black text-black truncate">{loading ? '...' : card.value}</h3>
                </div>
                <div className={`shrink-0 w-11 h-11 ${card.bg} ${card.color} rounded-full flex items-center justify-center text-xl`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-sm border border-gray-100 shadow-sm">
               <h4 className="font-black text-xs uppercase text-gray-400 mb-6 tracking-widest">Sales Performance</h4>
               <div className="h-[250px] md:h-[320px] w-full">
                  <Line 
                    data={lineChartData} 
                    options={{ 
                      maintainAspectRatio: false, 
                      responsive: true,
                      plugins: { legend: { display: false } }
                    }} 
                  />
               </div>
            </div>

            <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
              <h4 className="font-black text-xs uppercase text-gray-400 mb-8 tracking-widest italic">System Status</h4>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span className="text-gray-400">INVENTORY LEVEL</span>
                    <span className="text-green-600">85% HEALTHY</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full">
                    <div className="bg-green-500 h-full w-[85%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span className="text-gray-400">ORDER FULFILLMENT</span>
                    <span className="text-black">94% COMPLETE</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full">
                    <div className="bg-[#DB4444] h-full w-[94%] transition-all duration-1000"></div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-dashed mt-auto">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium uppercase italic">
                      * real-time data sync is active for Feb 2026.
                    </p>
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