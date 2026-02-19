import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      toast.success("A 6-digit reset code has been sent to your email!");
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Email address not found");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center pt-[60px] pb-[140px] font-['Inter']">
       <div className="w-full md:w-[50%] bg-[#CBE4E8] flex justify-center items-center h-[500px] rounded-r-[4px]">
        <img src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg" className="max-w-[400px] mix-blend-multiply" alt="Forgot Password Illustration" />
      </div>
      <div className="w-full md:w-[50%] flex justify-center md:pl-[129px]">
        <div className="w-full max-w-[371px]">
          <h1 className="text-[36px] font-medium mb-6">Forgot Password</h1>
          <p className="text-[16px] mb-12 text-gray-600">Please enter your email to receive a verification code.</p>
          <form className="space-y-10" onSubmit={handleSendCode}>
            <input type="email" placeholder="Email Address" className="w-full border-b border-gray-300 py-2 outline-none" onChange={(e) => setEmail(e.target.value)} required />
            <button className="w-full bg-[#DB4444] text-white py-4 rounded-[4px] font-medium">Send Code</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;