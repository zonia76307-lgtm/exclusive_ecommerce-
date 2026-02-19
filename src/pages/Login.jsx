import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      
      // Data save karna
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast.success('Welcome back! Login successful.');

      // Refresh ke saath Home par bhejna taake App logic update ho jaye
      window.location.href = "/"; 
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center pt-[60px] pb-[140px] font-['Inter']">
      <div className="w-full md:w-[50%] bg-[#CBE4E8] flex justify-center items-center h-[600px] rounded-r-[4px]">
        <img 
          src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg" 
          alt="Login Illustration" 
          className="max-w-[450px] mix-blend-multiply p-10" 
        />
      </div>

      <div className="w-full md:w-[50%] flex justify-center md:pl-[129px]">
        <div className="w-full max-w-[371px]">
          <h1 className="text-[36px] font-medium mb-[24px]">Log in to Exclusive</h1>
          <p className="text-[16px] mb-[48px]">Enter your details below</p>
          
          <form className="space-y-[40px]" onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email or Phone Number" 
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
            <div className="flex items-center justify-between pt-4">
              <button className="bg-[#DB4444] text-white px-12 py-4 rounded-[4px] font-medium text-[16px] hover:bg-[#e03a3a] transition-all">
                Log In
              </button>
              <Link to="/forgot-password" text-sm className="text-[#DB4444] text-[16px] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </form>

          <div className="mt-10 flex justify-center gap-4 text-[16px]">
            <span className="text-gray-500">Don't have an account?</span>
            <Link to="/signup" className="font-medium border-b border-black pb-1 hover:text-[#DB4444] transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;