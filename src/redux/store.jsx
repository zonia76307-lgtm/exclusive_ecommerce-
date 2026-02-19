import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer, // 🔥 Yeh line Wishlist count ke liye zaroori hai
    products: productReducer,
  },
});

export default store;