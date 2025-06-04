import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Select, Spin, Table } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {addAUniversity,deleteAUniversity,getAllUniversities,getAUniversity,resetUniversityState,updateAUniversity,} from "../features/university/universitySlice";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { getAllCountries } from "../features/country/countrySlice";
import { getAllSubLocations } from "../features/subLocation/subLocationSlice";
import { getAllCounties } from "../features/county/countySlice";
import { getAllConstituencies } from "../features/constituency/constituencySlice";
import { RiDeleteBinLine } from "react-icons/ri";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "universityName",
  },
  {
    title: "Short Description",
    dataIndex: "universityShortDesc",
  },

  {
    title: "Country",
    dataIndex: "universityCountryCode",
  },

  {
    title: "County",
    dataIndex: "universityCountyCode",
  },

  {
    title: "Constituency",
    dataIndex: "universityConstituencyCode",
  },

  {
    title: "Sub-location",
    dataIndex: "villageSubLocationCode",
  },

  {
    title: "Location",
    dataIndex: "universityLocation",
  },

  {
    title: "Type",
    dataIndex: "universityType",
  },

  {
    title: "Status",
    dataIndex: "universityStatus",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const UNIVERSITY_SHCHEMA = Yup.object().shape({
  universityName: Yup.string().required("Please provide your university name."),
  universityShortDesc: Yup.string().required("Please provide country short description."),
  universityCountryCode: Yup.number().typeError("Country code must be a number.").required("Please select university country."),
  universityCountyCode: Yup.number().typeError("County code must be a number.").required("Please select university county."),
  universityConstituencyCode: Yup.number().typeError("Constituency code must be a number.").required("Please select university constituency."),
  universitySubLocationCode: Yup.number().typeError("Sub-location code must be a number.").required("Please select university sub-location."),
  universityLocation: Yup.string().required("Please provide university location."),
  universityType: Yup.string().required("Please select your univerity type."),
  universityStatus: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Please select a valid university status.").required("Please select university status."),
});

const Universities = () => {
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUniversityCode, setSelectedUniversityCode] = useState(null);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const addedUniversity = useSelector((state) => state?.university?.addedUniversity);
  const addAUniversitySuccess = useSelector((state) => state?.university?.success?.addAUniversity);
  const universities = useSelector((state) => state?.university?.universities);
  const updatedUniversity = useSelector((state) => state?.university?.updatedUniversity);
  const updateAUniversitySuccess = useSelector((state) => state?.university?.success?.updateAUniversity);
  const addAUniversityLoading = useSelector((state) => state.university.loading.addAUniversity);
  const updateAUniversityLoading = useSelector((state) => state.university.loading.updateAUniversity);
  const getAllUniversitiesLoading = useSelector((state) => state?.university?.loading?.getAllUniversities);
  const deleteAUniversityLoading = useSelector((state) => state?.university?.loading?.deleteAUniversity);
  const countries = useSelector((state) => state?.country?.countries);
  const constituencies = useSelector((state) => state?.constituency?.constituencies);
  const counties = useSelector((state) => state?.county?.counties);
  const subLocations = useSelector((state) => state?.subLocation?.subLocations);
  const deleteAUniversitySuccess = useSelector((state) => state?.university?.success?.deleteAUniversity);

  const showDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    formik.resetForm();
  }, []);
  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);
  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const showEditModal = async (university) => {
    setEditingUniversity(university);
    setIsEditModalOpen(true);
    await dispatch(getAUniversity(university?.universityCode));
  };

  const formik = useFormik({
    initialValues: {
      universityName: editingUniversity?.universityName || "",
      universityShortDesc: editingUniversity?.universityShortDesc || "",
      universityCountryCode: editingUniversity?.country?.countryCode || null,
      universityCountyCode: editingUniversity?.county?.countyCode || null,
      universityConstituencyCode: editingUniversity?.constituency?.constituencyCode || null,
      universityLocation: editingUniversity?.universityLocation || null,
      universitySubLocationCode: editingUniversity?.subLocation?.subLocationCode || null,
      universityType: editingUniversity?.universityType || null,
      universityStatus: editingUniversity?.universityStatus || null,
    },
    enableReinitialize: true,
    validationSchema: UNIVERSITY_SHCHEMA,
    onSubmit: (values) => {
      if (editingUniversity) {
        dispatch(
          updateAUniversity({
            universityCode: editingUniversity?.universityCode,
            universityData: values,
          })
        );
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllSubLocations());
      } else {
        dispatch(addAUniversity(values));
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllSubLocations());
      }
    },
  });

  useEffect(() => {
    dispatch(getAllUniversities());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
    dispatch(getAllSubLocations());
  }, [dispatch]);

  useEffect(() => {
    if (addedUniversity && addAUniversitySuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetUniversityState());
      dispatch(getAllUniversities());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllSubLocations());
    }
  }, [addedUniversity, addAUniversitySuccess, dispatch,]);

  useEffect(() => {
    if (updatedUniversity && updateAUniversitySuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetUniversityState());
      dispatch(getAllUniversities());
      setEditingUniversity(null);
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllSubLocations());
    }
  }, [updateAUniversitySuccess, updatedUniversity, dispatch]);

  const dataSource =
    universities && Array.isArray(universities)
      ? universities.map((university, index) => ({
          key: index + 1,
          universityName: university?.universityName,
          universityShortDesc: university?.universityShortDesc,
          universityCountryCode: university?.country?.countryName,
          universityCountyCode: university?.county?.countyName,
          universityConstituencyCode:
            university?.constituency?.constituencyName,
          villageSubLocationCode: university?.subLocation?.subLocationName,
          universityLocation: university?.subLocation?.subLocationName,
          universityType: university?.universityType,
          universityStatus: university?.universityStatus,
          action: (
            <div className="flex flex-row items-center gap-8">
              <button type="button" onClick={() => showEditModal(university)}>
                <MdOutlineEdit className="text-blue-600 font-normal text-xl" />
              </button>

              <button type="button" onClick={() => {setSelectedUniversityCode(university?.universityCode); showDeleteModal();}}>
                <RiDeleteBinLine className="text-red-600 font-normal text-xl" />
              </button>
            </div>
          ),
        }))
      : [];

  const deleteUniversity = async () => {
    if (selectedUniversityCode) {
      await dispatch(deleteAUniversity(selectedUniversityCode));
    }
  };

  useEffect(() => {
    if (deleteAUniversitySuccess) {
      setIsDeleteModalOpen(false);
      setSelectedUniversityCode(null);
      dispatch(getAllUniversities());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllSubLocations());
    }
  }, [deleteAUniversitySuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Universities</h2>
        <div>
          <Button type="primary" onClick={showModal} htmlType="button"className="text-sm font-semibold px-4 h-10 text-white font-sans"> + New University </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">
              {editingUniversity ? "Edit university" : "Add a new university"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setIsEditModalOpen(false);
          setEditingUniversity(null);
        }}
        className="font-sans"
        width={720}
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 mt-4">

              <div className="flex flex-col gap-3">



              <div className="flex flex-col gap-1">
                <label
                  htmlFor="universityName"
                  className="text-sm font-semibold"
                >
                  Name
                </label>
                <Input
                  id="universityName"
                  name="universityName"
                  placeholder="e.g. University Of Nairobi"
                  type="text"
                  onBlur={(e) => {
                    formik.setFieldValue(
                      "universityName",
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
                  value={formik.values.universityName}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.universityName &&
                    formik.errors.universityName
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universityName &&
                      formik.errors.universityName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="universityShortDesc"
                  className="text-sm font-semibold"
                >
                  Short Description
                </label>
                <Input
                  type="text"
                  name="universityShortDesc"
                  placeholder="e.g. University Of Nairobi"
                  id="universityShortDesc"
                  onBlur={(e) => {
                    formik.setFieldValue(
                      "universityShortDesc",
                      e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1).toLowerCase()
                    );
                    formik.handleBlur(e);
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.universityShortDesc}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.universityShortDesc &&
                    formik.errors.universityShortDesc
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universityShortDesc &&
                      formik.errors.universityShortDesc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="universityCountryCode"
                  className="text-sm font-semibold"
                >
                  Country
                </label>
                <Select
                  placeholder="e.g Kenya"
                  type="text"
                  name="universityCountryCode"
                  id="universityCountryCode"
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
                    formik.setFieldValue("universityCountryCode", value)
                  }
                  value={formik.values.universityCountryCode}
                  className={`w-80 h-11 border-1.5 rounded-lg ${
                    formik.touched.universityCountryCode &&
                    formik.errors.universityCountryCode
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universityCountryCode &&
                      formik.errors.universityCountryCode}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="universityCountyCode"
                  className="text-sm font-semibold"
                >
                  County
                </label>
                <Select
                  type="text"
                  name="universityCountyCode"
                  id="universityCountyCode"
                  placeholder="e.g. Nairobi"
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
                    formik.setFieldValue("universityCountyCode", value)
                  }
                  value={formik.values.universityCountyCode}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.universityCountyCode &&
                    formik.errors.universityCountyCode
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universityCountyCode &&
                      formik.errors.universityCountyCode}
                  </p>
                </div>
              </div>
                 <div className="flex flex-col gap-1">
                <label
                  htmlFor="universityConstituencyCode"
                  className="text-sm font-semibold"
                >
                  Constituency
                </label>
                <Select
                  type="text"
                  name="universityConstituencyCode"
                  id="universityConstituencyCode"
                  placeholder="e.g. Embakasi"
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
                    formik.setFieldValue("universityConstituencyCode", value)
                  }
                  value={formik.values.universityConstituencyCode}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.universityConstituencyCode &&
                    formik.errors.universityConstituencyCode
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universityConstituencyCode &&
                      formik.errors.universityConstituencyCode}
                  </p>
                </div>
              </div>


          </div>

          <div className="flex flex-col gap-3">



           

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="universitySubLocationCode"
                  className="text-sm font-semibold"
                >
                  Sub-location
                </label>
                <Select
                  type="text"
                  name="universitySubLocationCode"
                  id="universitySubLocationCode"
                  placeholder="e.g. Nairobi West"
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
                    formik.setFieldValue("universitySubLocationCode", value)
                  }
                  value={formik.values.universitySubLocationCode}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.universityConstituencyCode &&
                    formik.errors.universityConstituencyCode
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universitySubLocationCode &&
                      formik.errors.universitySubLocationCode}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="universityLocation"
                  className="text-sm font-semibold"
                >
                  Location
                </label>
                <Input
                  id="universityLocation"
                  name="universityLocation"
                  placeholder="e.g. Nairobi"
                  type="text"
                  onBlur={(e) => {
                    formik.setFieldValue(
                      "universityLocation",
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
                  value={formik.values.universityLocation}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.universityLocation &&
                    formik.errors.universityLocation
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universityLocation &&
                      formik.errors.universityLocation}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="universityType"
                  className="text-sm font-semibold"
                >
                  Type
                </label>
                <Select
                  type="text"
                  name="universityType"
                  id="universityType"
                  placeholder="Select University Type."
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: "Public",
                      label: "Public",
                    },
                    {
                      value: "Private",
                      label: "Private",
                    },
                  ]}
                  onBlur={formik.handleBlur}
                  onChange={(value) =>
                    formik.setFieldValue("universityType", value)
                  }
                  value={formik.values.universityType}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.universityType &&
                    formik.errors.universityType
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universityType &&
                      formik.errors.universityType}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="universityStatus"
                  className="text-sm font-semibold"
                >
                  Status
                </label>
                <Select
                  type="text"
                  name="universityStatus"
                  id="universityStatus"
                  placeholder="University Status"
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
                    formik.setFieldValue("universityStatus", value)
                  }
                  value={formik.values.universityStatus}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.universityStatus &&
                    formik.errors.universityStatus
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.universityStatus &&
                      formik.errors.universityStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center  gap-24 mt-4 ">
                <Button htmlType="button" onClick={() => { handleCancel(); setIsEditModalOpen(false); setEditingUniversity(null)}} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>

                {addAUniversityLoading || updateAUniversityLoading ? (
                  <Button type="primary" htmlType="button"loading  className="w-28 text-sm font-semibold h-10 text-white font-sans">  Please wait...  </Button>
                ) : (
                  <Button  type="primary" htmlType="submit"  disabled={addAUniversityLoading || updateAUniversityLoading}   className="w-28 text-sm font-semibold h-10 text-white font-sans" >{editingUniversity ? "Update" : "Submit"}</Button>
                )}
              </div>

              </div>


            </div>
          </div>
        </form>
      </Modal>

      <div>
        {getAllUniversitiesLoading ? (
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

      {/* Delete country modal */}
      <Modal
        title="Confirm country deletion?"
        open={isDeleteModalOpen}
        footer={null}
        onCancel={handleDeleteCancel}
      >
        <div>
          <p className="text-sm">
            Are you sure you want to delete this country?
          </p>
        </div>

        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button
            htmlType="button"
            onClick={handleDeleteCancel}
            className="w-28 text-sm font-semibold h-10 font-sans"
          >
            Cancel
          </Button>

          {deleteAUniversityLoading ? (
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
              onClick={deleteUniversity}
              type="primary"
              htmlType="button"
              disabled={deleteAUniversityLoading}
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

export default Universities;
