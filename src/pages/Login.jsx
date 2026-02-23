import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '../redux/slices/userSlice'; // Redux action import kiya

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // .env se URL uthaya
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BASE_URL}/api/users/login`, { email, password });
      
      // 🔥 Redux aur LocalStorage dono update honge
      dispatch(login(data));
      
      toast.success('Welcome back! Login successful.');

      // Navigation (window.location ki bajaye navigate use karein agar App update ho raha ho)
      navigate("/");
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    // Responsive Wrapper: Mobile pe padding kam, laptop pe zyada
    <div className="flex flex-col md:flex-row items-center pt-10 md:pt-[60px] pb-20 md:pb-[140px] font-['Inter'] min-h-screen">
      
      {/* --- Left Side: Image (Mobile par hide ho jayegi ya scale hogi) --- */}
      <div className="w-full md:w-[50%] bg-[#CBE4E8] flex justify-center items-center h-[300px] md:h-[600px] rounded-r-[4px]">
        <img 
          src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg" 
          alt="Login Illustration" 
          className="max-w-[280px] md:max-w-[450px] mix-blend-multiply p-4 md:p-10 object-contain" 
        />
      </div>

      {/* --- Right Side: Form --- */}
      <div className="w-full md:w-[50%] flex justify-center px-6 md:px-0 md:pl-[60px] lg:pl-[129px] mt-10 md:mt-0">
        <div className="w-full max-w-[371px]">
          <h1 className="text-[28px] md:text-[36px] font-medium mb-3 md:mb-[24px]">Log in to Exclusive</h1>
          <p className="text-[14px] md:text-[16px] mb-8 md:mb-[48px] text-gray-600">Enter your details below</p>
          
          <form className="space-y-8 md:space-y-[40px]" onSubmit={handleLogin}>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#DB4444] transition-colors text-[16px]" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#DB4444] transition-colors text-[16px]" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button className="w-full sm:w-auto bg-[#DB4444] text-white px-12 py-4 rounded-[4px] font-medium text-[16px] hover:bg-[#e03a3a] transition-all active:scale-95">
                Log In
              </button>
              <Link to="/forgot-password" size="sm" className="text-[#DB4444] text-[16px] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 md:gap-4 text-[14px] md:text-[16px]">
            <span className="text-gray-500">Don't have an account?</span>
            <Link to="/signup" className="font-medium border-b border-black pb-1 hover:text-[#DB4444] hover:border-[#DB4444] transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;