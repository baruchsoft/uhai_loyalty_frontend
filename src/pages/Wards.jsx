import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Select, Spin, Table } from "antd";
import * as Yup from "yup";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {addAWard,deleteAWard,getAllWards,getAWard,resetWardState,updateAWard} from "../features/ward/wardSlice";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { getAllCountries } from "../features/country/countrySlice";
import { getAllCounties } from "../features/county/countySlice";
import { getAllConstituencies } from "../features/constituency/constituencySlice";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "wardName",
  },
  {
    title: "Shot Description",
    dataIndex: "wardShortDesc",
  },
  {
    title: "Country",
    dataIndex: "wardCountryCode",
  },
  {
    title: "County",
    dataIndex: "wardCountyCode",
  },
  {
    title: "Constituency",
    dataIndex: "wardConstituencyCode",
  },
  {
    title: "Status",
    dataIndex: "wardStatus",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const WARD_SCHEMA = Yup.object().shape({
  wardName: Yup.string().required("Please provide ward name."),
  wardShortDesc: Yup.string().required(
    "Please provide ward short description."
  ),
  wardCountryCode: Yup.number()
    .typeError("Country code must be a number.")
    .required("Please select ward country."),
  wardCountyCode: Yup.number()
    .typeError("County code must be a number.")
    .required("Please select ward County."),
  wardConstituencyCode: Yup.number()
    .typeError("Constituency code must be a number.")
    .required("Please select ward constituency."),
  wardStatus: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "Please select a valid ward status.")
    .required("Please select ward status."),
});

