import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-[1170px] mx-auto py-20 px-4 xl:px-0 font-['Inter']">
      {/* Breadcrumb - Chota aur saaf */}
      <div className="text-sm text-gray-400 mb-20">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black">404 Error</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center">
        {/* Font size ko 110px se kam karke 4xl/5xl kar diya hai */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-black mb-6">
          404 Not Found
        </h1>
        
        <p className="text-base text-gray-700 mb-10">
          Your visited page not found. You may go home page.
        </p>
        
        {/* Button Style bilkul video jaisa */}
        <Link 
          to="/" 
          className="bg-[#DB4444] text-white px-10 py-4 rounded-sm font-medium hover:bg-[#E07575] transition-all duration-300"
        >
          Back to home page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;