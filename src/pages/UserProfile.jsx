import { Avatar, Card, Button, Input, Select} from "antd";
import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import * as Yup from "yup"
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getAUser, updateAUser, updateUserPassword } from "../features/user/userSlice";
import Cookies from "js-cookie";
import { getAllCountries } from "../features/country/countrySlice";


const UserProfile = () => {
  const dispatch = useDispatch();
  const [showCurrentPassword,setShowCurrentPassword] = useState(false);
  const [showNewPassword,setShowNewPassword] = useState(false);
  const [showConfirmNewPassword,setShowConfirmNewPassword] = useState(false);
  const userData = useSelector((state)=> state?.user?.user)
  console.log(userData, "=> userdata.................")

  const toggleCurrentPasswordVisibility = ()=>{setShowCurrentPassword((prev)=> !prev)}
  const toggleNewPasswordVisibility = ()=>{setShowNewPassword((prev)=> !prev)}
  const toggleConfirmNewPasswordVisibility = ()=>{setShowConfirmNewPassword((prev)=> !prev)}

  const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?";:{}|<>\[\]])[A-Za-z\d!@#$%^&*(),.?";:{}|<>\[\]]{8,}$/;
  const PASSWORD_SCHEMA = Yup.object().shape({
    currentPassword: Yup.string().matches(passwordRegex,"Password must include at least one lowercase letter, at least one uppercase letter, at least one number, at least one special character and at least 8 characters long.").required("Please provide your current password."),
    newPassword: Yup.string().matches(passwordRegex,"Password must include at least one lowercase letter, at least one uppercase letter, at least one number, at least one special character and at least 8 characters long.").required("Please provide your new password."),
    confirmationPassword: Yup.string().matches(passwordRegex,"Password must include at least one lowercase letter, at least one uppercase letter, at least one number, at least one special character and at least 8 characters long.").required("Please confirm your new password."),
  });


const phoneNumberRegex = /^(\+?[1-9]\d{1,14}|0\d{1,14})$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const idNumberRegex = /^[A-Za-z0-9\-\s]{5,20}$/;
const hudumaNumberRegex = /^\d{8}$/;

  const USER_INFO_SCHEMA = Yup.object().shape({
    userFirstname: Yup.string().required("Please provide your first name."),
    userLastname: Yup.string().required("Please provide your last name."),
    userEmail: Yup.string().email("Please provide a valid email address.").matches(emailRegex, "Please provide a valid email address format.").max(50, "Email must not exceed 50 characters.").required("Please provide your email address."),
    userPhone: Yup.string().matches(phoneNumberRegex, "Please provide a valid phone number.").required("Please provide your phone number."),
    userIdNumber: Yup.string().matches(idNumberRegex, "Please provide a valid ID number.").required("Please provide your ID number."),
    userHudumaNo: Yup.string().matches(hudumaNumberRegex,"Please provide a valid kenyan huduma number."),
    userCountryCode: Yup.number().typeError("Country code must be a number.").required("Please select your country name."),
  });

