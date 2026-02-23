import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // 🔥 .env se API URL uthaya
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email missing. Please try again from Forgot Password.");
      return navigate('/forgot-password');
    }
    
    try {
      await axios.post(`${BASE_URL}/api/users/reset-password`, { email, otp, newPassword });
      toast.success("Password updated successfully! Please log in.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] md:min-h-[80vh] font-['Inter'] px-4">
      <div className="w-full max-w-[400px] bg-white p-6 md:p-8 rounded-lg shadow-sm sm:shadow-none border border-gray-50 sm:border-none">
        
        <h1 className="text-[28px] md:text-[36px] font-medium mb-3 md:mb-6 text-center sm:text-left">
          Reset Password
        </h1>
        
        <p className="text-[14px] md:text-[16px] mb-8 md:mb-12 text-gray-600 text-center sm:text-left">
          Enter the 6-digit code sent to <span className="font-semibold text-black">{email || 'your email'}</span> and your new password below.
        </p>

        <form className="space-y-8 md:space-y-10" onSubmit={handleReset}>
          {/* OTP Input */}
          <div className="relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center sm:text-left">
              Verification Code
            </label>
            <input 
              type="text" 
              placeholder="000000" 
              className="w-full border-b border-gray-300 py-2 outline-none text-center tracking-[8px] md:tracking-[10px] text-[20px] md:text-[24px] focus:border-[#DB4444] transition-colors font-mono" 
              maxLength="6" 
              onChange={(e) => setOtp(e.target.value)} 
              required 
            />
          </div>

          {/* New Password Input */}
          <div className="relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center sm:text-left">
              New Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#DB4444] transition-colors" 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>

          <button className="w-full bg-[#DB4444] text-white py-4 rounded-[4px] font-medium text-[16px] hover:bg-black transition-all active:scale-95 shadow-lg shadow-red-50">
            Update Password
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/forgot-password')} 
            className="text-[14px] text-gray-500 hover:text-[#DB4444] transition-colors"
          >
            Didn't get the code? Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;