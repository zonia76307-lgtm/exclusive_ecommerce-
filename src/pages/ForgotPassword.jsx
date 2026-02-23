import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ Backend Base URL (local + production)
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ API CALL UPDATED
      await axios.post(
        `${BASE_URL}/api/users/forgot-password`,
        { email }
      );

      toast.success("A 6-digit reset code has been sent to your email!");
      navigate("/reset-password", { state: { email } });

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Email address not found"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center min-h-[80vh] pt-10 pb-20 md:pt-[60px] md:pb-[140px] font-['Inter'] px-4 md:px-0">

      {/* Illustration Side */}
      <div className="w-full md:w-[50%] bg-[#CBE4E8] flex justify-center items-center h-[300px] md:h-[500px] rounded-[4px] md:rounded-l-none md:rounded-r-[4px] mb-10 md:mb-0">
        <img
          src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg"
          className="max-w-[250px] md:max-w-[400px] mix-blend-multiply transition-transform hover:scale-105 duration-500"
          alt="Forgot Password Illustration"
        />
      </div>

      {/* Form Side */}
      <div className="w-full md:w-[50%] flex justify-center md:pl-[80px] lg:pl-[129px]">
        <div className="w-full max-w-[371px]">
          <h1 className="text-[28px] md:text-[36px] font-medium mb-4 md:mb-6 tracking-tight">
            Forgot Password
          </h1>

          <p className="text-[14px] md:text-[16px] mb-8 md:mb-12 text-gray-600 leading-relaxed">
            Please enter your email to receive a verification code.
          </p>

          <form className="space-y-8 md:space-y-10" onSubmit={handleSendCode}>
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#DB4444] transition-colors text-[16px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className={`w-full bg-[#DB4444] text-white py-4 rounded-[4px] font-medium shadow-md transition-all active:scale-95 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-black"
              }`}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full text-sm text-gray-500 hover:text-black transition-colors md:hidden"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;