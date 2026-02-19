import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell, FiHome, FiUser, FiMenu } from 'react-icons/fi';

const AdminNavbar = ({ setSidebarOpen }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-[240px] h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-40 transition-all">
      
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
          <FiMenu size={24} />
        </button>

        {/* Search - Hidden on small mobile */}
        <div className="relative w-40 md:w-96 hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2 pl-10 pr-4 focus:outline-none focus:border-[#DB4444] text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-[#DB4444] font-medium text-sm" title="View Site">
          <FiHome size={20} /> <span>View Site</span>
        </Link>

        <button className="relative text-gray-500 hover:text-black">
          <FiBell size={22} />
          <span className="absolute -top-1 -right-1 bg-[#DB4444] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
        </button>

        <div className="flex items-center gap-2 md:gap-3 border-l pl-4 md:pl-6">
          <div className="text-right hidden xs:block">
            <p className="text-sm font-bold text-black leading-none">{userInfo?.name || 'Admin'}</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">Super Admin</p>
          </div>
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-gray-600">
            <FiUser size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;