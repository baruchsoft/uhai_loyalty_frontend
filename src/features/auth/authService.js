import { newRequest } from "../../utils/newRequest";
 // registration for Admin => for production only a single admin will be allowed to create an account and after which it will be disabled
 const register = async (registerData)=>{
 const response = await newRequest.post("auth/register", registerData);
  if(response && response.data){
    return response.data
  }
 }

const signIn = async (signInData) => {
  const response = await newRequest.post(`auth/authenticate`, signInData);
  if (response && response.data) {
    return response.data;
  }
};

const verifyEmail = async (email) => {
  const response = await newRequest.post(`forgotPassword/verifyMail/${email}`);
  if (response && response.data) {
    return response.data;
  }
};

const verifyOtp = async (otp, email) => {
  const response = await newRequest.post(`forgotPassword/verifyOtp/${otp}/${email}`);
  if (response && response.data) {
    return response.data;
  }
};

const resetPassword = async (passwords, email) => {
  const response = await newRequest.post(`forgotPassword/changePassword/${email}`, passwords);
  if (response && response.data) {
    return response.data;
  }
};

const authService = { signIn, verifyEmail, verifyOtp, resetPassword ,register};

export default authService;
