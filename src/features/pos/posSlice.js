import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import posService from "./posService";

export const addAPos = createAsyncThunk(
  "pos/add-pos",
  async (posData, thunkAPI) => {
    try {
      return await posService.addPos(posData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPoses = createAsyncThunk(
  "pos/get-all-poses",
  async (thunkAPI) => {
    try {
      return await posService.getPoses();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getAPos = createAsyncThunk(
  "pos/get-a-pos",
  async (posCode, thunkAPI) => {
    try {
      return await posService.getPos(posCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAPos = createAsyncThunk(
  "pos/update-a-pos",
  async ({ posCode, posData }, thunkAPI) => {
    try {
      return await posService.updatePos(posCode, posData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAPos = createAsyncThunk(
  "pos/delete-a-pos",
  async (posCode, thunkAPI) => {
    try {
      return await posService.deletePos(posCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addASignatory = createAsyncThunk("pos/add-signatory", async({posCode,signatoryData}, thunkAPI)=>{
  try {
    return await posService.addSignatory(posCode,signatoryData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
 

export const resetPosState = createAction("Reset_all");

const initialState = {
  poses: [],
  pos: null,
  addedPos: null,
  error: {addAPos: false,getAllPoses: false,getAPos: false,updateAPos: false,deleteAPos: false,addASignatory:false},
  loading: {addAPos: false,getAllPoses: false,getAPos: false,updateAPos: false,deleteAPos: false, addASignatory:false},
  success: {addAPos: false,getAllPoses: false,getAPos: false,updateAPos: false,deleteAPos: false, addASignatory:false},
  message: "",
};
export const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAPos.pending, (state) => {
        state.loading.addAPos = true;
      })
      .addCase(addAPos.fulfilled, (state, action) => {
        state.loading.addAPos = false;
        state.error.addAPos = false;
        state.success.addAPos = true;
        toast.success("Group created successfully.");
      })
      .addCase(addAPos.rejected, (state, action) => {
        state.loading.addAPos = false;
        state.error.addAPos = true;
        state.success.addAPos = false;
        toast.error(action?.payload?.response?.data?.header?.customerMessage)
      })
      .addCase(getAllPoses.pending, (state) => {
        state.loading.getAllPoses = true;
      })
      .addCase(getAllPoses.fulfilled, (state, action) => {
        state.loading.getAllPoses = false;
        state.error.getAllPoses = false;
        state.success.getAllPoses = true;
        state.poses = action?.payload?.content;
      })
      .addCase(getAllPoses.rejected, (state, action) => {
        state.loading.getAllPoses = false;
        state.error.getAllPoses = true;
        state.success.getAllPoses = false;
        state.message = action?.error;
      })
      .addCase(getAPos.pending, (state) => {
        state.loading.getAPos = true;
      })
      .addCase(getAPos.fulfilled, (state, action) => {
        state.loading.getAPos = false;
        state.error.getAPos = false;
        state.success.getAPos = true;
        state.pos = action?.payload;
      })
      .addCase(getAPos.rejected, (state, action) => {
        state.loading.getAPos = false;
        state.error.getAPos = true;
        state.success.getAPos = false;
        state.message = action?.error;
      })
      .addCase(updateAPos.pending, (state) => {
        state.loading.updateAPos = true;
      })
      .addCase(updateAPos.fulfilled, (state, action) => {
        state.loading.updateAPos = false;
        state.error.updateAPos = false;
        state.success.updateAPos = true;
        state.updatedPos = action?.payload;
        toast.success("POS updated successfully.");
      })
      .addCase(updateAPos.rejected, (state, action) => {
        state.loading.updateAPos = false;
        state.error.updateAPos = true;
        state.success.updateAPos = false;
        state.message = action?.error;
      })
      .addCase(deleteAPos.pending, (state) => {
        state.loading.deleteAPos = true;
      })
      .addCase(deleteAPos.fulfilled, (state, action) => {
        state.loading.deleteAPos = false;
        state.error.deleteAPos = false;
        state.success.deleteAPos = true;
        state.response = action?.payload;
        toast.success("POS deleted successfully.");
      })
      .addCase(deleteAPos.rejected, (state, action) => {
        state.loading.deleteAPos = false;
        state.error.deleteAPos = true;
        state.success.deleteAPos = false;
        state.message = action?.error;
      })
       .addCase(addASignatory.pending, (state) => {
        state.loading.addASignatory = true;
      })
      .addCase(addASignatory.fulfilled, (state, action) => {
        state.loading.addASignatory = false;
        state.error.addASignatory = false;
        state.success.addASignatory = true;
        state.response = action?.payload;
        toast.success("Signatory added successfully.");
      })
      .addCase(addASignatory.rejected, (state, action) => {
        state.loading.addASignatory = false;
        state.error.addASignatory = true;
        state.success.addASignatory = false;
        state.message = action?.error;
      })
      .addCase(resetPosState, () => initialState);
  },
});

export default posSlice.reducer;
