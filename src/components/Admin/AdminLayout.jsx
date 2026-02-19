import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { FiSearch, FiHome, FiUser } from 'react-icons/fi';

const AdminLayout = ({ children, title, subtitle }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen overflow-x-hidden">
      {/* Sidebar - Fixed width assumed 240px inside Sidebar component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        
        {/* Navbar */}
        <nav className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 w-full">
          <div className="relative w-48 md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiSearch size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Search data..." 
              className="w-full bg-gray-50 border rounded-sm py-1.5 pl-10 pr-4 focus:border-[#DB4444] text-sm outline-none" 
            />
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-[#DB4444] transition-all font-medium text-sm hidden sm:flex">
              <FiHome size={18} /> <span>Go to Site</span>
            </Link>
            
            <div className="flex items-center gap-3 border-l pl-4 md:pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-black leading-none">{userInfo?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Manager</p>
              </div>
              <div className="w-9 h-9 bg-[#fce9e9] text-[#DB4444] rounded-full flex items-center justify-center border border-red-100 shrink-0">
                <FiUser size={18} />
              </div>
            </div>
          </div>
        </nav>

        {/* Content Section */}
        <main className="p-4 md:p-8 font-['Inter'] flex-1">
          {/* Page Header */}
          {(title || subtitle) && (
            <div className="mb-8">
              {title && <h2 className="text-2xl font-black uppercase tracking-tight text-black italic">{title}</h2>}
              {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
            </div>
          )}
          
          {/* Yahan aapka page ka content render hoga */}
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;