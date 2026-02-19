import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

export const fetchCartFromDB = createAsyncThunk(
  'cart/fetchCartFromDB',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user: { userInfo } } = getState();
      if (!userInfo?.token) return [];
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${BASE_URL}/api/cart`, config);
      return data.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const syncCartWithDB = createAsyncThunk(
  'cart/syncCartWithDB',
  async ({ productId, quantity, actionType }, { getState, rejectWithValue }) => {
    try {
      const { user: { userInfo } } = getState();
      if (!userInfo?.token) return null;
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      let response;
      if (actionType === 'add' || actionType === 'update') {
        response = await axios.post(`${BASE_URL}/api/cart`, { productId, quantity }, config);
      } else if (actionType === 'remove') {
        response = await axios.delete(`${BASE_URL}/api/cart/${productId}`, config);
      }
      return response.data.items; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Sync failed");
    }
  }
);

export const clearCartServer = createAsyncThunk(
  'cart/clearCartServer',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user: { userInfo } } = getState();
      if (!userInfo?.token) return null;
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`${BASE_URL}/api/cart/clear`, config);
      return []; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart on server");
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: { 
    cartItems: JSON.parse(localStorage.getItem('cartItems') || '[]'),
    status: 'idle'
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(x => x._id === item._id);
      if (existItem) {
        existItem.qty += (item.qty || 1);
      } else {
        state.cartItems.push({ ...item, qty: item.qty || 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateCartQty: (state, action) => {
      const { _id, qty } = action.payload;
      const item = state.cartItems.find(x => x._id === _id);
      if (item) {
        item.qty = Number(qty); // 🔥 Direct set (No += logic here)
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x._id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromDB.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(syncCartWithDB.fulfilled, (state, action) => {
        if (action.payload) {
          state.cartItems = action.payload;
          localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
      })
      .addCase(clearCartServer.fulfilled, (state) => {
        state.cartItems = [];
        localStorage.removeItem('cartItems');
      });
  }
});

export const { addToCart, updateCartQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;