const Wards = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWardCode, setSelectedWardCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const addAWardSuccess = useSelector(
    (state) => state?.ward?.success?.addAWard
  );
  const addedWard = useSelector((state) => state?.ward?.addedWard);
  const wards = useSelector((state) => state?.ward?.wards);
  const addAWardLoading = useSelector(
    (state) => state?.ward?.loading?.addAWard
  );
  const deleteWardLoading = useSelector(
    (state) => state?.ward?.loading?.deleteAWard
  );
  const getAllWardsLoading = useSelector(
    (state) => state?.ward?.loading?.getAllWards
  );
  const updatedWard = useSelector((state) => state?.ward?.updatedWard);
  const updateAWardSuccess = useSelector(
    (state) => state?.ward?.success?.updateAWard
  );
  const updateAWardLoading = useSelector(
    (state) => state?.ward?.loading?.updateAWard
  );
  const countries = useSelector((state) => state?.country?.countries);
  const counties = useSelector((state) => state?.county?.counties);
  const constituencies = useSelector(
    (state) => state?.constituency?.constituencies
  );

  const deleteAWardSuccess = useSelector(
    (state) => state?.ward?.success?.deleteAWard
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

  const showEditModal = async (ward) => {
    setEditingWard(ward);
    setIsEditModalOpen(true);
    await dispatch(getAWard(ward?.wardCode));
  };

  const formik = useFormik({
    initialValues: {
      wardName: editingWard?.wardName || "",
      wardShortDesc: editingWard?.wardShortDesc || "",
      wardCountryCode: editingWard?.country?.countryCode || null,
      wardCountyCode: editingWard?.county?.countyCode || null,
      wardConstituencyCode: editingWard?.constituency?.constituencyCode || null,
      wardStatus: editingWard?.wardStatus || "INACTIVE",
    },
    enableReinitialize: true,
    validationSchema: WARD_SCHEMA,
    onSubmit: (values) => {
      if (editingWard) {
        dispatch(
          updateAWard({
            wardCode: editingWard?.wardCode,
            wardData: values,
          })
        );
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
      } else {
        dispatch(addAWard(values));
        dispatch(getAllCountries());
        dispatch(getAllCounties());
        dispatch(getAllConstituencies());
      }
    },
  });

  useEffect(() => {
    dispatch(getAllWards());
    dispatch(getAllCountries());
    dispatch(getAllCounties());
    dispatch(getAllConstituencies());
  }, [dispatch]);

  useEffect(() => {
    if (addedWard && addAWardSuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetWardState());
      dispatch(getAllWards());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
    }
  }, [addedWard, addAWardSuccess, dispatch]);

  useEffect(() => {
    if (updatedWard && updateAWardSuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetWardState());
      dispatch(getAllWards());
      setEditingWard(null);
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
    }
  }, [updatedWard, updateAWardSuccess, dispatch]);

  const dataSource =
    wards && Array.isArray(wards)
      ? wards.map((ward, index) => ({
          key: index + 1,
          wardName: ward?.wardName,
          wardShortDesc: ward?.wardShortDesc,
          wardCountryCode: ward?.country.countryName,
          wardCountyCode: ward?.county.countyName,
          wardConstituencyCode: ward?.constituency.constituencyName,
          wardStatus: ward?.wardStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8 ">
                <button type="button" onClick={() => showEditModal(ward)}>
                  <FaEdit className="text-blue-600 font-medium text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWardCode(ward?.wardCode);
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

  const deleteWard = async () => {
    if (selectedWardCode) {
      await dispatch(deleteAWard(selectedWardCode));
    }
  };

  useEffect(() => {
    if (deleteAWardSuccess) {
      setIsDeleteModalOpen(false);
      setSelectedWardCode(null);
      dispatch(resetWardState());
      dispatch(getAllWards());
      dispatch(getAllCountries());
      dispatch(getAllCounties());
      dispatch(getAllConstituencies());
    }
  }, [deleteAWardSuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Wards</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal} className="text-sm font-semibold px-4 h-10 text-white font-sans ">
            + Ward
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
              {editingWard ? "Edit ward" : "Add a ward"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setIsEditModalOpen(false);
          setEditingWard(null);
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
                    <label htmlFor="wardName" className="text-sm font-semibold">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="wardName"
                      name="wardName"
                      placeholder="e.g. Imara Daima"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "wardName",
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
                      value={formik.values.wardName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.wardName && formik.errors.wardName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.wardName && formik.errors.wardName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="wardShortDesc"
                      className="text-sm font-semibold"
                    >
                      Short Description
                    </label>
                    <Input
                      placeholder="e.g. Imara Daima"
                      type="text"
                      name="wardShortDesc"
                      id="wardShortDesc"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "wardShortDesc",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.wardShortDesc}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.wardShortDesc &&
                        formik.errors.wardShortDesc
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.wardShortDesc &&
                          formik.errors.wardShortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="wardCountryCode"
                      className="text-sm font-semibold"
                    >
                      Country
                    </label>
                    <Select
                      placeholder="Select Ward Country."
                      type="text"
                      name="wardCountryCode"
                      id="wardCountryCode"
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
                        formik.setFieldValue("wardCountryCode", value)
                      }
                      value={formik.values.wardCountryCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.wardCountryCode &&
                        formik.errors.wardCountryCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.wardCountryCode &&
                          formik.errors.wardCountryCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="wardCountyCode"
                      className="text-sm font-semibold"
                    >
                      County
                    </label>
                    <Select
                      placeholder="Select ward County."
                      type="text"
                      name="wardCountyCode"
                      id="wardCountyCode"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        Array.isArray(counties)
                          ? counties &&
                            counties.map((county) => ({
                              value: county?.countyCode,
                              label: county?.countyName,
                            }))
                          : []
                      }
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("wardCountyCode", value)
                      }
                      value={formik.values.wardCountyCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.wardCountyCode &&
                        formik.errors.wardCountyCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.wardCountyCode &&
                          formik.errors.wardCountyCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="wardConstituencyCode"
                      className="text-sm font-semibold"
                    >
                      Constituency
                    </label>
                    <Select
                      placeholder="Select Ward Constituency."
                      type="text"
                      name="wardConstituencyCode"
                      id="wardConstituencyCode"
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
                        formik.setFieldValue("wardConstituencyCode", value)
                      }
                      value={formik.values.wardConstituencyCode}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.wardConstituencyCode &&
                        formik.errors.wardConstituencyCode
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.wardConstituencyCode &&
                          formik.errors.wardConstituencyCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="status" className="text-sm font-semibold">
                      Status
                    </label>
                    <Select
                      placeholder="Select Ward Status."
                      type="text"
                      name="wardStatus"
                      id="wardStatus"
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
                        formik.setFieldValue("wardStatus", value)
                      }
                      value={formik.values.wardStatus}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.wardStatus && formik.errors.wardStatus
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.wardStatus && formik.errors.wardStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between  mt-4 ">
                    <Button
                      onClick={() => {
                        handleCancel();
                        setIsEditModalOpen(false);
                        setEditingWard(null);
                      }}
                      className="w-28 text-sm font-semibold h-10 font-sans"
                    >
                      Cancel
                    </Button>

                    {addAWardLoading || updateAWardLoading ? (
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
                        disabled={addAWardLoading || updateAWardLoading}
                        className="w-28 text-sm font-semibold h-10 text-white font-sans"
                      >
                        {editingWard ? "Update" : "Submit"}
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
        {getAllWardsLoading ? (
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

      {/* delete ward modal */}
      <Modal
        title="Confirm ward deletion?"
        open={isDeleteModalOpen}
        footer={null}
        onCancel={handleDeleteModalCancel}
      >
        <div>
          <p className="text-sm">Are you sure you want to delete this ward? </p>
        </div>

        <div className="flex items-center justify-end  mt-6  gap-8">
          <Button
            htmlType="button"
            onClick={handleDeleteModalCancel}
            className="w-28 text-sm font-semibold h-10 font-sans"
          >
            Cancel
          </Button>

          {deleteWardLoading ? (
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
              onClick={deleteWard}
              type="primary"
              htmlType="button"
              disabled={deleteWardLoading}
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

export default Wards;
