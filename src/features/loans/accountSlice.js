import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "./accountService";

export const getAllAccounts = createAsyncThunk(
  "account/getAll",
  async (_, thunkAPI) => {
    try {
      return await accountService.getAllAccounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAccount = createAsyncThunk(
  "account/getOne",
  async (accountId, thunkAPI) => {
    try {
      return await accountService.getAccount(accountId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addAccount = createAsyncThunk(
  "account/add",
  async (accountData, thunkAPI) => {
    try {
      return await accountService.addAccount(accountData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAccount = createAsyncThunk(
  "account/update",
  async ({ accountId, accountData }, thunkAPI) => {
    try {
      return await accountService.updateAccount(accountId, accountData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "account/delete",
  async (accountId, thunkAPI) => {
    try {
      return await accountService.deleteAccount(accountId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  accounts: [],
  selectedAccount: null,
  loading: {
    getAllAccounts: false,
    getAccount: false,
    addAccount: false,
    updateAccount: false,
    deleteAccount: false,
  },
  success: {
    addAccount: false,
    updateAccount: false,
    deleteAccount: false,
  },
  error: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    resetAccountState: (state) => {
      state.success = {
        addAccount: false,
        updateAccount: false,
        deleteAccount: false,
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAccounts.pending, (state) => {
        state.loading.getAllAccounts = true;
      })
      .addCase(getAllAccounts.fulfilled, (state, action) => {
        state.loading.getAllAccounts = false;
        state.accounts = action.payload;
      })
      .addCase(getAllAccounts.rejected, (state, action) => {
        state.loading.getAllAccounts = false;
        state.error = action.payload;
      })
      .addCase(getAccount.pending, (state) => {
        state.loading.getAccount = true;
      })
      .addCase(getAccount.fulfilled, (state, action) => {
        state.loading.getAccount = false;
        state.selectedAccount = action.payload;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.loading.getAccount = false;
        state.error = action.payload;
      })

      .addCase(addAccount.pending, (state) => {
        state.loading.addAccount = true;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.loading.addAccount = false;
        state.success.addAccount = true;
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.loading.addAccount = false;
        state.error = action.payload;
      })

      .addCase(updateAccount.pending, (state) => {
        state.loading.updateAccount = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading.updateAccount = false;
        state.success.updateAccount = true;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading.updateAccount = false;
        state.error = action.payload;
      })

      .addCase(deleteAccount.pending, (state) => {
        state.loading.deleteAccount = true;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading.deleteAccount = false;
        state.success.deleteAccount = true;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading.deleteAccount = false;
        state.error = action.payload;
      });
  },
});

export const { resetAccountState } = accountSlice.actions;
export default accountSlice.reducer;
