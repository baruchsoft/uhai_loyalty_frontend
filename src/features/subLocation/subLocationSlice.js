import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import subLocationService from "./subLacationService";

export const addASubLocation = createAsyncThunk(
  "sublocation/add-a-sublocation",
  async (subLocationData, thunkAPI) => {
    try {
      return await subLocationService.addSubLocation(subLocationData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllSubLocations = createAsyncThunk(
  "sublocation/get-all-sublocations",
  async (thunkAPI) => {
    try {
      return await subLocationService.getSubLocations();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getASubLocation = createAsyncThunk(
  "sublocation/get-a-sublocation",
  async (subLocationCode, thunkAPI) => {
    try {
      return await subLocationService.getSubLocation(subLocationCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateASubLocation = createAsyncThunk(
  "sublocation/update-a-sublocation",
  async ({ subLocationCode, subLocationData }, thunkAPI) => {
    try {
      return await subLocationService.updateSubLocation(
        subLocationCode,
        subLocationData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteASubLocation = createAsyncThunk(
  "sublocation/delete-a-sublocation",
  async (subLocationCode, thunkAPI) => {
    try {
      return await subLocationService.deleteSubLocation(subLocationCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetSubLocationState = createAction("Reset_all");

const initialState = {
  subLocations: [],
  subLocation: null,
  addedSubLocation: null,
  deletedSubLocation: null,
  updatedSubLocation: null,
  error: {addASubLocation: false,getAllSubLocations: false,getASubLocation: false,updateASubLocation: false,deleteASubLocation: false,},
  loading: {addASubLocation: false,getAllSubLocations: false,getASubLocation: false,updateASubLocation: false,deleteASubLocation: false,},
  success: {addASubLocation: false,getAllSubLocations: false,getASubLocation: false,updateASubLocation: false,deleteASubLocation: false,},
  message: "",
};

const subLocationSlice = createSlice({
  name: "sublocation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addASubLocation.pending, (state) => {
        state.loading.addASubLocation = true;
      })
      .addCase(addASubLocation.fulfilled, (state, action) => {
        state.loading.addASubLocation = false;
        state.success.addASubLocation = true;
        state.error.addASubLocation = false;
        state.addedSubLocation = action?.payload;
        toast.success("Sub-location added successfully.");
      })
      .addCase(addASubLocation.rejected, (state, action) => {
        state.loading.addASubLocation = false;
        state.success.addASubLocation = false;
        state.error.addASubLocation = true;
        state.message = action?.payload?.header?.customerMessage;
        console.log(action?.payload,".................................")
        toast.error(action?.payload?.response?.data?.header?.customerMessage);
      })
      .addCase(getAllSubLocations.pending, (state) => {
        state.loading.getAllSubLocations = true;
      })
      .addCase(getAllSubLocations.fulfilled, (state, action) => {
        state.loading.getAllSubLocations = false;
        state.success.getAllSubLocations = true;
        state.error.getAllSubLocations = false;
        state.subLocations = action?.payload?.content;
      })
      .addCase(getAllSubLocations.rejected, (state, action) => {
        state.loading.getAllSubLocations = false;
        state.success.getAllSubLocations = false;
        state.error.getAllSubLocations = true;
        state.message = action?.payload?.response?.data?.message;
      })
      .addCase(getASubLocation.pending, (state) => {
        state.loading.getASubLocation = true;
      })
      .addCase(getASubLocation.fulfilled, (state, action) => {
        state.loading.getASubLocation = false;
        state.success.getASubLocation = true;
        state.error.getASubLocation = false;
        state.subLocation = action?.payload;
      })
      .addCase(getASubLocation.rejected, (state, action) => {
        state.loading.getASubLocation = false;
        state.success.getASubLocation = false;
        state.error.getASubLocation = true;
        state.message = action?.payload?.response?.data?.message;
      })
      .addCase(updateASubLocation.pending, (state) => {
        state.loading.updateASubLocation = true;
      })
      .addCase(updateASubLocation.fulfilled, (state, action) => {
        state.loading.updateASubLocation = false;
        state.success.updateASubLocation = true;
        state.error.updateASubLocation = false;
        state.updatedSubLocation = action?.payload;
        toast.success("Sub-location updated successfully.");
      })
      .addCase(updateASubLocation.rejected, (state, action) => {
        state.loading.updateASubLocation = false;
        state.success.updateASubLocation = false;
        state.error.updateASubLocation = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(deleteASubLocation.pending, (state) => {
        state.loading.deleteASubLocation = true;
      })
      .addCase(deleteASubLocation.fulfilled, (state, action) => {
        state.loading.deleteASubLocation = false;
        state.success.deleteASubLocation = true;
        state.error.deleteASubLocation = false;
        state.deletedSubLocation = action?.payload;
        toast.success("Sub-location deleted successfully.");
      })
      .addCase(deleteASubLocation.rejected, (state, action) => {
        state.loading.deleteASubLocation = false;
        state.success.deleteASubLocation = false;
        state.error.deleteASubLocation = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(resetSubLocationState, () => initialState);
  },
});

export default subLocationSlice.reducer;
