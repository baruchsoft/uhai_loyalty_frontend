import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roleService from "./roleService";
import toast from "react-hot-toast";

export const addARole = createAsyncThunk(
  "role/add-role",
  async (roleData, thunkAPI) => {
    try {
      return await roleService.addRole(roleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getARole = createAsyncThunk(
  "role/get-a-role",
  async (roleCode, thunkAPI) => {
    try {
      return await roleService.getRole(roleCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateARole = createAsyncThunk(
  "role/update-a-role",
  async ({ roleCode, roleData }, thunkAPI) => {
    try {
      return await roleService.updateRole(roleCode, roleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteARole = createAsyncThunk(
  "role/delete-a-role",
  async (roleCode, thunkAPI) => {
    try {
      return await roleService.deleteRole(roleCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllRoles = createAsyncThunk(
  "role/get-all-role",
  async (thunkAPI) => {
    try {
      return await roleService.getRoles();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetRoleState = createAction("Reset_all");

const initialState = {
  roles: [],
  role: null,
  addedRole: null,
  updatedRole: null,
  deletedRole: null,
  error: {addARole: false,getARole: false,updateARole: false,deleteARole: false,getAllRoles: false,},
  success: {addARole: false,getARole: false,updateARole: false,deleteARole: false,getAllRoles: false},
  loading: {addARole: false,getARole: false,updateARole: false,deleteARole: false,getAllRoles: false,},
  message: "",
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addARole.pending, (state) => {
        state.loading.addARole = true;
      })
      .addCase(addARole.fulfilled, (state, action) => {
        state.loading.addARole = false;
        state.success.addARole = true;
        state.error.addARole = false;
        state.addedRole = action.payload;
        toast.success("Role added successfully.");
      })
      .addCase(addARole.rejected, (state, action) => {
        state.loading.addARole = false;
        state.success.addARole = false;
        state.error.addARole = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(getARole.pending, (state) => {
        state.loading.getARole = true;
      })
      .addCase(getARole.fulfilled, (state, action) => {
        state.loading.getARole = false;
        state.success.getARole = true;
        state.error.getARole = false;
        state.role = action.payload;
      })
      .addCase(getARole.rejected, (state, action) => {
        state.loading.getARole = false;
        state.success.getARole = false;
        state.error.getARole = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(updateARole.pending, (state) => {
        state.loading.addARole = true;
      })
      .addCase(updateARole.fulfilled, (state, action) => {
        state.loading.updateARole = false;
        state.success.updateARole = true;
        state.error.updateARole = false;
        state.updatedRole = action.payload;
        toast.success("Role updated successfully.");
      })
      .addCase(updateARole.rejected, (state, action) => {
        state.loading.updateARole = false;
        state.success.updateARole = false;
        state.error.updateARole = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(deleteARole.pending, (state) => {
        state.loading.deleteARole = true;
      })
      .addCase(deleteARole.fulfilled, (state, action) => {
        state.loading.deleteARole = false;
        state.success.deleteARole = true;
        state.error.deleteARole = false;
        state.deletedRole = action.payload;
        toast.success("Role deleted successfully.");
      })
      .addCase(deleteARole.rejected, (state, action) => {
        state.loading.deleteARole = false;
        state.success.deleteARole = false;
        state.error.deleteARole = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAllRoles.pending, (state) => {
        state.loading.getAllRoles = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.loading.getAllRoles = false;
        state.success.getAllRoles = true;
        state.error.getAllRoles = false;
        state.roles = action.payload;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.loading.getAllRoles = false;
        state.success.getAllRoles = false;
        state.error.getAllRoles = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(resetRoleState, () => initialState);
  },
});

export default roleSlice.reducer;
