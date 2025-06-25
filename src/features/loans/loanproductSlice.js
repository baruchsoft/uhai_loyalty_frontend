import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import loanproductService from "./loanproductService";

export const addLoanProduct = createAsyncThunk(
  "loan-products",
  async (loanproductData, thunkAPI) => {
    try {
      return await loanproductService.addLoanProduct(loanproductData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateLoanProduct = createAsyncThunk(
  "loan-products/update",
  async (loanproductData, thunkAPI) => {
    try {
      return await loanproductService.updateLoanProduct(loanproductData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getLoanProducts = createAsyncThunk(
  "loan-products/get/all",
  async (thunkAPI) => {
    try {
      const merhcandstadata = await loanproductService.getLoanProducts();
      console.log("merhcandstadata", merhcandstadata);
      return merhcandstadata;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetloanProduct = createAction("Reset_all");

const initialState = {
  loanproducts: [],
  loanproduct: null,
  updateLoanProduct: null,
  addLoanProduct: null,
  error: {
    addLoanProduct: false,
    getLoanProducts: false,
    updateLoanProduct: false,
  },
  loading: {
    addLoanProduct: false,
    getLoanProducts: false,
    updateLoanProduct: false,
  },
  success: {
    addLoanProduct: false,
    getLoanProducts: false,
    updateLoanProduct: false,
  },
  message: "",
};
export const loanproductSlice = createSlice({
  name: "loanproduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLoanProducts.pending, (state) => {
        state.loading.getLoanProducts = true;
      })
      .addCase(getLoanProducts.fulfilled, (state, action) => {
        state.loading.getLoanProducts = false;
        state.error.getLoanProducts = false;
        state.success.getLoanProducts = true;
        state.loanproducts = action?.payload;
      })
      .addCase(getLoanProducts.rejected, (state, action) => {
        state.loading.getLoanProducts = false;
        state.error.getLoanProducts = true;
        state.success.getLoanProducts = false;
        state.message = action?.error;
      })
      .addCase(updateLoanProduct.pending, (state) => {
        state.loading.updateLoanProduct = true;
      })
      .addCase(updateLoanProduct.fulfilled, (state, action) => {
        state.loading.updateLoanProduct = false;
        state.success.updateLoanProduct = true;
        state.error.updateLoanProduct = false;
        state.updateLoanProduct = action?.payload;
        toast.success("loanproduct updated successfully.");
      })
      .addCase(updateLoanProduct.rejected, (state, action) => {
        state.loading.updateLoanProduct = false;
        state.success.updateLoanProduct = false;
        state.error.updateLoanProduct = true;
        state.message = action?.error;
      })
      .addCase(addLoanProduct.pending, (state) => {
        state.loading.addLoanProduct = true;
      })
      .addCase(addLoanProduct.fulfilled, (state, action) => {
        state.loading.addLoanProduct = false;
        state.error.addLoanProduct = false;
        state.success.addLoanProduct = true;
        state.addLoanProduct = action?.payload;
        toast.success("loanproduct added successfully.");
      })
      .addCase(addLoanProduct.rejected, (state, action) => {
        state.loading.addLoanProduct = false;
        state.error.addLoanProduct = true;
        state.success.addLoanProduct = false;
        state.message = action?.error;
      })
      .addCase(resetloanProduct, () => initialState);
  },
});

export default loanproductSlice.reducer;
