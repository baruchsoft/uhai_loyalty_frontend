import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loanService from "./loanService";

export const addALoan = createAsyncThunk(
  "loan/add",
  async (loanData, thunkAPI) => {
    try {
      return await loanService.addALoan(loanData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllLoans = createAsyncThunk(
  "loan/getAll",
  async (_, thunkAPI) => {
    try {
      return await loanService.getAllLoans();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getALoan = createAsyncThunk(
  "loan/getOne",
  async (loanId, thunkAPI) => {
    try {
      return await loanService.getALoan(loanId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateALoan = createAsyncThunk(
  "loan/update",
  async ({ loanId, loanData }, thunkAPI) => {
    try {
      return await loanService.updateALoan({ loanId, loanData });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteALoan = createAsyncThunk(
  "loan/delete",
  async (loanId, thunkAPI) => {
    try {
      return await loanService.deleteALoan(loanId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  loans: [],
  loan: null,
  loading: {
    addALoan: false,
    getAllLoans: false,
    getALoan: false,
    updateALoan: false,
    deleteALoan: false,
  },
  success: {
    addALoan: false,
    updateALoan: false,
    deleteALoan: false,
  },
  error: null,
};

export const loanSlice = createSlice({
  name: "loan",
  initialState,
  reducers: {
    resetLoanState: (state) => {
      state.loan = null;
      state.success = {
        addALoan: false,
        updateALoan: false,
        deleteALoan: false,
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Add loan
      .addCase(addALoan.pending, (state) => {
        state.loading.addALoan = true;
      })
      .addCase(addALoan.fulfilled, (state, action) => {
        state.loading.addALoan = false;
        state.success.addALoan = true;
        state.loans.push(action.payload);
      })
      .addCase(addALoan.rejected, (state, action) => {
        state.loading.addALoan = false;
        state.error = action.payload;
      })

      // Get all loans
      .addCase(getAllLoans.pending, (state) => {
        state.loading.getAllLoans = true;
      })
      .addCase(getAllLoans.fulfilled, (state, action) => {
        state.loading.getAllLoans = false;
        state.loans = action.payload;
      })
      .addCase(getAllLoans.rejected, (state, action) => {
        state.loading.getAllLoans = false;
        state.error = action.payload;
      })

      // Get a loan
      .addCase(getALoan.pending, (state) => {
        state.loading.getALoan = true;
      })
      .addCase(getALoan.fulfilled, (state, action) => {
        state.loading.getALoan = false;
        state.loan = action.payload;
      })
      .addCase(getALoan.rejected, (state, action) => {
        state.loading.getALoan = false;
        state.error = action.payload;
      })

      // Update loan
      .addCase(updateALoan.pending, (state) => {
        state.loading.updateALoan = true;
      })
      .addCase(updateALoan.fulfilled, (state, action) => {
        state.loading.updateALoan = false;
        state.success.updateALoan = true;
        const index = state.loans.findIndex(
          (loan) => loan.id === action.payload.id
        );
        if (index !== -1) state.loans[index] = action.payload;
      })
      .addCase(updateALoan.rejected, (state, action) => {
        state.loading.updateALoan = false;
        state.error = action.payload;
      })

      // Delete loan
      .addCase(deleteALoan.pending, (state) => {
        state.loading.deleteALoan = true;
      })
      .addCase(deleteALoan.fulfilled, (state, action) => {
        state.loading.deleteALoan = false;
        state.success.deleteALoan = true;
        state.loans = state.loans.filter((loan) => loan.id !== action.meta.arg);
      })
      .addCase(deleteALoan.rejected, (state, action) => {
        state.loading.deleteALoan = false;
        state.error = action.payload;
      });
  },
});

export const { resetLoanState } = loanSlice.actions;
export default loanSlice.reducer;
