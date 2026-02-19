import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiPieChart, FiShoppingCart, FiBox, 
  FiUsers, FiLayers, FiTag, FiLogOut 
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FiPieChart />, path: '/admin/dashboard' },
    { name: 'Product', icon: <FiBox />, path: '/admin/products' },
    { name: 'User', icon: <FiUsers />, path: '/admin/users' },
    { name: 'Order', icon: <FiShoppingCart />, path: '/admin/orders' },
    { name: 'Category', icon: <FiLayers />, path: '/admin/categories' },
    { name: 'Sale/Offer', icon: <FiTag />, path: '/admin/sales' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-[240px] bg-white border-r border-gray-200 p-6 flex flex-col font-['Inter'] z-50 shadow-sm">
      <div className="mb-10 flex items-center gap-2 px-2">
        <div className="w-8 h-8 rounded-sm bg-[#DB4444] flex items-center justify-center">
          <div className="w-1 h-3 bg-white rounded-full"></div>
        </div>
        <span className="font-bold text-xl tracking-tight text-black">Exclusive</span>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 p-3.5 mb-2 rounded-sm transition-all duration-200 ${
                isActive 
                ? 'bg-[#DB4444] text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#DB4444]'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[15px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-gray-100">
        <button 
          onClick={() => {
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
          }}
          className="flex items-center gap-4 w-full p-3.5 text-gray-500 hover:text-[#DB4444] transition-all group"
        >
          <FiLogOut className="text-xl group-hover:translate-x-1 transition-transform" />
          <span className="text-[15px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;