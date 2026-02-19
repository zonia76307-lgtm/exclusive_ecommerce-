import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { useEffect } from 'react'; 
import { getWishlist } from './redux/slices/wishlistSlice'; 
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast'; 
import 'react-toastify/dist/ReactToastify.css';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- PAGES ---
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductDetails from './pages/ProductDetails'; 
import AdminDashboard from './pages/AdminDashboard'; 
import UserDashboard from './pages/UserDashboard'; 
import About from './pages/About';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Account from './pages/Account';
import Checkout from './pages/Checkout'; 
import CategoryPage from './pages/CategoryPage'; 
import NotFound from './pages/NotFound'; 
import VerifySuccess from './pages/VerifySuccess';
import ProductTypePage from './pages/ProductTypePage'; 
// 🔥 Import ProductsPage (Ensure you have created this file in src/pages)
import ProductsPage from './pages/ProductsPage'; 

// --- ADMIN COMPONENTS ---
import ProductManagement from './components/Admin/ProductManagement';
import CategoryManagement from './components/Admin/CategoryManagement'; 
import UserManagement from './components/Admin/UserManagement';
import OrderManagement from './components/Admin/OrderManagement';
import FlashSalesManager from './components/Admin/FlashSalesManager'; 

// 🛠️ LayoutHandler
const LayoutHandler = ({ children }) => {
  const location = useLocation();
  
  const shouldHideNavbarFooter = 
    location.pathname.startsWith('/admin') || 
    location.pathname === '/dashboard';

  return (
    <div className="flex flex-col min-h-screen font-['Inter']">
      {!shouldHideNavbarFooter && <Navbar />}
      
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Toaster position="top-center" reverseOrder={false} /> 

      <div className="flex-grow">
        {children}
      </div>

      {!shouldHideNavbarFooter && <Footer />}
    </div>
  );
};

// 🛡️ Admin Protection Wrapper
const AdminRoute = ({ children, userInfo }) => {
  return userInfo && userInfo.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  const dispatch = useDispatch(); 
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(getWishlist());
    }
  }, [userInfo, dispatch]);

  return (
    <Router>
      <LayoutHandler userInfo={userInfo}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          
          {/* 🔥 NEW ROUTE: Is se 404 fix ho jayega */}
          <Route path="/products" element={<ProductsPage />} />
          
          <Route path="/view-all/:type" element={<ProductTypePage />} /> 
          
          <Route path="/signup" element={!userInfo ? <Signup /> : <Navigate to="/" />} />
          <Route path="/login" element={!userInfo ? <Login /> : <Navigate to="/" />} />
          
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          <Route path="/checkout" element={userInfo ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/orders" element={userInfo ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/account" element={userInfo ? <Account /> : <Navigate to="/login" />} />
          
          {/* USER DASHBOARD ROUTE */}
          <Route path="/dashboard" element={userInfo ? <UserDashboard /> : <Navigate to="/login" />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/dashboard" element={<AdminRoute userInfo={userInfo}><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute userInfo={userInfo}><ProductManagement /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute userInfo={userInfo}><CategoryManagement /></AdminRoute>} />
          <Route path="/admin/sales" element={<AdminRoute userInfo={userInfo}><FlashSalesManager /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute userInfo={userInfo}><UserManagement /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute userInfo={userInfo}><OrderManagement /></AdminRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutHandler>
    </Router>
  );
}

export default App;