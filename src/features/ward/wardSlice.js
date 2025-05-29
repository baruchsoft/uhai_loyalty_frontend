import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import wardService from "./wardService";

export const addAWard = createAsyncThunk(
  "ward/add-a-ward",
  async (wardData, thunkAPI) => {
    try {
      return await wardService.addWard(wardData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllWards = createAsyncThunk(
  "ward/get-all-wards",
  async (thunkAPI) => {
    try {
      return await wardService.getWards();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAWard = createAsyncThunk(
  "ward/get-a-ward",
  async (wardCode, thunkAPI) => {
    try {
      return await wardService.getWard(wardCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAWard = createAsyncThunk(
  "ward/update-a-ward",
  async ({ wardCode, wardData }, thunkAPI) => {
    try {
      return await wardService.updateWard(wardCode, wardData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAWard = createAsyncThunk(
  "ward/delete-a-ward",
  async (wardCode, thunkAPI) => {
    try {
      return await wardService.deleteWard(wardCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetWardState = createAction("Reset_all");

const initialState = {
  wards: [],
  ward: null,
  addedWard: null,
  deletedWard: null,
  updatedWard: null,
  error: {addAWard: false,getAllWards: false,getAWard: false,updateAWard: false,deleteAWard: false,},
  loading: {addAWard: false,getAllWards: false,getAWard: false,updateAWard: false,deleteAWard: false,},
  success: {addAWard: false,getAllWards: false,getAWard: false,updateAWard: false,deleteAWard: false,},
  message: "",
};

const wardSlice = createSlice({
  name: "ward",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAWard.pending, (state) => {
        state.loading.addAWard = true;
      })
      .addCase(addAWard.fulfilled, (state, action) => {
        state.loading.addAWard = false;
        state.success.addAWard = true;
        state.error.addAWard = false;
        state.addedWard = action?.payload;
        toast.success("Ward added successfully.");
      })
      .addCase(addAWard.rejected, (state, action) => {
        state.loading.addAWard = false;
        state.success.addAWard = false;
        state.error.addAWard = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAllWards.pending, (state) => {
        state.loading.getAllWards = true;
      })
      .addCase(getAllWards.fulfilled, (state, action) => {
        state.loading.getAllWards = false;
        state.success.getAllWards = true;
        state.error.getAllWards = false;
        state.wards = action?.payload?.content;
      })
      .addCase(getAllWards.rejected, (state, action) => {
        state.loading.getAllWards = false;
        state.success.getAllWards = false;
        state.error.getAllWards = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAWard.pending, (state) => {
        state.loading.getAWard = true;
      })
      .addCase(getAWard.fulfilled, (state, action) => {
        state.loading.getAWard = false;
        state.success.getAWard = true;
        state.error.getAWard = false;
        state.ward = action?.payload;
      })
      .addCase(getAWard.rejected, (state, action) => {
        state.loading.getAWard = false;
        state.success.getAWard = false;
        state.error.getAWard = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(updateAWard.pending, (state) => {
        state.loading.updateAWard = true;
      })
      .addCase(updateAWard.fulfilled, (state, action) => {
        state.loading.updateAWard = false;
        state.success.updateAWard = true;
        state.error.updateAWard = false;
        state.updatedWard = action?.payload;
        toast.success("Ward updated successfully.");
      })
      .addCase(updateAWard.rejected, (state, action) => {
        state.loading.updateAWard = false;
        state.success.updateAWard = false;
        state.error.updateAWard = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(deleteAWard.pending, (state) => {
        state.loading.deleteAWard = true;
      })
      .addCase(deleteAWard.fulfilled, (state, action) => {
        state.loading.deleteAWard = false;
        state.success.deleteAWard = true;
        state.error.deleteAWard = false;
        state.deletedWard = action?.payload;
        toast.success("Ward deleted successfully.");
      })
      .addCase(deleteAWard.rejected, (state, action) => {
        state.loading.deleteAWard = false;
        state.success.deleteAWard = false;
        state.error.deleteAWard = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(resetWardState, () => initialState);
  },
});

export default wardSlice.reducer;
