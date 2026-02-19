import React from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="max-w-[1170px] mx-auto px-4 py-20 flex flex-col md:flex-row gap-8">
      {/* Sidebar Info */}
      <div className="md:w-1/3 shadow-sm border border-gray-100 p-8 rounded-sm bg-white">
        <div className="mb-8 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#DB4444] p-2 rounded-full text-white"><FiPhone size={20}/></div>
            <h3 className="font-semibold text-[16px]">Call To Us</h3>
          </div>
          <p className="text-sm mb-4 text-gray-700">We are available 24/7, 7 days a week.</p>
          <p className="text-sm font-medium">Phone: +8801611112222</p>
        </div>
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#DB4444] p-2 rounded-full text-white"><FiMail size={20}/></div>
            <h3 className="font-semibold text-[16px]">Write To US</h3>
          </div>
          <p className="text-sm mb-4 text-gray-700">Fill out our form and we will contact you within 24 hours.</p>
          <p className="text-sm font-medium">Emails: support@exclusive.com</p>
        </div>
      </div>

      {/* Form */}
      <div className="md:w-2/3 shadow-sm border border-gray-100 p-8 rounded-sm bg-white">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Your Name *" className="bg-[#F5F5F5] p-3 outline-none rounded-sm border focus:border-gray-400" required />
            <input type="email" placeholder="Your Email *" className="bg-[#F5F5F5] p-3 outline-none rounded-sm border focus:border-gray-400" required />
            <input type="tel" placeholder="Your Phone *" className="bg-[#F5F5F5] p-3 outline-none rounded-sm border focus:border-gray-400" required />
          </div>
          <textarea placeholder="Your Message" className="w-full bg-[#F5F5F5] p-3 outline-none rounded-sm border focus:border-gray-400 h-48 resize-none"></textarea>
          <div className="flex justify-end">
            <button className="bg-[#DB4444] text-white px-12 py-4 rounded-sm hover:bg-[#e03a3a] transition-all font-medium">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;