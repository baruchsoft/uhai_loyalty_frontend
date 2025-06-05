import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import signatoryService from "./signatoryService";

export const addSignatory = createAsyncThunk(
  "merchants",
  async (sigdata, thunkAPI) => {
    try {
      return await signatoryService.addSignatory(sigdata);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSignaories = createAsyncThunk(
  "merchants/get/all",
  async (thunkAPI) => {
    try {
      const sigsdata = await signatoryService.getSignaories();
      console.log("merhcandstadata", sigsdata);
      return sigsdata;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetSignatoryState = createAction("Reset_all");

const initialState = {
  signatories: [],
  signatory: null,
  addSignatory: null,
  error: {
    addSignatory: false,
    getSignaories: false,
  },
  loading: {
    addSignatory: false,
    getSignaories: false,
  },
  success: {
    addSignatory: false,
    getSignaories: false,
  },
  message: "",
};
export const signatorySlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSignaories.pending, (state) => {
        state.loading.getSignaories = true;
      })
      .addCase(getSignaories.fulfilled, (state, action) => {
        state.loading.getSignaories = false;
        state.error.getSignaories = false;
        state.success.getSignaories = true;
        state.merchants = action?.payload;
      })
      .addCase(getSignaories.rejected, (state, action) => {
        state.loading.getSignaories = false;
        state.error.getSignaories = true;
        state.success.getSignaories = false;
        state.message = action?.error;
      })
      .addCase(addSignatory.pending, (state) => {
        state.loading.addSignatory = true;
      })
      .addCase(addSignatory.fulfilled, (state, action) => {
        state.loading.addSignatory = false;
        state.error.addSignatory = false;
        state.success.addSignatory = true;
        state.addSignatory = action?.payload;
        toast.success("Signatory added successfully.");
      })
      .addCase(addSignatory.rejected, (state, action) => {
        state.loading.addSignatory = false;
        state.error.addSignatory = true;
        state.success.addSignatory = false;
        state.message = action?.error;
      })

      .addCase(resetSignatoryState, () => initialState);
  },
});

export default signatorySlice.reducer;
