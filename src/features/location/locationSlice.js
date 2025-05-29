import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import locationService from "./locationService";
import toast from "react-hot-toast";

export const addALocation = createAsyncThunk(
  "location/add-location",
  async (locationData, thunkAPI) => {
    try {
      return await locationService.addLocation(locationData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getALocation = createAsyncThunk(
  "location/get-a-location",
  async (locationCode, thunkAPI) => {
    try {
      return await locationService.getLocation(locationCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllLocations = createAsyncThunk(
  "location/get-all-locations",
  async (thunkAPI) => {
    try {
      return await locationService.getLocations();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateALocation = createAsyncThunk(
  "location/update-a-location",
  async ({ locationCode, locationData }, thunkAPI) => {
    try {
      return await locationService.updateLocation(locationCode, locationData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteALocation = createAsyncThunk(
  "location/delete-a-location",
  async (locationCode, thunkAPI) => {
    try {
      return await locationService.deleteLocation(locationCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetLocationState = createAction("Reset_all");

const initialState = {
  locations: [],
  location: null,
  addedLocation: null,
  updatedLocation: null,
  deletedLocation: null,
  error: {
    addALocation: false,
    getALocation: false,
    updateALocation: false,
    deleteALocation: false,
    getAllLocations: false,
  },
  success: {
    addALocation: false,
    getALocation: false,
    updateALocation: false,
    deleteALocation: false,
    getAllLocations: false,
  },
  loading: {
    addALocation: false,
    getALocation: false,
    updateALocation: false,
    deleteALocation: false,
    getAllLocations: false,
  },
  message: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addALocation.pending, (state) => {
        state.loading.addALocation = true;
      })
      .addCase(addALocation.fulfilled, (state, action) => {
        state.loading.addALocation = false;
        state.success.addALocation = true;
        state.error.addALocation = false;
        state.addedLocation = action.payload;
        toast.success("Location added successfully.");
      })
      .addCase(addALocation.rejected, (state, action) => {
        state.loading.addALocation = false;
        state.success.addALocation = false;
        state.error.addALocation = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getALocation.pending, (state) => {
        state.loading.getALocation = true;
      })
      .addCase(getALocation.fulfilled, (state, action) => {
        state.loading.getALocation = false;
        state.success.getALocation = true;
        state.error.getALocation = false;
        state.location = action.payload;
      })
      .addCase(getALocation.rejected, (state, action) => {
        state.loading.getALocation = false;
        state.success.getALocation = false;
        state.error.getALocation = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(updateALocation.pending, (state) => {
        state.loading.updateALocation = true;
      })
      .addCase(updateALocation.fulfilled, (state, action) => {
        state.loading.updateALocation = false;
        state.success.updateALocation = true;
        state.error.updateALocation = false;
        state.updatedLocation = action.payload;
        toast.success("Location updated successfully.");
      })
      .addCase(updateALocation.rejected, (state, action) => {
        state.loading.updateALocation = false;
        state.success.updateALocation = false;
        state.error.updateALocation = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(deleteALocation.pending, (state) => {
        state.loading.deleteALocation = true;
      })
      .addCase(deleteALocation.fulfilled, (state, action) => {
        state.loading.deleteALocation = false;
        state.success.deleteALocation = true;
        state.error.deleteALocation = false;
        state.deletedLocation = action.payload;
        toast.success("Location deleted successfully.");
      })
      .addCase(deleteALocation.rejected, (state, action) => {
        state.loading.deleteALocation = false;
        state.success.deleteALocation = false;
        state.error.deleteALocation = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAllLocations.pending, (state) => {
        state.loading.getAllLocations = true;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.loading.getAllLocations = false;
        state.success.getAllLocations = true;
        state.error.getAllLocations = false;
        state.locations = action?.payload?.content;
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.loading.getAllLocations = false;
        state.success.getAllLocations = false;
        state.error.getAllLocations = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(resetLocationState, () => initialState);
  },
});

export default locationSlice.reducer;