useEffect(()=>{
dispatch(getAllCountries())
},[])

 const countries = useSelector((state)=>state.country.countries)
 console.log(countries,"=>countries")


   const formik = useFormik({
      initialValues: {
        currentPassword: "",
        newPassword: "",
        confirmationPassword:"",
      },
      validationSchema: PASSWORD_SCHEMA,
      onSubmit: (values) => {
        console.log(values,"=> passwordUpdatePayload")
        dispatch(updateUserPassword(values));
      },
    });

     
     const userId = Cookies.get("userId")
     console.log(userId,"=>userId")
     
    useEffect(()=>{
      dispatch(getAUser(userId)) 
    },[userId])

     const userInfoFormik = useFormik({
      initialValues: {
        userFirstname:  userData.firstname || "",
        userLastname: userData.lastname || "",
        userEmail: userData.email || "",
        userPhone:userData.userPhoneNumber || "",
        userIdNumber: userData.userIdNumber || "",
        userHudumaNo: userData.userHudumaNumber || "",
        userCountryCode:userData.country.countryCode || null
      },
      enableReinitialize:true,
      validationSchema: USER_INFO_SCHEMA,
      onSubmit: (values) => {
        console.log(values,"=>userdData")
        dispatch(updateAUser({userId: userData.id, userData:values}))
      },
    });


  return (
  <div className="font-sans">

    <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Users Profile</h2>
    </div>

    <div className="flex gap-2 mt-4" >
    <div className="flex flex-col  gap-2 w-1/3">
      <Card style={{ height:"176px" , width:"100%",}} className="p-3" >
        <div className="flex gap-4 items-start justify-start">
        <Avatar size={96} icon={<UserOutlined />} className="shrink-0"/>
        <div className="flex flex-col">
           <p className="text-2xl font-semibold capitalize"> edwin onyango </p>
           <p className="text-base  text-[#6B7280] font-normal  capitalize"> Role: Admin</p>
        <Button type="primary"> 
         <IoCloudUploadOutline size={12}/>
          Change Picture
        </Button>
        </div>
        </div>
      </Card>

     
      <Card className="mt-4 shrink-0">
        <div className="mb-4">
         <p className="text-xl font-bold">Password information</p>
        </div>

        <form  onSubmit={formik.handleSubmit}>
          <div className="flex gap-4 flex-col">
             <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-semibold">Current Password</label>
              <div className="relative">
                <Input type={showCurrentPassword ? "text" : "password"} name="currentPassword" id="currentPassword" placeholder="***********"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currentPassword}
                  className={`w-full  h-11 border-1.5 ${formik.touched.currentPassword && formik.errors.currentPassword ? "border-red-600": ""}`}
                />
                <button type="button" onClick={toggleCurrentPasswordVisibility} className="absolute right-3 top-2 text-xl text-gray-500 hover:text-gray-700 focus:outline-none">
                  {showCurrentPassword ? (<AiFillEye className="text-2xl" />) : (<AiFillEyeInvisible className="text-2xl"/>)}
                </button>
              </div>

              <div className="w-full">
                <p className="text-xs text-red-600">{formik.touched.currentPassword && formik.errors.currentPassword}</p>
              </div>
            </div>

             <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-semibold">New Password</label>
              <div className="relative">
                <Input type={showNewPassword ? "text" : "password"} name="newPassword" id="newPassword" placeholder="***********"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                  className={`w-full  h-11 border-1.5 ${formik.touched.newPassword && formik.errors.newPassword ? "border-red-600": ""}`}
                />
                <button type="button" onClick={toggleNewPasswordVisibility} className="absolute right-3 top-2 text-xl text-gray-500 hover:text-gray-700 focus:outline-none">
                  {showNewPassword ? (<AiFillEye className="text-2xl" />) : (<AiFillEyeInvisible className="text-2xl"/>)}
                </button>
              </div>

              <div className="w-full">
                <p className="text-xs text-red-600">{formik.touched.newPassword && formik.errors.newPassword}</p>
              </div>
            </div>


             <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-semibold">Confirm New Password</label>
              <div className="relative">
                <Input type={showConfirmNewPassword ? "text" : "password"} name="confirmationPassword" id="confirmationPassword" placeholder="***********"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.confirmationPassword}
                  className={`w-full  h-11 border-1.5 ${formik.touched.confirmationPassword && formik.errors.confirmationPassword ? "border-red-600": ""}`}
                />
                <button type="button" onClick={toggleConfirmNewPasswordVisibility} className="absolute right-3 top-2 text-xl text-gray-500 hover:text-gray-700 focus:outline-none">
                  {showConfirmNewPassword ? (<AiFillEye className="text-2xl" />) : (<AiFillEyeInvisible className="text-2xl"/>)}
                </button>
              </div>

              <div className="w-full">
                <p className="text-xs text-red-600">{formik.touched.confirmationPassword && formik.errors.confirmationPassword}</p>
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button disabled={formik.isSubmitting} loading={formik.isSubmitting} className="h-11" type="primary" htmlType="submit">Update Password</Button>
            </div>

        </div>
        </form>
      </Card>
    </div>

    <div className="w-2/3">
       <Card className="">
         <p className="text-xl font-bold">General information</p>

          <form onSubmit={userInfoFormik.handleSubmit}>
            <div className="w-full flex gap-4">
             <div className="flex w-1/2 flex-col gap-4">
                <div className="flex flex-col gap-1">
                       <label htmlFor="userFirstname" className="text-sm font-semibold">First Name</label>
                       <Input type="text" name="userFirstname" id="userFirstname" placeholder="First Name"
                         onBlur={userInfoFormik.handleBlur}
                         onChange={userInfoFormik.handleChange}
                         value={userInfoFormik.values.userFirstname}
                         className={`w-full  h-11 border-1.5 ${
                           userInfoFormik.touched.userFirstname && userInfoFormik.errors.userFirstname
                             ? "border-red-600"
                             : ""
                         }`}
                       />
                       <div className="w-full">
                         <p className="text-xs text-red-600">{userInfoFormik.touched.userFirstname && userInfoFormik.errors.userFirstname}</p>
                       </div>
                </div>

                <div className="flex flex-col gap-1">
                       <label htmlFor="userEmail" className="text-sm font-semibold"> Email </label>
                       <Input type="text" name="userEmail" id="userEmail" placeholder="Email"
                         onBlur={userInfoFormik.handleBlur}
                         onChange={userInfoFormik.handleChange}
                         value={userInfoFormik.values.userEmail}
                         className={`w-full  h-11 border-1.5 ${
                           userInfoFormik.touched.userEmail && userInfoFormik.errors.userEmail
                             ? "border-red-600"
                             : ""
                         }`}
                       />
                       <div className="w-full">
                         <p className="text-xs text-red-600">{userInfoFormik.touched.userEmail && userInfoFormik.errors.userEmail}</p>
                       </div>
                </div>


                <div className="flex flex-col gap-1">
                       <label htmlFor="userPhone" className="text-sm font-semibold">Phone Number</label>
                       <Input type="text" name="userPhone" id="userPhone" placeholder="Phone Number"
                         onBlur={userInfoFormik.handleBlur}
                         onChange={userInfoFormik.handleChange}
                         value={userInfoFormik.values.userPhone}
                         className={`w-full h-11 border-1.5 ${
                           userInfoFormik.touched.userPhone && userInfoFormik.errors.userPhone
                             ? "border-red-600"
                             : ""
                         }`}
                       />
                       <div className="w-full">
                         <p className="text-xs text-red-600">{userInfoFormik.touched.userPhone && userInfoFormik.errors.userPhone}</p>
                       </div>
                </div>


                 <div className="flex flex-col gap-1">
                  <label htmlFor="countryCode" className="text-sm font-semibold"> Country</label>
                  <Select showSearch type="text" name="userCountryCode" id="userCountryCode" placeholder="Select user country."
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      Array.isArray(countries)
                        ? countries &&
                          countries.map((country) => ({
                            value: country.countryCode,
                            label: country.countryName,
                          }))
                        : []
                    }
                    onBlur={userInfoFormik.handleBlur}
                    onChange={(value) =>
                      userInfoFormik.setFieldValue("userCountryCode", value)
                    }
                    value={userInfoFormik.values.userCountryCode}
                    className={`w-full h-11 border-1.5 rounded-lg ${
                      userInfoFormik.touched.userCountryCode &&
                      userInfoFormik.errors.userCountryCode
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600"> {userInfoFormik.touched.userCountryCode && userInfoFormik.errors.userCountryCode}</p>
                  </div>
                </div>

             </div>


              <div className="flex w-1/2 flex-col gap-4">
                <div className="flex flex-col gap-1">
                       <label htmlFor="userLastname" className="text-sm font-semibold">Last Name</label>
                       <Input type="text" name="userLastname" id="userLastname" placeholder="Last Name"
                         onBlur={userInfoFormik.handleBlur}
                         onChange={userInfoFormik.handleChange}
                         value={userInfoFormik.values.userLastname}
                         className={`w-full  h-11 border-1.5 ${
                          userInfoFormik.touched.userLastname && userInfoFormik.errors.userLastname
                             ? "border-red-600"
                             : ""
                         }`}
                       />
                       <div className="w-full">
                         <p className="text-xs text-red-600">{userInfoFormik.touched.userLastname && userInfoFormik.errors.userLastname}</p>
                       </div>
                </div>
                

                <div className="flex flex-col gap-1">
                       <label htmlFor="userIdNumber" className="text-sm font-semibold">Id Number</label>
                       <Input type="number" name="userIdNumber" id="userIdNumber" placeholder="Id Number"
                         onBlur={userInfoFormik.handleBlur}
                         onChange={userInfoFormik.handleChange}
                         value={userInfoFormik.values.userIdNumber}
                         className={`w-full  h-11 border-1.5 ${
                           userInfoFormik.touched.userIdNumber && userInfoFormik.errors.userIdNumber
                             ? "border-red-600"
                             : ""
                         }`}
                       />
                       <div className="w-full">
                         <p className="text-xs text-red-600">{userInfoFormik.touched.userIdNumber && userInfoFormik.errors.userIdNumber}</p>
                       </div>
                </div>

                <div className="flex flex-col gap-1">
                       <label htmlFor="userHudumaNo" className="text-sm font-semibold">Huduma Number</label>
                       <Input type="number" name="userHudumaNo" id="userHudumaNo" placeholder="Huduma Number"
                         onBlur={userInfoFormik.handleBlur}
                         onChange={userInfoFormik.handleChange}
                         value={userInfoFormik.values.userHudumaNo}
                         className={`w-full  h-11 border-1.5 ${
                           userInfoFormik.touched.userHudumaNo && userInfoFormik.errors.userHudumaNo
                             ? "border-red-600"
                             : ""
                         }`}
                       />
                       <div className="w-full">
                         <p className="text-xs text-red-600">{userInfoFormik.touched.userHudumaNo && userInfoFormik.errors.userHudumaNo}</p>
                       </div>
                </div>

             <div className="mt-8 w-full flex justify-end">
              <Button className="h-11" type="primary" htmlType="submit">Update Info</Button>
            </div>
          </div>
        </div>
      </form>

      </Card>
     </div>
    </div>
  </div>
    )
};

export default UserProfile;
