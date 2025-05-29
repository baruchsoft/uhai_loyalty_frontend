import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Select, Spin, Table } from "antd";
import * as Yup from "yup";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {addAVillage,deleteAVillage,getAllVillages,getAVillage,resetVillageState,updateAVillage} from "../features/village/villageSlice";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { getAllCountries } from "../features/country/countrySlice";
import { getAllConstituencies } from "../features/constituency/constituencySlice";
import { getAllCounties } from "../features/county/countySlice";
import { getAllSubLocations } from "../features/subLocation/subLocationSlice";
import { getAllWards } from "../features/ward/wardSlice";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "villageName",
  },
  {
    title: "Short Description",
    dataIndex: "villageShortDesc",
  },
  {
    title: "Country",
    dataIndex: "villageCountryCode",
  },
  {
    title: "County",
    dataIndex: "villageCountyCode",
  },
  {
    title: "Constituency",
    dataIndex: "villageConstituencyCode",
  },
  {
    title: "Sub-location",
    dataIndex: "villageSubLocationCode",
  },
  {
    title: "Ward",
    dataIndex: "villageWardCode",
  },
  {
    title: "Status",
    dataIndex: "villageStatus",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const VILLAGE_SCHEMA = Yup.object().shape({
  villageName: Yup.string().required("Please provide village name."),
  villageShortDesc: Yup.string().required( "Please provide village short description."),
  villageCountryCode: Yup.number().typeError("Country code must be a number.").required("Please select village country."),
  villageCountyCode: Yup.number().typeError("County code must be a number.").required("Please select village county."),
  villageConstituencyCode: Yup.number().typeError("Constituency code must be a number.").required("Please select village constituency."),
  villageSubLocationCode: Yup.number().typeError("Sub-location code must be a number.").required("Please select village sub-location."),
  villageWardCode: Yup.number().typeError("Ward code must be a number.").required("Please select village ward."),
  villageStatus: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Please select a valid village status.").required("Please select village status."),
});

const Villages = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVillageCode, setSelectedVillageCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);

  const addAVillageSuccess = useSelector((state) => state?.village?.success?.addAVillage);
  const addedVillage = useSelector((state) => state?.village?.addedVillage);
  const addAVillageLoading = useSelector((state) => state?.village?.loading?.addAVillage);
  const updatedVillage = useSelector((state) => state?.village?.updatedVillage);
  const updateAVillageLoading = useSelector((state) => state?.village?.loading?.updateAVillage);
  const updateAVillageSuccess = useSelector((state) => state?.village?.success?.updateAVillage);
  const villages = useSelector((state) => state?.village?.villages);
  const getAllVillagesLoading = useSelector((state) => state?.village?.loading?.getAllVillages);
  const deleteAVillageLoading = useSelector((state) => state?.village?.loading?.deleteAVillage);

  const countries = useSelector((state) => state?.country?.countries);
  const counties = useSelector((state) => state?.county?.counties);
  const constituencies = useSelector((state) => state?.constituency?.constituencies);

  const deleteAVillageSuccess = useSelector((state) => state?.village?.success?.deleteAVillage);

  const subLocations = useSelector((state) => state?.subLocation?.subLocations);
  const wards = useSelector((state) => state?.ward?.wards);

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

  const showEditModal = async (village) => {
    setEditingVillage(village);
    setIsEditModalOpen(true);
    await dispatch(getAVillage(village?.villageCode));
  };

  const formik = useFormik({
    initialValues: {
      villageName: editingVillage?.villageName || "",
      villageShortDesc: editingVillage?.villageShortDesc || "",
      villageCountryCode: editingVillage?.country?.countryCode || null,
      villageCountyCode: editingVillage?.county?.countyCode || null,
      villageConstituencyCode: editingVillage?.constituency?.constituencyCode || null,
      villageSubLocationCode: editingVillage?.subLocation?.subLocationCode || null,
      villageWardCode: editingVillage?.ward?.wardCode || null,
      villageStatus: editingVillage?.villageStatus || null,
    },
    enableReinitialize: true,
    validationSchema: VILLAGE_SCHEMA,
    onSubmit: (values) => {
      if (editingVillage) {
        dispatch(
          updateAVillage({
            villageCode: editingVillage?.villageCode,
            villageData: values,
          })
        );
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllSubLocations());
        dispatch(getAllWards());
      } else {
        dispatch(addAVillage(values));
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllSubLocations());
        dispatch(getAllWards());
      }
    },
  });

  useEffect(() => {
    dispatch(getAllVillages());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
    dispatch(getAllSubLocations());
    dispatch(getAllWards());
  }, [dispatch]);

  useEffect(() => {
    if (addedVillage && addAVillageSuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetVillageState());
      dispatch(getAllVillages());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllSubLocations());
      dispatch(getAllWards());
    }
  }, [addedVillage, addAVillageSuccess, dispatch]);

  useEffect(() => {
    if (updatedVillage && updateAVillageSuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetVillageState());
      dispatch(getAllVillages());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllSubLocations());
      dispatch(getAllWards());
      setEditingVillage(null);
    }
  }, [updatedVillage, updateAVillageSuccess, dispatch]);

  const dataSource =
    villages && Array.isArray(villages)
      ? villages.map((village, index) => ({
          key: index + 1,
          villageName: village?.villageName,
          villageShortDesc: village?.villageShortDesc,
          villageCountryCode: village?.country?.countryName,
          villageCountyCode: village?.county?.countyName,
          villageConstituencyCode: village?.constituency?.constituencyName,
          villageSubLocationCode: village?.subLocation?.subLocationName,
          villageWardCode: village?.ward?.wardName,
          villageStatus: village?.villageStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8">
                <button type="button" onClick={() => showEditModal(village)}>
                  <FaEdit className="text-blue-600  font-medium text-xl" />
                </button>
                <button type="button" onClick={() => {setSelectedVillageCode(village?.villageCode);showDeleteModal()}}>
                  <MdDelete className="text-red-600  font-medium text-xl" />
                </button>
              </div>
            </>
          ),
        }))
      : [];

  const deleteVillage = async () => {
    if (selectedVillageCode) {
      await dispatch(deleteAVillage(selectedVillageCode));
    }
  };

  useEffect(() => {
    if (deleteAVillageSuccess) {
      setIsDeleteModalOpen(false);
      setSelectedVillageCode(null);
      dispatch(resetVillageState());
      dispatch(getAllVillages());
    }
  }, [deleteAVillageSuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Villages</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal}className="text-sm font-semibold px-4 h-10 text-white font-sans"> + New Village</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">{editingVillage ? "Edit village" : "Add a village"}</h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => { handleCancel(); setIsEditModalOpen(false); setEditingVillage(null)}}
        width={720}
        className="font-sans"
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center flex-col gap-3 mt-4">
              <div className="flex justify-start lg:gap-8">
                <div className="flex gap-4">

                  <div className="flex flex-col gap-3" >

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="villageName"
                      className="text-sm font-semibold"
                    >
                      Name
                    </label>
                    <Input
                      type="text"
                      id="villageName"
                      name="villageName"
                      placeholder="e.g. Fedha Estate"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "villageName",
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
                      value={formik.values.villageName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.villageName && formik.errors.villageName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.villageName &&
                          formik.errors.villageName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="villageShortDesc"
                      className="text-sm font-semibold"
                    >
                      Short Description
                    </label>
                    <Input
                      placeholder="e.g. Fedha Estate"
                      type="text"
                      name="villageShortDesc"
                      id="villageShortDesc"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "villageShortDesc",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.villageShortDesc}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.villageShortDesc &&
                        formik.errors.villageShortDesc
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.villageShortDesc &&
                          formik.errors.villageShortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="villageCountryCode"
                      className="text-sm font-semibold"
                    >
                      Country
                    </label>
                    <Select
                      placeholder="Select village Country"
                      type="text"
                      name="villageCountryCode"
                      id="villageCountryCode"
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
                        formik.setFieldValue("villageCountryCode", value)
                      }
                      value={formik.values.villageCountryCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.villageCountryCode &&
                        formik.errors.villageCountryCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.villageCountryCode &&
                          formik.errors.villageCountryCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="villageCountyCode"
                      className="text-sm font-semibold"
                    >
                      County
                    </label>
                    <Select
                      placeholder="Select Village County."
                      type="text"
                      name="villageCountyCode"
                      id="villageCountyCode"
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
                        formik.setFieldValue("villageCountyCode", value)
                      }
                      value={formik.values.villageCountyCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.villageCountyCode &&
                        formik.errors.villageCountyCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.villageCountyCode &&
                          formik.errors.villageCountyCode}
                      </p>
                    </div>
                  </div>
                </div>

                  <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                    <label
                      htmlFor="villageConstituencyCode"
                      className="text-sm font-semibold"
                    >
                      Constituency
                    </label>
                    <Select
                      placeholder="Select Village constituency."
                      type="text"
                      name="villageConstituencyCode"
                      id="villageConstituencyCode"
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
                        formik.setFieldValue("villageConstituencyCode", value)
                      }
                      value={formik.values.villageConstituencyCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.villageConstituencyCode &&
                        formik.errors.villageConstituencyCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.villageConstituencyCode &&
                          formik.errors.villageConstituencyCode}
                      </p>
                    </div>
                  </div>

                     <div className="flex flex-col gap-1">
                    <label
                      htmlFor="villageSubLocationCode"
                      className="text-sm font-semibold"
                    >
                      Sub-location
                    </label>
                    <Select
                      placeholder="Select Village Sub-location."
                      type="text"
                      name="villageSubLocationCode"
                      id="villageSubLocationCode"
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
                      onChange={(value) =>
                        formik.setFieldValue("villageSubLocationCode", value)
                      }
                      value={formik.values.villageSubLocationCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.villageSubLocationCode &&
                        formik.errors.villageSubLocationCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.villageSubLocationCode &&
                          formik.errors.villageSubLocationCode}
                      </p>
                    </div>
                  </div>


                   <div className="flex flex-col gap-1">
                    <label
                      htmlFor="villageWardCode"
                      className="text-sm font-semibold"
                    >
                      Ward
                    </label>
                    <Select
                      placeholder="Select Village Ward."
                      type="text"
                      name="villageWardCode"
                      id="villageWardCode"
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
                        formik.setFieldValue("villageWardCode", value)
                      }
                      value={formik.values.villageWardCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.villageWardCode &&
                        formik.errors.villageWardCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.villageWardCode &&
                          formik.errors.villageWardCode}
                      </p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-1">
                    <label htmlFor="villageStatus" className="text-sm font-semibold">Status</label>
                    <Select placeholder="Select Village Status." type="text" name="villageStatus" id="villageStatus"
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
                        formik.setFieldValue("villageStatus", value)
                      }
                      value={formik.values.villageStatus}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.villageStatus &&
                        formik.errors.villageStatus
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.villageStatus &&
                          formik.errors.villageStatus}
                      </p>
                    </div>
                  </div>

                 <div className="flex items-center justify-between  mt-4 ">
                     <Button htmlType="button" onClick={() => { handleCancel();  setIsEditModalOpen(false);setEditingVillage(null)}} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
                    {addAVillageLoading || updateAVillageLoading ? (
                      <Button type="primary"  htmlType="button"  loading className="w-28 text-sm font-semibold h-10 text-white font-sans">Please wait...</Button>
                    ) : (
                      <Button type="primary" htmlType="submit" disabled={addAVillageLoading || updateAVillageLoading}  className="w-28 text-sm font-semibold h-10 text-white font-sans">{editingVillage ? "Update" : "Submit"}</Button>
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
        {getAllVillagesLoading ? (
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

      <Modal
        title="Confirm village deletion? "
        open={isDeleteModalOpen}
        footer={null}
        onCancel={handleDeleteModalCancel}
        
      >
        <div>
          <p className="text-sm">re you sure you want to delete this village?</p>
        </div>

        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button htmlType="button" onClick={handleDeleteModalCancel}  className="w-28 text-sm font-semibold h-10 font-sans" >Cancel</Button>
          {deleteAVillageLoading ? (
            <Button type="primary"  htmlType="submit"  loading  className="w-28 text-sm font-semibold h-10 text-white font-sans">Please wait...</Button>
          ) : (
            <Button onClick={deleteVillage} type="primary" htmlType="submit"  disabled={deleteAVillageLoading}  className="w-28 text-sm font-semibold h-10 text-white font-sans">Delete</Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Villages;
