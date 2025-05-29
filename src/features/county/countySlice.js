import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import countyService from "./countyService";
import toast from "react-hot-toast";

export const addACounty = createAsyncThunk(
  "county/add-a-county",
  async (countyData, thunkAPI) => {
    try {
      return await countyService.addCounty(countyData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllCounties = createAsyncThunk(
  "county/get-all-counties",
  async (thunkAPI) => {
    try {
      return await countyService.getCounties();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getACounty = createAsyncThunk(
  "county/get-a-county",
  async (countyCode, thunkAPI) => {
    try {
      return await countyService.getCounty(countyCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateACounty = createAsyncThunk(
  "county/update-a-county",
  async ({ countyCode, countyData }, thunkAPI) => {
    try {
      return await countyService.updateCounty(countyCode, countyData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteACounty = createAsyncThunk(
  "county/delete-a-county",
  async (countyCode, thunkAPI) => {
    try {
      return await countyService.deleteCounty(countyCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetCountyState = createAction("Reset_all");

const initialState = {
  counties: [],
  county: null,
  addedCounty: null,
  updatedCounty: null,
  deletedCounty: null,
  loading: {
    addACounty: false,
    getAllCounties: false,
    getACounty: false,
    updateACounty: false,
    deleteACounty: false,
  },
  success: {
    addACounty: false,
    getAllCounties: false,
    getACounty: false,
    updateACounty: false,
    deleteACounty: false,
  },
  error: {
    addACounty: false,
    getAllCounties: false,
    getACounty: false,
    updateACounty: false,
    deleteACounty: false,
  },
  message: "",
};

const countySlice = createSlice({
  name: "county",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addACounty.pending, (state) => {
        state.loading.addACounty = true;
      })
      .addCase(addACounty.fulfilled, (state, action) => {
        state.loading.addACounty = false;
        state.success.addACounty = true;
        state.error.addACounty = false;
        state.addedCounty = action?.payload;
        toast.success("County added successfully.");
      })
      .addCase(addACounty.rejected, (state, action) => {
        state.loading.addACounty = false;
        state.success.addACounty = false;
        state.error.addACounty = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(getAllCounties.pending, (state) => {
        state.loading.getAllCounties = true;
      })
      .addCase(getAllCounties.fulfilled, (state, action) => {
        state.loading.getAllCounties = false;
        state.success.getAllCounties = true;
        state.error.getAllCounties = false;
        state.counties = action?.payload?.content;
      })
      .addCase(getAllCounties.rejected, (state, action) => {
        state.loading.getAllCounties = false;
        state.success.getAllCounties = false;
        state.error.getAllCounties = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getACounty.pending, (state) => {
        state.loading.getACounty = true;
      })
      .addCase(getACounty.fulfilled, (state, action) => {
        state.loading.getACounty = false;
        state.success.getACounty = true;
        state.error.getACounty = false;
        state.county = action?.payload;
      })
      .addCase(getACounty.rejected, (state, action) => {
        state.loading.getACounty = false;
        state.success.getACounty = false;
        state.error.getACounty = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(updateACounty.pending, (state) => {
        state.loading.updateACounty = true;
      })
      .addCase(updateACounty.fulfilled, (state, action) => {
        state.loading.updateACounty = false;
        state.success.updateACounty = true;
        state.error.updateACounty = false;
        state.updatedCounty = action?.payload;
        toast.success("County updated successfully.");
      })
      .addCase(updateACounty.rejected, (state, action) => {
        state.loading.updateACounty = false;
        state.success.updateACounty = false;
        state.error.updateACounty = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(deleteACounty.pending, (state) => {
        state.loading.deleteACounty = true;
      })
      .addCase(deleteACounty.fulfilled, (state, action) => {
        state.loading.deleteACounty = false;
        state.success.deleteACounty = true;
        state.error.deleteACounty = false;
        state.deletedCounty = action?.payload;
        toast.success("County deleted successfully.");
      })
      .addCase(deleteACounty.rejected, (state, action) => {
        state.loading.deleteACounty = false;
        state.success.deleteACounty = false;
        state.error.deleteACounty = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(resetCountyState, () => initialState);
  },
});

export default countySlice.reducer;
