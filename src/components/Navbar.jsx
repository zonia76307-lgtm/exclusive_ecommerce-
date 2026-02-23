import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiLogOut, FiGrid, FiMenu, FiX, FiPhone, FiInfo } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { getWishlist } from '../redux/slices/wishlistSlice';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(getWishlist());
    }
  }, [dispatch, userInfo]);

  // Helper function to close sidebar
  const closeMenu = () => setIsMenuOpen(false);

  const cartCount = cartItems?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
      closeMenu();
    }
  };

  return (
    <header className="w-full font-['Inter'] bg-white border-b sticky top-0 z-[100] shadow-sm">
      {/* --- 1. Top Black Banner --- */}
      <div className="bg-black text-white text-center py-2 md:py-3 text-[10px] sm:text-[14px] px-4">
        <p className="flex justify-center items-center gap-2">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! 
          <Link to="/" className="font-semibold underline hover:text-gray-300 transition-all">ShopNow</Link>
        </p>
      </div>

      {/* --- 2. Main Navigation Bar --- */}
      <nav className="max-w-[1170px] mx-auto flex items-center justify-between pt-4 pb-4 px-4 md:pt-8 md:pb-5">
        
        {/* Mobile: Hamburger Button & Logo */}
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden text-black p-1 hover:bg-gray-100 rounded-md transition-all" 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Toggle Menu"
          >
            <FiMenu size={26} />
          </button>
          <Link to="/" className="text-[20px] md:text-[24px] font-bold text-black tracking-wider hover:opacity-80 transition-all">
            Exclusive
          </Link>
        </div>

        {/* Center: Desktop Menu Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12 text-[16px] font-medium">
          <Link to="/" className="hover:underline underline-offset-8 decoration-2 decoration-[#DB4444]">Home</Link>
          <Link to="/contact" className="hover:underline underline-offset-8 decoration-2 decoration-[#DB4444]">Contact</Link>
          <Link to="/about" className="hover:underline underline-offset-8 decoration-2 decoration-[#DB4444]">About</Link>
          {!userInfo && (
            <Link to="/signup" className="hover:underline underline-offset-8 decoration-2 decoration-[#DB4444]">Sign Up</Link>
          )}
        </div>

        {/* Right: Actions (Search, Wishlist, Cart, Profile) */}
        <div className="flex items-center gap-2 md:gap-5">
          
          {/* Desktop Search Bar (Hidden on Mobile) */}
          <form onSubmit={handleSearch} className="hidden lg:relative lg:block group">
            <div className="bg-[#F5F5F5] rounded-[4px] px-4 py-2 flex items-center border border-transparent group-focus-within:border-gray-300 transition-all">
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="bg-transparent outline-none text-[12px] w-[140px] xl:w-[200px]" 
                onChange={(e) => setSearchTerm(e.target.value)} 
                value={searchTerm} 
              />
              <button type="submit"><FiSearch className="text-black ml-2" size={18} /></button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-1 md:gap-3">
            {userInfo && (
              <>
                {/* Wishlist Icon - Static Count (No Blink) */}
                <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-all" title="Wishlist">
                  <FiHeart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#DB4444] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                {/* Cart Icon - Static Count (No Blink) */}
                <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-all" title="Cart">
                  <FiShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#DB4444] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Profile Dropdown */}
            {userInfo ? (
              <div className="group relative ml-1">
                <div className={`p-1.5 rounded-full text-white cursor-pointer transition-all hover:scale-110 shadow-sm ${userInfo.role === 'admin' ? 'bg-black' : 'bg-[#DB4444]'}`}>
                  <FiUser size={18} />
                </div>
                
                {/* Desktop Dropdown Content */}
                <div className="hidden group-hover:block absolute right-0 top-full pt-3 w-[220px] z-[110]">
                  <div className="bg-black text-white rounded-md overflow-hidden shadow-2xl border border-gray-800">
                    <div className="px-4 py-3 border-b border-gray-800 bg-white/5">
                      <p className="text-xs text-gray-400 font-medium truncate">Hi, {userInfo.name || 'User'}</p>
                    </div>
                    
                    <Link to={userInfo.role === 'admin' ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm">
                      <FiGrid size={17} /> {userInfo.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                    </Link>
                    
                    <Link to="/account" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm">
                      <FiUser size={17} /> Manage My Account
                    </Link>

                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#DB4444] transition-colors text-sm w-full text-left font-medium border-t border-gray-800"
                    >
                      <FiLogOut size={17} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-[#DB4444] text-white px-5 py-2 rounded-[4px] text-xs md:text-sm font-medium hover:bg-black transition-all shadow-md active:scale-95 ml-2">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- 3. MOBILE SIDEBAR DRAWER --- */}
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={closeMenu}
      />
      
      {/* Sidebar Content Container */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[120] shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <span className="text-2xl font-black tracking-tighter">EXCLUSIVE</span>
            <button onClick={closeMenu} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <FiX size={24} />
            </button>
          </div>

          {/* Sidebar Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Mobile Search Bar inside Sidebar */}
            <form onSubmit={handleSearch} className="relative mb-8">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-gray-100 rounded-md py-3 px-4 pr-10 outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <FiSearch className="absolute right-3 top-3.5 text-gray-500" size={18} />
            </form>

            {/* Main Navigation Links */}
            <div className="flex flex-col gap-5 text-lg font-medium">
              <Link to="/" onClick={closeMenu} className="flex items-center gap-4 hover:text-[#DB4444] transition-colors"><FiGrid size={20}/> Home</Link>
              <Link to="/contact" onClick={closeMenu} className="flex items-center gap-4 hover:text-[#DB4444] transition-colors"><FiPhone size={20}/> Contact</Link>
              <Link to="/about" onClick={closeMenu} className="flex items-center gap-4 hover:text-[#DB4444] transition-colors"><FiInfo size={20}/> About</Link>
              
              {!userInfo && (
                <Link to="/signup" onClick={closeMenu} className="text-[#DB4444] border-t pt-4 mt-2">Sign Up / Register</Link>
              )}
            </div>

            {/* My Account Links for Mobile */}
            {userInfo && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-xs uppercase text-gray-400 font-bold mb-5 tracking-widest">My Account</p>
                <div className="flex flex-col gap-5">
                  <Link to={userInfo.role === 'admin' ? "/admin/dashboard" : "/dashboard"} onClick={closeMenu} className="text-base font-semibold">Dashboard</Link>
                  <Link to="/account" onClick={closeMenu} className="text-base font-semibold">Profile Settings</Link>
                  <Link to="/wishlist" onClick={closeMenu} className="text-base font-semibold">My Wishlist ({wishlistCount})</Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Footer (Logout Button) */}
          {userInfo && (
            <div className="p-6 border-t bg-gray-50">
               <button 
                onClick={handleLogout} 
                className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 rounded-md font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg"
               >
                  <FiLogOut size={18} /> Logout
               </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;