import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Select, Spin, Table } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { getAllWards } from "../features/ward/wardSlice";
import { useFormik } from "formik";
import {addASubLocation,deleteASubLocation,getAllSubLocations,getASubLocation,resetSubLocationState,updateASubLocation,} from "../features/subLocation/subLocationSlice";
import { getAllCountries } from "../features/country/countrySlice";
import { getAllCounties } from "../features/county/countySlice";
import { getAllConstituencies } from "../features/constituency/constituencySlice";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { getAllLocations } from "../features/location/locationSlice";
import { RiDeleteBinLine } from "react-icons/ri";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "subLocationName",
  },
  {
    title: "Short Description",
    dataIndex: "subLocationShortDesc",
  },
  {
    title: "Country",
    dataIndex: "subLocationCountryCode",
  },
  {
    title: "County",
    dataIndex: "subLocationCountyCode",
  },
  {
    title: "Constituency",
    dataIndex: "subLocationConstituencyCode",
  },
  {
    title: "Ward",
    dataIndex: "subLocationWardCode",
  },
    {
    title: "Location",
    dataIndex: "subLocationLocationCode",
  },
  {
    title: "Status",
    dataIndex: "subLocationStatus",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const SUBLOCATION_SCHEMA = Yup.object().shape({
  subLocationName: Yup.string().required("Please provide sub-location name."),
  subLocationShortDesc: Yup.string().required("Please provide sub-location short description."),
  subLocationCountryCode: Yup.number().typeError("Country code must be a number.").required("Please select sub-location country."),
  subLocationCountyCode: Yup.number().typeError("County code must be a number.").required("Please select sub-location County."),
  subLocationConstituencyCode: Yup.number().typeError("Constituency code must be a number.").required("Please select sub-location constituency."),
  subLocationWardCode: Yup.number().typeError("Ward code must be a number.").required("Please select sub-location ward."),
  subLocationLocationCode: Yup.number().typeError("Location code must be a number.").required("Please select sub-location location"),
  subLocationStatus: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Please select a valid sub-location status.").required("Please select sub-location status."),
});

const SubLocations = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubLocationCode, setSelectedSubLocationCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubLocation, setEditingSubLocation] = useState(null);
  const addASubLocationSuccess = useSelector((state) => state?.subLocation?.success?.addASubLocation);

  const addedSubLocation = useSelector((state) => state?.subLocation?.addedSubLocation);
  console.log(addedSubLocation,"=>addedSubLocation")

  const subLocations = useSelector((state) => state?.subLocation?.subLocations);
  const addASubLocationLoading = useSelector((state) => state?.subLocation?.loading?.addASubLocation);

  console.log(addASubLocationLoading,"=>addSubLocationLoading")

  const deleteASubLocationLoading = useSelector((state) => state?.subLocation?.loading?.deleteASubLocation);
  const getAllSubLocationsLoading = useSelector((state) => state?.subLocation?.loading?.getAllSubLocations);

  const updatedSubLocation = useSelector( (state) => state?.subLocation?.updatedSubLocation);

  const updateASubLocationSuccess = useSelector((state) => state?.subLocation?.success?.updateASubLocation);

  const updateASubLocationLoading = useSelector((state) => state?.subLocation?.loading?.updateASubLocation);

  const countries = useSelector((state) => state?.country?.countries);
  const counties = useSelector((state) => state?.county?.counties);
  const constituencies = useSelector((state) => state?.constituency?.constituencies );
  const wards = useSelector((state) => state?.ward?.wards);

  const deleteASubLocationSuccess = useSelector((state) => state?.subLocation?.success?.deleteASubLocation);
  const locations = useSelector((state)=>state?.location?.locations)

  console.log(locations,"=>locations")


  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    formik.resetForm()
  }, []);

  const showDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteModalCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const showEditModal = async (subLocation) => {
    setEditingSubLocation(subLocation);
    setIsEditModalOpen(true);
    await dispatch(getASubLocation(subLocation?.subLocationCode));
  };

  const formik = useFormik({
    initialValues: {
      subLocationName: editingSubLocation?.subLocationName || "",
      subLocationShortDesc: editingSubLocation?.subLocationShortDesc || "",
      subLocationCountryCode: editingSubLocation?.country?.countryCode || null,
      subLocationCountyCode: editingSubLocation?.county?.countyCode || null,
      subLocationConstituencyCode:editingSubLocation?.constituency?.constituencyCode || null,
      subLocationWardCode: editingSubLocation?.ward?.wardCode || null,
      subLocationLocationCode: editingSubLocation?.location.locationCode || null,
      subLocationStatus: editingSubLocation?.subLocationStatus || null,
    },
    enableReinitialize: true,
    validationSchema: SUBLOCATION_SCHEMA,
    onSubmit: (values) => {
      if (editingSubLocation) {
        dispatch(
          updateASubLocation({
            subLocationCode: editingSubLocation?.subLocationCode,
            subLocationData: values,
          })
        );
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllWards());
        dispatch(getAllLocations())
      } else {
        dispatch(addASubLocation(values));
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllWards());
        dispatch(getAllLocations())
      }
    },
  });


  useEffect(() => {
    dispatch(getAllSubLocations());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
    dispatch(getAllWards());
    dispatch(getAllLocations())
  }, [dispatch]);

  useEffect(() => {
    if (addASubLocationSuccess && addedSubLocation) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetSubLocationState());
      dispatch(getAllSubLocations());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllWards())
      dispatch(getAllLocations())
    }
  }, [addASubLocationSuccess,addedSubLocation, dispatch]);

  useEffect(() => {
    if (updatedSubLocation && updateASubLocationSuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      setEditingSubLocation(null);
      dispatch(resetSubLocationState());
      dispatch(getAllSubLocations());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllWards());
      dispatch(getAllSubLocations())
    }
  }, [updatedSubLocation, updateASubLocationSuccess]);

  const dataSource =
    subLocations && Array.isArray(subLocations)
      ? subLocations.map((subLocation, index) => ({
          key: index + 1,
          subLocationName: subLocation.subLocationName,
          subLocationShortDesc: subLocation.subLocationShortDesc,
          subLocationCountryCode: subLocation.country.countryName,
          subLocationCountyCode: subLocation.county.countyName,
          subLocationConstituencyCode:
          subLocation.constituency.constituencyName,
          subLocationWardCode: subLocation.ward.wardName,
          subLocationLocationCode:subLocation?.location?.locationName,
          subLocationStatus: subLocation.subLocationStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8 ">
                <button  type="button"  onClick={() => showEditModal(subLocation)}  >
                  <MdOutlineEdit className="text-blue-600 font-medium text-xl" />
                </button>
                <button type="button"  onClick={() => {   setSelectedSubLocationCode(subLocation.subLocationCode);   showDeleteModal(); }} >
                  <RiDeleteBinLine className="text-red-600  font-medium  text-xl" />
                </button>
              </div>
            </>
          ),
        }))
      : [];

  const deleteSubLocation = async () => {
    if (selectedSubLocationCode) {
      await dispatch(deleteASubLocation(selectedSubLocationCode));
    }
  };

  useEffect(() => {
    if (deleteASubLocationSuccess) {
      setIsDeleteModalOpen(false);
      setSelectedSubLocationCode(null);
      dispatch(resetSubLocationState());
      dispatch(getAllSubLocations());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllWards())
      dispatch(getAllLocations());
    }
  }, [deleteASubLocationSuccess]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Sub-locations</h2>
          <Button type="primary" htmlType="button" onClick={showModal}className="text-sm font-semibold px-4 h-10 text-white font-sans ">+ New Sub-Location</Button>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">
              {editingSubLocation ? "Edit sub-location" : "Add a sub-location"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => { handleCancel(); setIsEditModalOpen(false); setEditingSubLocation(null); }}
        width={720}
        className="font-sans"
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center flex-col gap-3  mt-4">
              <div className="flex justify-start lg:gap-8">


                <div className="flex gap-8">

                <div className="flex flex-col gap-3"> 
                  <div className="flex flex-col gap-1">
                    <label htmlFor="subLocationName"  className="text-sm font-semibold"> Name </label>
                    <Input type="text"  id="subLocationName"  name="subLocationName"  placeholder="e.g. Imara Daima East"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "subLocationName",
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
                      value={formik.values.subLocationName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.subLocationName &&
                        formik.errors.subLocationName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">  {formik.touched.subLocationName && formik.errors.subLocationName}  </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="subLocationShortDesc" className="text-sm font-semibold">  Short Description </label>
                    <Input placeholder="e.g. Imara Daima East"  type="text" name="subLocationShortDesc"  id="subLocationShortDesc"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "subLocationShortDesc",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.subLocationShortDesc}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.subLocationShortDesc &&
                        formik.errors.subLocationShortDesc
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.subLocationShortDesc && formik.errors.subLocationShortDesc}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label  htmlFor="subLocationCountryCode" className="text-sm font-semibold">  Country </label>
                    <Select  placeholder="Select Sub-location Country." type="text"  name="subLocationCountryCode"  id="subLocationCountryCode"
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
                        formik.setFieldValue("subLocationCountryCode", value)
                      }
                      value={formik.values.subLocationCountryCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${ formik.touched.subLocationCountryCode && formik.errors.subLocationCountryCode ? "border-red-600" : "" }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.subLocationCountryCode &&  formik.errors.subLocationCountryCode}  </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label  htmlFor="wardCountyCode"  className="text-sm font-semibold" >County</label>
                    <Select placeholder="Select Sub-location County." type="text"  name="subLocationCountyCode"  id="subLocationCountyCode"
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
                        formik.setFieldValue("subLocationCountyCode", value)
                      }
                      value={formik.values.subLocationCountyCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${ formik.touched.subLocationCountyCode && formik.errors.subLocationCountyCode  ? "border-red-600"  : "" }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.subLocationCountyCode &&  formik.errors.subLocationCountyCode}</p>
                    </div>
                  </div>

                </div>




               <div className="flex flex-col gap-3"> 

                   <div className="flex flex-col gap-1">
                    <label htmlFor="subLocationConstituencyCode"  className="text-sm font-semibold" >  Constituency </label>
                    <Select placeholder="Select Sub-location Constituency ." type="text" name="subLocationConstituencyCode" id="subLocationConstituencyCode"
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
                        formik.setFieldValue(
                          "subLocationConstituencyCode",
                          value
                        )
                      }
                      value={formik.values.subLocationConstituencyCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${formik.touched.subLocationConstituencyCode && formik.errors.subLocationConstituencyCode ? "border-red-600" : ""  }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.subLocationConstituencyCode && formik.errors.subLocationConstituencyCode}</p>
                    </div>
                  </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="subLocationWardCode" className="text-sm font-semibold"> Ward </label>
                    <Select  placeholder="Select Sub-location ward." type="text" name="subLocationWardCode"  id="subLocationWardCode"
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
                        formik.setFieldValue("subLocationWardCode", value)
                      }
                      value={formik.values.subLocationWardCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${formik.touched.subLocationWardCode && formik.errors.subLocationWardCode  ? "border-red-600"  : ""  }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.subLocationWardCode && formik.errors.subLocationWardCode}</p>
                    </div>
                  </div>



                  <div className="flex flex-col gap-1">
                    <label htmlFor="subLocationLocationCode" className="text-sm font-semibold">Location</label>
                    <Select placeholder="Select Sub-location location." type="text" name="subLocationLocationCode" id="subLocationLocationCode"
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
                      onChange={(value) => formik.setFieldValue("subLocationLocationCode", value)}
                      value={formik.values.subLocationLocationCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${formik.touched.subLocationLocationCode && formik.errors.subLocationLocationCode ? "border-red-600" : ""}`}
                    />
                    <div>
                      <p className="text-xs text-red-600">{formik.touched.subLocationLocationCode && formik.errors.subLocationLocationCode}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="subLocationStatus" className="text-sm font-semibold">Status </label>
                    <Select placeholder="Select SubLocation Status." type="text" name="subLocationStatus" id="subLocationStatus"
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
                      onChange={(value) => formik.setFieldValue("subLocationStatus", value)}
                      value={formik.values.subLocationStatus}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.subLocationStatus &&
                        formik.errors.subLocationStatus
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600"> {formik.touched.subLocationStatus &&   formik.errors.subLocationStatus}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between  mt-4 ">
                     <Button onClick={() => { handleCancel(); setIsEditModalOpen(false); setEditingSubLocation(null);}}className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
                      <Button type="primary" htmlType="submit" loading={addASubLocationLoading || updateASubLocationLoading } disabled={addASubLocationLoading || updateASubLocationLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans">
                        {editingSubLocation ? "Update" : "Submit"}
                      </Button>
                  </div>

              </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      
          <div style={{ overflowX: "auto", width: "100%" }}>
            <Table
             loading={getAllSubLocationsLoading}
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: "max-content" }}
            />
          </div>
      

      {/* delete sub-location modal */}
      <Modal
        title="Confirm sub-location deletion?"
        open={isDeleteModalOpen}
        footer={null}
        onCancel={handleDeleteModalCancel}
      >
        <div>
          <p className="text-sm">
            Are you sure you want to delete this sub-location?
          </p>
        </div>

        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button
            htmlType="button"
            onClick={handleDeleteModalCancel}
            className="w-28 text-sm font-semibold h-10 font-sans"
          >
            Cancel
          </Button>

         
            <Button
              loading={deleteASubLocationLoading}
              onClick={deleteSubLocation}
              type="primary"
              htmlType="button"
              disabled={deleteASubLocationLoading}
              className="w-28 text-sm font-semibold h-10 text-white font-sans"
            >
              Delete
            </Button>
       
        </div>
      </Modal>
    </div>
  );
};

export default SubLocations;
