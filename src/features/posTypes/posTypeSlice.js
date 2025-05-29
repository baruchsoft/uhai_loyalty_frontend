import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import posTypeService from "./posTypeService";
import toast from "react-hot-toast";

export const addAPosType = createAsyncThunk(
  "pos-types/create-pos-type",
  async (posTypeData, thunkAPI) => {
    try {
      return await posTypeService.addPosType(posTypeData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPosTypes = createAsyncThunk(
  "pos-types/get-all-pos-type",
  async (thunkAPI) => {
    try {
      return await posTypeService.getPosTypes();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getAPosType = createAsyncThunk(
  "pos-types/get-a-pos-type",
  async (posTypeCode, thunkAPI) => {
    try {
      return await posTypeService.getPosType(posTypeCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAPosType = createAsyncThunk(
  "pos-types/update-a-pos-type",
  async ({ posTypeCode, posTypeData }, thunkAPI) => {
    try {
      return await posTypeService.updatePosType(posTypeCode, posTypeData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAPosType = createAsyncThunk(
  "pos-types/delete-a-pos-type",
  async (posTypeCode, thunkAPI) => {
    try {
      return await posTypeService.deletePosType(posTypeCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetPosTypeState = createAction("Reset_all");

const initialState = {
  posTypes: [],
  posType: null,
  updatedPosType: null,
  addedPosType: null,
  error: {addAPosType: false,getAllPosTypes: false,getAPosType: false,updateAPosType: false,deleteAPosType: false,},
  loading: {addAPosType: false,getAllPosTypes: false,getAPosType: false,updateAPosType: false,deleteAPosType: false},
  success: {addAPosType: false, getAllPosTypes: false, getAPosType: false, updateAPosType: false,deleteAPosType: false,},
  message: "",
};
export const posTypeSlice = createSlice({
  name: "posType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosTypes.pending, (state) => {
        state.loading.getAllPosTypes = true;
      })
      .addCase(getAllPosTypes.fulfilled, (state, action) => {
        state.loading.getAllPosTypes = false;
        state.error.getAllPosTypes = false;
        state.success.getAllPosTypes = true;
        state.posTypes = action?.payload?.content;
      })
      .addCase(getAllPosTypes.rejected, (state, action) => {
        state.loading.getAllPosTypes = false;
        state.error.getAllPosTypes = true;
        state.success.getAllPosTypes = false;
        state.message = action?.error;
      })
      .addCase(addAPosType.pending, (state) => {
        state.loading.addAPosType = true;
      })
      .addCase(addAPosType.fulfilled, (state, action) => {
        state.loading.addAPosType = false;
        state.error.addAPosType = false;
        state.success.addAPosType = true;
        state.addedPosType = action?.payload;
        toast.success("POS Type added successfully.");
      })
      .addCase(addAPosType.rejected, (state, action) => {
        state.loading.addAPosType = false;
        state.error.addAPosType = true;
        state.success.addAPosType = false;
        state.message = action?.error;
      })
      .addCase(getAPosType.pending, (state) => {
        state.loading.getAPosType = true;
      })
      .addCase(getAPosType.fulfilled, (state, action) => {
        state.loading.getAPosType = false;
        state.error.getAPosType = false;
        state.success.getAPosType = true;
        state.posType = action?.payload;
      })
      .addCase(getAPosType.rejected, (state, action) => {
        state.loading.getAPosType = false;
        state.error.getAPosType = true;
        state.success.getAPosType = false;
        state.message = action?.error;
      })
      .addCase(updateAPosType.pending, (state) => {
        state.loading.updateAPosType = true;
      })
      .addCase(updateAPosType.fulfilled, (state, action) => {
        state.loading.updateAPosType = false;
        state.error.updateAPosType = false;
        state.success.updateAPosType = true;
        state.updatedPosType = action?.payload;
        toast.success("POS Type updated successfully.");
      })
      .addCase(updateAPosType.rejected, (state, action) => {
        state.loading.updateAPosType = false;
        state.error.updateAPosType = true;
        state.success.updateAPosType = false;
        state.message = action?.error;
      })
      .addCase(deleteAPosType.pending, (state) => {
        state.loading.deleteAPosType = true;
      })
      .addCase(deleteAPosType.fulfilled, (state, action) => {
        state.loading.deleteAPosType = false;
        state.error.deleteAPosType = false;
        state.success.deleteAPosType = true;
        state.response = action?.payload;
        toast.success("POS Type deleted successfully.");
      })
      .addCase(deleteAPosType.rejected, (state, action) => {
        state.loading.deleteAPosType = false;
        state.error.deleteAPosType = true;
        state.success.deleteAPosType = false;
        state.message = action?.error;
      })
      .addCase(resetPosTypeState, () => initialState);
  },
});

export default posTypeSlice.reducer;
