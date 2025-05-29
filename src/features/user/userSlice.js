import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./usersService";
import toast from "react-hot-toast";

export const addAUser = createAsyncThunk(
  "user/add-user",
  async (userData, thunkAPI) => {
    try {
      return await userService.addUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAUser = createAsyncThunk(
  "user/get-a-user",
  async (userId, thunkAPI) => {
    try {
      return await userService.getUser(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/get-all-user",
  async (thunkAPI) => {
    try {
      return await userService.getUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAUser = createAsyncThunk(
  "user/update-a-user",
  async ({ userId, userData }, thunkAPI) => {
    try {
      return await userService.updateUser(userId, userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAUser = createAsyncThunk(
  "user/delete-a-user",
  async (userId, thunkAPI) => {
    try {
      return await userService.deleteUser(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

 export const updateUserPassword = createAsyncThunk(
  "user/update-user-password",
  async(passwordData, thunkAPI)=>{
    try {
      return await userService.updatePassword(passwordData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const resetUserState = createAction("Reset_all");

const initialState = {
  addedUser: null,
  deletedUser: null,
  updatedUser: null,
  users: [],
  user: null,
  updateUserPasswordResponse:null,
  error: {addAUser: false,getAllUsers: false,deleteAUser: false,updateAUser: false,getAUser: false, updateUserPassword:false},
  loading: {addAUser: false,getAllUsers: false,deleteAUser: false,updateAUser: false,getAUser: false, updateUserPassword:false},
  success: {addAUser: false,getAllUsers: false,deleteAUser: false,updateAUser: false,getAUser: false, updateUserPassword:false},
  
  message: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAUser.pending, (state) => {
        state.loading.addAUser = true;
      })
      .addCase(addAUser.fulfilled, (state, action) => {
        state.loading.addAUser = false;
        state.success.addAUser = true;
        state.error.addAUser = false;
        state.addedUser = action?.payload;
        toast.success("User added succesfully.");
      })
      .addCase(addAUser.rejected, (state, action) => {
        state.loading.addAUser = false;
        state.success.addAUser = false;
        state.error.addAUser = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAUser.pending, (state) => {
        state.loading.getAUser = true;
      })
      .addCase(getAUser.fulfilled, (state, action) => {
        state.loading.getAUser = false;
        state.success.getAUser = true;
        state.error.getAUser = false;
        state.user = action.payload;

        console.log(state.user,"=> user")
      })
      .addCase(getAUser.rejected, (state, action) => {
        state.loading.getAUser = false;
        state.success.getAUser = false;
        state.error.getAUser = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading.getAllUsers = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading.getAllUsers = false;
        state.success.getAllUsers = true;
        state.error.getAllUsers = false;
        state.users = action?.payload?.content;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading.getAllUsers = false;
        state.success.getAllUsers = false;
        state.error.getAllUsers = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(deleteAUser.pending, (state) => {
        state.loading.deleteAUser = true;
      })
      .addCase(deleteAUser.fulfilled, (state, action) => {
        state.loading.deleteAUser = false;
        state.success.deleteAUser = true;
        state.error.deleteAUser = false;
        state.addedUser = action?.payload;
        toast.success("User deleted successfully.");
      })
      .addCase(deleteAUser.rejected, (state, action) => {
        state.loading.deleteAUser = false;
        state.success.deleteAUser = false;
        state.error.deleteAUser = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(updateAUser.pending, (state) => {
        state.loading.updateAUser = true;
      })
      .addCase(updateAUser.fulfilled, (state, action) => {
        state.loading.updateAUser = false;
        state.success.updateAUser = true;
        state.error.updateAUser = false;
        state.updatedUser = action?.payload;
        console.log(action.payload)
        toast.success(action?.payload?.header?.customerMessage);
      })
      .addCase(updateAUser.rejected, (state, action) => {
        state.loading.updateAUser = false;
        state.success.updateAUser = false;
        state.error.updateAUser = true;
        state.message = action?.payload?.response?.data?.message;          
        toast.error(action?.payload?.response?.data?.message);
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.loading.updateUserPassword = true;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading.updateUserPassword = false;
        state.success.updateUserPassword = true;
        state.error.updateUserPassword = false;
        state.addedUser = action?.payload;
        toast.success("Your password has been updated succesfully.");
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading.updateUserPassword = false;
        state.success.updateUserPassword = false;
        state.error.updateUserPassword = true;
        state.message = action?.payload?.response?.data?.message;
        toast.error(action?.payload?.response?.data?.message);
        
      })

      .addCase(resetUserState, () => initialState);
  },
});

export default userSlice.reducer;
