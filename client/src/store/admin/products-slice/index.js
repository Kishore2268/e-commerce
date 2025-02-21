import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "admin/products/add",
  async (formData) => {
    try {
      console.log("Sending request with formData:", formData);
      
      const transformedData = {
        ...formData,
        image: formData.image?.secure_url || formData.image
      };

      const response = await axios.post(
        "https://clothing-store-ta8c.onrender.com/api/admin/products/add",
        transformedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Request error:", error.response || error);
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please try logging in again.");
      }
      throw new Error(error.response?.data?.message || "Failed to add product");
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "admin/products/getAll",
  async () => {
    const response = await axios.get(
      "https://clothing-store-ta8c.onrender.com/api/admin/products/get",
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `https://clothing-store-ta8c.onrender.com/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `https://clothing-store-ta8c.onrender.com/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        console.error("Error fetching products:", action.error.message);
      });
  },
});

export default AdminProductsSlice.reducer;
