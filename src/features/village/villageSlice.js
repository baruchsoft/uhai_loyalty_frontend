import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import villageService from "./villageSerive";

export const addAVillage = createAsyncThunk(
  "village/add-a-village",
  async (villageData, thunkAPI) => {
    try {
      return await villageService.addVillage(villageData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllVillages = createAsyncThunk(
  "village/get-all-villages",
  async (thunkAPI) => {
    try {
      return await villageService.getVillages();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAVillage = createAsyncThunk(
  "village/get-a-village",
  async (villageCode, thunkAPI) => {
    try {
      return await villageService.getVillage(villageCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAVillage = createAsyncThunk(
  "village/update-a-village",
  async ({ villageCode, villageData }, thunkAPI) => {
    try {
      return await villageService.updateVillage(villageCode, villageData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAVillage = createAsyncThunk(
  "village/delete-a-village",
  async (villageCode, thunkAPI) => {
    try {
      return await villageService.deleteVillage(villageCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetVillageState = createAction("Reset_all");

const initialState = {
  villages: [],
  village: null,
  addedVillage: null,
  deletedVillage: null,
  updatedVillage: null,
  error: {addAVillage: false,getAVillage: false,getAllVillages: false,updateAVillage: false,deleteAVillage: false},
  loading: {addAVillage: false,getAVillage: false,getAllVillages: false,updateAVillage: false,deleteAVillage: false},
  success: {addAVillage: false,getAVillage: false,getAllVillages: false,updateAVillage: false,deleteAVillage: false},
  message: "",
};

const villageSlice = createSlice({
  name: "ward",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAVillage.pending, (state) => {
        state.loading.addAVillage = true;
      })
      .addCase(addAVillage.fulfilled, (state, action) => {
        state.loading.addAVillage = false;
        state.success.addAVillage = true;
        state.error.addAVillage = false;
        state.addedVillage = action?.payload;
        toast.success("Village added successfully.");
      })
      .addCase(addAVillage.rejected, (state, action) => {
        state.loading.addAVillage = false;
        state.success.addAVillage = false;
        state.error.addAVillage = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAllVillages.pending, (state) => {
        state.loading.getAllVillages = true;
      })
      .addCase(getAllVillages.fulfilled, (state, action) => {
        state.loading.getAllVillages = false;
        state.success.getAllVillages = true;
        state.error.getAllVillages = false;
        state.villages = action?.payload?.content;
      })
      .addCase(getAllVillages.rejected, (state, action) => {
        state.loading.getAllVillages = false;
        state.success.getAllVillages = false;
        state.error.getAllVillages = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAVillage.pending, (state) => {
        state.loading.getAVillage = true;
      })
      .addCase(getAVillage.fulfilled, (state, action) => {
        state.loading.getAVillage = false;
        state.success.getAVillage = true;
        state.error.getAVillage = false;
        state.village = action?.payload;
      })
      .addCase(getAVillage.rejected, (state, action) => {
        state.loading.getAVillage = false;
        state.success.getAVillage = false;
        state.error.getAVillage = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(updateAVillage.pending, (state) => {
        state.loading.updateAVillage = true;
      })
      .addCase(updateAVillage.fulfilled, (state, action) => {
        state.loading.updateAVillage = false;
        state.success.updateAVillage = true;
        state.error.updateAVillage = false;
        state.updatedVillage = action?.payload;
        toast.success("Ward updated successfully.");
      })
      .addCase(updateAVillage.rejected, (state, action) => {
        state.loading.updateAVillage = false;
        state.success.updateAVillage = false;
        state.error.updateAVillage = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(deleteAVillage.pending, (state) => {
        state.loading.deleteAVillage = true;
      })
      .addCase(deleteAVillage.fulfilled, (state, action) => {
        state.loading.deleteAVillage = false;
        state.success.deleteAVillage = true;
        state.error.deleteAVillage = false;
        state.updatedVillage = action?.payload;
        toast.success("Village deleted successfully.");
      })
      .addCase(deleteAVillage.rejected, (state, action) => {
        state.loading.deleteAVillage = false;
        state.success.deleteAVillage = false;
        state.error.deleteAVillage = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(resetVillageState, () => initialState);
  },
});

export default villageSlice.reducer;
