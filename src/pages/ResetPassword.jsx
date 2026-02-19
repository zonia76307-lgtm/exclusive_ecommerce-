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

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/reset-password', { email, otp, newPassword });
      toast.success("Password updated successfully! Please log in.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] font-['Inter']">
      <div className="w-full max-w-[371px] px-6">
        <h1 className="text-[36px] font-medium mb-6">Reset Password</h1>
        <p className="text-[16px] mb-12 text-gray-600">Enter the 6-digit code and your new password below.</p>
        <form className="space-y-10" onSubmit={handleReset}>
          <input type="text" placeholder="6-digit code" className="w-full border-b border-gray-300 py-2 outline-none text-center tracking-[10px] text-[24px]" maxLength="6" onChange={(e) => setOtp(e.target.value)} required />
          <input type="password" placeholder="New Password" className="w-full border-b border-gray-300 py-2 outline-none" onChange={(e) => setNewPassword(e.target.value)} required />
          <button className="w-full bg-[#DB4444] text-white py-4 rounded-[4px] font-medium">Update Password</button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;