import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // 🔥 .env se API URL uthaya
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSignup = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading("Creating account..."); 
    try {
      await axios.post(`${BASE_URL}/api/users/signup`, formData);
      
      toast.update(loadToast, { 
        render: "Signup Successful! Please check email to verify.", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      toast.update(loadToast, { 
        render: err.response?.data?.message || "Registration failed.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  return (
    // Responsive Wrapper: Mobile pe column, desktop pe row
    <div className="flex flex-col md:flex-row items-center pt-10 md:pt-[60px] pb-20 md:pb-[140px] font-['Inter'] min-h-screen">
      
      {/* --- Left Side: Illustration --- */}
      <div className="w-full md:w-[50%] bg-[#CBE4E8] flex justify-center items-center h-[300px] md:h-[600px] rounded-r-[4px]">
        <img 
          src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg" 
          className="max-w-[280px] md:max-w-[450px] mix-blend-multiply p-6 md:p-10 object-contain" 
          alt="Signup Illustration" 
        />
      </div>

      {/* --- Right Side: Form --- */}
      <div className="w-full md:w-[50%] flex justify-center px-6 md:px-0 md:pl-[60px] lg:pl-[129px] mt-10 md:mt-0">
        <div className="w-full max-w-[371px]">
          <h1 className="text-[28px] md:text-[36px] font-medium mb-2 md:mb-[24px]">Create an account</h1>
          <p className="text-[14px] md:text-[16px] mb-8 md:mb-[48px] text-gray-600">Enter your details below</p>
          
          <form className="space-y-6 md:space-y-[40px]" onSubmit={handleSignup}>
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#DB4444] transition-colors" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#DB4444] transition-colors" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#DB4444] transition-colors" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
            
            <button className="w-full bg-[#DB4444] text-white py-4 rounded-[4px] font-medium text-[16px] hover:bg-[#e03a3a] transition-all active:scale-95 shadow-lg shadow-red-100">
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-4 text-[14px] md:text-[16px]">
            <span className="text-gray-500">Already have an account?</span>
            <Link to="/login" className="font-medium border-b border-black pb-1 hover:text-[#DB4444] hover:border-[#DB4444] transition-all">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;