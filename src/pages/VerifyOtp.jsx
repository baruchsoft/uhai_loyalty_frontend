import { useFormik } from "formik";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/villagecan logo.png";
import * as Yup from "yup";
import { Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { resetAuthState, verifyUserOtp } from "../features/auth/authSlice";

const CODE_VERIFICATION_SCHEMA = Yup.object().shape({
  code1: Yup.number().integer().min(0).max(9).required(),
  code2: Yup.number().integer().min(0).max(9).required(),
  code3: Yup.number().integer().min(0).max(9).required(),
  code4: Yup.number().integer().min(0).max(9).required(),
  code5: Yup.number().integer().min(0).max(9).required(),
  code6: Yup.number().integer().min(0).max(9).required(),
});

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = [useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null)];
  const verifyOtpLoading = useSelector((state) => state.auth.loading.verifyUserOtp);
  const verifyOtpSuccess = useSelector((state) => state.auth.success.verifyUserOtp);
  const verifyUserOtpResponse = useSelector((state) => state.auth.verifyUserOtpResponse);
  const error = useSelector((state) => state.auth.error.verifyUserOtp);

  const formik = useFormik({
    initialValues: {
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
      code6: "",
      email: location?.state?.email,
    },
    validationSchema: CODE_VERIFICATION_SCHEMA,
    onSubmit: (values) => {
      const otp = `${values.code1}${values.code2}${values.code3}${values.code4}${values.code5}${values.code6}`;
      dispatch(resetAuthState());
      dispatch(verifyUserOtp({ otp, email: values.email }));
    },
  });

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (verifyOtpSuccess && verifyUserOtpResponse) {
      formik.resetForm(); 
      navigate("/reset-password", { state: { email: formik.values.email } });
      dispatch(resetAuthState());
    }
  }, [verifyOtpSuccess, verifyUserOtpResponse]);

  const handleKeyUp = (index, e) => {
    const currentInput = inputRefs[index].current;
    if (currentInput.value) {
      if (index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formik.values[`code${index + 1}`] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

const handleInputChange = (e, fieldName) => {
  const value = e.target.value.replace(/[^\d]/g, "");
  const newValue = value.slice(-1); 
  formik.setFieldValue(fieldName, newValue);
  
  if (newValue && fieldName !== "code6") {
    const currentIndex = parseInt(fieldName.replace("code", "")) - 1;
    inputRefs[currentIndex + 1].current.focus();
  }
};
const handlePaste = async (e) => {
  e.preventDefault();
  const pastedData = e.clipboardData
    .getData("text")
    .replace(/[^\d]/g, "")
    .slice(0, 6);

  formik.setTouched({});
  
  for (let i = 1; i <= 6; i++) {
    await formik.setFieldValue(`code${i}`, "", false); 
  }

  for (let index = 0; index < pastedData.length; index++) {
    if (index < 6) {
      await formik.setFieldValue(`code${index + 1}`, pastedData[index], false); 
    }
  }

  await formik.validateForm();
  if (pastedData.length === 6) {
    inputRefs[5].current.focus();
  } else if (pastedData.length > 0) {
    const nextEmptyIndex = pastedData.length;
    if (nextEmptyIndex < 6) {
      inputRefs[nextEmptyIndex].current.focus();
    }
  }
};

  return (
    <div className="max-w-full min-h-screen bg-gray-200 overflow-hidden font-sans">
      <div className="flex flex-col items-center justify-center md:py-4">
        <form style={{ width: "500px" }} onSubmit={formik.handleSubmit} className="flex flex-col items-center m-4 bg-white py-8 rounded-lg md:px-10 p-6 gap-1">
          <div>
            <img src={logo} alt="logo" className="w-36" />
          </div>

          <div className="mt-3">
            <h2 className="text-xl text-gray-800 font-bold">VERIFY OTP</h2>
          </div>

          <div className="my-3 flex justify-center items-center">
            <span className="text-sm font-normal text-wrap text-center">
              We've sent a 6-digit verification code to {formik.values.email || "your email"}. Please enter the code below to proceed.
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 m-4">
            <div className="flex justify-start items-center flex-shrink gap-4 mb-4">
                {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <input key={num} ref={inputRefs[index]} type="text" pattern="[0-9]*"inputMode="numeric" name={`code${num}`}
                  className={`border ${
                    formik.touched[`code${num}`] && formik.errors[`code${num}`]
                      ? "border-red-600 border-1.5"
                      : "border-gray-400 border-1.5"
                  } rounded-lg text-center text-2xl text-gray-800 font-bold focus:outline-none focus:border-blue-600 transition duration-200`}
                  style={{ width: 58, height: 60 }}
                  maxLength={1}
                  value={formik.values[`code${num}`]}
                  onChange={(e) => handleInputChange(e, `code${num}`)}
                  onKeyUp={(e) => handleKeyUp(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onBlur={formik.handleBlur(`code${num}`)}
                />
              ))}
            </div>

            <div className="mt-2">
              {verifyOtpLoading ? (
                <Button type="primary" htmlType="button" style={{ width: "168px", height: "40px"}} loading  className="mt-2 text-base font-medium font-sans">Please wait...</Button>
              ) : (
                <Button type="primary" htmlType="submit" disabled={verifyOtpLoading} style={{ width: "168px", height: "40px" }} className="mt-2 text-base font-medium font-sans"> VERIFY CODE </Button>
              )}
            </div>

            <div className="flex gap-1 items-center content-center text-base mt-2">
              <Button type="link" htmlType="button" onClick={() => navigate("/")} className="text-blue-600 cursor-pointer text-base font-medium"> Sign in </Button>
              <span className="text-gray-500">|</span>
              <Button type="link"  htmlType="button"  onClick={() => navigate("/forgot-password")} className="text-blue-600 cursor-pointer text-base font-medium"> Resend code</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;