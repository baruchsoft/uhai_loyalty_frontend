import { Button, Input, Modal, Select, Spin, Table, DatePicker } from "antd";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import {addAPos,deleteAPos,getAllPoses,getAPos,resetPosState,updateAPos} from "../features/pos/posSlice";
import { getAllVillages } from "../features/village/villageSlice";
import { getAllCampuses } from "../features/campus/campusSlice";
import { getAllPosTypes } from "../features/posTypes/posTypeSlice";
import { getAllCounties } from "../features/county/countySlice";
import { getAllConstituencies } from "../features/constituency/constituencySlice";
import { getAllWards } from "../features/ward/wardSlice";
import { getAllSubLocations } from "../features/subLocation/subLocationSlice";
import dayjs from "dayjs";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Group Name",
    dataIndex: "groupName",
  },
  {
    title: "Description",
    dataIndex: "posDescription",
  },
  {
    title: "Mobile Number",
    dataIndex: "mobileNumber",
  },
  {
    title: "Date Of Registration",
    dataIndex: "dateOfRegistration",
  },
   {
    title: "Physical Address",
    dataIndex: "physicalAddress",
  },
     {
    title: "Number Of Members",
    dataIndex: "numberOfMembers",
  },
  {
    title: "posStatus",
    dataIndex: "posStatus",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];


// {
//   "posTypeCode": 0,
//   "posName": "string",
//   "posDescription": "string",
//   "posVillageCode": 0,
//   "posCampusCode": 0,
//   "posStatus": "ACTIVE",
//   "groupName": "string",
//   "mobileNumber": "string",
//   "emailAddress": "string",
//   "dateOfRegistration": "2025-05-25",
//   "physicalAddress": "string",
//   "signingOptions": "string",
//   "otherInstructions": "string",
//   "numberOfMembers": "string",
//   "refereeFullName": "string",
//   "refereeMemberNumber": "string",
//   "county": "string",
//   "subCounty": "string",
//   "ward": "string",
//   "subLocation": "string",
//   "villageEstate": "string"
// }


const phoneNumberRegex = /^(\+?[1-9]\d{1,14}|0\d{1,14})$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const idNumberRegex = /^[A-Za-z0-9\-\s]{5,20}$/;
const hudumaNumberRegex = /^\d{8}$/;

const POS_SCHEMA = Yup.object().shape({
  posName: Yup.string().required("Please provide point of sale name."),
  posDescription: Yup.string().required("Please provide point of sale description."),
  posTypeCode: Yup.number().typeError("Point of sale type code must be a number.").required("Please select point of sale type."),
  posVillageCode: Yup.number().typeError("Point of sale village code must be a number.").required("Please select point of sale village."),
  posCampusCode: Yup.number().typeError("Point of sale campus code must be a number.").required("Please select point of sale campus."),
  posStatus:Yup.string().oneOf(["ACTIVE","INACTIVE"]).required("Please select point of sale status."),
  groupName:Yup.string().required("Please provide group name."),
  mobileNumber:Yup.string().matches(phoneNumberRegex,"Please provide a valid phone number.").required("Please provide group phone number."),
  emailAddress:Yup.string().email("Please provide a valid email").matches(emailRegex, "Please provide a valid email.").required("Please provide group email address."),
  dateOfRegistration: Yup.date().required("Select group registration date.").min(dayjs().subtract(1, 'day').toDate(), "Date cannot be in the past."),
  physicalAddress:Yup.string().required("Please provide a physical address."),
  signingOptions:Yup.string().required("Please provide a sign in options."),
  otherInstructions:Yup.string(),
  numberOfMembers:Yup.number().required("Please provide number of members of the group."),
  refereeFullName: Yup.string(),
  refereeMemberNumber:Yup.string(),
  county:Yup.string().required("Please select country."),
  subCounty:Yup.string().required("Please select sub county."),
  ward:Yup.string().required("Select ward."),
  subLocation:Yup.string().required("Select sub location."),
  villageEstate:Yup.string().required("select Village."),
});

