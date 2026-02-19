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
    <div className="max-w-[1170px] mx-auto py-[80px] px-4 font-['Inter']">
      {/* Breadcrumbs */}
      <div className="flex justify-between items-center mb-[80px]">
        <div className="text-[14px] text-gray-500">
          Home / <span className="text-black">My Account</span>
        </div>
        <div className="text-[14px]">
          Welcome! <span className="text-[#DB4444] font-medium">{user?.name}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-[80px]">
        {/* Left Sidebar */}
        <div className="w-full md:w-[280px]">
          <h3 className="font-bold mb-4">Manage My Account</h3>
          <ul className="pl-8 space-y-2 mb-6">
            <li className="text-[#DB4444] cursor-pointer">My Profile</li>
            <li className="text-gray-500 hover:text-[#DB4444] cursor-pointer">Address Book</li>
            <li className="text-gray-500 hover:text-[#DB4444] cursor-pointer">My Payment Options</li>
          </ul>

          <h3 className="font-bold mb-4">My Orders</h3>
          <ul className="pl-8 space-y-2">
            <li className="text-gray-500 hover:text-[#DB4444] cursor-pointer" onClick={() => window.location.href='/orders'}>My Returns</li>
            <li className="text-gray-500 hover:text-[#DB4444] cursor-pointer" onClick={() => window.location.href='/orders'}>My Cancellations</li>
          </ul>
        </div>

        {/* Right Form */}
        <div className="flex-grow shadow-lg p-8 rounded-sm border border-gray-50">
          <h3 className="text-[20px] font-medium text-[#DB4444] mb-8">Edit Your Profile</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm">Full Name</label>
                <input type="text" value={formData.name} className="w-full bg-[#F5F5F5] p-3 outline-none rounded-sm" />
              </div>
              <div>
                <label className="block mb-2 text-sm">Email Address</label>
                <input type="email" value={formData.email} className="w-full bg-[#F5F5F5] p-3 outline-none rounded-sm" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm">Password Changes</label>
              <input type="password" placeholder="Current Password" className="w-full bg-[#F5F5F5] p-3 outline-none rounded-sm" />
              <input type="password" placeholder="New Password" className="w-full bg-[#F5F5F5] p-3 outline-none rounded-sm" />
              <input type="password" placeholder="Confirm New Password" className="w-full bg-[#F5F5F5] p-3 outline-none rounded-sm" />
            </div>

            <div className="flex justify-end items-center gap-8 pt-4">
              <button type="button" className="text-black hover:underline">Cancel</button>
              <button type="submit" className="bg-[#DB4444] text-white px-12 py-4 rounded-sm font-medium hover:bg-[#E06767] transition-all">
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