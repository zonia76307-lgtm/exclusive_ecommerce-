import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWishlist, clearWishlistServer, removeFromWishlistServer } from '../redux/slices/wishlistSlice';
import { addToCart, syncCartWithDB } from '../redux/slices/cartSlice'; 
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { wishlistItems, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(getWishlist());
    }
  }, [dispatch, userInfo]);

  const getDiscountedPrice = (product) => {
    if (product.onSale && product.discountPercentage > 0) {
      return Math.round(product.price - (product.price * product.discountPercentage / 100));
    }
    return product.price;
  };

  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    const toastId = toast.loading("Moving items to bag...");

    try {
      for (const item of wishlistItems) {
        const salePrice = getDiscountedPrice(item);
        dispatch(addToCart({ ...item, price: salePrice, qty: 1 }));
        
        if (userInfo?.token) {
          await dispatch(syncCartWithDB({ 
            productId: item._id, 
            quantity: 1, 
            actionType: 'add' 
          })).unwrap();
        }
      }

      await dispatch(clearWishlistServer()).unwrap();
      toast.update(toastId, { render: "All items moved to bag!", type: "success", isLoading: false, autoClose: 3000 });
      dispatch(getWishlist());
    } catch (error) {
      toast.update(toastId, { render: "Some items failed to move.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      const salePrice = getDiscountedPrice(product);
      dispatch(addToCart({ ...product, price: salePrice, qty: 1 }));
      
      if (userInfo?.token) {
        await dispatch(syncCartWithDB({ 
          productId: product._id, 
          quantity: 1, 
          actionType: 'add' 
        })).unwrap();
      }

      await dispatch(removeFromWishlistServer(product._id)).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Cart sync failed.");
    }
  };

  const handleRemove = (product) => {
    dispatch(removeFromWishlistServer(product._id));
    toast.info(`${product.name} removed from wishlist`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-[#DB4444] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Wishlist...</p>
    </div>
  );

  return (
    <div className="max-w-[1170px] mx-auto py-10 md:py-20 px-4 font-['Inter']">
      {/* Scope specific CSS for product card overrides */}
      <style>{`
        .wishlist-container .relative button:not(.custom-trash) {
          display: none !important;
        }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
        <h2 className="text-lg md:text-xl font-medium text-black">
          Wishlist <span className="text-gray-500 ml-1">({wishlistItems.length})</span>
        </h2>
        
        {wishlistItems.length > 0 && (
          <button 
            onClick={handleMoveAllToCart}
            className="w-full sm:w-auto border border-black/30 px-6 md:px-10 py-3 md:py-4 hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] transition-all text-xs md:text-sm font-bold uppercase tracking-wider rounded-sm active:scale-95"
          >
            Move All To Bag
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 md:py-24 border-2 border-dashed rounded-xl bg-gray-50 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
             <FiShoppingCart className="text-gray-300" size={40} />
          </div>
          <p className="text-gray-400 mb-8 font-medium italic text-lg">"Your wishlist is feeling lonely..."</p>
          <Link to="/" className="bg-[#DB4444] text-white px-10 py-4 rounded-sm font-bold uppercase hover:bg-black transition-all shadow-md active:scale-95">
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Responsive Grid: 2 columns on small mobile, 4 on desktop */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 wishlist-container">
          {wishlistItems.map((product) => (
            <div key={product._id} className="flex flex-col h-full group">
              <div className="relative flex-1">
                <ProductCard product={product} showBadge={false} />
                
                {/* Trash icon - Optimized for touch */}
                <button 
                  onClick={() => handleRemove(product)}
                  className="custom-trash absolute top-2 right-2 md:top-4 md:right-4 bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-[#DB4444] transition-all z-20 active:scale-110"
                >
                  <FiTrash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>
              </div>

              {/* Add to Cart Button - Always visible on mobile for UX */}
              <button 
                onClick={() => handleMoveToCart(product)}
                className="w-full bg-black text-white py-3 mt-2 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase hover:bg-[#DB4444] transition-all rounded-sm shadow-sm active:bg-[#DB4444]"
              >
                <FiShoppingCart size={16} /> <span className="hidden xs:inline">Add To Cart</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;