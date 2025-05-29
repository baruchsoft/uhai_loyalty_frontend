import React, { useEffect } from "react";
import logo from "../assets/villagecan logo.png";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button } from "antd";
import { resetAuthState, verifyUserEmail } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const FORGOT_PASSWORD_SCHEMA = Yup.object().shape({
  email: Yup.string().email().matches(emailRegex, "Please provide a valid email format.").max(50, "Email must not exceed 50 characters.").required("Please provide your email address.")});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyUserEmailLoading = useSelector( (state) => state.auth.loading.verifyUserEmail);
  const verifyUserEmailSuccess = useSelector((state) => state.auth.success.verifyUserEmail);
  const verifyEmailResponse = useSelector((state) => state.auth.verifyEmailRepsonse);

  const formik = useFormik({
    initialValues: {email: ""},
    validationSchema: FORGOT_PASSWORD_SCHEMA,
    onSubmit: (values) => {
      dispatch(resetAuthState());
      dispatch(verifyUserEmail(values.email));
    },
  });

  useEffect(() => {
    if (verifyEmailResponse && verifyUserEmailSuccess) {
      formik.resetForm();
      navigate("/verify-otp", {state:{email: formik.values.email}});
      dispatch(resetAuthState());
    }
  }, [verifyEmailResponse, verifyUserEmailSuccess, dispatch]);

  return (
    <div className="max-w-full min-h-screen bg-gray-200  overflow-hidden font-sans">
      <div className="flex flex-col items-center justify-center md:py-4">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col  items-center m-4 bg-white py-8 rounded-lg md:px-10 p-6 gap-1"
        >
          <div className="">
            <img src={logo} alt="logo" className="w-36" />
          </div>

          <div className="m-1">
            <h2 className="text-xl text-gray-800 font-bold">Forgot Password</h2>
          </div>

          <div className="flex justify-center items-center">
            <span className="text-sm font-normal">Enter your email address, and we’ll send you a code <br />to reset your password.</span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <Input
                type="text"
                name="email"
                id="email"
                placeholder="Email"
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
                <p className="text-xs text-red-600">
                  {formik.touched.email && formik.errors.email}
                </p>
              </div>
            </div>

            <div className="mt-2">
              {verifyUserEmailLoading ? (
                <Button type="primary" htmlType="button" loading className="w-80  h-11 mt-2 text-base  font-medium font-sans"> Please wait...</Button>
              ) : (
                <Button type="primary" htmlType="submit" disabled={verifyUserEmail} className="w-80  h-11 mt-2 text-base  font-medium font-sans"> Request Code</Button>
              )}
            </div>

            <div className="flex  gap-1 text-base mt-2">
              <Button type="link" htmlType="button" onClick={() => navigate("/")} className="text-blue-600 cursor-pointer text-base font-medium">Sign in</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
