import { Button, Input, Modal, Select,Table, DatePicker,Typography, Dropdown } from "antd";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {addASignatory,deleteAPos,getAllPoses,getAPos,resetPosState} from "../features/pos/posSlice";
import { getAllVillages } from "../features/village/villageSlice";
import { getAllCampuses } from "../features/campus/campusSlice";
import { getAllPosTypes } from "../features/posTypes/posTypeSlice";
import { getAllCounties } from "../features/county/countySlice";
import { getAllConstituencies } from "../features/constituency/constituencySlice";
import { getAllWards } from "../features/ward/wardSlice";
import { getAllSubLocations } from "../features/subLocation/subLocationSlice";
import { FaCheck } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { addPos, updatePos } from "../features/pos/posService";

const columns = [
  { title: "#", dataIndex: "key",},
  { title: "Group Name",dataIndex: "groupName",},
  { title: "Description", dataIndex: "posDescription",},
  { title: "Mobile Number",dataIndex: "mobileNumber",},
  { title: "Date Of Registration", dataIndex: "dateOfRegistration",},
  { title: "Physical Address", dataIndex: "physicalAddress",},
  { title: "Number Of Members",dataIndex: "numberOfMembers",},
  { title: "Status",dataIndex: "posStatus",},
  { title: "Action",dataIndex: "action",},
];

const phoneNumberRegex = /^(\+?[1-9]\d{1,14}|0\d{1,14})$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const idNumberRegex = /^[A-Za-z0-9\-\s]{5,20}$/;


