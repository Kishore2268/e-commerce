import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("auth-token");
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      };

      const response = await axios.post(
        `https://clothing-store-ta8c.onrender.com/api/shop/review/add`,
        formdata,
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add review');
    }
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews", 
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://clothing-store-ta8c.onrender.com/api/shop/review/${id}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch reviews');
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Review cases
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload.success) {
          state.reviews.push(action.payload.data);
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add review';
      })
      // Get Reviews cases
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch reviews';
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
