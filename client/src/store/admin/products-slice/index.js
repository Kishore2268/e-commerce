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
      console.log("Adding product with data:", formData);

      const submitData = {
        ...formData,
        image: typeof formData.image === 'string' ? formData.image : null
      };

      console.log("Transformed data for submission:", submitData);

      const response = await axios.post(
        "https://clothing-store-ta8c.onrender.com/api/admin/products/add",
        submitData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
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
