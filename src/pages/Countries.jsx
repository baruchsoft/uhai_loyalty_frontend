import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Input, Select, Spin } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {addACountry,deleteACountry,getACountry,getAllCountries,resetCountryState,updateACountry,} from "../features/country/countrySlice";
import { Loading3QuartersOutlined } from "@ant-design/icons";
const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "countryName",
  },

  {
    title: "Short Description",
    dataIndex: "countryShortDesc",
  },

  {
    title: "Code",
    dataIndex: "countryCountryCode",
  },

  {
    title: "Currency Code",
    dataIndex: "countryCurrencyCode",
  },

  {
    title: "Status",
    dataIndex: "countryStatus",
  },

  {
    title: "Action",
    dataIndex: "action",
  },
];

const countryCodeRegex = /^[A-Z]{2}$/;
const countryCurrencyCodeRegex = /^[A-Z]{3}$/;

const ADD_COUNTRY_SCHEMA = Yup.object().shape({
  countryName: Yup.string().required("Please provide country name."),
  countryShortDesc: Yup.string().required(
    "Please provide country short decsription."
  ),
  countryCountryCode: Yup.string()
    .length(2, "Country code must be exactly 2 letters.")
    .matches(
      countryCodeRegex,
      "Country code must be exaclty 2 uppercase letters."
    )
    .required("Please provide country code."),
  countryCurrencyCode: Yup.string()
    .length(3, "Currency code must be exactly 3  letters.")
    .matches(
      countryCurrencyCodeRegex,
      "Currency code must be exaclty 3 uppercase letters."
    )
    .required("Please provide country's currency code."),
  countryStatus: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "Please select a valid country status.")
    .required("Please select country status."),
});

