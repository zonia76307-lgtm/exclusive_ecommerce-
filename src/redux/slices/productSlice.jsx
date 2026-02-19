import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllProducts = createAsyncThunk('products/fetchAll', async () => {
  const { data } = await axios.get('http://localhost:5000/api/products');
  return data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle' },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      });
  },
});

export default productSlice.reducer;