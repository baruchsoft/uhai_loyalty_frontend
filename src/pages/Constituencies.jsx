import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Button, Input, Modal, Select, Spin, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {addAConstituency,deleteAConstituency,getAConstituency,getAllConstituencies,resetConstituencyState,updateAConstituency,} from "../features/constituency/constituencySlice";
import { useFormik } from "formik";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { getAllCountries } from "../features/country/countrySlice";
import { getAllCounties } from "../features/county/countySlice";
import { RiDeleteBinLine } from "react-icons/ri";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "constituencyName",
  },
  {
    title: "Short Description",
    dataIndex: "constituencyShortDesc",
  },
  {
    title: "Country",
    dataIndex: "constituencyCountryCode",
  },
  {
    title: "County",
    dataIndex: "constituencyCountyCode",
  },
  {
    title: "Status",
    dataIndex: "constituencyStatus",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const CONSTITUNECY_SCHEMA = Yup.object().shape({
  constituencyName: Yup.string().required("Please provide constituency name."),
  constituencyShortDesc: Yup.string().required("Please provide constituency short description."),
  constituencyCountryCode: Yup.number().typeError("Country code must be a number.").required("Please select constituency country."),
  constituencyCountyCode: Yup.number().typeError("County code must be a number.").required("Please select constituency county."),
  constituencyStatus: Yup.string().oneOf(["ACTIVE", "INACTIVE"],"Please select a valid constituency status.").required("Please select constituency status."),
});

const Constituencies = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedConstituencyCode, setSelectedConstituencyCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingConstituency, setEditingConstituency] = useState(null);
  const addedConstituency = useSelector((state) => state?.constituency?.addedConstituency);
  const addAConstituencySuccess = useSelector((state) => state?.constituency?.success?.addAConstituency);
  const updateAConstituencyLoading = useSelector((state) => state?.constituency?.loading?.updateAConstituency);
  const updatedConstituency = useSelector((state) => state?.constituency?.updatedConstituency);
  const updateAConstituencySuccess = useSelector((state) => state?.constituency?.success?.updateAConstituency);
  const constituencies = useSelector((state) => state?.constituency?.constituencies);
  const getAllConstituenciesLoading = useSelector((state) => state?.constituency?.loading?.getAllConstituencies);
  const deleteAConstituencyLoading = useSelector((state) => state?.constituency?.loading?.deleteAConstituency);
  const addAConstituencyLoading = useSelector((state) => state?.constituency?.loading?.addAConstituency);
  const countries = useSelector((state) => state?.country?.countries);
  const counties = useSelector((state) => state?.county?.counties);
  const deleteAConstituencySuccess = useSelector((state) => state?.constituency?.success?.deleteAConstituency);

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

  const showEditModal = async (constituency) => {
    setEditingConstituency(constituency);
    setIsEditModalOpen(true);
    await dispatch(getAConstituency(constituency.constituencyCode));
  };

  const formik = useFormik({
    initialValues: {
      constituencyName: editingConstituency?.constituencyName || "",
      constituencyShortDesc: editingConstituency?.constituencyShortDesc || "",
      constituencyCountryCode:editingConstituency?.country?.countryCode || null,
      constituencyCountyCode: editingConstituency?.county?.countyCode || null,
      constituencyStatus: editingConstituency?.constituencyStatus || null,
    },
    enableReinitialize: true,
    validationSchema: CONSTITUNECY_SCHEMA,
    onSubmit: (values) => {
      if (editingConstituency) {
        dispatch(
          updateAConstituency({
            constituencyCode: editingConstituency.constituencyCode,
            constituencyData: values,
          })
        );
        dispatch(getAllCountries());
        dispatch(getAllCounties());
      } else {
        dispatch(addAConstituency(values));
        dispatch(getAllCountries());
        dispatch(getAllCounties());
      }
    },
  });

  useEffect(() => {
    dispatch(getAllConstituencies());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
  }, [dispatch]);

  useEffect(() => {
    if (addedConstituency && addAConstituencySuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetConstituencyState());
      dispatch(getAllConstituencies());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
    }
  }, [addedConstituency, addAConstituencySuccess, dispatch]);

  useEffect(() => {
    if (updatedConstituency && updateAConstituencySuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      setEditingConstituency(null);
      dispatch(resetConstituencyState());
      dispatch(getAllConstituencies());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
    }
  }, [updatedConstituency, updateAConstituencySuccess, dispatch]);

  const dataSource =
    constituencies && Array.isArray(constituencies)
      ? constituencies.map((constituencies, index) => ({
          key: index + 1,
          constituencyName: constituencies.constituencyName,
          constituencyShortDesc: constituencies.constituencyShortDesc,
          constituencyCountryCode: constituencies.country.countryName,
          constituencyCountyCode: constituencies.county.countyName,
          constituencyStatus: constituencies.constituencyStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8">
                <button
                  type="button"
                  onClick={() => showEditModal(constituencies)}
                >
                  <MdOutlineEdit className="text-blue-600  font-medium text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedConstituencyCode(
                      constituencies.constituencyCode
                    );
                    showDeleteModal();
                  }}
                >
                  <RiDeleteBinLine className="text-red-600  font-medium text-xl" />
                </button>
              </div>
            </>
          ),
        }))
      : [];

  const deleteConstituency = async () => {
    if (selectedConstituencyCode) {
      await dispatch(deleteAConstituency(selectedConstituencyCode));
    }
  };

  useEffect(() => {
    if (deleteAConstituencySuccess) {
      setIsDeleteModalOpen(false);
      setSelectedConstituencyCode(null);
      dispatch(resetConstituencyState());
      dispatch(getAllConstituencies());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
    }
  }, [deleteAConstituencySuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Constituencies</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal} className="text-sm font-semibold px-4 h-10 text-white font-sans"> + New Constituency </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">
              {editingConstituency ? "Edit constituency" : "Add a constituency"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => { handleCancel(); setIsEditModalOpen(false); setEditingConstituency(null);}}
        width={400}
        className="font-sans"
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center flex-col gap-3  mt-4">
              <div className="flex justify-start lg:gap-8">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="constituencyName"
                      className="text-sm font-semibold"
                    >
                      Name
                    </label>
                    <Input
                      type="text"
                      id="constituencyName"
                      name="constituencyName"
                      placeholder="e.g. Embakasi"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "constituencyName",
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
                      value={formik.values.constituencyName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.constituencyName &&
                        formik.errors.constituencyName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.constituencyName &&
                          formik.errors.constituencyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="constituencyShortDesc"
                      className="text-sm font-semibold"
                    >
                      Short Description
                    </label>
                    <Input
                      placeholder="e.g. Embakasi"
                      type="text"
                      name="constituencyShortDesc"
                      id="constituencyShortDesc"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "constituencyShortDesc",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.constituencyShortDesc}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.constituencyShortDesc &&
                        formik.errors.constituencyShortDesc
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.constituencyShortDesc &&
                          formik.errors.constituencyShortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="constituencyCountryCode"
                      className="text-sm font-semibold"
                    >
                      Country
                    </label>
                    <Select
                      placeholder="Select Constituency Country."
                      type="text"
                      name="constituencyCountryCode"
                      id="constituencyCountryCode"
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
                        formik.setFieldValue("constituencyCountryCode", value)
                      }
                      value={formik.values.constituencyCountryCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.constituencyCountryCode &&
                        formik.errors.constituencyCountryCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.constituencyCountryCode &&
                          formik.errors.constituencyCountryCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="constituencyCountyCode"
                      className="text-sm font-semibold"
                    >
                      County
                    </label>
                    <Select
                      placeholder="Select Constituency County."
                      type="text"
                      name="constituencyCountyCode"
                      id="constituencyCountyCode"
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
                        formik.setFieldValue("constituencyCountyCode", value)
                      }
                      value={formik.values.constituencyCountyCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.constituencyCountyCode &&
                        formik.errors.constituencyCountyCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.constituencyCountyCode &&
                          formik.errors.constituencyCountyCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="constituencyStatus" className="text-sm font-semibold"> Status </label>
                    <Select
                      placeholder="Select Constituency Status."
                      type="text"
                      name="constituencyStatus"
                      id="constituencyStatus"
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
                        formik.setFieldValue("constituencyStatus", value)
                      }
                      value={formik.values.constituencyStatus}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.constituencyStatus &&
                        formik.errors.constituencyStatus
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.constituencyStatus &&
                          formik.errors.constituencyStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between  mt-4 ">
                    <Button htmlType="button" onClick={() => { handleCancel(); setIsEditModalOpen(false); setEditingConstituency(null); }} className="w-28 text-sm font-semibold h-10 font-sans"> Cancel </Button>
                    <Button type="primary" loading={ addAConstituencyLoading || updateAConstituencyLoading } htmlType="submit" disabled={ addAConstituencyLoading || updateAConstituencyLoading } className="w-28 text-sm font-semibold h-10 text-white font-sans"> {editingConstituency ? "Update" : "Submit"} </Button>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table loading={getAllConstituenciesLoading} columns={columns} dataSource={dataSource} scroll={{ x: "max-content" }}/>
      </div>
    
      <Modal title="Confirm constituency deletion? "open={isDeleteModalOpen} footer={null} onCancel={handleDeleteModalCancel} >
        <p className="text-sm"> Are you sure you want to delete this constituency?</p>
        <div className="flex items-center justify-end  mt-6  gap-8">
            <Button htmlType="button" onClick={handleDeleteModalCancel} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
            <Button onClick={deleteConstituency} type="primary" loading={deleteAConstituencyLoading }  htmlType="submit" disabled={deleteAConstituencyLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans" > Delete </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Constituencies;
