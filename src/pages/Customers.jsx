import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Spin, Table, Modal, Select,} from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import { deleteACustomer, getACustomer, getAllCustomers, registerACustomer, resetCustomerState, updateACustomer } from "../features/customer/customerSlice";
import { getAllCountries } from "../features/country/countrySlice";
import { getAllCounties } from "../features/county/countySlice";
import { getAllConstituencies } from "../features/constituency/constituencySlice";
import { getAllWards } from "../features/ward/wardSlice";
import { getAllLocations } from "../features/location/locationSlice";
import { getAllSubLocations } from "../features/subLocation/subLocationSlice";
import { getAllVillages } from "../features/village/villageSlice";
import { getAllCampuses } from "../features/campus/campusSlice";
import { getAllUniversities } from "../features/university/universitySlice";
import { getAllPoses } from "../features/pos/posSlice";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";


const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
  },
  {
    title: "Email",
    dataIndex: "email",
  },

  {
    title: "Phone Number",
    dataIndex: "primaryPhone",
  },

  {
    title: "ID Number",
    dataIndex: "nationalId",
  },

  {
    title: "Country",
    dataIndex: "countryCode",
  },
  {
    title:"Action",
    dataIndex:"action",
  }
];

const phoneNumberRegex = /^(\+?[1-9]\d{1,14}|0\d{1,14})$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const idNumberRegex = /^[A-Za-z0-9\-\s]{5,20}$/;
const hudumaNumberRegex = /^\d{8}$/;

const CUSTOMER_SCHEMA = Yup.object().shape({
      posAccntId: Yup.number().typeError("Pos Id must be a number").required("Please select pos."),
      studentId: Yup.number(),
      fullName:Yup.string().required("Please provide  full name."),
      email:Yup.string().matches(emailRegex,"Please provide a valid email.").required("Please provide primary email."),
      primaryPhone:Yup.string().matches(phoneNumberRegex, "Please provide a valid phone number").required("Please provide primary phone number."),
      alternatePhone:Yup.string().matches(phoneNumberRegex,"Please provide a valid phone number."),
      universityCode:Yup.number().typeError("Unversity code must be a number."),
      campusCode:Yup.number().typeError("Campus code must be a number."),
      yearOfStudy:Yup.number().typeError("Year of study must be a number."),
      programme:Yup.string(),
      nationalId:Yup.string().matches(idNumberRegex,"Please provide a valid Id Number.").required("Please provide Id Number."),
      nextOfKinName:Yup.string(),
      nextOfKinMobile:Yup.string().matches(phoneNumberRegex,"Please provide a valid phone number."),
      nextOfKinRelationship:Yup.string(),
      inpl:Yup.number(),
      customerStatus:Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required("Please select customer status."),
      countryCode:Yup.number().typeError("Country code must be a number.").required("Please select country."),
      countyCode:Yup.number().typeError("County code must be a number.").required("Please select county."),
      constituencyCode:Yup.number().typeError("Constituency code must be a number.").required("Please select constituency."),
      wardCode:Yup.number().typeError("Ward code must be a number.").required("Please select ward."),
      locationCode:Yup.number().typeError("location code must be a number.").required("Please select location."),
      subLocationCode:Yup.number().typeError("Sub location code must be a number.").required("Please select sub location."),
      villageCode:Yup.number().typeError("Unversity code must be a number.").required("Please select village."),
})

