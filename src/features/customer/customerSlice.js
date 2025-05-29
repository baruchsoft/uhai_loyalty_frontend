import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import customerService from "./customerService";


export const registerACustomer = createAsyncThunk(
  "customer/cutomer-register",
  async(customerData, thunkAPI)=>{
    try {
      return await customerService.customerRegister(customerData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getAllCustomers = createAsyncThunk(
  "customer/get-all-customers",
  async (thunkAPI) => {
    try {
      return await customerService.getCustomers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const getACustomer =  createAsyncThunk(
  "customer/get-a-customer", 
  async(customerId, thunkAPI) =>{
    try {
      return await customerService.getCustomer(customerId)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateACustomer = createAsyncThunk("customer/update-a-customer", async( {customerId ,updateData},thunkAPI) =>{
  try {
    return await customerService.updateCustomer(updateData,customerId)
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const deleteACustomer = createAsyncThunk("customer/delete-a-customer", async(customerId,thunkAPI) =>{
  try {
    return await customerService.deleteCustomer(customerId)
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const resetCustomerState = createAction("Reset_all");

const initialState = {
  registerTokens: null,
  customers: [],
  loyalty: null,
  customer:null,
  updatedCustomer:null,
  error:   {getAllCustomers: false,getACustomer: false, registerACustomer:false, updateACustomer:false,deleteACustomer:false},
  loading: {getAllCustomers: false,getACustomer: false, registerACustomer:false, updateACustomer:false,deleteACustomer:false},
  success: {getAllCustomers: false,getACustomer: false,registerACustomer: false, updateACustomer:false,deleteACustomer:false},
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerACustomer.pending, (state) => {
        state.loading.registerACustomer = true;
      })
      .addCase(registerACustomer.fulfilled, (state, action) => {
        state.loading.registerACustomer = false;
        state.success.registerACustomer = true;
        state.error.registerACustomer = false;
        toast.success("Customer registered succefully.")
      })
      .addCase(registerACustomer.rejected, (state, action) => {
        state.loading.registerACustomer = false;
        state.success.registerACustomer = false;
        state.error.registerACustomer = true;
        toast.error(action?.payload?.response?.data?.header?.customerMessage)
      })
      .addCase(getAllCustomers.pending, (state) => {
        state.loading.getAllCustomers = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading.getAllCustomers = false;
        state.success.getAllCustomers = true;
        state.error.getAllCustomers = false;
        state.customers = action?.payload?.content;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading.getAllCustomers = false;
        state.success.getAllCustomers = false;
        state.error.getAllCustomers = true;
      })
      .addCase(getACustomer.pending, (state) => {
        state.loading.getACustomer = true;
      })
      .addCase(getACustomer.fulfilled, (state, action) => {
        state.loading.getACustomer = false;
        state.success.getACustomer = true;
        state.error.getACustomer = false;
        state.customer = action?.payload;
      })
      .addCase(getACustomer.rejected, (state, action) => {
        state.loading.getACustomer = false;
        state.success.getACustomer = false;
        state.error.getACustomer = true;
      })
       .addCase(updateACustomer.pending, (state) => {
        state.loading.updateACustomer = true;
      })
      .addCase(updateACustomer.fulfilled, (state, action) => {
        state.loading.updateACustomer = false;
        state.success.updateACustomer = true;
        state.error.updateACustomer = false;
        state.updatedCustomer = action?.payload;
        toast.success("Customer updated successfully.")
      })
      .addCase(updateACustomer.rejected, (state, action) => {
        state.loading.updateACustomer = false;
        state.success.updateACustomer = false;
        state.error.updateACustomer = true;
        toast.error(action.payload.message)
      })

      .addCase(deleteACustomer.pending, (state) => {
        state.loading.deleteACustomer = true;
      })
      .addCase(deleteACustomer.fulfilled, (state, action) => {
        state.loading.deleteACustomer = false;
        state.success.deleteACustomer = true;
        state.error.deleteACustomer = false;
        toast.success("Customer deleted successfully.")
      })
      .addCase(deleteACustomer.rejected, (state, action) => {
        state.loading.deleteACustomer = false;
        state.success.deleteACustomer = false;
        state.error.deleteACustomer = true;
        toast.error(action.payload.message)
      })
      .addCase(resetCustomerState,() => initialState);
  },
});

export default customerSlice.reducer;