const POS_SCHEMA = Yup.object().shape({
  posName: Yup.string().required("Please provide point of sale name."),
  posDescription: Yup.string().required("Please provide point of sale description."),
  posTypeCode: Yup.number().typeError("Point of sale type code must be a number.").required("Please select point of sale type."),
  posVillageCode: Yup.number().typeError("Point of sale village code must be a number.").required("Please select point of sale village."),
  posCampusCode: Yup.number().typeError("Point of sale campus code must be a number.").required("Please select point of sale campus."),
  posStatus:Yup.string().oneOf(["ACTIVE","INACTIVE"]).required("Please select point of sale status."),
  groupName:Yup.string().required("Please provide group name."),
  mobileNumber:Yup.string().matches(phoneNumberRegex,"Please provide a valid phone number.").required("Please provide group phone number."),
  email:Yup.string().email("Please provide a valid email").matches(emailRegex, "Please provide a valid email.").required("Please provide group email address."),
  dateOfRegistration: Yup.date().required("Select group registration date."),
  physicalAddress:Yup.string().required("Please provide a physical address."),
  signingOptions:Yup.string().required("Select preffered signing option."),
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

const SIGNATORIES_SCHEMA  = Yup.object().shape({
  fullName: Yup.string().required("Please provide full name."),
  idNumber: Yup.string().matches(idNumberRegex,"Please provide  valid id number.").required("Please provide id number."),
  nationality: Yup.string().required("Please select nationality."),
  designation: Yup.string().required("Please provide designation.")
})

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
  const deleteAPosLoading = useSelector((state) => state?.pos?.loading?.deleteAPos);
  const deleteAPosSuccess = useSelector((state) => state?.pos?.success?.deleteAPos);
  const posTypes = useSelector((state) => state?.posType?.posTypes);
  const villages = useSelector((state) => state?.village?.villages);
  const campuses = useSelector((state) => state?.campus?.campuses);
  const counties = useSelector((state)=>state?.county?.counties)
  const constituencies = useSelector((state) => state?.constituency?.constituencies);
  const wards = useSelector((state)=>state?.ward?.wards)
  const subLocations = useSelector((state) => state?.subLocation?.subLocations);
  const addASignatoryLoading = useSelector((state)=>state?.pos?.loading?.addASignatory)
  const addASignatorySuccess = useSelector((state)=>state?.pos?.success?.addASignatory)
    


   const  [openUploadDocumentsModal,setOpenUploadDocumentsModal] = useState(false)
   const showUploadDocumentModal = useCallback(()=>{
    setOpenUploadDocumentsModal(true)
  })

  const handleCloseUploadDocumentsModal = useCallback(()=>{
    setOpenUploadDocumentsModal(false)
    setSelectedPosCode(null)
  })



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
       setOpenSignatoriesModal(false)
       signatoriesFormik.resetForm()
       setSelectedPosCode(null)
    }

  const showEditModal = async (pos) => {
    setEditingPos(pos);
    setIsEditModalOpen(true);
    await dispatch(getAPos(pos?.posCode));
  };

  const [addingPos,setAddingPos] = useState(false);
  const [updateAPosLoading,setUpdateAPosLoading] = useState(false)

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
      email: editingPos?.email || "",
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
    onSubmit: async (values) => {
      if (editingPos) {
        try {
          setUpdateAPosLoading(true);
          const response = await updatePos({ posCode: editingPos?.posCode, posData: values,});
          if(response.status === 200){
            toast.success("Group updated successfully.")
            handleCancel()
            dispatch(resetPosState())
            setEditingPos(null);
            dispatch(getAllPoses());
            setIsEditModalOpen(false);
            dispatch(getAllPoses());
            dispatch(getAllPosTypes());
            dispatch(getAllVillages());
            dispatch(getAllCampuses());
            dispatch(getAllCounties());
            dispatch(getAllConstituencies());
            dispatch(getAllWards());
            dispatch(getAllSubLocations());
            dispatch(getAllVillages());
          }
        } catch (error) {
          toast.error(error.response.data)
        }finally{
          setUpdateAPosLoading(false)
        }
      } else {
        try {
          setAddingPos(true)
          const response = await addPos(values) 
          if(response.status === 201){
            toast.success("Group created successfully.")
            handleCancel()
            dispatch(resetPosState())
            dispatch(getAllPoses())
            setIsModalOpen(false);
            dispatch(getAllPosTypes());
            dispatch(getAllVillages());
            dispatch(getAllCampuses());
            dispatch(getAllCounties());
            dispatch(getAllConstituencies());
            dispatch(getAllWards());
            dispatch(getAllSubLocations());
            dispatch(getAllVillages());
          }
        } catch (error) {
          toast.error(error?.response?.data?.message)
        }finally{
          setAddingPos(false)
        }
      }
    },
  });

  useEffect(() => {
    const fetchInitialData = async ()=>{
      await Promise.all([
         dispatch(resetPosState()),
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


 // Move the items array inside the dataSource mapping
const dataSource =
  poses && Array.isArray(poses)
    ? poses.map((pos, index) => {
        const items = [
          {
            key: '1',
            label: (
              <div type="button" onClick={()=>{handleOpenSignatoriesModal(); setSelectedPosCode(pos?.posCode) }} style={{ display: "flex", gap: "10px" }}>
                <FaCheck style={{ width: "20px", height: "20px" }} className="text-green-600 font-medium text-xl" />
                <Typography style={{ fontSize: "14px", fontWeight: "400", textAlign: "start" }}>Add Signatories</Typography>
              </div>
            ),
          },
          {
            key: "2",
            label: (
              <div onClick={()=> {showUploadDocumentModal(); setSelectedPosCode(pos?.posCode)}} style={{ display: "flex", gap: "10px" }}>
                <IoDocumentTextOutline style={{ width: "20px", height: "20px" }} className="text-grey-600 font-medium text-xl" />
                <Typography style={{ fontSize: "14px", fontWeight: "400", textAlign: "start" }}>Upload Documents</Typography>
              </div>
            ),
          },
          {
            key: '3',
            label: (
              <div onClick={() => showEditModal(pos)} style={{ display: "flex", gap: "10px" }}>
                <MdOutlineEdit style={{ width: "20px", height: "20px" }} className="text-blue-600 font-medium text-xl" />
                <Typography style={{ fontSize: "14px", fontWeight: "400", textAlign: "start" }}>Edit Group</Typography>
              </div>
            ),
          },
          {
            key: '4',
            label: (
              <div onClick={() => {setSelectedPosCode(pos?.posCode); showDeleteModal(); }} style={{ display: "flex", gap: "10px" }}>
                <RiDeleteBinLine style={{ width: "20px", height: "20px" }} className="text-red-600 font-medium text-xl" />
                <Typography style={{ fontSize: "14px", fontWeight: "400", textAlign: "start" }}>Delete Group</Typography>
              </div>
            ),
          },
        ];

        return {
          key: index + 1,
          groupName: pos?.groupName,
          mobileNumber: pos?.mobileNumber,
          posDescription: pos?.posDescription,
          dateOfRegistration: pos?.dateOfRegistration,
          physicalAddress: pos?.physicalAddress,
          numberOfMembers: pos?.numberOfMembers,
          posStatus: pos?.posStatus,
          action: (
            <Dropdown menu={{ items }} trigger={['click']}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: 'pointer' }}>
                <IoEllipsisVertical style={{ fontSize: "28px", height: "24px", width: "24px" }} />
              </div>
            </Dropdown>
          ),
        };
      })
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
      dispatch(resetPosState());
      dispatch(getAllPoses());
      dispatch(getAllPosTypes());
      dispatch(getAllVillages());
      dispatch(getAllCampuses());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllWards());
      dispatch(getAllSubLocations());
      dispatch(getAllVillages());
    }
  }, [deleteAPosSuccess]);
  
   const signingOptions = [
    {id:1, name:"Singly"},
    { id:2, name:"Jointly"}
   ]

    const signatoriesFormik = useFormik({
      initialValues:{
        fullName:"",
        idNumber:"",
        nationality:"", 
        designation:"",
      },
      validationSchema: SIGNATORIES_SCHEMA,
      onSubmit:(values)=>{
       if(selectedPosCode){
        dispatch(addASignatory({ posCode:selectedPosCode,  signatoryData:values}))
       }
      }
    })

    useEffect(()=>{
      if(addASignatorySuccess){
        signatoriesFormik.resetForm();
        handleCloseSignatoriesModal()
        dispatch(resetPosState());
        dispatch(getAllPoses());
        dispatch(getAllPosTypes());
        dispatch(getAllVillages());
        dispatch(getAllCampuses());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllWards());
        dispatch(getAllSubLocations());
        dispatch(getAllVillages());
      }
    },[addASignatorySuccess, dispatch])

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Groupes</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal} className="text-sm font-semibold px-6 h-10 text-white font-sans ">+ New Group</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={<h2 className="text-xl font-semibold">{editingPos ? "Update group details" : "Add a New Group"}</h2>}
        open={isModalOpen || isEditModalOpen} footer={null} onCancel={() => {handleCancel(); setIsEditModalOpen(false); setEditingPos(null);}}
        width={1032}
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
                      className={`w-80 h-11 ${ formik.touched.posName && formik.errors.posName ? "border-red-600" : "" }`}
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
                      className={`w-80 h-11 ${ formik.touched.posDescription && formik.errors.posDescription ? "border-red-600" : "" }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posDescription && formik.errors.posDescription}
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
                      className={`w-80 h-11 ${ formik.touched.posTypeCode && formik.errors.posTypeCode ? "border-red-600" : "" }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.posTypeCode && formik.errors.posTypeCode} </p>
                    </div>
                  </div>


                  <div className="flex flex-col gap-1">
                    <label htmlFor="posVillageCode" className="text-sm font-semibold" > Point of Sale Village </label>
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
                      className={`w-80 h-11 ${ formik.touched.posVillageCode && formik.errors.posVillageCode ? "border-red-600" : "" }`} />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.posVillageCode && formik.errors.posVillageCode} </p>
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
                      className={`w-80 h-11  ${
                        formik.touched.posCampusCode &&
                        formik.errors.posCampusCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posCampusCode && formik.errors.posCampusCode}
                      </p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-1">
                    <label htmlFor="groupName" className="text-sm font-semibold">Group Name</label>
                    <Input type="text" id="groupName" name="groupName" placeholder="e.g. Wagai Self Help Group"
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
                      className={`w-80 h-11 ${ formik.touched.groupName && formik.errors.groupName ? "border-red-600" : "" }`}
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
                        className={`w-80 h-11 ${
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
                  <label htmlFor="email" className="text-sm font-semibold"> Email Address </label>
                  <Input type="email" name="email" id="email" placeholder="e.g. example@gmail.com" 
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className={`w-80 h-11  ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">
                      {formik.touched.email && formik.errors.email}
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
                      className={`w-80 h-11 ${
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
                          className={`w-80 h-11  ${
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
                      className={`w-80 h-11 ${formik.touched.signingOptions && formik.errors.signingOptions
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
                      className={`w-80 h-11 ${
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
                        className={`w-80 h-11 ${
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
                      className={`w-80 h-11 ${
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
                    <Input placeholder="Referee Member Number" type="text" name="refereeMemberNumber" id="refereeMemberNumber"
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
                      className={`w-80 h-11 ${
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
                      className={`w-80 h-11  ${
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
                      className={`w-80 h-11 ${
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
                      className={`w-80 h-11 ${ formik.touched.ward && formik.errors.ward ? "border-red-600" : "" }`}
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
                      className={`w-80 h-11 ${ formik.touched.subLocation && formik.errors.subLocation ? "border-red-600" : "" }`}
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
                      className={`w-80 h-11 ${ formik.touched.villageEstate && formik.errors.villageEstate ? "border-red-600" : "" }`}
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
                            className={`w-80 h-11 ${formik.touched.posStatus && formik.errors.posStatus ? "border-red-600": "" }`}/>
                             <div>
                               <p className="text-xs text-red-600">{formik.touched.posStatus && formik.errors.posStatus}</p>
                            </div>       
                      </div>

                  <div className="flex items-center justify-between  mt-4 ">
                      <Button onClick={() => { handleCancel(); setIsEditModalOpen(false); setEditingPos(null);}} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
                      <Button type="primary" htmlType="submit"  loading={ addingPos || updateAPosLoading} disabled={addingPos || updateAPosLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans" > {editingPos ? "Update" : "Continue"}</Button>
                  </div>
                </div>
              </div>

              </div>
            </div>
          </div>
        </form>

      </Modal>

        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table  loading={getAllPosLoading} columns={columns} dataSource={dataSource} scroll={{ x: "max-content" }}/>
        </div>
  
      {/* delete pos  modal */}

      <Modal title="Confirm group deletion?" open={isDeleteModalOpen} footer={null} onCancel={handleDeleteModalCancel}>
        <div>
          <p className="text-sm">Are you sure you want to delete this group? </p>
        </div>
        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button htmlType="button" onClick={handleDeleteModalCancel} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
          <Button onClick={deletePos} type="primary" loading={deleteAPosLoading} htmlType="button" disabled={deleteAPosLoading}  className="w-28 text-sm font-semibold h-10 text-white font-sans">Delete</Button>
        </div>
      </Modal>


    {/* add signatories modal */}
      <Modal width={368} open={openSignatoriesModal} footer={null} onCancel={handleCloseSignatoriesModal}
       title={(<Typography style={{ fontSize:"18px", fontWeight:"600", textAlign:"start", color:"#333"}}>Add Signatories to this Group</Typography>)}>
      <form onSubmit={signatoriesFormik.handleSubmit}  >
        <div style={{ display:"flex", flexDirection:"column", gap:"10px"}}>
            <div className="flex flex-col gap-1">
                    <label htmlFor="fullName" className="text-sm font-semibold">Full Name</label>
                    <Input type="text" id="fullName" name="fullName"
                      placeholder="Full Name"
                      onBlur={(e) => {
                        signatoriesFormik.setFieldValue(
                          "fullName",
                          e.target.value
                            .toLowerCase()
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        );
                        signatoriesFormik.handleBlur(e);
                      }}
                      onChange={signatoriesFormik.handleChange}
                      value={signatoriesFormik.values.fullName}
                      className={`w-80 h-11 ${ signatoriesFormik.touched.fullName && signatoriesFormik.errors.fullName ? "border-red-600" : "" }`}
                    />
                <div>
                  <p className="text-xs text-red-600">
                    {signatoriesFormik.touched.fullName && signatoriesFormik.errors.fullName}
                  </p>
                </div>
             </div>

              <div className="flex flex-col gap-1">
                    <label htmlFor="idNumber" className="text-sm font-semibold">Id Number</label>
                    <Input type="number" id="idNumber" name="idNumber"
                      placeholder="National Id"
                      onBlur={signatoriesFormik.handleBlur}
                      onChange={signatoriesFormik.handleChange}
                      value={signatoriesFormik.values.idNumber}
                      className={`w-80 h-11 ${ signatoriesFormik.touched.idNumber && signatoriesFormik.errors.idNumber ? "border-red-600" : "" }`}
                    />
                <div>
                  <p className="text-xs text-red-600">
                    {signatoriesFormik.touched.idNumber && signatoriesFormik.errors.idNumber}
                  </p>
                </div>
             </div>

              <div className="flex flex-col gap-1">
                    <label htmlFor="nationality" className="text-sm font-semibold">Nationality</label>
                    <Input type="text" id="nationality" name="nationality"
                      placeholder="Provide Nationality"
                      onBlur={(e) => {
                        signatoriesFormik.setFieldValue("nationality",e.target.value.toLowerCase() 
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        );
                        signatoriesFormik.handleBlur(e);
                      }}
                      onChange={signatoriesFormik.handleChange}
                      value={signatoriesFormik.values.nationality}
                      className={`w-80 h-11 ${ signatoriesFormik.touched.nationality && signatoriesFormik.errors.nationality ? "border-red-600" : "" }`}
                    />
                <div>
                  <p className="text-xs text-red-600">
                    {signatoriesFormik.touched.nationality && signatoriesFormik.errors.nationality}
                  </p>
                </div>
             </div>

              <div className="flex flex-col gap-1">
                    <label htmlFor="designation" className="text-sm font-semibold">Designation</label>
                    <Input type="text" id="designation" name="designation"
                      placeholder="Provide Designation"
                      onBlur={(e) => {
                        signatoriesFormik.setFieldValue(
                          "designation",
                          e.target.value
                            .toLowerCase()
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        );
                        signatoriesFormik.handleBlur(e);
                      }}
                      onChange={signatoriesFormik.handleChange}
                      value={signatoriesFormik.values.designation}
                      className={`w-80 h-11 ${ signatoriesFormik.touched.designation && signatoriesFormik.errors.designation ? "border-red-600" : "" }`}
                    />
                <div>
                  <p className="text-xs text-red-600">
                    {signatoriesFormik.touched.designation && signatoriesFormik.errors.designation}
                  </p>
                </div>
             </div>

            <div style={{ marginTop:"10px"}} className="flex items-center justify-between gap-8">
              <Button htmlType="button" onClick={handleCloseSignatoriesModal} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
              <Button loading={addASignatoryLoading} type="primary" htmlType="submit" className="w-28 text-sm font-semibold h-10 text-white font-sans">Submit</Button>
            </div>
        </div>
      </form>
      </Modal>


      {/* upload documents to a group  */}
      <Modal width={600} open={openUploadDocumentsModal} footer={null} onCancel={handleCloseUploadDocumentsModal}
       title={(<Typography style={{ fontSize:"18px", fontWeight:"600", textAlign:"start", color:"#333"}}>Upload documents to this Group</Typography>)}>
      <form onSubmit={signatoriesFormik.handleSubmit} style={{ marginTop:"20px"}}  >
        <div style={{ display:"flex", flexDirection:"column", gap:"10px",}}>

          <div style={{ display:"flex", flexDirection:"column", gap:"10px"}}>
            <label htmlFor="docType">KRA PIN</label>
            <div style={{ width:"100%",  borderRadius:"8px", border:"1px solid #9CA3AF", height:"60px", padding:"24px"}} >
                   
                
          </div>
          </div>

            <div style={{ marginTop:"10px"}} className="flex items-center justify-between gap-8">
              <Button htmlType="button" onClick={handleCloseUploadDocumentsModal} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
              <Button loading={addASignatoryLoading} type="primary" htmlType="submit" className="w-28 text-sm font-semibold h-10 text-white font-sans">Submit</Button>
            </div>
        </div>
      </form>
      </Modal>

    </div>
  );
};

export default Pos;
