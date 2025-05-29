import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import customerService from "./customerService";

export const addACustomer = createAsyncThunk(
  "customer/add",
  async (data, thunkAPI) => {
    try {
      return await customerService.addCustomer(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllCustomers = createAsyncThunk(
  "customer/get-all",
  async ({ page = 0, size = 10 }, thunkAPI) => {
    try {
      return await customerService.getCustomers(page, size);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getACustomer = createAsyncThunk(
  "customer/get",
  async (customerId, thunkAPI) => {
    try {
      return await customerService.getCustomer(customerId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateACustomer = createAsyncThunk(
  "customer/update",
  async ({ customerId, data }, thunkAPI) => {
    try {
      return await customerService.updateCustomer(customerId, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteACustomer = createAsyncThunk(
  "customer/delete",
  async (customerId, thunkAPI) => {
    try {
      return await customerService.deleteCustomer(customerId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetCustomerState = createAction("Reset_all");

const initialState = {
  customers: [],
  customer: null,
  addedCustomer: null,
  updatedCustomer: null,
  response: null,
  error: {
    addACustomer: false,
    getAllCustomers: false,
    getACustomer: false,
    updateACustomer: false,
    deleteACustomer: false,
  },
  loading: {
    addACustomer: false,
    getAllCustomers: false,
    getACustomer: false,
    updateACustomer: false,
    deleteACustomer: false,
  },
  success: {
    addACustomer: false,
    getAllCustomers: false,
    getACustomer: false,
    updateACustomer: false,
    deleteACustomer: false,
  },
  message: "",
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addACustomer.pending, (state) => {
        state.loading.addACustomer = true;
      })
      .addCase(addACustomer.fulfilled, (state, action) => {
        state.loading.addACustomer = false;
        state.success.addACustomer = true;
        state.error.addACustomer = false;
        state.addedCustomer = action.payload;
        toast.success("Customer added successfully.");
      })
      .addCase(addACustomer.rejected, (state, action) => {
        state.loading.addACustomer = false;
        state.success.addACustomer = false;
        state.error.addACustomer = true;
        state.message = action.error;
      })

      .addCase(getAllCustomers.pending, (state) => {
        state.loading.getAllCustomers = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading.getAllCustomers = false;
        state.success.getAllCustomers = true;
        state.error.getAllCustomers = false;
        state.customers = action.payload?.content || [];
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading.getAllCustomers = false;
        state.success.getAllCustomers = false;
        state.error.getAllCustomers = true;
        state.message = action.error;
      })

      .addCase(getACustomer.pending, (state) => {
        state.loading.getACustomer = true;
      })
      .addCase(getACustomer.fulfilled, (state, action) => {
        state.loading.getACustomer = false;
        state.success.getACustomer = true;
        state.error.getACustomer = false;
        state.customer = action.payload;
      })
      .addCase(getACustomer.rejected, (state, action) => {
        state.loading.getACustomer = false;
        state.success.getACustomer = false;
        state.error.getACustomer = true;
        state.message = action.error;
      })

      .addCase(updateACustomer.pending, (state) => {
        state.loading.updateACustomer = true;
      })
      .addCase(updateACustomer.fulfilled, (state, action) => {
        state.loading.updateACustomer = false;
        state.success.updateACustomer = true;
        state.error.updateACustomer = false;
        state.updatedCustomer = action.payload;
        toast.success("Customer updated successfully.");
      })
      .addCase(updateACustomer.rejected, (state, action) => {
        state.loading.updateACustomer = false;
        state.success.updateACustomer = false;
        state.error.updateACustomer = true;
        state.message = action.error;
      })

      .addCase(deleteACustomer.pending, (state) => {
        state.loading.deleteACustomer = true;
      })
      .addCase(deleteACustomer.fulfilled, (state, action) => {
        state.loading.deleteACustomer = false;
        state.success.deleteACustomer = true;
        state.error.deleteACustomer = false;
        state.response = action.payload;
        toast.success("Customer deleted successfully.");
      })
      .addCase(deleteACustomer.rejected, (state, action) => {
        state.loading.deleteACustomer = false;
        state.success.deleteACustomer = false;
        state.error.deleteACustomer = true;
        state.message = action.error;
      })

      .addCase(resetCustomerState, () => initialState);
  },
});

export default customerSlice.reducer;
