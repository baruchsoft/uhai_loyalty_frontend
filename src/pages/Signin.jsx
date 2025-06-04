import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../assets/villagecan logo.png";
import { Button, Input } from "antd";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAuthState, signInUser } from "../features/auth/authSlice";
import {jwtDecode} from "jwt-decode"
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { getAUser } from "../features/user/userSlice";

const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?";:{}|<>\[\]])[A-Za-z\d!@#$%^&*(),.?";:{}|<>\[\]]{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SIGNIN_SCHEMA = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address.").matches(emailRegex, "Please provide a valid email address format.").max(50, "Email must not exceed 50 characters.").required("Please provide your email address."),
  password: Yup.string().matches(passwordRegex,"Password must include at least one lowercase letter, at least one uppercase letter, at least one number, at least one special character and at least 8 characters long.").required("Please provide your password."),
});

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {setShowPassword((prev) => !prev);};

  const signInSuccess = useSelector((state) => state?.auth?.success?.signInUser);
  const signInTokens = useSelector((state) => state?.auth?.signInTokens);
  const signInLoading = useSelector((state) => state?.auth?.loading?.signInUser);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SIGNIN_SCHEMA,
    onSubmit: (values) => {
      dispatch(resetAuthState());
      dispatch(signInUser(values));
    },
  });

  useEffect(() => {
    if (signInTokens && signInSuccess) {
      formik.resetForm();
      // decode the token to check if user is an admin
      console.log(signInTokens.access_token,"=>accessToken")
      
      if(signInTokens.access_token){
        const decodedUser = jwtDecode(signInTokens.access_token);
        console.log(decodedUser, "=> decodedUser");

        // get the logged in user by user id
        if(decodedUser.userId){
          dispatch(getAUser(decodedUser.userId))
          // store user Id in cookies
          Cookies.set("userId", decodedUser.userId, {expires:1, secure:true, sameSite:"strict"})
        }

        if(decodedUser.role === "Admin"){
          // store tokens in cookies
        Cookies.set("accessToken", signInTokens.access_token, {expires: 1,secure: true, sameSite:"strict"});
        Cookies.set("refreshToken", signInTokens.refresh_token, {expires: 1,secure: true, sameSite:"strict"});
        navigate("/admin")
        }else{
         toast.error("Access Denied: You require admin privileges.")
        }
      }
    }
  }, [signInSuccess, signInTokens]);


// sm — Small screens (min-width: 640px)
// md — Medium screens (min-width: 768px)
// lg — Large screens (min-width: 1024px)
// xl — Extra large screens (min-width: 1280px)
// 2xl — 2x extra large screens (min-width: 1536px)    

  return (
    <div className="max-w-full min-h-screen bg-gray-200 overflow-hidden font-sans" >
      <div className="flex flex-col items-center justify-center md:py-4">
        <form onSubmit={formik.handleSubmit} className="flex flex-col items-center m-4 bg-white py-8 rounded-lg sm:px-10 p-6 gap-1" >
          <div>
            <img src={logo} alt="logo" className="w-36" />
          </div>

          <div className="m-1">
            <h2 className="text-xl text-gray-800 font-bold">Sign In</h2>
          </div>

          <div className="flex flex-col items-center gap-2">

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-semibold">Email</label>
              <Input type="email" name="email" id="email" placeholder="Email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                className={`w-80  h-11 border-1.5 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-600"
                    : ""
                }`}
              />
              <div className="w-80">
                <p className="text-xs text-red-600">{formik.touched.email && formik.errors.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-semibold">Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="***********"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className={`w-80  h-11 border-1.5 ${formik.touched.password && formik.errors.password ? "border-red-600": ""}`}
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-2 text-xl text-gray-500 hover:text-gray-700 focus:outline-none">
                  {showPassword ? (<AiFillEye className="text-2xl" />) : (<AiFillEyeInvisible className="text-2xl"/>)}
                </button>
              </div>

              <div className="w-80">
                <p className="text-xs text-red-600">{formik.touched.password && formik.errors.password}</p>
              </div>
            </div>

            <div className="flex cursor-pointer ml-48">
              <Button type="link" htmlType="button" onClick={() => navigate("/forgot-password")}className="text-sm font-medium  text-blue-600">Forgot password</Button>
            </div>
             <Button loading={signInLoading} type="primary" htmlType="submit" disabled={signInLoading} className="w-80  h-11 mt-2 text-base  font-medium font-sans">Sign In</Button>
          </div>
        </form>
      </div>
      
    </div>
  );
};

export default Signin;
