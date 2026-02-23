import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-[1170px] mx-auto py-12 md:py-20 px-6 xl:px-0 font-['Inter'] min-h-[70vh] flex flex-col justify-center">
      
      {/* Breadcrumb - Mobile par centered ya hidden bhi kar sakte hain, yahan clean rakha hai */}
      <div className="text-[12px] md:text-sm text-gray-400 mb-10 md:mb-20">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black">404 Error</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center">
        {/* Responsive Text Sizes */}
        <h1 className="text-[32px] sm:text-[48px] md:text-[72px] lg:text-[110px] font-medium tracking-tight text-black mb-4 md:mb-6 leading-tight">
          404 Not Found
        </h1>
        
        <p className="text-[14px] md:text-base text-gray-600 md:text-gray-700 mb-8 md:mb-12 max-w-[300px] md:max-w-none">
          Your visited page not found. You may go home page.
        </p>
        
        {/* Full-width button on very small screens, auto on larger */}
        <Link 
          to="/" 
          className="w-full sm:w-auto bg-[#DB4444] text-white px-12 py-4 rounded-sm font-medium hover:bg-[#E07575] transition-all duration-300 active:scale-95 shadow-md md:shadow-none"
        >
          Back to home page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;