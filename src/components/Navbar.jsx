import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiLogOut, FiShoppingBag, FiGrid } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { getWishlist } from '../redux/slices/wishlistSlice';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
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

  const cartCount = cartItems?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/?search=${searchTerm}`);
  };

  return (
    <header className="w-full font-['Inter'] bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="bg-black text-white text-center py-3 text-[12px] sm:text-[14px]">
        <p>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! 
          <Link to="/" className="font-semibold underline ml-2">ShopNow</Link>
        </p>
      </div>

      <nav className="max-w-[1170px] mx-auto flex items-center justify-between pt-[30px] pb-[16px] px-4">
        <Link to="/" className="text-[24px] font-bold text-black tracking-wider">Exclusive</Link>

        <div className="hidden md:flex items-center gap-[48px] text-[16px]">
          <Link to="/" className="hover:underline underline-offset-8 decoration-2">Home</Link>
          <Link to="/contact" className="hover:underline underline-offset-8 decoration-2">Contact</Link>
          <Link to="/about" className="hover:underline underline-offset-8 decoration-2">About</Link>
          {!userInfo && <Link to="/signup" className="hover:underline underline-offset-8 decoration-2">Sign Up</Link>}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden lg:relative lg:block bg-[#F5F5F5] rounded-[4px] px-5 py-2">
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="bg-transparent outline-none text-[12px] w-[200px]" 
              onChange={(e) => setSearchTerm(e.target.value)} 
              value={searchTerm} 
            />
            <FiSearch className="absolute right-3 top-2.5 text-black" size={18} />
          </form>

          {userInfo && (
            <>
              <Link to="/wishlist" className="relative p-1">
                <FiHeart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative p-1">
                <FiShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DB4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {userInfo ? (
            <div className="group relative">
              {/* User Icon Circle */}
              <div className={`p-1.5 rounded-full text-white cursor-pointer ${userInfo.role === 'admin' ? 'bg-black' : 'bg-[#DB4444]'}`}>
                <FiUser size={20} />
              </div>

              {/* Dropdown Menu */}
              <div className="hidden group-hover:block absolute right-0 top-full pt-2 w-[224px] z-[100]">
                <div className="bg-black/80 backdrop-blur-md text-white rounded-md p-2 shadow-2xl border border-gray-700">
                  <div className="flex flex-col">
                    
                    {/* Condition: Admin vs User Dashboard */}
                    {userInfo.role === 'admin' ? (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 hover:bg-white/20 text-sm border-b border-gray-700">
                        <FiGrid size={18} /> Admin Dashboard
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-white/20 text-sm border-b border-gray-700">
                        <FiGrid size={18} /> My Dashboard
                      </Link>
                    )}

                    <Link to="/account" className="flex items-center gap-3 p-3 hover:bg-white/20 text-sm">
                      <FiUser size={18} /> Account Settings
                    </Link>

                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-3 p-3 hover:bg-white/20 text-sm border-t border-gray-700 w-full text-left font-['Inter']"
                    >
                      <FiLogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-[#DB4444] text-white px-6 py-2 rounded-sm text-sm font-medium">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;