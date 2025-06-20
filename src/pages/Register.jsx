import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Select } from "antd";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo from "../assets/villagecan logo.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../features/auth/authService";
import { useDispatch, useSelector } from "react-redux";
import { getAllCountries } from "../features/country/countrySlice";


const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?";:{}|<>\[\]])[A-Za-z\d!@#$%^&*(),.?";:{}|<>\[\]]{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneNumberRegex = /^(\+?[1-9]\d{1,14}|0\d{1,14})$/;
const idNumberRegex = /^[A-Za-z0-9\-\s]{5,20}$/;
const hudumaNumberRegex = /^\d{8}$/;

const LOYALTY_SCHEMA = Yup.object().shape({
  userFirstname: Yup.string().required("Please provide your first name."),
  userLastname: Yup.string().required("Please provide your last name."),
  userEmail: Yup.string().email("Please provide a valid email address.").matches(emailRegex, "Please provide a valid email address format.").max(50, "Email must not exceed 50 characters.").required("Please provide your email address."),
  userPhone: Yup.string().matches(phoneNumberRegex, "Please provide a valid phone number.").required("Please provide your phone number."),
  userIdNumber: Yup.string().matches(idNumberRegex, "Please provide a valid ID number.").required("Please provide your ID number."),
  userHudumaNo: Yup.string().matches(hudumaNumberRegex,"Please provide a valid kenyan huduma number."),
  userCountryCode: Yup.number().typeError("Country code must be a number.").required("Please select your country."),
  userPassword: Yup.string().matches(passwordRegex,"Password must include at least one lowercase letter, at least one uppercase letter, at least one number, at least one special character and at least 8 characters long.").required("Please provide your password."),
});

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const [isSubmitting,setIsubmitting] = useState(false)
  const countriesList = useSelector((state)=>state?.country?.countries || []);
  const loadingCountries = useSelector((state)=>state?.country?.loading?.getAllCountries);

  console.log(countriesList,"=>list of all countries")

  const formik = useFormik({
    initialValues: {
      userFirstname: "",
      userLastname: "",
      userEmail: "",
      userPhone: "",
      userIdNumber: "",
      userHudumaNo: "",
      userCountryCode: null,
      userPassword: "",
      userUsername:"",
      roleId: 1,
    },
    validationSchema: LOYALTY_SCHEMA,
    onSubmit: async (values) => {
       try {
        setIsubmitting(true)

        const userUsername = `${values.userFirstname} ${values.userLastname}`
        console.log(userUsername,"=>userName....")

        const registrationData ={...values,userUsername:userUsername }
 
        const response =  await register(registrationData);
        if(response.status === 200){
           toast.success("Your account has been successfully created.")
           formik.resetForm();
           navigate("/")
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }finally{
        setIsubmitting(false)
      }
    },
  });

  useEffect(()=>{
    dispatch(getAllCountries())
  },[dispatch])



  return (
    <div className="max-w-full min-h-screen  bg-gray-200  overflow-hidden ">
      <div className="flex flex-col items-center justify-center md:py-4">
        <form onSubmit={formik.handleSubmit} className="flex flex-col items-center  m-4  bg-white py-8  rounded-lg  sm:px-10 p-6 gap-1">
          <div>
            <img src={logo} alt="logo" className="w-36" />
          </div>
          <div className="m-1">
            <h2 className="text-xl text-gray-800 font-bold">Admin Register</h2>
          </div>
          <div className="flex flex-wrap justify-center md:flex-nowrap gap-1 md:gap-8 ">
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-col gap-1">
                <label htmlFor="firstName" className="text-sm font-semibold">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input type="text" placeholder="First Name" name="userFirstname" id="userFirstname"
                  onBlur={(e) => {
                    formik.setFieldValue( "userFirstname", e.target.value.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") );
                    formik.handleBlur(e);
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.userFirstname}
                  className={`w-80 h-11 border-1.5  rounded-lg ${
                    formik.touched.userFirstname && formik.errors.userFirstname
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div className="w-80">
                  <p className="text-xs text-red-600">
                    {formik.touched.userFirstname &&
                      formik.errors.userFirstname}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="lastName" className="text-sm font-semibold">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Last Name"
                  name="userLastname"
                  id="userLastname"
                  onBlur={(e) => {
                    formik.setFieldValue(
                      "userLastname",
                      e.target.value
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                    );
                    formik.handleBlur(e);
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.userLastname}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.userLastname && formik.errors.userLastname
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <div className="w-80">
                  <p className="text-xs text-red-600">
                    {formik.touched.userLastname && formik.errors.userLastname}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="e.g. example@gmail.com"
                  name="userEmail"
                  id="userEmail"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.userEmail}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.userEmail && formik.errors.userEmail
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <div className="w-80">
                  <p className="text-xs text-red-600">
                    {formik.touched.userEmail && formik.errors.userEmail}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-sm font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="e.g. 0712345678"
                  name="userPhone"
                  id="userPhone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.userPhone}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.userPhone && formik.errors.userPhone
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <div className="w-80">
                  <p className="text-xs text-red-600">
                    {formik.touched.userPhone && formik.errors.userPhone}
                  </p>
                </div>
              </div>
            
                <div className="hidden md:block">
                  <Button type="primary"  loading={isSubmitting} htmlType="submit"  disabled={isSubmitting}  className="w-80  h-11 mt-4 text-base font-medium font-sans" >Register</Button>
                </div>
              
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="idNumber" className="text-sm font-semibold">
                  Id Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="userIdNumber"
                  id="userIdNumber"
                  placeholder="Id Number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.userIdNumber}
                  className={`w-80  h-11 border-1.5  rounded-lg ${
                    formik.touched.userIdNumber && formik.errors.userIdNumber
                      ? "border-red-600"
                      : ""
                  }`}
                  minLength={1}
                  maxLength={12}
                  min={1}
                />

                <div className="w-80">
                  <p className="text-xs text-red-600">
                    {formik.touched.userIdNumber && formik.errors.userIdNumber}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="hudumaNumber "
                  className="text-sm font-semibold"
                >
                  Huduma Number
                </label>
                <Input
                  placeholder="Huduma Number"
                  type="number"
                  name="userHudumaNo"
                  id="userHudumaNo"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.userHudumaNo}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.userHudumaNo && formik.errors.userHudumaNo
                      ? "border-red-600"
                      : ""
                  }`}
                  minLength={1}
                  maxLength={12}
                  min={1}
                />

                <div className="w-80">
                  <p className="text-xs text-red-600">
                    {formik.touched.userHudumaNo && formik.errors.userHudumaNo}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="userCountryCode"
                  className="text-sm font-semibold"
                >
                  Country<span className="text-red-500">*</span>
                </label>

                <Select
                  showSearch
                  type="text"
                  placeholder="Select Your Country"
                  name="userCountryCode"
                  id="userCountryCode"
                  loading={loadingCountries}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                          countriesList.map((country) => ({
                          value: country.countryCode,
                          label: country.countryName,
                        }))
                  }
                  onBlur={formik.handleBlur}
                  onChange={(value) =>
                    formik.setFieldValue("userCountryCode", value)
                  }
                  value={formik.values.userCountryCode}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.userCountryCode &&
                    formik.errors.userCountryCode
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <div className="w-80">
                  <p className="text-xs text-red-600">
                    {formik.touched.userCountryCode &&
                      formik.errors.userCountryCode}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="***************"
                    name="userPassword"
                    id="userPassword"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.userPassword}
                    className={`w-80  h-11 border-1.5 rounded-lg ${
                      formik.touched.userPassword && formik.errors.userPassword
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
                    {formik.touched.userPassword && formik.errors.userPassword}
                  </p>
                </div>
              </div>

            
                <div className="block md:hidden">
                  <Button type="primary" htmlType="submit" loading={isSubmitting}  disabled={isSubmitting} className="w-80  h-11 mt-4 text-base font-medium font-sans">Register</Button>
                </div>
              
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
