import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groupRepaymentService from "./groupRepaymentService";

export const addGroupRepayment = createAsyncThunk(
  "groupRepayment/addGroupRepayment",
  async (repaymentData, { rejectWithValue }) => {
    try {
      const response = await groupRepaymentService.addGroupRepayment(
        repaymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getGroupRepayments = createAsyncThunk(
  "groupRepayment/getGroupRepayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await groupRepaymentService.getGroupRepayments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const groupRepaymentSlice = createSlice({
  name: "groupRepayment",
  initialState: {
    groupRepayments: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    resetRepaymentState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addGroupRepayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addGroupRepayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Repayment added successfully.";
        state.groupRepayments.push(action.payload);
      })
      .addCase(addGroupRepayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGroupRepayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupRepayments.fulfilled, (state, action) => {
        state.loading = false;
        state.groupRepayments = action.payload;
      })
      .addCase(getGroupRepayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRepaymentState } = groupRepaymentSlice.actions;
export default groupRepaymentSlice.reducer;
