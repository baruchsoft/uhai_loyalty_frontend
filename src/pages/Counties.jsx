import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Spin, Input, Select } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {addACounty,deleteACounty,getACounty,getAllCounties,resetCountyState,updateACounty} from "../features/county/countySlice";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { getAllCountries } from "../features/country/countrySlice";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "countyName",
  },
  {
    title: "Short Description",
    dataIndex: "countyShortDesc",
  },

  {
    title: "Country",
    dataIndex: "countyCountryCode",
  },
  {
    title: "Status",
    dataIndex: "countyStatus",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const COUNTY_SCHEMA = Yup.object().shape({
  countyName: Yup.string().required("Please provide county name."),
  countyShortDesc: Yup.string().required(
    "Please provide county short description."
  ),
  countyCountryCode: Yup.number()
    .typeError("Country code must be a number.")
    .required("Please select county country."),
  countyStatus: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "Please select a valid county status.")
    .required("Please select county status."),
});

const Counties = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCountyCode, setSelectedCountyCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCounty, setEditingCounty] = useState(null);

  const addedCounty = useSelector((state) => state?.county?.addedCounty);
  const addACountySuccess = useSelector(
    (state) => state?.county?.success?.addACounty
  );
  const updateACountyLoading = useSelector(
    (state) => state?.county?.loading?.updateACounty
  );
  const updatedCounty = useSelector((state) => state?.county?.updatedCounty);
  const updateACountySuccess = useSelector(
    (state) => state?.county?.success?.updateACounty
  );
  const counties = useSelector((state) => state?.county?.counties);
  const getAllCountiesLoading = useSelector(
    (state) => state?.county?.loading?.getAllCounties
  );
  const deleteACountyLoading = useSelector(
    (state) => state?.county?.loading?.deleteACounty
  );
  const addACountyLoading = useSelector(
    (state) => state?.county?.loading?.addACounty
  );
  const countries = useSelector((state) => state?.country?.countries);
  const deleteACountySuccess = useSelector(
    (state) => state?.county?.success?.deleteACounty
  );

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

  const showEditModal = async (county) => {
    setEditingCounty(county);
    setIsEditModalOpen(true);
    await dispatch(getACounty(county?.countyCode));
  };

  const formik = useFormik({
    initialValues: {
      countyName: editingCounty?.countyName || "",
      countyShortDesc: editingCounty?.countyShortDesc || "",
      countyCountryCode: editingCounty?.country?.countryCode || null,
      countyStatus: editingCounty?.countyStatus || "INACTIVE",
    },
    enableReinitialize: true,
    validationSchema: COUNTY_SCHEMA,
    onSubmit: (values) => {
      if (editingCounty) {
        dispatch(
          updateACounty({
            countyCode: editingCounty?.countyCode,
            countyData: values,
          })
        );
        dispatch(getAllCountries());
      } else {
        dispatch(addACounty(values));
        dispatch(getAllCountries());
      }
    },
  });

  useEffect(() => {
    dispatch(getAllCounties());
    dispatch(getAllCountries());
  }, [dispatch]);

  useEffect(() => {
    if (addedCounty && addACountySuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetCountyState());
      dispatch(getAllCounties());
      dispatch(getAllCountries());
    }
  }, [addedCounty, addACountySuccess, dispatch]);

  useEffect(() => {
    if (updateACountySuccess && updatedCounty) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetCountyState());
      dispatch(getAllCounties());
      dispatch(getAllCountries());
      setEditingCounty(null);
    }
  }, [updateACountySuccess, updatedCounty, dispatch]);

  const dataSource =
    counties && Array.isArray(counties)
      ? counties.map((county, index) => ({
          key: index + 1,
          countyName: county?.countyName,
          countyShortDesc: county?.countyShortDesc,
          countyCountryCode: county?.country?.countryName,
          countyStatus: county?.countyStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8">
                <button type="button" onClick={() => showEditModal(county)}>
                  <FaEdit className="text-blue-600  font-medium text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCountyCode(county?.countyCode);
                    showDeleteModal();
                  }}
                >
                  <MdDelete className="text-red-600  font-medium text-xl" />
                </button>
              </div>
            </>
          ),
        }))
      : [];

  const deleteCounty = async () => {
    if (selectedCountyCode) {
      await dispatch(deleteACounty(selectedCountyCode));
    }
  };

  useEffect(() => {
    if (deleteACountySuccess) {
      setIsDeleteModalOpen(false);
      setSelectedCountyCode(null);
      dispatch(getAllCounties());
      dispatch(getAllCountries());
    }
  }, [deleteACountySuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Counties</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal} className="text-sm font-semibold px-4 h-10 text-white font-sans ">
            + County
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">
              {editingCounty ? "Edit a county" : "Add a county"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setIsEditModalOpen(false);
          setEditingCounty(null);
        }}
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
                      htmlFor="countyName"
                      className="text-sm font-semibold"
                    >
                      Name
                    </label>
                    <Input
                      type="text"
                      id="countyName"
                      name="countyName"
                      placeholder="e.g. Nairobi"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "countyName",
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
                      value={formik.values.countyName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.countyName && formik.errors.countyName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.countyName && formik.errors.countyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="countyShortDesc"
                      className="text-sm font-semibold"
                    >
                      Short Description
                    </label>
                    <Input
                      placeholder="e.g. Nairobi"
                      type="text"
                      name="countyShortDesc"
                      id="countyShortDesc"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "countyShortDesc",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.countyShortDesc}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.countyShortDesc &&
                        formik.errors.countyShortDesc
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.countyShortDesc &&
                          formik.errors.countyShortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="countyCountryCode"
                      className="text-sm font-semibold"
                    >
                      Country
                    </label>
                    <Select
                      placeholder="e.g. Kenya"
                      type="text"
                      name="countyCountryCode"
                      id="countyCountryCode"
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
                        formik.setFieldValue("countyCountryCode", value)
                      }
                      value={formik.values.countyCountryCode}
                      className={`w-80 h-11 border-1.5 rounded-lg ${
                        formik.touched.countyCountryCode &&
                        formik.errors.countyCountryCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.countyCountryCode &&
                          formik.errors.countyCountryCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="countyStatus"
                      className="text-sm font-semibold"
                    >
                      Status
                    </label>
                    <Select
                      placeholder="Select county Status"
                      type="text"
                      name="countyStatus"
                      id="countyStatus"
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
                        formik.setFieldValue("countyStatus", value)
                      }
                      value={formik.values.countyStatus}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.countyStatus &&
                        formik.errors.countyStatus
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.countyStatus &&
                          formik.errors.countyStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between  mt-4 ">
                    <Button
                      htmlType="button"
                      onClick={() => {
                        handleCancel();
                        setIsEditModalOpen(false);
                        setEditingCounty(null);
                      }}
                      className="w-28 text-sm font-semibold h-10 font-sans"
                    >
                      Cancel
                    </Button>

                    {addACountyLoading || updateACountyLoading ? (
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
                        disabled={addACountyLoading || updateACountyLoading}
                        className="w-28 text-sm font-semibold h-10 text-white font-sans"
                      >
                        {editingCounty ? "Update" : "Submit"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <div>
        {getAllCountiesLoading ? (
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
        title="Confirm county deletion."
        open={isDeleteModalOpen}
        footer={null}
        onCancel={handleDeleteModalCancel}
      >
        <div>
          <p className="text-sm">
            Are you sure you want to delete this county?
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

          {deleteACountyLoading ? (
            <Button
              type="primary"
              htmlType="submit"
              loading
              className="w-28 text-sm font-semibold h-10 text-white font-sans"
            >
              Please wait...
            </Button>
          ) : (
            <Button
              onClick={deleteCounty}
              type="primary"
              htmlType="submit"
              disabled={deleteACountyLoading}
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

export default Counties;
