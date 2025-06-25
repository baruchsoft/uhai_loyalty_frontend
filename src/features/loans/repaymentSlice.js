import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import repaymentService from "./repaymentService";

export const addRepayment = createAsyncThunk(
  "repayment/add",
  async (data, thunkAPI) => {
    try {
      return await repaymentService.addRepayment(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllRepayments = createAsyncThunk(
  "repayment/getAll",
  async (_, thunkAPI) => {
    try {
      return await repaymentService.getAllRepayments();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const repaymentSlice = createSlice({
  name: "repayment",
  initialState: {
    repayments: [],
    loading: false,
    error: null,
    success: {
      addRepayment: false,
    },
  },
  reducers: {
    resetRepaymentState: (state) => {
      state.success.addRepayment = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRepayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRepayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success.addRepayment = true;
        state.repayments.push(action.payload);
      })
      .addCase(addRepayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllRepayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRepayments.fulfilled, (state, action) => {
        state.loading = false;
        state.repayments = action.payload;
      })
      .addCase(getAllRepayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRepaymentState } = repaymentSlice.actions;
export default repaymentSlice.reducer;
