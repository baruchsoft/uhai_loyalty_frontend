import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Input, Select, Spin } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {addAUser,deleteAUser,getAllUsers,getAUser,resetUserState,updateAUser} from "../features/user/userSlice";
import { getAllRoles } from "../features/role/roleSlice";
import { getAllCountries } from "../features/country/countrySlice";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Full Name",
    dataIndex: "fullname",
  },
  {
    title: "Email",
    dataIndex: "email",
  },

  {
    title: "Phone Number",
    dataIndex: "userPhoneNumber",
  },

  {
    title: "ID Number",
    dataIndex: "userIdNumber",
  },
  {
    title: "Role",
    dataIndex: "role",
  },

  {
    title: "Country",
    dataIndex: "userCountryCode",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const phoneNumberRegex = /^(\+?[1-9]\d{1,14}|0\d{1,14})$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const idNumberRegex = /^[A-Za-z0-9\-\s]{5,20}$/;
const hudumaNumberRegex = /^\d{8}$/;

const ADD_USER_SCHEMA = Yup.object().shape({
  userFirstname: Yup.string().required("Please provide your first name."),
  userLastname: Yup.string().required("Please provide your last name."),
  userEmail: Yup.string().email("Please provide a valid email address.").matches(emailRegex, "Please provide a valid email address format.").max(50, "Email must not exceed 50 characters.").required("Please provide your email address."),
  userPhone: Yup.string().matches(phoneNumberRegex, "Please provide a valid phone number.").required("Please provide your phone number."),
  userIdNumber: Yup.string().matches(idNumberRegex, "Please provide a valid ID number.").required("Please provide your ID number."),
  userHudumaNo: Yup.string().matches(hudumaNumberRegex,"Please provide a valid kenyan huduma number."),
  roleId: Yup.string().required("Please select user role."),
  userCountryCode: Yup.number().typeError("Country code must be a number.").required("Please select your country name."),
  userStatus: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Please select a valid status.").required("Please select user status."),
});

const Users = () => {
  const [length, setLength] = useState(8);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    let charset = lowerCase + upperCase;
    if (includeNumbers) charset += digits;
    if (includeSymbols) charset += specialChars;

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    return newPassword;
  };

  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const addAUserSuccess = useSelector(
    (state) => state?.user?.success?.addAUser
  );
  const addedUser = useSelector((state) => state?.user?.addedUser);
  const addAUserLoading = useSelector(
    (state) => state?.user?.loading?.addAUser
  );
  const users = useSelector((state) => state?.user?.users);
  const roles = useSelector((state) => state?.role?.roles);
  console.log(roles)

  // Rove admin from list of roles
  const formatedRoles = Array.isArray(roles) && roles?.filter((role)=> role?.roleName !== "Admin")
  console.log(formatedRoles)


  const countries = useSelector((state) => state?.country?.countries);
  const getAllUsersLoading = useSelector((state) => state?.user?.loading?.getAllUsers);
  const deleteAUserLoading = useSelector((state) => state?.user?.loading.deleteAUser);
  const updateAUserLoading = useSelector((state) => state?.user?.loading?.updateAUser);
  const updatedUser = useSelector((state) => state?.user?.updatedUser);
  const updateAUserSuccess = useSelector((state) => state?.user?.success?.updateAUser);
  const deleteAUserSuccess = useSelector((state) => state?.user?.success?.deleteAUser);
  const deletedUser = useSelector((state) => state?.user?.deletedUser);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    formik.resetForm();
  }, []);

  const showDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteModalCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const showEditModal = async (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
    await dispatch(getAUser(user?.id));
  };

  const formik = useFormik({
    initialValues: {
      userFirstname: editingUser?.firstname || "",
      userLastname: editingUser?.lastname || "",
      userEmail: editingUser?.email || "",
      userPhone: editingUser?.userPhoneNumber || "",
      userIdNumber: editingUser?.userIdNumber || "",
      userHudumaNo: editingUser?.userHudumaNumber || "",
      userCountryCode: editingUser?.country?.countryCode || null,
      roleId: editingUser?.role.roleName || null,
      userStatus: editingUser?.userStatus || null,
    },
    enableReinitialize: true,
    validationSchema: ADD_USER_SCHEMA,
    onSubmit: (values) => {
      const userData = { ...values };
      if (!editingUser) {
        const generatedPassword = generatePassword();
        userData.userPassword = generatedPassword;
      }
      if (editingUser) {
        dispatch(
          updateAUser({ userId: editingUser?.id,userData})
        );
        dispatch(getAllRoles());
        dispatch(getAllCountries());
      } else {
        dispatch(addAUser(userData));
        dispatch(getAllRoles());
        dispatch(getAllCountries());
      }
    },
  });

  useEffect(() => {
    dispatch(getAllRoles());
    dispatch(getAllCountries());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (addAUserSuccess && addedUser) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetUserState());
      dispatch(getAllUsers());
      dispatch(getAllRoles());
      dispatch(getAllCountries());
    }
  }, [addAUserSuccess, addedUser, dispatch]);

  useEffect(() => {
    if (updateAUserSuccess && updatedUser) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetUserState());
      dispatch(getAllUsers());
      dispatch(getAllRoles());
      dispatch(getAllCountries());
      setEditingUser(null);
    }
  }, [updateAUserSuccess, updatedUser, dispatch]);

  const dataSource =
    users && Array.isArray(users)
      ? users.map((user, index) => ({
            key: index + 1,
            fullname: user?.firstname + " " + user?.lastname,
            email: user?.email,
            userStatus: user?.userStatus,
            userPhoneNumber: user?.userPhoneNumber,
            userIdNumber: user?.userIdNumber,
            role: user?.role?.roleName,
            userCountryCode: user?.country?.countryName,
            action: (
              <>
                <div className="flex flex-row items-center gap-8">
                  <button type="button" onClick={() => showEditModal(user)}>
                    <FaEdit className="text-blue-600 font-normal text-xl" />
                  </button>
                  <button type="button" onClick={() => {setSelectedUserId(user?.id);showDeleteModal();}}>
                    <MdDelete className="text-red-600 font-normal text-xl" />
                  </button>
                </div>
              </>
            ),
          }))
      : [];

  const deleteUser = async () => {
    if (selectedUserId) {
      await dispatch(deleteAUser(selectedUserId));
    }
  };
  useEffect(() => {
    if (deleteAUserSuccess && deletedUser) {
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
      dispatch(resetUserState());
      dispatch(getAllUsers());
      dispatch(getAllRoles());
      dispatch(getAllCountries());
    }
  }, [deleteAUserSuccess, deletedUser, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Users</h2>
          <Button type="primary" htmlType="button" onClick={showModal} className="text-sm font-semibold  px-6 h-10 text-white font-sans "> + New User</Button>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={<h2 className="text-xl font-semibold">{editingUser ? "Edit user" : "Add a new user"}</h2>}
        width={720} open={isModalOpen || isEditModalOpen} footer={null}
        onCancel={() => {handleCancel();setIsEditModalOpen(false); setEditingUser(null);}}
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-center items-center md:gap-8 mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="userFirstname" className="text-sm font-semibold">
                    First Name
                  </label>
                  <Input type="text" id="userFirstname" name="userFirstname" placeholder="First Name"
                    onBlur={(e) => {
                      formik.setFieldValue(
                        "userFirstname",
                        e.target.value.toLowerCase().split(" ").map(
                            (word) =>word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
                      formik.handleBlur(e);
                    }}
                    onChange={formik.handleChange}
                    value={formik.values.userFirstname}
                    className={`w-80 lg:w-72 md:w-64 h-11 border-1.5 ${
                      formik.touched.userFirstname &&
                      formik.errors.userFirstname
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.userFirstname &&
                        formik.errors.userFirstname}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="userLastname"
                    className="text-sm font-semibold"
                  >
                    Last Name
                  </label>
                  <Input
                    type="text"
                    name="userLastname"
                    placeholder="Last Name"
                    id="userLastname"
                    onBlur={(e) => {
                      formik.setFieldValue(
                        "userLastname",
                        e.target.value
                          .toLowerCase()
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      );
                      formik.handleBlur(e);
                    }}
                    onChange={formik.handleChange}
                    value={formik.values.userLastname}
                    className={`w-80 lg:w-72 md:w-64 h-11 border-1.5 ${
                      formik.touched.userLastname && formik.errors.userLastname
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.userLastname &&
                        formik.errors.userLastname}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="userEmail" className="text-sm font-semibold">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="userEmail"
                    id="userEmail"
                    placeholder="e.g. example@gmail.com"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.userEmail}
                    className={`w-80 lg:w-72 md:w-64 h-11 border-1.5 ${
                      formik.touched.userEmail && formik.errors.userEmail
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.userEmail && formik.errors.userEmail}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="userPhone" className="text-sm font-semibold">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="userPhone"
                    id="userPhone"
                    placeholder="e.g. 0712345678"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.userPhone}
                    className={`w-80 lg:w-72 h-11 md:w-64 border-1.5 ${
                      formik.touched.userPhone && formik.errors.userPhone
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.userPhone && formik.errors.userPhone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="userIdNumber"
                    className="text-sm font-semibold"
                  >
                    ID Number
                  </label>
                  <Input
                    type="text"
                    name="userIdNumber"
                    id="userIdNumber"
                    placeholder="e.g. 12345678"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.userIdNumber}
                    className={`w-80 lg:w-72 md:w-64 h-11 border-1.5 ${
                      formik.touched.userIdNumber && formik.errors.userIdNumber
                        ? "border-red-600"
                        : ""
                    }`}
                    min={1}
                    max={12}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.userIdNumber &&
                        formik.errors.userIdNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="userHudumaNo"
                    className="text-sm font-semibold"
                  >
                    Huduma Number
                  </label>
                  <Input
                    type="text"
                    name="userHudumaNo"
                    id="userHudumaNo"
                    placeholder="e.g. 12345678"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.userHudumaNo}
                    className={`w-80 lg:w-72 h-11 md:w-64 border-1.5 ${
                      formik.touched.userHudumaNo && formik.errors.userHudumaNo
                        ? "border-red-600"
                        : ""
                    }`}
                    min={1}
                    max={12}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.userHudumaNo &&
                        formik.errors.userHudumaNo}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="roleId" className="text-sm font-semibold">
                    Role
                  </label>
                  <Select
                    showSearch
                    type="text"
                    name="roleId"
                    id="roleId"
                    placeholder="Select user role"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      Array.isArray(formatedRoles)
                        ? formatedRoles &&
                          formatedRoles.map((role) => ({
                            value: role.roleCode,
                            label: role.roleName,
                          }))
                        : []
                    }
                    onBlur={formik.handleBlur}
                    onChange={(value) => formik.setFieldValue("roleId", value)}
                    value={formik.values.roleId}
                    className={`w-80 lg:w-72 h-11 border-1.5 md:w-64 rounded-lg ${
                      formik.touched.roleId && formik.errors.roleId
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.roleId && formik.errors.roleId}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="countryCode"
                    className="text-sm font-semibold"
                  >
                    Country
                  </label>
                  <Select
                    showSearch
                    type="text"
                    name="userCountryCode"
                    id="userCountryCode"
                    placeholder="Select user country."
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
                    onBlur={formik.handleBlur}
                    onChange={(value) =>
                      formik.setFieldValue("userCountryCode", value)
                    }
                    value={formik.values.userCountryCode}
                    className={`w-80 lg:w-72 h-11 border-1.5 md:w-64 rounded-lg ${
                      formik.touched.userCountryCode &&
                      formik.errors.userCountryCode
                        ? "border-red-600"
                        : ""
                    }`}
                  />

                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.userCountryCode &&
                        formik.errors.userCountryCode}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="userStatus" className="text-sm font-semibold">Status</label>
                  <Select
                    type="text"
                    name="userStatus"
                    id="userStatus"
                    placeholder="Status"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "ACTIVE",
                        label: "ACTIVE",
                      },
                      {
                        value: "INACTIVE",
                        label: "INACTIVE",
                      },
                    ]}
                    onBlur={formik.handleBlur}
                    onChange={(value) =>
                      formik.setFieldValue("userStatus", value)
                    }
                    value={formik.values.userStatus}
                    className={`w-80 lg:w-72 h-11 border-1.5 md:w-64 rounded-lg ${
                      formik.touched.userStatus && formik.errors.userStatus
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.userStatus && formik.errors.userStatus}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-8 lg:gap-12 mt-4 ">
                  <Button
                    htmlType="button"
                    onClick={() => {
                      handleCancel();
                      setIsEditModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="w-28 text-sm font-semibold h-10 font-sans"
                  >
                    Cancel
                  </Button>

                  {addAUserLoading || updateAUserLoading ? (
                    <Button
                      type="primary"
                      htmlType="button"
                      loading
                      className="w-28 text-sm font-semibold h-10 text-white font-sans"
                    >
                      Please wait...
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={addAUserLoading || updateAUserLoading}
                      className="w-28 text-sm font-semibold h-10 text-white font-sans"
                    >
                      {editingUser ? "Update" : "Submit"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <div>
        {getAllUsersLoading ? (
          <div className="flex flex-row items-center justify-center mt-20">
            <Spin
              indicator={
                <Loading3QuartersOutlined
                  style={{
                    fontSize: 40,
                    color: "#000",
                  }}
                  spin
                />
              }
            />
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <Table
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: "max-content" }}
            />
          </div>
        )}
      </div>

      {/* delete user modal */}
      <Modal
        title="Confirm user deletion?"
        open={isDeleteModalOpen}
        footer={null}
        onCancel={handleDeleteModalCancel}
      >
        <div>
          <p className="text-sm">Are you sure you want to delete this user? </p>
        </div>

        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button
            htmlType="button"
            onClick={handleDeleteModalCancel}
            className="w-28 text-sm font-semibold h-10 font-sans"
          >
            Cancel
          </Button>

          {deleteAUserLoading ? (
            <Button
              type="primary"
              htmlType="button"
              loading
              className="w-28 text-sm font-semibold h-10 text-white font-sans"
            >
              Please wait...
            </Button>
          ) : (
            <Button
              onClick={deleteUser}
              type="primary"
              htmlType="button"
              disabled={deleteAUserLoading}
              className="w-28 text-sm font-semibold h-10 text-white font-sans"
            >
              Delete
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Users;