const Countries = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const addedCountry = useSelector((state) => state.country.addedCountry);
  const addACountrySuccess = useSelector(
    (state) => state?.country?.success?.addACountry
  );
  const addACountryLoading = useSelector(
    (state) => state?.country?.loading?.addACountry
  );
  const deleteACountryLoading = useSelector(
    (state) => state?.country?.loading?.deleteACountry
  );
  const countries = useSelector((state) => state?.country?.countries);

  console.log(countries,"=>Countries")
  const getAllCountriesLoading = useSelector(
    (state) => state?.country?.loading?.getAllCountries
  );
  const updateACountryLoading = useSelector(
    (state) => state?.country?.loading?.updateACountry
  );
  const updatedCountry = useSelector((state) => state?.country?.updatedCountry);
  const updateACountrySuccess = useSelector(
    (state) => state?.country?.success?.updateACountry
  );

  const deleteACountrySuccess = useSelector(
    (state) => state?.country?.success?.deleteACountry
  );

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

  const showEditModal = async (country) => {
    setEditingCountry(country);
    setIsEditModalOpen(true);
    await dispatch(getACountry(country.countryCode));
  };

  const formik = useFormik({
    initialValues: {
      countryName: editingCountry?.countryName || "",
      countryShortDesc: editingCountry?.countryShortDesc || "",
      countryCountryCode: editingCountry?.countryCountryCode || "",
      countryCurrencyCode: editingCountry?.countryCurrencyCode || "",
      countryStatus: editingCountry?.countryStatus || "INACTIVE",
    },
    enableReinitialize: true,
    validationSchema: ADD_COUNTRY_SCHEMA,
    onSubmit: (values) => {
      if (editingCountry) {
        dispatch(
          updateACountry({
            countryCode: editingCountry.countryCode,
            countryData: values,
          })
        );
      } else {
        dispatch(addACountry(values));
      }
    },
  });
  useEffect(() => {
    dispatch(getAllCountries());
  }, [dispatch]);

  useEffect(() => {
    if (addedCountry && addACountrySuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetCountryState());
      dispatch(getAllCountries());
    }
  }, [addedCountry, addACountrySuccess, dispatch]);

  useEffect(() => {
    if (updateACountrySuccess && updatedCountry) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetCountryState());
      dispatch(getAllCountries());
      setEditingCountry(null);
    }
  }, [updateACountrySuccess, updatedCountry, dispatch]);

  const dataSource =
    countries && Array.isArray(countries)
      ? countries.map((country, index) => ({
          key: index + 1,
          countryName: country.countryName,
          countryShortDesc: country.countryShortDesc,
          countryCountryCode: country.countryCountryCode,
          countryCurrencyCode: country.countryCurrencyCode,
          countryStatus: country.countryStatus,
          action: (
            <div className="flex flex-row items-center gap-8">
              <button type="button" onClick={() => showEditModal(country)}>
                <FaEdit className="text-blue-600 font-normal text-xl" />
              </button>

              <button type="button"
                onClick={() => {
                  setSelectedCountryCode(country.countryCode);
                  showDeleteModal();
                }}
              >
                <MdDelete className="text-red-600 font-normal text-xl" />
              </button>
            </div>
          ),
        }))
      : [];

  const deleteCountry = async () => {
    if (selectedCountryCode) {
      await dispatch(deleteACountry(selectedCountryCode));
    }
  };

  useEffect(() => {
    if (deleteACountrySuccess) {
      setIsDeleteModalOpen(false);
      setSelectedCountryCode(null);
      dispatch(resetCountryState());
      dispatch(getAllCountries());
    }
  }, [deleteACountrySuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Countries</h2>
          <Button type="primary" onClick={showModal} htmlType="button"className="text-sm font-semibold px-4 h-10 text-white font-sans "> + New Country</Button>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">
              {editingCountry ? "Edit country" : "Add a new country"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setIsEditModalOpen(false);
          setEditingCountry(null);
        }}
        className="font-sans"
        width={400}
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex items-center flex-col gap-3  mt-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="countryName" className="text-sm font-semibold">
                  Name
                </label>
                <Input
                  id="countryName"
                  name="countryName"
                  placeholder="e.g. Kenya"
                  type="text"
                  onBlur={(e) => {
                    formik.setFieldValue(
                      "countryName",
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
                  value={formik.values.countryName}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.countryName && formik.errors.countryName
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.countryName && formik.errors.countryName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="countryShortDesc"
                  className="text-sm font-semibold"
                >
                  Short Description
                </label>
                <Input
                  type="text"
                  name="countryShortDesc"
                  placeholder="e.g. Kenya"
                  id="countryShortDesc"
                  onBlur={(e) => {
                    formik.setFieldValue(
                      "countryShortDesc",
                      e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1).toLowerCase()
                    );
                    formik.handleBlur(e);
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.countryShortDesc}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.countryShortDesc &&
                    formik.errors.countryShortDesc
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.countryShortDesc &&
                      formik.errors.countryShortDesc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="countryCountryCode"
                  className="text-sm font-semibold"
                >
                  Code
                </label>
                <Input
                  showSearch
                  type="text"
                  name="countryCountryCode"
                  id="countryCountryCode"
                  placeholder="e.g. KE"
                  onBlur={(e) => {
                    formik.setFieldValue(
                      "countryCountryCode",
                      e.target.value.toUpperCase()
                    );
                    formik.handleBlur(e);
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.countryCountryCode}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.countryCountryCode &&
                    formik.errors.countryCountryCode
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.countryCountryCode &&
                      formik.errors.countryCountryCode}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="countryCurrencyCode"
                  className="text-sm font-semibold"
                >
                  Currency Code
                </label>
                <Input
                  type="text"
                  name="countryCurrencyCode"
                  id="countryCurrencyCode"
                  placeholder="e.g. KES"
                  onBlur={(e) => {
                    formik.setFieldValue(
                      "countryCurrencyCode",
                      e.target.value.toUpperCase()
                    );
                    formik.handleBlur(e);
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.countryCurrencyCode}
                  className={`w-80  h-11 border-1.5 ${
                    formik.touched.countryCurrencyCode &&
                    formik.errors.countryCurrencyCode
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.countryCurrencyCode &&
                      formik.errors.countryCurrencyCode}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="countryStatus"
                  className="text-sm font-semibold"
                >
                  Status
                </label>
                <Select
                  type="text"
                  name="countryStatus"
                  id="countryStatus"
                  placeholder="Country Status"
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
                    formik.setFieldValue("countryStatus", value)
                  }
                  value={formik.values.countryStatus}
                  className={`w-80  h-11 border-1.5 rounded-lg ${
                    formik.touched.countryStatus && formik.errors.countryStatus
                      ? "border-red-600"
                      : ""
                  }`}
                />
                <div>
                  <p className="text-xs text-red-600">
                    {formik.touched.countryStatus &&
                      formik.errors.countryStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center  gap-24 mt-4 ">
                <Button
                  htmlType="button"
                  onClick={() => {
                    handleCancel();
                    setIsEditModalOpen(false);
                    setEditingCountry(null);
                  }}
                  className="w-28 text-sm font-semibold h-10 font-sans"
                >
                  Cancel
                </Button>

                {addACountryLoading || updateACountryLoading ? (
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
                    disabled={addACountryLoading || updateACountryLoading}
                    className="w-28 text-sm font-semibold h-10 text-white font-sans"
                  >
                    {editingCountry ? "Update" : "Submit"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <div>
        {getAllCountriesLoading ? (
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

          {deleteACountryLoading ? (
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
              onClick={deleteCountry}
              type="primary"
              htmlType="button"
              disabled={deleteACountryLoading}
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

export default Countries;
