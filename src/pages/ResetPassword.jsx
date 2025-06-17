/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../assets/villagecan logo.png";
import { Button, Input } from "antd";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetAuthState, resetUserPassword } from "../features/auth/authSlice";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?";:{}|<>\[\]])[A-Za-z\d!@#$%^&*(),.?";:{}|<>\[\]]{8,}$/;

const SIGNIN_SCHEMA = Yup.object().shape({
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must include at least one lowercase letter, at least one uppercase letter, at least one number, at least one special character and at least 8 characters long."
    )
    .required("Please provide your password."),
  repeatPassword: Yup.string()
    .matches(
      passwordRegex,
      "Password must include at least one lowercase letter, at least one uppercase letter, at least one number, at least one special character and at least 8 characters long."
    )
    .oneOf([Yup.ref("password"), null], "Passwords must match.")
    .required("Please repeat your password."),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword((prev) => !prev);
  };

  const resetPasswordSuccess = useSelector(
    (state) => state?.auth?.success?.resetUserPassword
  );
  const resetPasswordLoading = useSelector(
    (state) => state?.auth?.loading?.resetUserPassword
  );

  const formik = useFormik({
    initialValues: {
      password: "",
      repeatPassword: "",
      email: location?.state?.email,
    },
    validationSchema: SIGNIN_SCHEMA,
    onSubmit: (values) => {
      const passwords = {
        password: values.password,
        repeatPassword: values.repeatPassword,
      };
      dispatch(resetUserPassword({ passwords, email: values.email }));
    },
  });

  useEffect(() => {
    if (resetPasswordSuccess) {
      formik.resetForm();
      navigate("/");
      dispatch(resetAuthState());
    }
  }, [resetPasswordSuccess]);

  return (
    <div className="max-w-full min-h-screen bg-gray-200 overflow-hidden font-sans">
      <div className="flex flex-col items-center justify-center md:py-4">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col  items-center m-4 bg-white py-8 rounded-lg sm:px-10 p-6 gap-1"
        >
          <div>
            <img src={logo} alt="logo" className="w-36" />
          </div>

          <div className="m-1">
            <h2 className="text-xl text-gray-800 font-bold">RESET PASSWORD</h2>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="***********"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2 text-xl text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <AiFillEye className="text-2xl" />
                  ) : (
                    <AiFillEyeInvisible className="text-2xl" />
                  )}
                </button>
              </div>

              <div className="w-80">
                <p className="text-xs text-red-600">
                  {formik.touched.password && formik.errors.password}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="repeatPassword" className="text-sm font-semibold">
                Repeat Password
              </label>
              <div className="relative">
                <Input
                  type={showRepeatPassword ? "text" : "password"}
                  name="repeatPassword"
                  id="repeatPassword"
                  placeholder="***********"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.repeatPassword}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.repeatPassword &&
                    formik.errors.repeatPassword
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={toggleRepeatPasswordVisibility}
                  className="absolute right-3 top-2 text-xl text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showRepeatPassword ? (
                    <AiFillEye className="text-2xl" />
                  ) : (
                    <AiFillEyeInvisible className="text-2xl" />
                  )}
                </button>
              </div>

              <div className="w-80">
                <p className="text-xs text-red-600">
                  {formik.touched.repeatPassword &&
                    formik.errors.repeatPassword}
                </p>
              </div>
            </div>

            {resetPasswordLoading ? (
              <div>
                <Button
                  type="primary"
                  htmlType="button"
                  loading
                  className="w-80  h-11 mt-2 text-base  font-medium font-sans"
                >
                  {" "}
                  Please wait...
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={resetPasswordLoading}
                  className="w-80  h-11 mt-2 text-base  font-medium font-sans"
                >
                  RESET PASSWORD
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