const Customers = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const customers = useSelector((state) => state?.customer?.customers);
  const allCustomerLoading = useSelector((state) => state?.customer?.loading?.getAllCustomers);

  const registerLoading  = useSelector((state)=> state?.customer?.loading?.registerACustomer)
  const updateLoading = useSelector((state)=> state?.customer?.loading?.updateACustomer)
  const registerCustomerSuccess = useSelector((state)=> state?.customer?.success?.registerACustomer)
  const updateCustomerSuccess = useSelector((state)=> state.customer?.success.updateACustomer)
  const deleteACustomerLoading = useSelector((state)=>state?.customer?.loading?.deleteACustomer)
  const deleteACustomerSuccess = useSelector((state)=>state?.customer?.success?.deleteACustomer)



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
  
    const showEditModal = async (customer) => {
      setEditingCustomer(customer);
      setIsEditModalOpen(true);
      dispatch(getACustomer(customer?.id));
    };


  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
    dispatch(getAllWards());
    dispatch(getAllLocations());
    dispatch(getAllSubLocations());
    dispatch(getAllVillages());
    dispatch(getAllUniversities())
    dispatch(getAllCampuses())
    dispatch(getAllPoses())
  }, [dispatch]);


  const countries = useSelector((state)=>state?.country?.countries);
  const counties = useSelector((state)=> state?.county?.counties);
  const constituencies = useSelector((state)=>state?.constituency?.constituencies);
  const wards = useSelector((state)=>state?.ward?.wards);
  console.log(wards,"=>wards")
  const locations = useSelector((state)=>state?.location?.locations);
  const subLocations = useSelector((state)=> state?.subLocation?.subLocations);
  const villages  = useSelector((state)=>state?.village?.villages);
  const universities = useSelector((state)=>state?.university?.universities)
  const campuses = useSelector((state)=>state.campus.campuses);
  const poses = useSelector((state)=>state?.pos?.poses);


  const formik = useFormik({
    initialValues:{ 
      posAccntId: editingCustomer?.posAccntId ||  "",
      studentId: editingCustomer?.studentId || "",
      fullName: editingCustomer?.fullName ||"",
      email: editingCustomer?.email || "",
      primaryPhone:editingCustomer?.primaryPhone ||  "",
      alternatePhone:editingCustomer?.alternatePhone ||  "",
      universityCode: editingCustomer?.university.universityCode || "",
      campusCode: editingCustomer?.campus.campusCode || "",
      yearOfStudy: editingCustomer?.yearOfStudy ||  "",
      programme: editingCustomer?.programme || "",
      nationalId: editingCustomer?.nationalId || "",
      nextOfKinName: editingCustomer?.nextOfKinName || "",
      nextOfKinMobile: editingCustomer?.nextOfKinMobile || "",
      nextOfKinRelationship:editingCustomer?.nextOfKinRelationship || "",
      inpl: editingCustomer?.inpl || 0,
      customerStatus: editingCustomer?.customerStatus || "",
      countryCode:editingCustomer?.country.countryCode || "",
      countyCode:editingCustomer?.county.countyCode || "",
      constituencyCode: editingCustomer?.constituency.constituencyCode || "",
      wardCode: editingCustomer?.ward.wardCode || "",
      locationCode: editingCustomer?.location.locationCode || "",
      subLocationCode: editingCustomer?.subLocation.subLocationCode || "",
      villageCode: editingCustomer?.village.villageCode || "",
     },
     enableReinitialize:true,
     validationSchema: CUSTOMER_SCHEMA,
     onSubmit:(values)=>{
      if(editingCustomer){
        dispatch(updateACustomer({customerId: editingCustomer.id, updateData: values }))
      } else{
        dispatch(registerACustomer(values))
      }
     }
  })

 const dataSource =
   customers && Array.isArray(customers)
     ? customers.map((customer, index) => ({
           key: index + 1,
           fullName: customer?.fullName,
           email: customer?.email,
           studentId:customer?.studentId,
           primaryPhone:customer?.primaryPhone,
           alternatePhone:customer?.alternatePhone,
           universityCode:customer?.university.universityName,
           campusCode: customer?.campus.campusName,
           yearOfStudy:customer?.yearOfStudy,
           programme: customer?.programme,
           nationalId:customer?.nationalId,
           nextOfKinName:customer?.nextOfKinName,
           nextOfKinMobile: customer?.nextOfKinMobile,
           nextOfKinRelationship:customer?.nextOfKinRelationship,
           inpl:customer?.inpl,
           customerStatus: customer?.customerStatus,
           countryCode:customer?.country?.countryName,
           wardCode:customer?.ward?.wardName,
           locationCode:customer?.location?.locationName,
           subLocationCode: customer?.subLocation.subLocationName,
           villageCode:customer?.village.villageName,
          action: (
                <>
                  <div className="flex flex-row items-center gap-8">
                    <button type="button" onClick={() => showEditModal(customer)}>
                      <MdOutlineEdit className="text-blue-600 font-normal text-xl" />
                    </button>
                    <button type="button" onClick={() => {setSelectedCustomerId(customer?.id);showDeleteModal();}}>
                      <RiDeleteBinLine className="text-red-600 font-normal text-xl" />
                    </button>
                  </div>
                </>
              ),
         }))
     : [];


     useEffect(()=>{
      if(registerCustomerSuccess ){
        formik.resetForm();
        setIsModalOpen(false)
        dispatch(getAllCustomers())
      }

      if(updateCustomerSuccess){
        formik.resetForm()
        setIsEditModalOpen(false)
        setEditingCustomer(null)
        dispatch(resetCustomerState())
        dispatch(getAllCustomers());
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllWards());
        dispatch(getAllLocations());
        dispatch(getAllSubLocations());
        dispatch(getAllVillages());
        dispatch(getAllUniversities())
        dispatch(getAllCampuses())
        dispatch(getAllPoses())
      }
     },[registerCustomerSuccess,updateCustomerSuccess])

 

    const deleteCustomer = async () => {
      if (selectedCustomerId) {
       await dispatch(deleteACustomer(selectedCustomerId));
     }
   };
   useEffect(()=>{
     if(deleteACustomerSuccess){
      setSelectedCustomerId(null);
      setIsDeleteModalOpen(false);
      dispatch(resetCustomerState());
      dispatch(getAllCustomers());
     }
   },[deleteACustomerSuccess])

  return (
    <div className="font-sans">
    <div className="d-flex flex-col">
     <div className="flex justify-between mb-2 items-center ">
        <h2 className="text-xl font-bold">Customers</h2>
        <Button type="primary" htmlType="button" onClick={showModal} className="text-sm font-semibold px-4 h-10 text-white font-sans ">+ New Customer</Button>
      </div>
      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>
      </div>


       <Modal title={<h2 className="text-xl font-semibold">{ editingCustomer ? "Edit customer" : "Add a new Customer"}</h2>}
        width={1000} open={isModalOpen || isEditModalOpen} footer={null}
        onCancel={() => {handleCancel(); setIsEditModalOpen(false); setEditingCustomer(null);}}
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-center items-start md:gap-8 mt-4">

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="fullName" className="text-sm font-semibold">Full Name</label>
                  <Input type="text" id="fullName" name="fullName" placeholder="Full Name"
                    onBlur={(e) => {
                      formik.setFieldValue("fullName",e.target.value.toLowerCase().split(" ").map(
                        (word) =>word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
                      formik.handleBlur(e);
                    }}
                    onChange={formik.handleChange}
                    value={formik.values.fullName}
                    className={`w-80 lg:w-72 md:w-64 h-11${ formik.touched.fullName && formik.errors.fullName ? "border-red-600" : "" }`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.fullName && formik.errors.fullName}</p>
                  </div>
                </div>

                 <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm font-semibold">Email</label>
                  <Input type="email" id="email" name="email" placeholder="eg.example@gamil.com"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className={`w-80 lg:w-72 md:w-64 h-11 ${ formik.touched.email && formik.errors.email ? "border-red-600" : "" }`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.email && formik.errors.email}</p>
                  </div>
                </div>



                <div className="flex flex-col gap-1">
                  <label htmlFor="primaryPhone" className="text-sm font-semibold">Primary Phone Number</label>
                  <Input type="tel" name="primaryPhone" id="primaryPhone" placeholder="e.g. 0712345678" 
                    onBlur={formik.handleBlur} 
                    onChange={formik.handleChange} 
                    value={formik.values.primaryPhone}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${ formik.touched.primaryPhone && formik.errors.primaryPhone? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600"> {formik.touched.primaryPhone && formik.errors.primaryPhone}</p>
                  </div>
                </div>


                 <div className="flex flex-col gap-1">
                  <label htmlFor="alternatePhone" className="text-sm font-semibold">Alternate Phone Number</label>
                  <Input type="tel" name="alternatePhone" id="alternatePhone" placeholder="e.g. 0712345678" 
                    onBlur={formik.handleBlur} 
                    onChange={formik.handleChange} 
                    value={formik.values.alternatePhone}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${ formik.touched.alternatePhone && formik.errors.alternatePhone? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600"> {formik.touched.alternatePhone && formik.errors.alternatePhone}</p>
                  </div>
                </div>
            
                <div className="flex flex-col gap-1">
                  <label htmlFor="nationalId"  className="text-sm font-semibold">ID Number</label>
                  <Input type="text" name="nationalId" id="nationalId" placeholder="e.g. 12345678"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.nationalId}
                    className={`w-80 lg:w-72 md:w-64 h-11${
                      formik.touched.nationalId && formik.errors.nationalId
                        ? "border-red-600"
                        : ""
                    }`}
                    min={1}
                    max={12}
                  />
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.nationalId && formik.errors.nationalId}</p>
                  </div>
                </div>


                <div className="flex flex-col gap-1">
                  <label htmlFor="posAccntId" className="text-sm font-semibold">Point of Sale</label>
                  <Select allowClear showSearch type="text" name="posAccntId" id="posAccntId" placeholder="Select Point of Sale"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      Array.isArray(poses)
                        ? poses &&
                          poses.map((pos) => ({
                            value: pos.posCode,
                            label: pos.groupName,
                          }))
                        : []
                    }
                    onBlur={formik.handleBlur}
                    onChange={(value) =>
                      formik.setFieldValue("posAccntId", value || "")
                    }
                    value={formik.values.posAccntId || undefined}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${
                      formik.touched.posAccntId &&
                      formik.errors.posAccntId
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.posAccntId && formik.errors.posAccntId}</p>
                  </div>
                </div>
                

                <div className="flex flex-col gap-1">
                  <label htmlFor="inpl"  className="text-sm font-semibold">Points</label>
                  <Input defaultValue={0} type="number" name="inpl" id="inpl" placeholder="e.g. 12345678"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.inpl}
                    className={`w-80 lg:w-72 md:w-64 h-11 ${
                      formik.touched.inpl && formik.errors.inpl
                        ? "border-red-600"
                        : ""
                    }`}
                    minLength={1}
                    maxLength={12}
                  />
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.inpl && formik.errors.inpl}</p>
                  </div>
                </div>

                  <div className="flex flex-col gap-1">
                  <label htmlFor="customerStatus" className="text-sm font-semibold"> Status </label>
                  <Select type="text" name="userStatus" id="userStatus" placeholder="Select Status"
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
                      formik.setFieldValue("customerStatus", value || "")
                    }
                    value={formik.values.customerStatus || undefined }
                    className={`w-80 lg:w-72 h-11 md:w-64 ${ formik.touched.customerStatus && formik.errors.customerStatus ? "border-red-600" : "" }`} />
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.customerStatus && formik.errors.customerStatus}</p>
                  </div>
                </div>

              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="universityCode" className="text-sm font-semibold">University</label>
                  <Select showSearch type="text" name="universityCode" id="universityCode" placeholder="Select university."
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      Array.isArray(universities)
                        ? universities &&
                          universities.map((university) => ({
                            value: university.universityCode,
                            label: university.universityName,
                          }))
                        : []
                    }
                    onBlur={formik.handleBlur}
                    onChange={(value) =>
                      formik.setFieldValue("universityCode", value || "")
                    }
                    value={formik.values.universityCode || undefined}
                    className={`w-80 lg:w-72 h-11  md:w-64 ${
                      formik.touched.universityCode &&
                      formik.errors.universityCode
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.universityCode && formik.errors.universityCode}</p>
                  </div>
                </div>


                  <div className="flex flex-col gap-1">
                  <label htmlFor="campusCode" className="text-sm font-semibold">Campus</label>
                  <Select showSearch type="text" name="campusCode" id="campusCode" placeholder="Select campus."
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
                      formik.setFieldValue("campusCode", value || "")
                    }
                    value={formik.values.campusCode || undefined }
                    className={`w-80 lg:w-72 h-11 md:w-64 ${
                      formik.touched.campusCode &&
                      formik.errors.campusCode
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.campusCode && formik.errors.campusCode}</p>
                  </div>
                </div>
                


                <div className="flex flex-col gap-1">
                  <label htmlFor="yearOfStudy" className="text-sm font-semibold">Year Of Study</label>
                  <Input type="number" id="yearOfStudy" name="yearOfStudy" placeholder="Year of Study"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.yearOfStudy}
                    className={`w-80 lg:w-72 md:w-64 h-11 ${ formik.touched.yearOfStudy && formik.errors.yearOfStudy ? "border-red-600" : "" }`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.yearOfStudy && formik.errors.yearOfStudy}</p>
                  </div>
                </div>


                <div className="flex flex-col gap-1">
                  <label htmlFor="programme" className="text-sm font-semibold">Programme</label>
                  <Input type="text" id="programme" name="programme" placeholder="Programme"
                    onBlur={(e) => {
                      formik.setFieldValue("programme",e.target.value.toLowerCase().split(" ").map(
                        (word) =>word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
                      formik.handleBlur(e);
                    }}
                    onChange={formik.handleChange}
                    value={formik.values.programme}
                    className={`w-80 lg:w-72 md:w-64 h-11 ${ formik.touched.programme && formik.errors.programme ? "border-red-600" : "" }`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.programme && formik.errors.programme}</p>
                  </div>
                </div>

                 <div className="flex flex-col gap-1">
                  <label htmlFor="studentId" className="text-sm font-semibold">Registration Number</label>
                  <Input type="number" id="studentId" name="studentId" placeholder="Registration Number"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.studentId}
                    className={`w-80 lg:w-72 md:w-64 h-11 ${ formik.touched.studentId && formik.errors.studentId ? "border-red-600" : "" }`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.studentId && formik.errors.studentId}</p>
                  </div>
                </div>

                  <div className="flex flex-col gap-1">
                  <label htmlFor="nextOfKinName" className="text-sm font-semibold">Next Of Kin Name</label>
                  <Input type="text" id="nextOfKinName" name="nextOfKinName" placeholder="Next Of Kin Name"
                    onBlur={(e) => {
                      formik.setFieldValue("nextOfKinName",e.target.value.toLowerCase().split(" ").map(
                        (word) =>word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
                      formik.handleBlur(e);
                    }}
                    onChange={formik.handleChange}
                    value={formik.values.nextOfKinName}
                    className={`w-80 lg:w-72 md:w-64 h-11 ${ formik.touched.nextOfKinName && formik.errors.nextOfKinName ? "border-red-600" : "" }`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.nextOfKinName && formik.errors.nextOfKinName}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="nextOfKinMobile" className="text-sm font-semibold">Next Of Kin Mobile</label>
                  <Input type="tel" name="nextOfKinMobile" id="nextOfKinMobile" placeholder="e.g. 0712345678" 
                    onBlur={formik.handleBlur} 
                    onChange={formik.handleChange} 
                    value={formik.values.nextOfKinMobile}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${ formik.touched.nextOfKinMobile && formik.errors.nextOfKinMobile? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600"> {formik.touched.nextOfKinMobile && formik.errors.nextOfKinMobile}</p>
                  </div>
                </div>


                <div className="flex flex-col gap-1">
                  <label htmlFor="nextOfKinRelationship" className="text-sm font-semibold">Next Of Kin Relationship </label>
                  <Select type="text" name="nextOfKinRelationship" id="nextOfKinRelationship" placeholder="Select Next of Kin Relationship"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "Father",
                        label: "Father",
                      },
                      {
                        value: "Mother",
                        label: "Mother",
                      },
                      {
                        value: "Brother",
                        label: "Brother",
                      },
                      {
                        value: "Sister",
                        label: "Sister",
                      },
                      {
                        value: "Son",
                        label: "Son",
                      },
                      {
                        value: "Daughter",
                        label: "Daughter",
                      },
                       {
                        value: "Gurdian",
                        label: "Gurdian",
                      },
                       {
                        value: "Other",
                        label: "Other",
                      },
                    ]}
                    onBlur={formik.handleBlur}
                    onChange={(value) =>
                      formik.setFieldValue("nextOfKinRelationship", value || "")
                    }
                    value={formik.values.nextOfKinRelationship || undefined }
                    className={`w-80 lg:w-72 h-11 md:w-64 ${ formik.touched.nextOfKinRelationship && formik.errors.nextOfKinRelationship ? "border-red-600" : "" }`} />
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.nextOfKinRelationship && formik.errors.nextOfKinRelationship}</p>
                  </div>
                </div>

              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="countryCode" className="text-sm font-semibold"> Country </label>
                  <Select showSearch type="text" name="countryCode" id="countryCode" placeholder="Select user country."
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
                      formik.setFieldValue("countryCode", value || "")
                    }
                    value={formik.values.countryCode || undefined}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${
                      formik.touched.countryCode &&
                      formik.errors.countryCode
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.countryCode && formik.errors.countryCode}</p>
                  </div>
                </div>


                <div className="flex flex-col gap-1">
                  <label htmlFor="countyCode" className="text-sm font-semibold">County</label>
                  <Select showSearch type="text" name="countyCode" id="countyCode" placeholder="Select County."
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      Array.isArray(counties)
                        ? counties &&
                          counties.map((county) => ({
                            value: county.countyCode,
                            label: county.countyName,
                          }))
                        : []
                    }
                    onBlur={formik.handleBlur}
                    onChange={(value) =>
                      formik.setFieldValue("countyCode", value || "")
                    }
                    value={formik.values.countyCode || undefined}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${formik.touched.countyCode && formik.errors.countyCode ? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.countyCode && formik.errors.countyCode}</p>
                  </div>
                </div>


              <div className="flex flex-col gap-1">
                  <label htmlFor="constituencyCode" className="text-sm font-semibold">Constituency</label>
                  <Select showSearch type="text" name="constituencyCode" id="constituencyCode" placeholder="Select Constituency."
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      Array.isArray(constituencies)
                        ? constituencies &&
                          constituencies.map((constituency) => ({
                            value: constituency.constituencyCode,
                            label: constituency.constituencyName,
                          }))
                        : []
                    }
                    onBlur={formik.handleBlur}
                    onChange={(value) =>
                      formik.setFieldValue("constituencyCode", value || "")
                    }
                    value={formik.values.constituencyCode || undefined}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${formik.touched.constituencyCode && formik.errors.constituencyCode ? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.constituencyCode && formik.errors.constituencyCode}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="wardCode" className="text-sm font-semibold">Ward</label>
                  <Select showSearch type="text" name="wardCode" id="wardCode" placeholder="Select Ward."
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                     options={
                      Array.isArray(wards)
                        && wards.map((ward) => ({
                            value: ward.wardCode,
                            label: ward.wardName,
                          }))
                    }
                    onBlur={formik.handleBlur}
                    onChange={(value) =>formik.setFieldValue("wardCode", value || "")}
                    value={formik.values.wardCode || undefined}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${formik.touched.wardCode && formik.errors.wardCode ? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.wardCode && formik.errors.wardCode}</p>
                  </div>
                </div>



                <div className="flex flex-col gap-1">
                  <label htmlFor="locationCode" className="text-sm font-semibold">Location</label>
                  <Select showSearch type="text" name="locationCode" id="locationCode" placeholder="Select Location."
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      Array.isArray(locations)
                        ? locations &&
                          locations.map((location) => ({
                            value: location.locationCode,
                            label: location.locationName,
                          }))
                        : []
                    }
                    onBlur={formik.handleBlur}
                    onChange={(value) =>formik.setFieldValue("locationCode", value || "")}
                    value={formik.values.locationCode || undefined}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${formik.touched.locationCode && formik.errors.locationCode ? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.locationCode && formik.errors.locationCode}</p>
                  </div>
                </div>


                <div className="flex flex-col gap-1">
                  <label htmlFor="subLocationCode" className="text-sm font-semibold">Sub Location</label>
                  <Select showSearch type="text" name="subLocationCode" id="subLocationCode" placeholder="Select Sub Location."
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      Array.isArray(subLocations)
                        ? subLocations &&
                          subLocations.map((subLocation) => ({
                            value: subLocation.subLocationCode,
                            label: subLocation.subLocationName,
                          }))
                        : []
                    }
                    onBlur={formik.handleBlur}
                    onChange={(value) =>formik.setFieldValue("subLocationCode", value || "")}
                    value={formik.values.subLocationCode || undefined}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${formik.touched.subLocationCode && formik.errors.subLocationCode ? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.subLocationCode && formik.errors.subLocationCode}</p>
                  </div>
                </div>



                <div className="flex flex-col gap-1">
                  <label htmlFor="villageCode" className="text-sm font-semibold">Village</label>
                  <Select showSearch type="text" name="villageCode" id="villageCode" placeholder="Select Village."
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
                    onChange={(value) =>formik.setFieldValue("villageCode", value || "")}
                    value={formik.values.villageCode || undefined}
                    className={`w-80 lg:w-72 h-11 md:w-64 ${formik.touched.villageCode && formik.errors.villageCode ? "border-red-600" : ""}`}/>
                  <div>
                    <p className="text-xs text-red-600">{formik.touched.villageCode && formik.errors.villageCode}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-8 lg:gap-12 mt-4 ">
                     <Button htmlType="button" onClick={() => { handleCancel(); setIsEditModalOpen(false); setEditingCustomer(null)}} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
                     <Button type="primary" htmlType="submit" loading={ updateLoading || registerLoading} disabled={registerLoading || updateLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans" >{editingCustomer ? "Update" : "Submit"}</Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table loading={allCustomerLoading} pagination columns={columns} dataSource={dataSource}scroll={{ x: "max-content" }}/>
      </div>

     {/* delete user modal */}
      <Modal title="Confirm customer deletion?" open={isDeleteModalOpen} footer={null} onCancel={handleDeleteModalCancel}>
        <div>
          <p className="text-sm">Are you sure you want to delete this customer? </p>
        </div>
        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button  htmlType="button" onClick={handleDeleteModalCancel} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
          <Button loading={deleteACustomerLoading} onClick={deleteCustomer} type="primary" htmlType="button"  disabled={deleteACustomerLoading}  className="w-28 text-sm font-semibold h-10 text-white font-sans">Delete</Button>
        </div>
      </Modal>
     </div>
  );
};

export default Customers;
