import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/wishlist';

// Helper to fix prices in the list
const fixWishlistPrices = (products) => {
    return products.map(product => {
        if (product.onSale && product.discountPercentage > 0) {
            const discountedPrice = (product.price - (product.price * product.discountPercentage / 100)).toFixed(0);
            return { ...product, price: Number(discountedPrice) };
        }
        return product;
    });
};

// 1. GET WISHLIST
export const getWishlist = createAsyncThunk('wishlist/get', async (_, { getState }) => {
    const { user: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get(BASE_URL, config);
    return data.products || []; 
});

// 2. TOGGLE (ADD/REMOVE)
export const addToWishlistServer = createAsyncThunk('wishlist/add', async (product, { getState }) => {
    const { user: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    // Backend ko sirf ID chahiye, lekin price hum Slice mein fix karenge
    const { data } = await axios.post(BASE_URL, { productId: product._id }, config);
    return data.data?.products || data.products || []; 
});

// 3. REMOVE SINGLE ITEM
export const removeFromWishlistServer = createAsyncThunk('wishlist/remove', async (productId, { getState }) => {
    const { user: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    await axios.delete(`${BASE_URL}/${productId}`, config);
    return productId;
});

// 4. CLEAR ALL
export const clearWishlistServer = createAsyncThunk('wishlist/clear', async (_, { getState }) => {
    const { user: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    await axios.delete(`${BASE_URL}/clear`, config);
    return []; 
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: { 
        wishlistItems: JSON.parse(localStorage.getItem('wishlistItems')) || [], 
        loading: false, 
        error: null 
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                // Price fix kar ke save kar rahe hain
                const updatedItems = fixWishlistPrices(action.payload);
                state.wishlistItems = updatedItems;
                localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
            })
            .addCase(addToWishlistServer.fulfilled, (state, action) => {
                const updatedItems = fixWishlistPrices(action.payload);
                state.wishlistItems = updatedItems;
                localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
            })
            .addCase(removeFromWishlistServer.fulfilled, (state, action) => {
                state.wishlistItems = state.wishlistItems.filter(item => item._id !== action.payload);
                localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
            })
            .addCase(clearWishlistServer.fulfilled, (state) => {
                state.wishlistItems = []; 
                localStorage.removeItem('wishlistItems');
            });
    },
});

export default wishlistSlice.reducer;