import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate add kiya
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate(); // Navigation initialize ki

  const handleSignup = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading("Creating account..."); // Loading state ke liye
    try {
      await axios.post('http://localhost:5000/api/users/signup', formData);
      
      // Success message jo aapne manga
      toast.update(loadToast, { 
        render: "Signup Successful!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });

      // Foran login par redirect
      setTimeout(() => {
        navigate('/login');
      }, 2000);

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
    <div className="flex flex-col md:flex-row items-center pt-[60px] pb-[140px] font-['Inter']">
      <div className="w-full md:w-[50%] bg-[#CBE4E8] flex justify-center items-center h-[600px] rounded-r-[4px]">
        <img src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg" className="max-w-[450px] mix-blend-multiply p-10" alt="Signup Illustration" />
      </div>
      <div className="w-full md:w-[50%] flex justify-center md:pl-[129px]">
        <div className="w-full max-w-[371px]">
          <h1 className="text-[36px] font-medium mb-[24px]">Create an account</h1>
          <p className="text-[16px] mb-[48px]">Enter your details below</p>
          <form className="space-y-[40px]" onSubmit={handleSignup}>
            <input type="text" placeholder="Name" className="w-full border-b border-gray-300 py-2 outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" className="w-full border-b border-gray-300 py-2 outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full border-b border-gray-300 py-2 outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <button className="w-full bg-[#DB4444] text-white py-4 rounded-[4px] font-medium text-[16px]">Create Account</button>
          </form>
          <div className="mt-8 flex justify-center gap-4">
            <span className="text-gray-500">Already have an account?</span>
            <Link to="/login" className="font-medium border-b border-black pb-1">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;