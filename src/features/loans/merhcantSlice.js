import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import merchantService from "./merchantService";

export const addMechant = createAsyncThunk(
  "merchants",
  async (merchantData, thunkAPI) => {
    try {
      return await merchantService.addMerchant(merchantData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateMechant = createAsyncThunk(
  "merchants/update",
  async (merchantData, thunkAPI) => {
    try {
      return await merchantService.updateMerchant(merchantData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllMechants = createAsyncThunk(
  "merchants/get/all",
  async (thunkAPI) => {
    try {
      const merhcandstadata = await merchantService.getMerchants();
      console.log("merhcandstadata", merhcandstadata);
      return merhcandstadata;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetMerchantState = createAction("Reset_all");

const initialState = {
  merchants: [],
  merchant: null,
  updateMechant: null,
  addMechant: null,
  error: {
    addMechant: false,
    getAllMechants: false,
    updateMechant: false,
  },
  loading: {
    addMechant: false,
    getAllMechants: false,
    updateMechant: false,
  },
  success: {
    addMechant: false,
    getAllMechants: false,
    updateMechant: false,
  },
  message: "",
};
export const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMechants.pending, (state) => {
        state.loading.getAllMechants = true;
      })
      .addCase(getAllMechants.fulfilled, (state, action) => {
        state.loading.getAllMechants = false;
        state.error.getAllMechants = false;
        state.success.getAllMechants = true;
        state.merchants = action?.payload;
      })
      .addCase(getAllMechants.rejected, (state, action) => {
        state.loading.getAllMechants = false;
        state.error.getAllMechants = true;
        state.success.getAllMechants = false;
        state.message = action?.error;
      })
      .addCase(updateMechant.pending, (state) => {
        state.loading.updateMechant = true;
      })
      .addCase(updateMechant.fulfilled, (state, action) => {
        state.loading.updateMechant = false;
        state.success.updateMechant = true;
        state.error.updateMechant = false;
        state.updateMechant = action?.payload;
        toast.success("Merchant updated successfully.");
      })
      .addCase(updateMechant.rejected, (state, action) => {
        state.loading.updateMechant = false;
        state.success.updateMechant = false;
        state.error.updateMechant = true;
        state.message = action?.error;
      })
      .addCase(addMechant.pending, (state) => {
        state.loading.addMechant = true;
      })
      .addCase(addMechant.fulfilled, (state, action) => {
        state.loading.addMechant = false;
        state.error.addMechant = false;
        state.success.addMechant = true;
        state.addMechant = action?.payload;
        toast.success("Merchant added successfully.");
      })
      .addCase(addMechant.rejected, (state, action) => {
        state.loading.addMechant = false;
        state.error.addMechant = true;
        state.success.addMechant = false;
        state.message = action?.error;
      })
      .addCase(resetMerchantState, () => initialState);
  },
});

export default merchantSlice.reducer;
