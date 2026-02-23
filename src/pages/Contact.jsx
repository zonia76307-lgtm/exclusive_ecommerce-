import React from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20 flex flex-col lg:flex-row gap-8 font-['Inter']">
      
      {/* Sidebar Info - Responsive width and padding */}
      <div className="w-full lg:w-1/3 shadow-sm border border-gray-100 p-6 md:p-8 rounded-sm bg-white">
        {/* Call To Us Section */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#DB4444] p-3 rounded-full text-white shadow-sm">
              <FiPhone size={22}/>
            </div>
            <h3 className="font-bold text-[16px] tracking-tight">Call To Us</h3>
          </div>
          <p className="text-sm mb-4 text-gray-700 leading-relaxed">
            We are available 24/7, 7 days a week.
          </p>
          <p className="text-sm font-semibold text-black">Phone: +8801611112222</p>
        </div>

        {/* Write To Us Section */}
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#DB4444] p-3 rounded-full text-white shadow-sm">
              <FiMail size={22}/>
            </div>
            <h3 className="font-bold text-[16px] tracking-tight">Write To US</h3>
          </div>
          <p className="text-sm mb-4 text-gray-700 leading-relaxed">
            Fill out our form and we will contact you within 24 hours.
          </p>
          <p className="text-sm font-semibold text-black mb-2">Emails: support@exclusive.com</p>
          <p className="text-sm font-semibold text-black">Emails: customer@exclusive.com</p>
        </div>
      </div>

      {/* Form Section - Stacked inputs on mobile */}
      <div className="w-full lg:w-2/3 shadow-sm border border-gray-100 p-6 md:p-8 rounded-sm bg-white">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Responsive Grid for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Your Name *" 
              className="bg-[#F5F5F5] p-3 outline-none rounded-sm border border-transparent focus:border-[#DB4444] focus:bg-white transition-all text-sm" 
              required 
            />
            <input 
              type="email" 
              placeholder="Your Email *" 
              className="bg-[#F5F5F5] p-3 outline-none rounded-sm border border-transparent focus:border-[#DB4444] focus:bg-white transition-all text-sm" 
              required 
            />
            <input 
              type="tel" 
              placeholder="Your Phone *" 
              className="bg-[#F5F5F5] p-3 outline-none rounded-sm border border-transparent focus:border-[#DB4444] focus:bg-white transition-all text-sm" 
              required 
            />
          </div>

          <textarea 
            placeholder="Your Message" 
            className="w-full bg-[#F5F5F5] p-4 outline-none rounded-sm border border-transparent focus:border-[#DB4444] focus:bg-white transition-all h-48 md:h-64 resize-none text-sm"
          ></textarea>

          <div className="flex justify-center md:justify-end">
            <button 
              type="submit"
              className="w-full md:w-auto bg-[#DB4444] text-white px-12 py-4 rounded-sm hover:bg-black transition-all font-bold uppercase tracking-wider text-sm shadow-md active:scale-95"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;