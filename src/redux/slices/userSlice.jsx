import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Login ke liye use hota hai
    login: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    
    // Profile update ke baad data sync karne ke liye
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems'); // Cleanup
    },
  },
});

export const { login, logout, setCredentials } = userSlice.actions;
export default userSlice.reducer;