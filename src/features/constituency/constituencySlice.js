import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import constituencyService from "./constituencyService";
import toast from "react-hot-toast";

export const addAConstituency = createAsyncThunk(
  "constituency/add-a-constituency",
  async (constituencyData, thunkAPI) => {
    try {
      return await constituencyService.addConstituency(constituencyData);
    } catch (error) {
    return  thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllConstituencies = createAsyncThunk(
  "constituency/get-all-constituencies",
  async (thunkAPI) => {
    try {
      return await constituencyService.getConstituencies();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAConstituency = createAsyncThunk(
  "constituency/get-a-constituency",
  async (constituencyCode, thunkAPI) => {
    try {
      return await constituencyService.getConstituency(constituencyCode);
    } catch (error) {
     return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAConstituency = createAsyncThunk(
  "constituency/update-a-constituency",
  async ({ constituencyCode, constituencyData }, thunkAPI) => {
    try {
      return await constituencyService.updateConstituency(
        constituencyCode,
        constituencyData
      );
    } catch (error) {
     return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAConstituency = createAsyncThunk(
  "constituency/delete-a-constituency",
  async (constituencyCode, thunkAPI) => {
    try {
      return await constituencyService.deleteConstituency(constituencyCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetConstituencyState = createAction("Reset_all");

const initialState = {
  constituencies: [],
  constituency: null,
  addedConstituency: null,
  updatedConstituency: null,
  deletedConstituency: null,
  error: {
    addAConstituency: false,
    getAConstituency: false,
    getAllConstituencies: false,
    updateAConstituency: false,
    deleteAConstituency: false,
  },
  success: {
    addAConstituency: false,
    getAConstituency: false,
    getAllConstituencies: false,
    updateAConstituency: false,
    deleteAConstituency: false,
  },
  loading: {
    addAConstituency: false,
    getAConstituency: false,
    getAllConstituencies: false,
    updateAConstituency: false,
    deleteAConstituency: false,
  },
  message: "",
};

const constituencySlice = createSlice({
  name: "constituency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAConstituency.pending, (state) => {
        state.loading.addAConstituency = true;
      })
      .addCase(addAConstituency.fulfilled, (state, action) => {
        state.loading.addAConstituency = false;
        state.success.addAConstituency = true;
        state.error.addAConstituency = false;
        state.addedConstituency = action?.payload;
        toast.success("Constituency added successfully.");
      })
      .addCase(addAConstituency.rejected, (state, action) => {
        state.loading.addAConstituency = false;
        state.success.addAConstituency = false;
        state.error.addAConstituency = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAConstituency.pending, (state) => {
        state.loading.getAConstituency = true;
      })
      .addCase(getAConstituency.fulfilled, (state, action) => {
        state.loading.getAConstituency = false;
        state.success.getAConstituency = true;
        state.error.getAConstituency = false;
        state.constituency = action?.payload;
      })
      .addCase(getAConstituency.rejected, (state, action) => {
        state.loading.getAConstituency = false;
        state.success.getAConstituency = false;
        state.error.getAConstituency = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAllConstituencies.pending, (state) => {
        state.loading.getAllConstituencies = true;
      })
      .addCase(getAllConstituencies.fulfilled, (state, action) => {
        state.loading.getAllConstituencies = false;
        state.success.getAllConstituencies = true;
        state.error.getAllConstituencies = false;
        state.constituencies = action?.payload?.content;
      })
      .addCase(getAllConstituencies.rejected, (state, action) => {
        state.loading.getAllConstituencies = false;
        state.success.getAllConstituencies = false;
        state.error.getAllConstituencies = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(updateAConstituency.pending, (state) => {
        state.loading.updateAConstituency = true;
      })
      .addCase(updateAConstituency.fulfilled, (state, action) => {
        state.loading.updateAConstituency = false;
        state.success.updateAConstituency = true;
        state.error.updateAConstituency = false;
        state.updatedConstituency = action?.payload;
        toast.success("Constituency updated successfully.");
      })
      .addCase(updateAConstituency.rejected, (state, action) => {
        state.loading.updateAConstituency = false;
        state.success.updateAConstituency = false;
        state.error.updateAConstituency = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(deleteAConstituency.pending, (state) => {
        state.loading.deleteAConstituency = true;
      })
      .addCase(deleteAConstituency.fulfilled, (state, action) => {
        state.loading.deleteAConstituency = false;
        state.success.deleteAConstituency = true;
        state.error.deleteAConstituency = false;
        state.deletedConstituency = action?.payload;
        toast.success("Constituency deleted successfully.");
      })
      .addCase(deleteAConstituency.rejected, (state, action) => {
        state.loading.deleteAConstituency = false;
        state.success.deleteAConstituency = false;
        state.error.deleteAConstituency = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(resetConstituencyState, () => initialState);
  },
});

export default constituencySlice.reducer;
