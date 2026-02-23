import React from 'react';
import { Link } from 'react-router-dom';

const VerifySuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] md:min-h-[70vh] text-center px-6 font-['Inter']">
      
      {/* Success Icon Animation Wrapper */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
          <svg 
            className="w-10 h-10 md:w-12 md:h-12 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="3" 
              d="M5 13l4 4L19 7"
              className="animate-draw"
            ></path>
          </svg>
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-[28px] md:text-[40px] font-bold text-gray-900 mb-4 tracking-tight">
        Email Verified!
      </h1>
      
      <p className="text-[15px] md:text-[18px] text-gray-500 mb-10 max-w-[450px] leading-relaxed">
        Aapka account kamyabi se verify ho gaya hai. Ab aap Exclusive store ki tamaam features istemal kar sakte hain.
      </p>

      {/* Call to Action */}
      <Link 
        to="/login" 
        className="w-full sm:w-auto bg-[#DB4444] text-white px-12 py-4 rounded-[4px] font-medium text-[16px] hover:bg-black transition-all shadow-lg shadow-red-100 active:scale-95"
      >
        Go to Login
      </Link>

      {/* Brand Footer Shortcut */}
      <div className="mt-12">
        <p className="text-gray-400 text-sm">
          Need help? <Link to="/contact" className="text-[#DB4444] hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifySuccess;