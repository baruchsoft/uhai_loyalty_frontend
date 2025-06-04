import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from "yup"
import { addALocation, deleteALocation, getAllLocations, getALocation, resetLocationState, updateALocation } from '../features/location/locationSlice'
import { Button, Modal ,Select, Spin, Table,Input} from 'antd'
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useFormik } from 'formik'
import { getAllCountries } from '../features/country/countrySlice'
import { getAllCounties } from '../features/county/countySlice'
import { getAllConstituencies } from '../features/constituency/constituencySlice'
import { getAllWards } from '../features/ward/wardSlice'
import { MdDelete, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'

const locationColumns = [
  { 
    title:"#",
    dataIndex: "key",
  },
  { 
    title:"Name",
    dataIndex: "locationName",
  },
  { 
    title:"Short Description",
    dataIndex: "locationShortDesc",
  },
  { 
    title:"Country",
    dataIndex: "locationCountryCode",
  },
  { 
    title:"County",
    dataIndex: "locationCountyCode",
  },
  { 
    title:"Constituency",
    dataIndex: "locationConstituencyCode",
  },
  { 
    title:"Ward",
    dataIndex: "locationWardCode",
  },
   
  { 
    title:"Status",
    dataIndex: "locationStatus",
  },
  { 
    title:"Action",
    dataIndex: "action",
  },

]


const LOCATION_SCHEMA = Yup.object().shape({
    locationName: Yup.string().required("Please provide location name."),
    locationShortDesc: Yup.string().required("Please provide location short description."),
    locationCountryCode: Yup.number().typeError("Country code must be a number.").required("Please select location country."),
    locationCountyCode: Yup.number().typeError("County code must be a number.").required("Please select location County."),
    locationConstituencyCode: Yup.number().typeError("Constituency code must be a number.").required("Please select location constituency."),
    locationWardCode: Yup.number().typeError("Ward code must be a number.").required("Please select location ward."),
    locationStatus: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Please select a valid location status.").required("Please select location status."),
})

const Locations = () => {
const dispatch = useDispatch()
const locations = useSelector((state)=> state?.location?.locations);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [isModalOpen,setIsModalOpen] = useState(false);
const [selectedLocationCode,setSelectedLocationCode] = useState(null);
const [isEditModalOpen,setIsEditModalOpen] = useState(false);
const [editingLocation,setEditingLocation] = useState(null);

const addLocationSuccess = useSelector((state)=> state?.location?.success?.addALocation)
const countries = useSelector((state) => state?.country?.countries);
const counties = useSelector((state) => state?.county?.counties);
const constituencies = useSelector((state) => state?.constituency?.constituencies );
const wards = useSelector((state) => state?.ward?.wards);
const addALocationLoading = useSelector((state)=>state?.location?.loading?.addALocation);
const updateALocationLoading = useSelector((state) => state?.location?.loading?.updateALocation);
const getAllLocationsLoading = useSelector((state)=> state?.location?.loading?.getAllLocations)
const deleteALocationLoading = useSelector((state)=>state?.location?.loading?.deleteALocation)


useEffect(()=>{
   dispatch(getAllLocations())
},[])

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

  const showEditModal = async (location) => {
    setEditingLocation(location);
    setIsEditModalOpen(true);
    await dispatch(getALocation(location?.locationCode));
  };


const formik = useFormik({
  initialValues:{
    locationName: editingLocation?.locationName || "",
    locationShortDesc: editingLocation?.locationShortDesc || "",
    locationCountryCode:editingLocation?.country?.countryCode || null,
    locationCountyCode: editingLocation?.county?.countyCode || null,
    locationConstituencyCode: editingLocation?.constituency.constituencyCode || null,
    locationWardCode: editingLocation?.ward?.wardCode || null,
    locationStatus: editingLocation?.locationStatus || null
  },
  enableReinitialize:true,
  validationSchema: LOCATION_SCHEMA,
  onSubmit:(values)=>{

    if(editingLocation){
    dispatch(updateALocation({
      locationCode: editingLocation?.locationCode,
      locationData: values
    }));
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
    dispatch(getAllWards())
    }else{
      dispatch(addALocation(values));
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllWards());
    }
  }
})

useEffect(()=>{
  if(addLocationSuccess){
    formik.resetForm();
    setIsModalOpen(false);
    dispatch(getAllLocations());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
    dispatch(getAllWards());
  }
},[addLocationSuccess])

const  updateALocationSuccess = useSelector((state)=> state?.location?.success?.updateALocation) 


useEffect(()=>{
  if(updateALocationSuccess){
    formik.resetForm();
    setIsEditModalOpen(false);
    setEditingLocation(null);
    dispatch(getAllLocations());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
    dispatch(getAllWards())
  }
},[updateALocationSuccess])


  const dataSource =
    locations && Array.isArray(locations)
      ? locations.map((location, index) => ({
          key: index + 1,
          locationName: location?.locationName,
          locationShortDesc: location?.locationShortDesc,
          locationCountryCode: location?.country?.countryName,
          locationCountyCode: location?.county?.countyName,
          locationConstituencyCode:location?.constituency?.constituencyName,
          locationWardCode: location?.ward?.wardName,
          locationStatus: location?.locationStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8 ">
                <button type="button" onClick={() => showEditModal(location)}>
                  <MdOutlineEdit className="text-blue-600 font-medium text-xl" />
                </button>
                <button type="button" onClick={() => {setSelectedLocationCode(location?.locationCode);showDeleteModal();}}>
                  <RiDeleteBinLine className="text-red-600  font-medium  text-xl" />
                </button>
              </div>
            </>
          ),
        }))
      : [];


      const deleteLocation = async () => {
        console.log(selectedLocationCode,"=>seletedLocationCode")
          if (selectedLocationCode) {
            await dispatch(deleteALocation(selectedLocationCode));
          }
        };
      
        const deleteLocationSuccess = useSelector((state)=> state?.location?.success?.deleteALocation)

        useEffect(() => {
          if (deleteLocationSuccess) {
            setIsDeleteModalOpen(false);
            setSelectedLocationCode(null);
            // dispatch(resetLocationState())
            dispatch(getAllLocations());
            dispatch(getAllCountries());
            dispatch(getAllCounties());
            dispatch(getAllConstituencies());
            dispatch(getAllWards())
          }
        }, [deleteLocationSuccess]);



  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Locations</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal}className="text-sm font-semibold px-4 h-10 text-white font-sans ">+ New Location</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold"> {editingLocation ? "Edit Location" : "Add a Location"} </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => { handleCancel(); setIsEditModalOpen(false); setEditingSubLocation(null) }}
        width={400}
        className="font-sans"
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center flex-col gap-3  mt-4">
              <div className="flex justify-start lg:gap-8">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label  htmlFor="locationName" className="text-sm font-semibold">Name</label>
                    <Input type="text" id="locationName" name="locationName" placeholder="e.g. Imara Daima East"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "locationName",
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
                      onChange={formik.handleChange} value={formik.values.locationName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.locationName &&
                        formik.errors.locationName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.locationName && formik.errors.locationName} </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="locationShortDesc" className="text-sm font-semibold">
                      Short Description
                    </label>
                    <Input
                      placeholder="e.g. Imara Daima East"
                      type="text"
                      name="locationShortDesc"
                      id="locationShortDesc"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "locationShortDesc",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.locationShortDesc}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.locationShortDesc &&
                        formik.errors.locationShortDesc
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.locationShortDesc && formik.errors.locationShortDesc}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="locationCountryCode" className="text-sm font-semibold"> Country </label>
                    <Select
                      placeholder="Select Sub-location Country."
                      type="text"
                      name="locationCountryCode"
                      id="locationCountryCode"
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
                        formik.setFieldValue("locationCountryCode", value)
                      }
                      value={formik.values.locationCountryCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.locationCountryCode &&
                        formik.errors.locationCountryCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.locationCountryCode && formik.errors.locationCountryCode}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="wardCountyCode" className="text-sm font-semibold">County </label>
                    <Select  placeholder="Select Sub-location County."  type="text" name="locationCountyCode" id="locationCountyCode"
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
                      onChange={(value) => formik.setFieldValue("locationCountyCode", value)}
                      value={formik.values.locationCountyCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.locationCountyCode &&
                        formik.errors.locationCountyCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">  {formik.touched.locationCountyCode &&  formik.errors.locationCountyCode}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="locationConstituencyCode" className="text-sm font-semibold">Constituency</label>
                    <Select  placeholder="Select Sub-location Constituency ." type="text" name="locationConstituencyCode" id="locationConstituencyCode"
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
                        formik.setFieldValue( "locationConstituencyCode", value )
                      }
                      value={formik.values.locationConstituencyCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${formik.touched.locationConstituencyCode && formik.errors.locationConstituencyCode  ? "border-red-600": "" }`}/>
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.locationConstituencyCode && formik.errors.locationConstituencyCode}  </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="locationWardCode"  className="text-sm font-semibold">Ward</label>
                    <Select placeholder="Select Sub-location ward."  type="text" name="locationWardCode"  id="locationWardCode"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(wards)
                          ? wards &&
                            wards.map((ward) => ({
                              value: ward.wardCode,
                              label: ward.wardName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("locationWardCode", value)
                      }
                      value={formik.values.locationWardCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${ formik.touched.locationWardCode &&  formik.errors.locationWardCode ? "border-red-600" : ""  }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.locationWardCode && formik.errors.locationWardCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="subLocationStatus"
                      className="text-sm font-semibold"
                    >
                      Status
                    </label>
                    <Select
                      placeholder="Select location Status."
                      type="text"
                      name="locationStatus"
                      id="locationStatus"
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
                        formik.setFieldValue(
                          "locationStatus",
                          value
                        )
                      }
                      value={formik.values.locationStatus}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.locationStatus &&
                        formik.errors.locationStatus
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.locationStatus &&
                          formik.errors.locationStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between  mt-4 ">
                      <Button onClick={() => { handleCancel(); setIsEditModalOpen(false); setEditingLocation(null)}} className="w-28 text-sm font-semibold h-10 font-sans">Cancel </Button>
                       <Button  type="primary" loading={addALocationLoading || updateALocationLoading} htmlType="submit" disabled={ addALocationLoading || updateALocationLoading }  className="w-28 text-sm font-semibold h-10 text-white font-sans">
                        {editingLocation ? "Update" : "Submit"}
                       </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table loading={getAllLocationsLoading} columns={locationColumns} dataSource={dataSource} scroll={{ x: "max-content" }}/>
        </div>

      {/* delete sub-location modal */}
      <Modal title="Confirm location deletion?" open={isDeleteModalOpen} footer={null} onCancel={handleDeleteModalCancel}>
        <div>
          <p className="text-sm"> Are you sure you want to delete this location?</p>
        </div>

        <div className="flex items-center justify-end  mt-6  gap-8">
            <Button htmlType="button" onClick={handleDeleteModalCancel} className="w-28 text-sm font-semibold h-10 font-sans"> Cancel</Button>
            <Button disabled={deleteALocationLoading} loading={deleteALocationLoading} onClick={deleteLocation} type="primary" htmlType="button" className="w-28 text-sm font-semibold h-10 text-white font-sans" >Delete</Button>
        </div>
      </Modal>
    </div>
  )
}

export default Locations