const Pos = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openSignatoriesModal,setOpenSignatoriesModal] = useState(false)
  const [selectedPosCode, setSelectedPosCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState(false);

  const getAllPosLoading = useSelector((state) => state?.pos?.loading?.getAllPoses);
  const poses = useSelector((state) => state?.pos?.poses);

  const addAPosLoading = useSelector((state) => state?.pos?.loading?.addAPos);
  const updateAPosLoading = useSelector((state) => state?.posType?.loading?.updateAPos);
  const deleteAPosLoading = useSelector((state) => state?.pos?.loading?.deleteAPos);

  const addAPosSuccess = useSelector((state) => state?.pos?.success?.addAPos);
  const updateAPosSuccess = useSelector((state) => state?.pos?.success?.updateAPos);
  const deleteAPosSuccess = useSelector((state) => state?.pos?.success?.deleteAPos);
  const posTypes = useSelector((state) => state?.posType?.posTypes);
  const villages = useSelector((state) => state?.village?.villages);
  const campuses = useSelector((state) => state?.campus?.campuses);
  const counties = useSelector((state)=>state?.county?.counties)
  const constituencies = useSelector((state) => state?.constituency?.constituencies);
  const wards = useSelector((state)=>state?.ward?.wards)
  const subLocations = useSelector((state) => state?.subLocation?.subLocations);
    
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

  const handleOpenSignatoriesModal = ()=>{
       setOpenSignatoriesModal(true)
    }

    const handleCloseSignatoriesModal = ()=>{
       setOpenSignatoriesModal(true)
    }

  const showEditModal = async (pos) => {
    setEditingPos(pos);
    setIsEditModalOpen(true);
    await dispatch(getAPos(pos?.posCode));
  };

  const formik = useFormik({
    initialValues: {
      posName: editingPos?.posName || "",
      posDescription: editingPos?.posDescription || "",
      posTypeCode: editingPos?.posTypeCode || null,
      posVillageCode: editingPos?.posVillageCode || null,
      posCampusCode: editingPos?.posCampusCode || null,
      posStatus:editingPos?.posStatus || null,
      groupName: editingPos?.groupName || "",
      mobileNumber: editingPos?.mobileNumber || "",
      emailAddress: editingPos?.emailAddress || "",
      dateOfRegistration: editingPos?.dateOfRegistration || null,
      physicalAddress: editingPos?.physicalAddress || null,
      signingOptions: editingPos?.signingOptions || null,
      otherInstructions:editingPos?.otherInstructions || "",
      numberOfMembers: editingPos?.numberOfMembers || "",
      refereeFullName: editingPos?.refereeFullName || "",
      refereeMemberNumber:editingPos?.refereeMemberNumber || "",
      county:editingPos?.county || null,
      subCounty: editingPos?.subCounty || null,
      ward:editingPos?.ward || null,
      subLocation: editingPos?.subLocation || null,
      villageEstate:editingPos?.villageEstate || null,
    },

    enableReinitialize: true,
    validationSchema: POS_SCHEMA,
    onSubmit: (values) => {
      if (editingPos) {
        dispatch(
          updateAPos({ posCode: editingPos?.posCode, posData: values,})
        );
      } else {
        dispatch(addAPos(values));
      }
    },
  });

  useEffect(() => {
    const fetchInitialData = async ()=>{
      await Promise.all([
         dispatch(getAllPoses()),
         dispatch(getAllPosTypes()),
         dispatch(getAllVillages()),
         dispatch(getAllCampuses()),
         dispatch(getAllCounties()),
         dispatch(getAllConstituencies()),
         dispatch(getAllWards()),
         dispatch(getAllSubLocations()),
         dispatch(getAllVillages()),
      ])
    }
   fetchInitialData()
  }, [dispatch]);

  useEffect(() => {
    if (addAPosSuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(getAllPoses())
    }
  }, [addAPosSuccess]);

  useEffect(() => {
    if (updateAPosSuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      setEditingPos(null);
      dispatch(getAllPoses());
    }
  }, [updateAPosSuccess]);


  const dataSource =
    poses && Array.isArray(poses)
      ? poses.map((pos, index) => ({
          key: index + 1,
          groupName: pos?.groupName,
          mobileNumber:pos?.mobileNumber,
          posDescription: pos?.posDescription,
          dateOfRegistration: pos?.dateOfRegistration,
          physicalAddress: pos?.physicalAddress,
          numberOfMembers:pos?.numberOfMembers,
          posStatus: pos?.posStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8 ">
                <button type="button" onClick={() => showEditModal(pos)}>
                  <FaEdit className="text-blue-600 font-medium text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPosCode(pos?.posCode);
                    showDeleteModal();
                  }}
                >
                  <MdDelete className="text-red-600  font-medium  text-xl" />
                </button>
              </div>
            </>
          ),
        }))
      : [];

  const deletePos = async () => {
    if (selectedPosCode) {
      await dispatch(deleteAPos(selectedPosCode));
    }
  };

  useEffect(() => {
    if (deleteAPosSuccess) {
      setIsDeleteModalOpen(false);
      setSelectedPosCode(null);
      dispatch(resetPosState())
      dispatch(getAllPoses());
    }
  }, [deleteAPosSuccess]);
  
   const signingOptions = [
    {id:1, name:"Email & Password"},
    { id:2, name:"Group Number & Password"}
   ]
  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Groupes</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal} className="text-sm font-semibold px-6 h-10 text-white font-sans ">+ New Group</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">
              {editingPos ? "Edit group" : "Add a new group"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setIsEditModalOpen(false);
          setEditingPos(null);
        }}
        width={1032}
        className="font-sans"
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center flex-col gap-3  mt-4">
              <div className="flex justify-start lg:gap-8">

                <div className="flex gap-4"> 

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="posName" className="text-sm font-semibold">Point of Sale Name </label>
                    <Input type="text" id="posName" name="posName"
                      placeholder="e.g. Maseno Canteen"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "posName",
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
                      value={formik.values.posName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.posName && formik.errors.posName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posName && formik.errors.posName}
                      </p>
                    </div>
                  </div>



                  <div className="flex flex-col gap-1">
                    <label htmlFor="posDescription" className="text-sm font-semibold">
                     Point of Sale Description
                    </label>
                    <Input
                      placeholder="e.g. Maseno Canteen"
                      type="text"
                      name="posDescription"
                      id="posDescription"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "posDescription",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.posDescription}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.posDescription &&
                        formik.errors.posDescription
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posDescription &&
                          formik.errors.posDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="posTypeCode"
                      className="text-sm font-semibold"
                    >
                     Point of Sale Type
                    </label>
                    <Select
                      placeholder="Select Point of Sale Type."
                      type="text"
                      name="posTypeCode"
                      id="posTypeCode"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(posTypes)
                          ? posTypes &&
                            posTypes.map((posType) => ({
                              value: posType.posTypeCode,
                              label: posType.posTypeName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("posTypeCode", value)
                      }
                      value={formik.values.posTypeCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.posTypeCode && formik.errors.posTypeCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posTypeCode &&
                          formik.errors.posTypeCode}
                      </p>
                    </div>
                  </div>


                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="posVillageCode"
                      className="text-sm font-semibold"
                    >
                      Point of Sale Village 
                    </label>
                    <Select
                      placeholder="Select Point of Sale Village."
                      type="text"
                      name="posVillageCode"
                      id="posVillageCode"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(villages)
                          ? villages &&
                            villages.map((village) => ({
                              value: village.villageCode,
                              label: village.villageName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("posVillageCode", value)
                      }
                      value={formik.values.posVillageCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.posVillageCode &&
                        formik.errors.posVillageCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posVillageCode &&
                          formik.errors.posVillageCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="posCampusCode" className="text-sm font-semibold">Point of Sale Campus</label>
                    <Select placeholder="Select Point of Sale Campus." type="text" name="posCampusCode" id="posCampusCode"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(campuses)
                          ? campuses &&
                            campuses.map((campus) => ({
                              value: campus.campusCode,
                              label: campus.campusName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("posCampusCode", value)
                      }
                      value={formik.values.posCampusCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.posCampusCode &&
                        formik.errors.posCampusCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posCampusCode &&
                          formik.errors.posCampusCode}
                      </p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-1">
                    <label htmlFor="groupName" className="text-sm font-semibold">Group Name</label>
                    <Input type="text" id="groupName" name="groupName"
                      placeholder="e.g. Wagai Self Help Group"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "groupName",
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
                      value={formik.values.groupName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.groupName && formik.errors.groupName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.groupName && formik.errors.groupName}
                      </p>
                    </div>
                  </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="mobileNumber" className="text-sm font-semibold"> Phone Number</label>
                      <Input type="tel" name="mobileNumber" id="mobileNumber" placeholder="e.g. 0712345678" 
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.mobileNumber}
                        className={`w-80 h-11 border-1.5 ${
                          formik.touched.mobileNumber && formik.errors.mobileNumber
                            ? "border-red-600"
                            : ""
                        }`} 
                      />
                      <div>
                        <p className="text-xs text-red-600">
                          {formik.touched.mobileNumber && formik.errors.mobileNumber}
                        </p>
                      </div>
                  </div>

                </div>


                 <div className="flex flex-col gap-3">
                  
               <div className="flex flex-col gap-1">
                  <label htmlFor="emailAddress" className="text-sm font-semibold"> Email Address </label>
                  <Input type="email" name="emailAddress" id="emailAddress" placeholder="e.g. example@gmail.com" 
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.emailAddress}
                    className={`w-80 h-11 border-1.5 ${
                      formik.touched.emailAddress && formik.errors.emailAddress
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.emailAddress && formik.errors.emailAddress}
                    </p>
                  </div>
                </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="physicalAddress" className="text-sm font-semibold">Physical Address</label>
                    <Input placeholder="e.g. Wagai CBD" type="text" name="physicalAddress" id="physicalAddress"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "physicalAddress",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.physicalAddress}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.physicalAddress &&
                        formik.errors.physicalAddress
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.physicalAddress && formik.errors.physicalAddress}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="dateOfRegistration" className="text-sm font-semibold">Date Of Registration</label>
                       <DatePicker id="dateOfRegistration" name="dateOfRegistration" placeholder="Select Registration Date"
                          className={`w-80 h-11 border-1.5 ${
                            formik.touched.dateOfRegistration && formik.errors.dateOfRegistration
                              ? "border-red-600"
                              : ""
                          }`}
                          value={formik.values.dateOfRegistration ? dayjs(formik.values.dateOfRegistration) : null}
                          onChange={(date) => {formik.setFieldValue("dateOfRegistration", date ? date.format('YYYY-MM-DD') : "")}}
                          onBlur={formik.handleBlur}
                        />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.dateOfRegistration && formik.errors.dateOfRegistration}</p>
                    </div>
                  </div>

                 <div className="flex flex-col gap-1">
                    <label htmlFor="signingOptions" className="text-sm font-semibold">Signing Options</label>
                    <Select placeholder="Select Sign in Option." type="text" name="signingOptions" id="signingOptions"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(signingOptions)
                          ? signingOptions &&
                            signingOptions.map((option) => ({
                              value: option.name,
                              label: option.name,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("signingOptions", value)
                      }
                      value={formik.values.signingOptions}
                      className={`w-80 h-11 border-1.5 rounded-lg ${formik.touched.signingOptions && formik.errors.signingOptions
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.signingOptions && formik.errors.signingOptions}</p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-1">
                    <label htmlFor="otherInstructions" className="text-sm font-semibold">Other Instructions</label>
                    <Input placeholder="e.g. Wagai CBD" type="text" name="otherInstructions" id="otherInstructions"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "otherInstructions",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.otherInstructions}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.otherInstructions &&
                        formik.errors.otherInstructions
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.otherInstructions && formik.errors.otherInstructions}</p>
                    </div>
                  </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="numberOfMembers" className="text-sm font-semibold">Number Of Members</label>
                      <Input type="number" name="numberOfMembers" id="numberOfMembers" placeholder="e.g. 0712345678" 
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.numberOfMembers}
                        className={`w-80 h-11 border-1.5 ${
                          formik.touched.numberOfMembers && formik.errors.numberOfMembers
                            ? "border-red-600"
                            : ""
                        }`} 
                        min={0}
                        maxLength={12}
                      />
                      <div>
                        <p className="text-xs text-red-600">
                          {formik.touched.numberOfMembers && formik.errors.numberOfMembers}
                        </p>
                      </div>
                  </div>

                   <div className="flex flex-col gap-1">
                    <label htmlFor="refereeFullName" className="text-sm font-semibold">Referee Full Name</label>
                    <Input placeholder="Referee Full Name" type="text" name="refereeFullName" id="refereeFullName"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "refereeFullName",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.refereeFullName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.refereeFullName &&
                        formik.errors.refereeFullName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.refereeFullName && formik.errors.refereeFullName}</p>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="refereeMemberNumber" className="text-sm font-semibold">Referee Member Number</label>
                    <Input placeholder="Referee Member Number" type="number" name="refereeMemberNumber" id="refereeMemberNumber"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "refereeMemberNumber",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.refereeMemberNumber}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.refereeMemberNumber &&
                        formik.errors.refereeMemberNumber
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.refereeMemberNumber && formik.errors.refereeMemberNumber}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="county" className="text-sm font-semibold">County</label>
                    <Select  placeholder="Select County." type="text" name="county" id="county"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(counties)
                          ? counties &&
                            counties.map((county) => ({
                              value: county.countyName,
                              label: county.countyName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("county", value)
                      }
                      value={formik.values.county}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.county && formik.errors.county
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.county && formik.errors.county}</p>
                    </div>
                  </div>


                  <div className="flex flex-col gap-1">
                    <label htmlFor="subCounty" className="text-sm font-semibold" >Sub County</label>
                    <Select  placeholder="Select Sub County." type="text" name="subCounty" id="subCounty"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(constituencies)
                          ? constituencies &&
                            constituencies.map((posType) => ({
                              value: posType.constituencyName,
                              label: posType.constituencyName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("subCounty", value)
                      }
                      value={formik.values.subCounty}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.subCounty && formik.errors.subCounty
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.subCounty && formik.errors.subCounty}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="ward" className="text-sm font-semibold">Ward</label>
                    <Select  placeholder="Select Ward." type="text" name="ward" id="ward"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(wards)
                          ? wards &&
                            wards.map((ward) => ({
                              value: ward.wardName,
                              label: ward.wardName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("ward", value)
                      }
                      value={formik.values.ward}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.ward && formik.errors.ward
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.ward && formik.errors.ward}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="subLocation" className="text-sm font-semibold">Sub Location</label>
                    <Select  placeholder="Select Sub Location." type="text" name="subLocation" id="subLocation"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(subLocations)
                          ? subLocations &&
                            subLocations.map((subLocation) => ({
                              value: subLocation.subLocationName,
                              label: subLocation.subLocationName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("subLocation", value)
                      }
                      value={formik.values.subLocation}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.subLocation && formik.errors.subLocation
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.subLocation && formik.errors.subLocation}</p>
                    </div>
                  </div>


                  <div className="flex flex-col gap-1">
                    <label htmlFor="villageEstate" className="text-sm font-semibold">Village Estate</label>
                    <Select  placeholder="Select Village Estate." type="text" name="villageEstate" id="villageEstate"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(villages)
                          ? villages &&
                            villages.map((village) => ({
                              value: village.villageName,
                              label: village.villageName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("villageEstate", value)
                      }
                      value={formik.values.villageEstate}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.villageEstate && formik.errors.villageEstate
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.villageEstate && formik.errors.villageEstate}</p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-1">
                    <label htmlFor="posStatus" className="text-sm font-semibold">Status</label>
                     <Select type="text"  name="posStatus" id="posStatus" placeholder="Status"
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
                            onChange={(value) => formik.setFieldValue("posStatus", value)}
                            value={formik.values.posStatus}
                            className={`w-80 h-11 border-1.5 rounded-lg ${formik.touched.posStatus && formik.errors.posStatus ? "border-red-600": "" }`}/>
                             <div>
                               <p className="text-xs text-red-600">{formik.touched.posStatus && formik.errors.posStatus}</p>
                            </div>       
                      </div>

                  <div className="flex items-center justify-between  mt-4 ">
                    <Button onClick={() => { handleCancel(); setIsEditModalOpen(false); setEditingPos(null);}} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
                    {addAPosLoading || updateAPosLoading ? (
                      <Button type="primary" htmlType="button"  loading  className="w-28 text-sm font-semibold h-10 text-white font-sans"> Please wait... </Button>
                    ) : (
                      <Button type="primary" htmlType="submit" disabled={addAPosLoading || updateAPosLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans" > {editingPos ? "Update" : "Continue"}</Button>
                    )}
                  </div>
                </div>
              </div>

              </div>
            </div>
          </div>
        </form>
      </Modal>

      <div>
        {getAllPosLoading ? (
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
            <Table  columns={columns} dataSource={dataSource} scroll={{ x: "max-content" }}/>
          </div>
        )}
      </div>

      {/* delete pos  modal */}
      <Modal  title="Confirm group deletion?" open={isDeleteModalOpen} footer={null} onCancel={handleDeleteModalCancel}>
        <div>
          <p className="text-sm">Are you sure you want to delete this group? </p>
        </div>

        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button htmlType="button" onClick={handleDeleteModalCancel} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
          {deleteAPosLoading ? (
            <Button  type="primary" htmlType="button"  loading   className="w-28 text-sm font-semibold h-10 text-white font-sans">Please wait...</Button>
          ) : (
            <Button onClick={deletePos} type="primary" htmlType="button" disabled={deleteAPosLoading}  className="w-28 text-sm font-semibold h-10 text-white font-sans">Delete</Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Pos;
