import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import grouploanService from "./grouploanService";

export const addGroupLoan = createAsyncThunk(
  "group-loans",
  async (loanproductData, thunkAPI) => {
    try {
      return await grouploanService.addGroupLoan(loanproductData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateGroupLoan = createAsyncThunk(
  "group-loans/update",
  async (loanproductData, thunkAPI) => {
    try {
      return await grouploanService.updateGroupLoan(loanproductData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getGroupLoans = createAsyncThunk(
  "group-loans/get/all",
  async (thunkAPI) => {
    try {
      const merhcandstadata = await grouploanService.getGroupLoans();
      return merhcandstadata;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetgrouploan = createAction("Reset_all");

const initialState = {
  grouploans: [],
  grouploan: null,
  updateGroupLoan: null,
  addGroupLoan: null,
  error: {
    addGroupLoan: false,
    getGroupLoans: false,
    updateGroupLoan: false,
  },
  loading: {
    addGroupLoan: false,
    getGroupLoans: false,
    updateGroupLoan: false,
  },
  success: {
    addGroupLoan: false,
    getGroupLoans: false,
    updateGroupLoan: false,
  },
  message: "",
};

export const grouploanslice = createSlice({
  name: "grouploan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGroupLoans.pending, (state) => {
        state.loading.getGroupLoans = true;
      })
      .addCase(getGroupLoans.fulfilled, (state, action) => {
        state.loading.getGroupLoans = false;
        state.error.getGroupLoans = false;
        state.success.getGroupLoans = true;
        state.grouploans = action?.payload;
      })
      .addCase(getGroupLoans.rejected, (state, action) => {
        state.loading.getGroupLoans = false;
        state.error.getGroupLoans = true;
        state.success.getGroupLoans = false;
        state.message = action?.error;
      })
      .addCase(updateGroupLoan.pending, (state) => {
        state.loading.updateGroupLoan = true;
      })
      .addCase(updateGroupLoan.fulfilled, (state, action) => {
        state.loading.updateGroupLoan = false;
        state.success.updateGroupLoan = true;
        state.error.updateGroupLoan = false;
        state.updateGroupLoan = action?.payload;
        toast.success("loanproduct updated successfully.");
      })
      .addCase(updateGroupLoan.rejected, (state, action) => {
        state.loading.updateGroupLoan = false;
        state.success.updateGroupLoan = false;
        state.error.updateGroupLoan = true;
        state.message = action?.error;
      })
      .addCase(addGroupLoan.pending, (state) => {
        state.loading.addGroupLoan = true;
      })
      .addCase(addGroupLoan.fulfilled, (state, action) => {
        state.loading.addGroupLoan = false;
        state.error.addGroupLoan = false;
        state.success.addGroupLoan = true;
        state.addGroupLoan = action?.payload;
        toast.success("loanproduct added successfully.");
      })
      .addCase(addGroupLoan.rejected, (state, action) => {
        state.loading.addGroupLoan = false;
        state.error.addGroupLoan = true;
        state.success.addGroupLoan = false;
        state.message = action?.error;
      })
      .addCase(resetgrouploan, () => initialState);
  },
});

export default grouploanslice.reducer;
