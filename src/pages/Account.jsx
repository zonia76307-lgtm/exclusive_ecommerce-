import React, { useState } from 'react';

const Account = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  return (
    <div className="max-w-[1170px] mx-auto py-10 md:py-[80px] px-4 font-['Inter']">
      
      {/* --- Breadcrumbs & Welcome Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 md:mb-[80px]">
        <div className="text-[12px] md:text-[14px] text-gray-500">
          Home / <span className="text-black">My Account</span>
        </div>
        <div className="text-[14px]">
          Welcome! <span className="text-[#DB4444] font-medium">{user?.name}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 md:gap-[80px]">
        
        {/* --- Left Sidebar: Mobile par horizontal scroll ya simple stack --- */}
        <div className="w-full md:w-[280px]">
          <div className="mb-6">
            <h3 className="font-bold mb-4 text-[16px]">Manage My Account</h3>
            <ul className="pl-4 md:pl-8 space-y-2 mb-6">
              <li className="text-[#DB4444] cursor-pointer font-medium">My Profile</li>
              <li className="text-gray-500 hover:text-[#DB4444] cursor-pointer transition-colors">Address Book</li>
              <li className="text-gray-500 hover:text-[#DB4444] cursor-pointer transition-colors">My Payment Options</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-4 text-[16px]">My Orders</h3>
            <ul className="pl-4 md:pl-8 space-y-2">
              <li className="text-gray-500 hover:text-[#DB4444] cursor-pointer transition-colors" onClick={() => window.location.href='/orders'}>My Returns</li>
              <li className="text-gray-500 hover:text-[#DB4444] cursor-pointer transition-colors" onClick={() => window.location.href='/orders'}>My Cancellations</li>
            </ul>
          </div>
        </div>

        {/* --- Right Form Section --- */}
        <div className="flex-grow shadow-none md:shadow-lg p-0 md:p-10 lg:p-20 rounded-sm md:border border-gray-50">
          <h3 className="text-[18px] md:text-[20px] font-medium text-[#DB4444] mb-6 md:mb-8">Edit Your Profile</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#F5F5F5] p-3 md:p-4 outline-none rounded-sm border border-transparent focus:border-gray-200" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  readOnly 
                  className="w-full bg-[#F5F5F5] p-3 md:p-4 outline-none rounded-sm opacity-70 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="block text-sm font-medium">Password Changes</label>
              <input 
                type="password" 
                placeholder="Current Password" 
                className="w-full bg-[#F5F5F5] p-3 md:p-4 outline-none rounded-sm border border-transparent focus:border-gray-200" 
              />
              <input 
                type="password" 
                placeholder="New Password" 
                className="w-full bg-[#F5F5F5] p-3 md:p-4 outline-none rounded-sm border border-transparent focus:border-gray-200" 
              />
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                className="w-full bg-[#F5F5F5] p-3 md:p-4 outline-none rounded-sm border border-transparent focus:border-gray-200" 
              />
            </div>

            {/* Buttons: Mobile par flex-col, desktop par row */}
            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-4 sm:gap-8 pt-6">
              <button type="button" className="text-black hover:underline py-2">Cancel</button>
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-[#DB4444] text-white px-12 py-4 rounded-sm font-medium hover:bg-[#E06767] transition-all active:scale-95 shadow-lg shadow-red-100"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;