import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Select, Spin, Table } from "antd";
import * as Yup from "yup";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {addACampus,deleteACampus,getACampus,getAllCampuses,resetCampusState,updateACampus} from "../features/campus/campusSlice";
import { useFormik } from "formik";
import { getAllCountries } from "../features/country/countrySlice";
import { getAllCounties } from "../features/county/countySlice";
import { getAllConstituencies } from "../features/constituency/constituencySlice";
import { getAllUniversities } from "../features/university/universitySlice";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "campusName",
  },
  {
    title: "Short Description",
    dataIndex: "campusShortDesc",
  },
  {
    title: "Country",
    dataIndex: "campusCountryCode",
  },
  {
    title: "County",
    dataIndex: "campusCountyCode",
  },
  {
    title: "Constituency",
    dataIndex: "campusConstituencyCode",
  },
  {
    title: "University",
    dataIndex: "campusUniversityCode",
  },
  {
    title: "Location",
    dataIndex: "campusLocation",
  },
  {
    title: "Status",
    dataIndex: "campusStatus",
  },
  {
    title: "Action ",
    dataIndex: "action",
  },
];

const CAMPUS_SCHEMA = Yup.object().shape({
  campusName: Yup.string().required("Please provide campus name."),
  campusShortDesc: Yup.string().required(
    "Please provide campus short description."
  ),
  campusCountryCode: Yup.number()
    .typeError("Country code must be a number.")
    .required("Please select campus country."),
  campusCountyCode: Yup.number()
    .typeError("County code must be a number.")
    .required("Please select campus county."),
  campusConstituencyCode: Yup.number()
    .typeError("Constituency code must be a number.")
    .required("Please select campus constituency."),
  campusUniversityCode: Yup.number()
    .typeError("University code must be a number.")
    .required("Please select campus university."),
  campusLocation: Yup.string().required("Please provide campus location."),
  campusStatus: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "Please select a valid campus status.")
    .required("Please select campus status."),
});

