import React from 'react';
import { Link } from 'react-router-dom';

const VerifySuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Aapka account kamyabi se verify ho gaya hai. Ab aap login kar sakte hain.
      </p>
      <Link 
        to="/login" 
        className="bg-[#DB4444] text-white px-8 py-3 rounded-md font-medium hover:bg-black transition-all"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default VerifySuccess;