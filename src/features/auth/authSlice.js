import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import authService from "./authService";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// registration for admin
export const registerUser = createAsyncThunk("auth/register", async(registerData, thunkAPI) =>{
  try {
    return await authService.register(registerData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const signInUser = createAsyncThunk(
  "auth/signin",
  async (signInData, thunkAPI) => {
    try {
      return await authService.signIn(signInData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const verifyUserEmail = createAsyncThunk(
  "auth/verify-user-email",
  async (email, thunkAPI) => {
    try {
      return await authService.verifyEmail(email);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const verifyUserOtp = createAsyncThunk(
  "auth/verify-otp",
  async ({otp, email}, thunkAPI) => {
    try {
      return await authService.verifyOtp(otp, email);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/reset-password",
  async ({passwords, email}, thunkAPI) => {
    console.log(email)
    try {
      return await authService.resetPassword(passwords, email);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetAuthState = createAction("Reset_all");

const initialState = {
  registerTokens:null,
  signUpTokens: null,
  signInTokens: null,
  verifyEmailRepsonse: null,
  verifyUserOtpResponse: null,
  error: { registerUser:false, loyaltyRegister: false, verifyUserEmail: false, signInUser: false, verifyUserOtp: false, resetUserPassword: false,},
  loading: { registerUser:false, loyaltyRegister: false, verifyUserEmail: false, signInUser: false, verifyUserOtp: false, resetUserPassword: false,},
  success: { registerUser:false, loyaltyRegister: false, verifyUserEmail: false, signInUser: false, verifyUserOtp: false, resetUserPassword: false,},
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(registerUser.pending, (state) => {
        state.loading.registerUser = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.registerUser = false;
        state.success.registerUser = true;
        state.error.registerUser = false;
        state.registerTokens = action?.payload;
        toast.success("Your account has been created successfully.")
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.registerUser = false;
        state.success.registerUser = false;
        state.error.registerUser = true;
        toast.error(action?.payload?.header?.customerMessage)
      })
      .addCase(verifyUserEmail.pending, (state) => {
        state.loading.verifyUserEmail = true;
      })
      .addCase(verifyUserEmail.fulfilled, (state, action) => {
        state.loading.verifyUserEmail = false;
        state.success.verifyUserEmail = true;
        state.error.verifyUserEmail = false;
        state.verifyEmailRepsonse = action?.payload;
        toast.success("A password reset code has been sent to your email. Please check your inbox to proceed with resetting your password.");
      })
      .addCase(verifyUserEmail.rejected, (state, action) => {
        state.loading.verifyUserEmail = false;
        state.success.verifyUserEmail = false;
        state.error.verifyUserEmail = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(signInUser.pending, (state) => {
        state.loading.signInUser = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading.signInUser = false;
        state.success.signInUser = true;
        state.error.signInUser = false;
        state.signInTokens = action?.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading.signInUser = false;
        state.success.signInUser = false;
        state.error.signInUser = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(verifyUserOtp.pending, (state) => {
        state.loading.verifyUserOtp = true;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.loading.verifyUserOtp = false;
        state.success.verifyUserOtp = true;
        state.error.verifyUserOtp = false;
        state.verifyUserOtpResponse = action?.payload;
        toast.success("OTP verified successfully please proceed to reset your password.")
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.loading.verifyUserOtp = false;
        state.success.verifyUserOtp = false;
        state.error.verifyUserOtp = true;
        state.message = action?.payload?.response?.data?.message;
        toast.error(action?.payload?.response?.data?.message);
        
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.loading.resetUserPassword = true;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading.resetUserPassword = false;
        state.success.resetUserPassword = true;
        state.error.resetUserPassword = false;
        state.resetPasswordResponse = action?.payload;
        toast.success("Your password has been successfully updated. You can now log in with your new password.");
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading.resetUserPassword = false;
        state.success.resetUserPassword = false;
        state.error.resetUserPassword = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(resetAuthState, () => initialState);
  },
});

export default authSlice.reducer;
