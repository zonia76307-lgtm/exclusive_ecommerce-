import React from 'react';
import { 
  FiTruck, 
  FiHeadphones, 
  FiShield, 
  FiShoppingBag, 
  FiDollarSign, 
  FiUsers 
} from 'react-icons/fi';
import { FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const About = () => {
  return (
    <div className="max-w-[1170px] mx-auto px-4 py-8 lg:py-20 font-['Inter'] overflow-x-hidden">
      
      {/* --- Breadcrumb --- */}
      <div className="text-sm text-gray-400 mb-8 lg:mb-20">
        <span className="hover:text-[#DB4444] cursor-pointer">Home</span> / <span className="text-black font-medium">About</span>
      </div>

      {/* --- 1. Our Story Section --- */}
      <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20 mb-20 lg:mb-32">
        <div className="w-full md:w-1/2 order-2 md:order-1 text-center md:text-left">
          <h1 className="text-3xl lg:text-5xl font-semibold mb-6 lg:mb-8 tracking-tight">Our Story</h1>
          <div className="space-y-4 lg:space-y-6 text-[15px] lg:text-[16px] leading-7 text-black">
            <p>
              Launched in 2015, Exclusive is South Asia’s premier online shopping marketplace with an active presence in Bangladesh. Supported by wide range of tailored marketing, data and service solutions.
            </p>
            <p>
              Exclusive has more than 10,500 sellers and 300 brands and serves 3 millions customers across the region. Exclusive offers a diverse assortment in categories ranging from consumer electronics to fashion.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800" 
            alt="Our Story" 
            className="w-full h-[300px] lg:h-[600px] object-cover rounded-sm shadow-sm" 
          />
        </div>
      </div>

      {/* --- 2. Stats Section --- */}
      {/* grid-cols-2 mobile par 2 cards dikhayega, jo user experience ke liye best hai */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-20 lg:mb-32">
        {[
          { icon: <FiShoppingBag size={24} />, count: "10.5k", label: "Sellers active" },
          { icon: <FiDollarSign size={24} />, count: "33k", label: "Monthly Sale" },
          { icon: <FiUsers size={24} />, count: "45.5k", label: "Active Customers" },
          { icon: <FiShield size={24} />, count: "25k", label: "Annual Gross Sale" },
        ].map((stat, index) => (
          <div key={index} className="group border border-gray-300 p-6 lg:p-8 text-center rounded-sm hover:bg-[#DB4444] hover:border-[#DB4444] transition-all duration-300 cursor-default shadow-sm">
            <div className="bg-black text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto border-[6px] lg:border-8 border-gray-200 group-hover:bg-white group-hover:text-black transition-all">
              {stat.icon}
            </div>
            <h3 className="text-xl lg:text-3xl font-bold mt-4 group-hover:text-white transition-colors">{stat.count}</h3>
            <p className="text-[12px] lg:text-sm mt-2 group-hover:text-white transition-colors uppercase font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* --- 3. Team Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 mb-20 lg:mb-32">
        {[
          { name: "Tom Cruise", role: "Founder & Chairman", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
          { name: "Emma Watson", role: "Managing Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" },
          { name: "Will Smith", role: "Product Designer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
        ].map((member, index) => (
          <div key={index} className="flex flex-col">
            <div className="bg-[#F5F5F5] pt-8 px-6 lg:px-10 rounded-sm mb-6">
              <img src={member.img} alt={member.name} className="h-[300px] lg:h-[400px] w-full object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <h3 className="text-2xl font-semibold tracking-wide mb-1">{member.name}</h3>
            <p className="text-gray-500 mb-4 text-sm">{member.role}</p>
            <div className="flex gap-4 text-lg">
              <FaTwitter className="cursor-pointer hover:text-[#DB4444] transition-colors" />
              <FaInstagram className="cursor-pointer hover:text-[#DB4444] transition-colors" />
              <FaLinkedinIn className="cursor-pointer hover:text-[#DB4444] transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* --- 4. Services Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 text-center pb-10">
        {[
          { icon: <FiTruck size={30} />, title: "Free and Fast Delivery", desc: "Free delivery for all orders over $140" },
          { icon: <FiHeadphones size={30} />, title: "24/7 Customer Service", desc: "Friendly 24/7 customer support" },
          { icon: <FiShield size={30} />, title: "Money Back Guarantee", desc: "We return money within 30 days" },
        ].map((service, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 border-8 border-gray-200">
              {service.icon}
            </div>
            <h3 className="font-bold text-lg lg:text-xl uppercase tracking-wider mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;