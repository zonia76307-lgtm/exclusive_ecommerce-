import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// Zaroori: Apne userSlice se setCredentials import karein (agar naam alag hai toh woh use karein)
import { logout, setCredentials } from '../redux/slices/userSlice'; 
import { 
  FiPieChart, FiShoppingBag, FiUser, 
  FiPackage, FiDollarSign, FiClock, FiCheckCircle,
  FiSearch, FiBell, FiLogOut, FiSettings, FiArrowLeft,
  FiMenu, FiX 
} from 'react-icons/fi';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); 
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, pendingOrders: 0, orders: [] });
  const [profile, setProfile] = useState({ name: userInfo?.name || '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔥 UPDATED: Using .env variable
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${BASE_URL}/api/orders/my-stats`, config);
        setStats(data);
      } catch (err) {
        toast.error("Failed to load dashboard data!");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) fetchDashboardData();
  }, [userInfo, BASE_URL]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success("Logged out successfully");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (profile.password && profile.password !== profile.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    
    try {
      const config = { 
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` 
        } 
      };

      // 🔥 API Call to updated backend route
      const { data } = await axios.put(`${BASE_URL}/api/users/profile`, {
        name: profile.name,
        password: profile.password
      }, config);

      // 🔥 Sync Redux & LocalStorage (UI will update instantly)
      dispatch(setCredentials({ ...data }));
      
      toast.success("Profile updated successfully!");
      setProfile({ ...profile, password: '', confirmPassword: '' });
    } catch (err) {
      const errMsg = err.response?.data?.message || "Update failed!";
      toast.error(errMsg);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F4F7FE]">
      <div className="w-12 h-12 border-4 border-[#DB4444] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-semibold">Preparing your workspace...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-['Inter'] overflow-hidden relative">
      
      {/* ---------------- MOBILE OVERLAY ---------------- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-[#DB4444] tracking-tighter uppercase flex items-center gap-2 hover:opacity-80 transition-all">
            Exclusive
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 p-1">
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/" className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold text-gray-400 hover:bg-gray-50 hover:text-[#DB4444] transition-all mb-4 border-b border-gray-50 pb-6">
            <FiArrowLeft size={18} /> Back to Store
          </Link>

          <button onClick={() => {setActiveTab('overview'); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all ${activeTab === 'overview' ? 'bg-[#DB4444] text-white shadow-xl shadow-red-200' : 'text-gray-400 hover:bg-gray-50'}`}>
            <FiPieChart size={20} /> Overview
          </button>
          
          <button onClick={() => {setActiveTab('orders'); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all ${activeTab === 'orders' ? 'bg-[#DB4444] text-white shadow-xl shadow-red-200' : 'text-gray-400 hover:bg-gray-50'}`}>
            <FiShoppingBag size={20} /> My Orders
          </button>
          
          <button onClick={() => {setActiveTab('settings'); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all ${activeTab === 'settings' ? 'bg-[#DB4444] text-white shadow-xl shadow-red-200' : 'text-gray-400 hover:bg-gray-50'}`}>
            <FiSettings size={20} /> Settings
          </button>
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN SECTION ---------------- */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        
        {/* CUSTOM NAVBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiMenu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-xl w-64 lg:w-96 border border-gray-200/50">
              <FiSearch className="text-gray-400" />
              <input type="text" placeholder="Search your history..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2 text-gray-400 hover:text-[#DB4444] transition-colors">
              <FiBell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-none">{userInfo.name}</p>
                <p className="text-[9px] text-green-500 font-black uppercase mt-1 tracking-wider">Verified Account</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-[#DB4444] to-red-400 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-red-100">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#F4F7FE]">
          {/* Tabs render logic remains same as before... */}
          {activeTab === 'overview' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl font-black text-gray-800 mb-2">Welcome, {userInfo.name.split(' ')[0]}!</h1>
                <p className="text-gray-400 text-sm mb-8">Quick overview of your shopping activity.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-white group hover:border-[#DB4444] transition-all">
                      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#DB4444] mb-6 group-hover:scale-110 transition-transform">
                        <FiPackage size={24} />
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Orders</p>
                      <h2 className="text-3xl font-black mt-1">{stats.totalOrders}</h2>
                   </div>

                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-white group hover:border-green-500 transition-all">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                        <FiDollarSign size={24} />
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Spent</p>
                      <h2 className="text-3xl font-black mt-1">${stats.totalSpent.toFixed(2)}</h2>
                   </div>

                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-white group hover:border-orange-500 transition-all">
                      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                        <FiClock size={24} />
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Active Orders</p>
                      <h2 className="text-3xl font-black mt-1">{stats.pendingOrders}</h2>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-in fade-in duration-500 bg-white rounded-3xl shadow-sm border border-white overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-800">Order History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Order Reference</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Amount</th>
                      <th className="px-8 py-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.orders.length > 0 ? stats.orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6 text-sm font-bold text-gray-700">ORD-{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-8 py-6 text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-gray-800">${order.totalPrice.toFixed(2)}</td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="p-20 text-center text-gray-300 font-medium italic">No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in slide-in-from-right-4 duration-500 max-w-2xl bg-white p-6 lg:p-10 rounded-3xl shadow-sm border border-white">
              <h2 className="text-2xl font-black text-gray-800 mb-2">Account Settings</h2>
              <p className="text-sm text-gray-400 mb-10">Update your profile and security details.</p>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#DB4444] transition-all font-medium" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Leave blank to keep current"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#DB4444] transition-all" 
                      value={profile.password}
                      onChange={(e) => setProfile({...profile, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Confirm Password</label>
                    <input 
                      type="password" 
                      placeholder="Repeat new password"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#DB4444] transition-all" 
                      value={profile.confirmPassword}
                      onChange={(e) => setProfile({...profile, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="pt-8">
                  <button type="submit" className="bg-[#DB4444] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black hover:shadow-2xl transition-all duration-300">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;