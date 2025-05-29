import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import universityService from "./universityService";

export const addAUniversity = createAsyncThunk(
  "university/add-university",
  async (universityData, thunkAPI) => {
    try {
      return await universityService.addUniversity(universityData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAUniversity = createAsyncThunk(
  "university/get-a-university",
  async (universityCode, thunkAPI) => {
    try {
      return await universityService.getUniversity(universityCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAUniversity = createAsyncThunk(
  "university/update-a-university",
  async ({ universityCode, universityData }, thunkAPI) => {
    try {
      return await universityService.updateUniversity(
        universityCode,
        universityData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAUniversity = createAsyncThunk(
  "university/delete-a-university",
  async (universityCode, thunkAPI) => {
    try {
      return await universityService.deleteUniversity(universityCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllUniversities = createAsyncThunk(
  "university/get-all-universities",
  async (thunkAPI) => {
    try {
      return await universityService.getUniversities();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetUniversityState = createAction("Reset_all");

const initialState = {
  universities: [],
  university: null,
  addedUniversity: null,
  updatedUniversity: null,
  deletedUniversity: null,
  error: {addAUniversity: false,getAUniversity: false,updateAUniversity: false,deleteAUniversity: false,getAllUniversities: false,},
  success: {addAUniversity: false,getAUniversity: false,updateAUniversity: false,deleteAUniversity: false,getAllUniversities: false,},
  loading: {addAUniversity: false,getAUniversity: false,updateAUniversity: false,deleteAUniversity: false,getAllUniversities: false,},
  message: "",
};

const universitySlice = createSlice({
  name: "university",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAUniversity.pending, (state) => {
        state.loading.addAUniversity = true;
      })
      .addCase(addAUniversity.fulfilled, (state, action) => {
        state.loading.addAUniversity = false;
        state.success.addAUniversity = true;
        state.error.addAUniversity = false;
        state.addedUniversity = action.payload;
        toast.success("University added successfully.");
      })
      .addCase(addAUniversity.rejected, (state, action) => {
        state.loading.addAUniversity = false;
        state.success.addAUniversity = false;
        state.error.addAUniversity = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(getAUniversity.pending, (state) => {
        state.loading.getAUniversity = true;
      })
      .addCase(getAUniversity.fulfilled, (state, action) => {
        state.loading.getAUniversity = false;
        state.success.getAUniversity = true;
        state.error.getAUniversity = false;
        state.university = action.payload;
      })
      .addCase(getAUniversity.rejected, (state, action) => {
        state.loading.getAUniversity = false;
        state.success.getAUniversity = false;
        state.error.getAUniversity = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(updateAUniversity.pending, (state) => {
        state.loading.updateAUniversity = true;
      })
      .addCase(updateAUniversity.fulfilled, (state, action) => {
        state.loading.updateAUniversity = false;
        state.success.updateAUniversity = true;
        state.error.updateAUniversity = false;
        state.updatedUniversity = action.payload;
        toast.success("University updated successfully.");
      })
      .addCase(updateAUniversity.rejected, (state, action) => {
        state.loading.updateAUniversity = false;
        state.success.updateAUniversity = false;
        state.error.updateAUniversity = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(deleteAUniversity.pending, (state) => {
        state.loading.deleteAUniversity = true;
      })
      .addCase(deleteAUniversity.fulfilled, (state, action) => {
        state.loading.deleteAUniversity = false;
        state.success.deleteAUniversity = true;
        state.error.deleteAUniversity = false;
        state.deletedUniversity = action.payload;
        toast.success("University deleted successfully.");
      })
      .addCase(deleteAUniversity.rejected, (state, action) => {
        state.loading.deleteAUniversity = false;
        state.success.deleteAUniversity = false;
        state.error.deleteAUniversity = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(getAllUniversities.pending, (state) => {
        state.loading.getAllUniversities = true;
      })
      .addCase(getAllUniversities.fulfilled, (state, action) => {
        state.loading.getAllUniversities = false;
        state.success.getAllUniversities = true;
        state.error.getAllUniversities = false;
        state.universities = action.payload.content;
      })
      .addCase(getAllUniversities.rejected, (state, action) => {
        state.loading.getAllUniversities = false;
        state.success.getAllUniversities = false;
        state.error.getAllUniversities = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(resetUniversityState, () => initialState);
  },
});

export default universitySlice.reducer;
