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
    <div className="max-w-[1170px] mx-auto px-4 py-10 lg:py-20 font-['Inter']">
      
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-10 lg:mb-20">
        Home / <span className="text-black">About</span>
      </div>

      {/* 1. Our Story Section */}
      <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20 mb-32">
        <div className="md:w-1/2 order-2 md:order-1">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-8 tracking-tight">Our Story</h1>
          <div className="space-y-6 text-[16px] leading-7 text-black">
            <p>
              Launched in 2015, Exclusive is South Asia’s premier online shopping marketplace with an active presence in Bangladesh. Supported by wide range of tailored marketing, data and service solutions.
            </p>
            <p>
              Exclusive has more than 10,500 sellers and 300 brands and serves 3 millions customers across the region. Exclusive offers a diverse assortment in categories ranging from consumer electronics to fashion.
            </p>
          </div>
        </div>
        <div className="md:w-1/2 order-1 md:order-2">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800" 
            alt="Our Story" 
            className="w-full h-[400px] lg:h-[600px] object-cover rounded-sm" 
          />
        </div>
      </div>

      {/* 2. Stats Section (Hover effect: Red Background) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {[
          { icon: <FiShoppingBag size={30} />, count: "10.5k", label: "Sellers active our site" },
          { icon: <FiDollarSign size={30} />, count: "33k", label: "Monthly Product Sale" },
          { icon: <FiUsers size={30} />, count: "45.5k", label: "Customer active in our site" },
          { icon: <FiShield size={30} />, count: "25k", label: "Anual gross sale in our site" },
        ].map((stat, index) => (
          <div key={index} className="group border border-gray-300 p-8 text-center rounded-sm hover:bg-[#DB4444] hover:border-[#DB4444] transition-all duration-300 cursor-default">
            <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto border-8 border-gray-200 group-hover:bg-white group-hover:text-black group-hover:border-[#E07575] transition-all">
              {stat.icon}
            </div>
            <h3 className="text-3xl font-bold mt-4 group-hover:text-white transition-colors">{stat.count}</h3>
            <p className="text-sm mt-2 group-hover:text-white transition-colors">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 3. Team Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {[
          { name: "Tom Cruise", role: "Founder & Chairman", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
          { name: "Emma Watson", role: "Managing Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" },
          { name: "Will Smith", role: "Product Designer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
        ].map((member, index) => (
          <div key={index} className="space-y-4">
            <div className="bg-[#F5F5F5] pt-10 px-10 rounded-sm">
              <img src={member.img} alt={member.name} className="h-[350px] w-full object-contain mx-auto mix-blend-multiply" />
            </div>
            <h3 className="text-2xl font-medium tracking-wide">{member.name}</h3>
            <p className="text-gray-500">{member.role}</p>
            <div className="flex gap-4 text-xl">
              <FaTwitter className="cursor-pointer hover:text-[#DB4444] transition-colors" />
              <FaInstagram className="cursor-pointer hover:text-[#DB4444] transition-colors" />
              <FaLinkedinIn className="cursor-pointer hover:text-[#DB4444] transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pb-10">
        <div className="space-y-4">
          <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto border-8 border-gray-200">
            <FiTruck size={30} />
          </div>
          <h3 className="font-bold text-xl uppercase tracking-wider">Free and Fast Delivery</h3>
          <p className="text-sm">Free delivery for all orders over $140</p>
        </div>
        <div className="space-y-4">
          <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto border-8 border-gray-200">
            <FiHeadphones size={30} />
          </div>
          <h3 className="font-bold text-xl uppercase tracking-wider">24/7 Customer Service</h3>
          <p className="text-sm">Friendly 24/7 customer support</p>
        </div>
        <div className="space-y-4">
          <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto border-8 border-gray-200">
            <FiShield size={30} />
          </div>
          <h3 className="font-bold text-xl uppercase tracking-wider">Money Back Guarantee</h3>
          <p className="text-sm">We return money within 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default About;