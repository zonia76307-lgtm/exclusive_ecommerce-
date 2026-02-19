import React from 'react';
import { Link } from 'react-router-dom';
import { FiSend } from 'react-icons/fi'; // Arrow icon ke liye

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Dynamic Links Data
  const footerLinks = {
    account: [
      { name: 'My Account', path: '/profile' },
      { name: 'Login / Register', path: '/login' },
      { name: 'Cart', path: '/cart' },
      { name: 'Wishlist', path: '/wishlist' },
      { name: 'Shop', path: '/view-all/all-products' },
    ],
    quickLink: [
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms Of Use', path: '/terms' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Contact', path: '/contact' },
    ]
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 md:px-20 mt-20 font-['Inter']">
      <div className="max-w-[1170px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Exclusive - Subscription */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-wider">Exclusive</h2>
          <p className="text-lg font-medium">Subscribe</p>
          <p className="text-sm text-gray-400">Get 10% off your first order</p>
          <div className="border border-white flex items-center p-3 rounded-sm">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-500" 
            />
            <button className="hover:scale-110 transition-transform">
              <FiSend size={18} />
            </button>
          </div>
        </div>

        {/* Support - Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Support</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            111 Bijoy sarani, Dhaka, <br /> DH 1515, Bangladesh.
          </p>
          <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
            exclusive@gmail.com
          </p>
          <p className="text-sm text-gray-400">
            +88015-88888-9999
          </p>
        </div>

        {/* Account - Dynamic Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Account</h2>
          <ul className="text-sm text-gray-400 space-y-3">
            {footerLinks.account.map((link, index) => (
              <li key={index}>
                <Link to={link.path} className="hover:text-white hover:underline transition-all">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Link - Dynamic Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Link</h2>
          <ul className="text-sm text-gray-400 space-y-3">
            {footerLinks.quickLink.map((link, index) => (
              <li key={index}>
                <Link to={link.path} className="hover:text-white hover:underline transition-all">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Download App */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Download App</h2>
          <p className="text-[12px] text-gray-400 font-medium">Save $3 with App New User Only</p>
          <div className="flex items-center gap-3">
            {/* QR Code Placeholder (Standard design mein hota hai) */}
            <div className="bg-white p-1 rounded-sm w-20 h-20">
               <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-2">
              <a href="https://play.google.com" target="_blank" rel="noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1024px-Google_Play_Store_badge_EN.svg.png" className="w-28 h-9 object-contain" alt="Playstore" />
              </a>
              <a href="https://apple.com" target="_blank" rel="noreferrer">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" className="w-28 h-9 object-contain" alt="Appstore" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-16 pt-6 border-t border-gray-900 text-gray-600 text-sm">
        © Copyright Rimel {currentYear}. All right reserved
      </div>
    </footer>
  );
};

export default Footer;