const Campuses = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampusCode, setSelectedCampusCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState(null);
  const addACampusSuccess = useSelector(
    (state) => state?.campus?.success?.addACampus
  );
  const addedCampus = useSelector((state) => state?.campus?.addedCampus);
  const campuses = useSelector((state) => state?.campus?.campuses);
  const addACampusLoading = useSelector(
    (state) => state?.campus?.loading?.addACampus
  );
  const deleteACampusLoading = useSelector(
    (state) => state?.campus?.loading?.deleteACampus
  );
  const getAllCampusesLoading = useSelector(
    (state) => state?.campus?.loading?.getAllCampuses
  );
  const updatedCampus = useSelector((state) => state?.campus?.updatedCampus);
  const updateACampusSuccess = useSelector(
    (state) => state?.campus?.success?.updateACampus
  );
  const updateACampusLoading = useSelector(
    (state) => state?.campus?.loading?.updateACampus
  );
  const countries = useSelector((state) => state?.country?.countries);
  const counties = useSelector((state) => state?.county?.counties);
  const constituencies = useSelector(
    (state) => state?.constituency?.constituencies
  );
  const universities = useSelector((state) => state?.university?.universities);

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

  const showEditModal = async (campus) => {
    setEditingCampus(campus);
    setIsEditModalOpen(true);
    await dispatch(getACampus(campus?.campusCode));
  };

  const formik = useFormik({
    initialValues: {
      campusName: editingCampus?.campusName || "",
      campusShortDesc: editingCampus?.campusShortDesc || "",
      campusCountryCode: editingCampus?.country?.countryCode || null,
      campusCountyCode: editingCampus?.county?.countyCode || null,
      campusConstituencyCode:editingCampus?.constituency?.constituencyCode || null,
      campusUniversityCode: editingCampus?.university?.universityCode || null,
      campusLocation: editingCampus?.campusLocation || "",
      campusStatus: editingCampus?.campusStatus || null,
    },
    enableReinitialize: true,
    validationSchema: CAMPUS_SCHEMA,
    onSubmit: (values) => {
      if (editingCampus) {
        dispatch(
          updateACampus({
            campusCode: editingCampus?.campusCode,
            campusData: values,
          })
        );
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllUniversities());
      } else {
        dispatch(addACampus(values));
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
        dispatch(getAllUniversities());
      }
    },
  });

  useEffect(() => {
    dispatch(getAllCampuses());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
    dispatch(getAllUniversities());
  }, [dispatch]);

  useEffect(() => {
    if (addedCampus && addACampusSuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetCampusState());
      dispatch(getAllCampuses());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllUniversities());
    }
  }, [addedCampus, addACampusSuccess, dispatch]);

  useEffect(() => {
    if (updatedCampus && updateACampusSuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetCampusState());
      dispatch(getAllCampuses());
      setEditingCampus(null);
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllUniversities());
    }
  }, [updatedCampus, updateACampusSuccess, dispatch]);

  const dataSource =
    campuses && Array.isArray(campuses)
      ? campuses.map((campus, index) => ({
          key: index + 1,
          campusName: campus?.campusName,
          campusShortDesc: campus?.campusShortDesc,
          campusCountryCode: campus?.country.countryName,
          campusCountyCode: campus?.county.countyName,
          campusConstituencyCode: campus?.constituency.constituencyName,
          campusUniversityCode: campus?.university.universityName,
          campusLocation: campus?.campusLocation,
          campusStatus: campus?.campusStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8 ">
                <button type="button" onClick={() => showEditModal(campus)}>
                  <FaEdit className="text-blue-600 font-medium text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCampusCode(campus?.campusCode);
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

  const deleteCampus = async () => {
    if (selectedCampusCode) {
      await dispatch(deleteACampus(selectedCampusCode));
      setIsDeleteModalOpen(false);
      setSelectedCampusCode(null);
      dispatch(resetCampusState());
      dispatch(getAllCampuses());
      dispatch(getAllCampuses());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
      dispatch(getAllUniversities());
    }
  };

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Campus</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal}className="text-sm font-semibold px-4 h-10 text-white font-sans">
            + New Campus
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">
              {editingCampus ? "Edit campus" : "Add a new campus"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setIsEditModalOpen(false);
          setEditingCampus(null);
        }}
        width={720}
        className="font-sans"
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center flex-col gap-3 mt-4">
              <div className="flex justify-start lg:gap-8">
                <div className="flex gap-4">

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="campusName"
                            className="text-sm font-semibold"
                          >
                            Name
                          </label>
                          <Input
                            type="text"
                            id="campusName"
                            name="campusName"
                            placeholder="e.g. Nairobi University City Campus."
                            onBlur={(e) => {
                              formik.setFieldValue(
                                "campusName",
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
                            value={formik.values.campusName}
                            className={`w-80 h-11 border-1.5 ${
                              formik.touched.campusName && formik.errors.campusName
                                ? "border-red-600"
                                : ""
                            }`}
                          />
                          <div>
                            <p className="text-xs text-red-600">
                              {formik.touched.campusName && formik.errors.campusName}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="campusShortDesc"
                            className="text-sm font-semibold"
                          >
                            Short Description
                          </label>
                          <Input
                            placeholder="e.g. Nairobi University City Campus."
                            type="text"
                            name="campusShortDesc"
                            id="campusShortDesc"
                            onBlur={(e) => {
                              formik.setFieldValue(
                                "campusShortDesc",
                                e.target.value.charAt(0).toUpperCase() +
                                  e.target.value.slice(1).toLowerCase()
                              );
                              formik.handleBlur(e);
                            }}
                            onChange={formik.handleChange}
                            value={formik.values.campusShortDesc}
                            className={`w-80 h-11 border-1.5 ${
                              formik.touched.campusShortDesc &&
                              formik.errors.campusShortDesc
                                ? "border-red-600"
                                : ""
                            }`}
                          />
                          <div>
                            <p className="text-xs text-red-600">
                              {formik.touched.campusShortDesc &&
                                formik.errors.campusShortDesc}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="campusCountryCode"
                            className="text-sm font-semibold"
                          >
                            Country
                          </label>
                          <Select
                            placeholder="e.g. Kenya"
                            type="text"
                            name="campusCountryCode"
                            id="campusCountryCode"
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
                              formik.setFieldValue("campusCountryCode", value)
                            }
                            value={formik.values.campusCountryCode}
                            className={`w-80 h-11 border-1.5 rounded-lg ${
                              formik.touched.campusCountryCode &&
                              formik.errors.campusCountryCode
                                ? "border-red-600"
                                : ""
                            }`}
                          />
                          <div>
                            <p className="text-xs text-red-600">
                              {formik.touched.campusCountryCode &&
                                formik.errors.campusCountryCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="campusCountyCode"
                            className="text-sm font-semibold"
                          >
                            County
                          </label>
                          <Select
                            placeholder="e.g. Nairobi"
                            type="text"
                            name="campusCountyCode"
                            id="campusCountyCode"
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
                              formik.setFieldValue("campusCountyCode", value)
                            }
                            value={formik.values.campusCountyCode}
                            className={`w-80  h-11 border-1.5 rounded-lg ${
                              formik.touched.campusCountyCode &&
                              formik.errors.campusCountyCode
                                ? "border-red-600"
                                : ""
                            }`}
                          />
                          <div>
                            <p className="text-xs text-red-600">
                              {formik.touched.campusCountyCode &&
                                formik.errors.campusCountyCode}
                            </p>
                          </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">

                       <div className="flex flex-col gap-1">
                          <label
                            htmlFor="campusConstituencyCode"
                            className="text-sm font-semibold"
                          >
                            Constituency
                          </label>
                          <Select
                            placeholder="e.g Embakasi"
                            type="text"
                            name="campusConstituencyCode"
                            id="campusConstituencyCode"
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
                              formik.setFieldValue("campusConstituencyCode", value)
                            }
                            value={formik.values.campusConstituencyCode}
                            className={`w-80  h-11 border-1.5 rounded-lg ${
                              formik.touched.campusConstituencyCode &&
                              formik.errors.campusConstituencyCode
                                ? "border-red-600"
                                : ""
                            }`}
                          />
                          <div>
                            <p className="text-xs text-red-600">
                              {formik.touched.campusConstituencyCode &&
                                formik.errors.campusConstituencyCode}
                            </p>
                          </div>
                        </div>
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="campusUniversityCode"
                          className="text-sm font-semibold"
                        >
                          University
                        </label>
                        <Select
                          placeholder="e.g University of Nairobi"
                          type="text"
                          name="campusUniversityCode"
                          id="campusUniversityCode"
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
                            formik.setFieldValue("campusUniversityCode", value)
                          }
                          value={formik.values.campusUniversityCode}
                          className={`w-80  h-11 border-1.5 rounded-lg ${
                            formik.touched.campusUniversityCode &&
                            formik.errors.campusUniversityCode
                              ? "border-red-600"
                              : ""
                          }`}
                        />
                        <div>
                          <p className="text-xs text-red-600">
                            {formik.touched.campusUniversityCode &&
                              formik.errors.campusUniversityCode}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="campusLocation"
                          className="text-sm font-semibold"
                        >
                          Location
                        </label>
                        <Input
                          id="campusLocation"
                          name="campusLocation"
                          placeholder="e.g. Nairobi"
                          type="text"
                          onBlur={(e) => {
                            formik.setFieldValue(
                              "campusLocation",
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
                          value={formik.values.campusLocation}
                          className={`w-80  h-11 border-1.5 ${
                            formik.touched.campusLocation &&
                            formik.errors.campusLocation
                              ? "border-red-600"
                              : ""
                          }`}
                        />
                        <div>
                          <p className="text-xs text-red-600">
                            {formik.touched.campusLocation &&
                              formik.errors.campusLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="campusStatus"
                          className="text-sm font-semibold"
                        >
                          Status
                        </label>
                        <Select
                          placeholder="Select Campus Status"
                          type="text"
                          name="campusStatus"
                          id="campusStatus"
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
                            formik.setFieldValue("campusStatus", value)
                          }
                          value={formik.values.campusStatus}
                          className={`w-80  h-11 border-1.5 rounded-lg ${
                            formik.touched.campusStatus &&
                            formik.errors.campusStatus
                              ? "border-red-600"
                              : ""
                          }`}
                        />
                        <div>
                          <p className="text-xs text-red-600">
                            {formik.touched.campusStatus &&
                              formik.errors.campusStatus}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between  mt-4 ">
                        <Button htmlType="button"  onClick={() => { handleCancel();  setIsEditModalOpen(false); setEditingCampus(null);  }} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
                        {addACampusLoading || updateACampusLoading ? (
                          <Button type="primary"  htmlType="button"  loading  className="w-28 text-sm font-semibold h-10 text-white font-sans">Please wait...</Button>
                        ) : (
                          <Button  type="primary"  htmlType="submit"  disabled={addACampusLoading || updateACampusLoading}  className="w-28 text-sm font-semibold h-10 text-white font-sans">{editingCampus ? "Update" : "Submit"}</Button>
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
        {getAllCampusesLoading ? (
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
            <Table columns={columns} dataSource={dataSource} scroll={{ x: "max-content" }}/>
          </div>
        )}
      </div>

      {/* delete campus modal */}

      <Modal title="Confirm Campus deletion?" open={isDeleteModalOpen} footer={null} onCancel={handleDeleteModalCancel}>
        <p className="text-sm">  Are you sure you want to delete this campus?</p>
        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button htmlType="button"  onClick={handleDeleteModalCancel} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
          {deleteACampusLoading ? (
            <Button  type="primary" htmlType="button" loading className="w-28 text-sm font-semibold h-10 text-white font-sans">Please wait... </Button>
          ) : (
            <Button onClick={deleteCampus} type="primary" htmlType="button" disabled={deleteACampusLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans">Delete</Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Campuses;
