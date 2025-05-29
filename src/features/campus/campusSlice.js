import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import campusService from "./campusService";

export const addACampus = createAsyncThunk(
  "campus/add-campus",
  async (campusData, thunkAPI) => {
    try {
      return await campusService.addCampus(campusData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getACampus = createAsyncThunk(
  "campus/get-a-campus",
  async (campusCode, thunkAPI) => {
    try {
      return await campusService.getCampus(campusCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateACampus = createAsyncThunk(
  "campus/update-a-campus",
  async ({ campusCode, campusData }, thunkAPI) => {
    try {
      return await campusService.updateCampus(campusCode, campusData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteACampus = createAsyncThunk(
  "campus/delete-a-campus",
  async (campusCode, thunkAPI) => {
    try {
      return await campusService.deleteCampus(campusCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllCampuses = createAsyncThunk(
  "campus/get-all-campuses",
  async (thunkAPI) => {
    try {
      return await campusService.getCampuses();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetCampusState = createAction("Reset_all");

const initialState = {
  campuses: [],
  campus: null,
  addedCampus: null,
  updatedCampus: null,
  deletedCampus: null,
  error: { addACampus: false, getACampus: false,updateACampus: false, deleteACampus: false,getAllCampuses: false,},
  success: { addACampus: false, getACampus: false, updateACampus: false, deleteACampus: false,getAllCampuses: false,},
  loading: { addACampus: false, getACampus: false, updateACampus: false,deleteACampus: false,getAllCampuses: false,
  },
  message: "",
};

const campusSlice = createSlice({
  name: "campus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addACampus.pending, (state) => {
        state.loading.addACampus = true;
      })
      .addCase(addACampus.fulfilled, (state, action) => {
        state.loading.addACampus = false;
        state.success.addACampus = true;
        state.error.addACampus = false;
        state.addedCampus = action.payload;
        toast.success("Campus added successfully.");
      })
      .addCase(addACampus.rejected, (state, action) => {
        state.loading.addACampus = false;
        state.success.addACampus = false;
        state.error.addACampus = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getACampus.pending, (state) => {
        state.loading.getACampus = true;
      })
      .addCase(getACampus.fulfilled, (state, action) => {
        state.loading.getACampus = false;
        state.success.getACampus = true;
        state.error.getACampus = false;
        state.campus = action.payload;
      })
      .addCase(getACampus.rejected, (state, action) => {
        state.loading.getACampus = false;
        state.success.getACampus = false;
        state.error.getACampus = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(updateACampus.pending, (state) => {
        state.loading.updateACampus = true;
      })
      .addCase(updateACampus.fulfilled, (state, action) => {
        state.loading.updateACampus = false;
        state.success.updateACampus = true;
        state.error.updateACampus = false;
        state.updatedCampus = action.payload;
        toast.success("Campus updated successfully.");
      })
      .addCase(updateACampus.rejected, (state, action) => {
        state.loading.updateACampus = false;
        state.success.updateACampus = false;
        state.error.updateACampus = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(deleteACampus.pending, (state) => {
        state.loading.deleteACampus = true;
      })
      .addCase(deleteACampus.fulfilled, (state, action) => {
        state.loading.deleteACampus = false;
        state.success.deleteACampus = true;
        state.error.deleteACampus = false;
        state.deletedCampus = action.payload;
        toast.success("Campus deleted successfully.");
      })
      .addCase(deleteACampus.rejected, (state, action) => {
        state.loading.deleteACampus = false;
        state.success.deleteACampus = false;
        state.error.deleteACampus = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAllCampuses.pending, (state) => {
        state.loading.getAllCampuses = true;
      })
      .addCase(getAllCampuses.fulfilled, (state, action) => {
        state.loading.getAllCampuses = false;
        state.success.getAllCampuses = true;
        state.error.getAllCampuses = false;
        state.campuses = action?.payload?.content;
      })
      .addCase(getAllCampuses.rejected, (state, action) => {
        state.loading.getAllCampuses = false;
        state.success.getAllCampuses = false;
        state.error.getAllCampuses = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(resetCampusState, () => initialState);
  },
});

export default campusSlice.reducer;
