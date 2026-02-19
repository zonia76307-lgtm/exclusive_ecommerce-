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

  // 🔥 Helper function for Discounted Price
  const getDiscountedPrice = (product) => {
    if (product.onSale && product.discountPercentage > 0) {
      return Math.round(product.price - (product.price * product.discountPercentage / 100));
    }
    return product.price;
  };

  // 🔥 Move ALL to Cart Function
  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return;

    try {
      for (const item of wishlistItems) {
        const salePrice = getDiscountedPrice(item);
        
        // Price update kar ke cart mein bhejein
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
      toast.success("All items moved to bag!", { position: "top-right" });
      dispatch(getWishlist());

    } catch (error) {
      console.error("Move all error:", error);
      toast.error("Kuch items cart mein nahi ja sakay.");
    }
  };

  // 🔥 Move Single to Cart Function
  const handleMoveToCart = async (product) => {
    try {
      const salePrice = getDiscountedPrice(product);

      // 1. Frontend update with discounted price
      dispatch(addToCart({ ...product, price: salePrice, qty: 1 }));
      
      // 2. Database Sync
      if (userInfo?.token) {
        await dispatch(syncCartWithDB({ 
          productId: product._id, 
          quantity: 1, 
          actionType: 'add' 
        })).unwrap();
      }

      // 3. Wishlist se remove karein
      await dispatch(removeFromWishlistServer(product._id)).unwrap();
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Cart sync fail ho gaya.");
    }
  };

  const handleRemove = (product) => {
    dispatch(removeFromWishlistServer(product._id));
    toast.error(`${product.name} removed from wishlist`);
  };

  if (loading) return <div className="py-20 text-center font-bold text-xl italic uppercase">Loading Wishlist...</div>;

  return (
    <div className="max-w-[1170px] mx-auto py-20 px-4 font-['Inter']">
      <style>{`
        .wishlist-container .relative button:not(.custom-trash) {
          display: none !important;
        }
      `}</style>

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-medium text-black">Wishlist ({wishlistItems.length})</h2>
        
        {wishlistItems.length > 0 && (
          <button 
            onClick={handleMoveAllToCart}
            className="border border-black px-10 py-4 hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] transition-all text-sm font-medium uppercase"
          >
            Move All To Bag
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-6 font-medium italic">"Your wishlist is feeling lonely..."</p>
          <Link to="/" className="bg-[#DB4444] text-white px-10 py-4 rounded-sm font-bold uppercase hover:bg-black transition-all">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 wishlist-container">
          {wishlistItems.map((product) => (
            <div key={product._id} className="flex flex-col gap-2 group">
              <div className="relative">
                {/* 🔥 Pass kiya showBadge={false} taake wishlist mein badge na dikhe */}
                <ProductCard product={product} showBadge={false} />
                <button 
                  onClick={() => handleRemove(product)}
                  className="custom-trash absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:text-[#DB4444] transition-all z-20"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <button 
                onClick={() => handleMoveToCart(product)}
                className="w-full bg-black text-white py-3 flex items-center justify-center gap-3 text-sm font-bold uppercase hover:bg-[#DB4444] transition-all rounded-sm"
              >
                <FiShoppingCart size={18} /> Add To Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;