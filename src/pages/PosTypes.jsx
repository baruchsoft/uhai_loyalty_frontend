import { Button, Input, Modal, Select, Spin, Table } from "antd";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {addAPosType,deleteAPosType,getAllPosTypes,getAPosType,resetPosTypeState,updateAPosType} from "../features/posTypes/posTypeSlice";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { RiDeleteBinLine } from "react-icons/ri";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "posTypeName",
  },
  {
    title: "Short Description",
    dataIndex: "posTypesShortDesc",
  },
  {
    title: "Description",
    dataIndex: "posTypeDescription",
  },
  {
    title: "status",
    dataIndex: "posTypesStatus",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const POS_TYPES_SCHEMA = Yup.object().shape({
  posTypeName: Yup.string().required("Please provide point of sale type name."),
  posTypesShortDesc: Yup.string().required("Please provide point of sale type short description."),
  posTypeDescription: Yup.string().required("Please provide point of sale type description."),
  posTypesStatus: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Please select a valid point of sale type status.").required("Please select point of sale type status."),
});

const PosTypes = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPosTypeCode, setSelectedPosTypeCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPosType, setEditingPosType] = useState(false);

  const getAllPosTypesLoading = useSelector(
    (state) => state?.posType?.loading?.getAllPosTypes
  );
  const posTypes = useSelector((state) => state?.posType?.posTypes);

  const addAPosTypeLoading = useSelector(
    (state) => state?.posType?.loading?.addAPosType
  );
  const updateAPosTypeLoading = useSelector(
    (state) => state?.posType?.loading?.updateAPosType
  );
  const deleteAPosTypeLoading = useSelector(
    (state) => state?.posType?.loading?.deleteAPosType
  );

  const addedPosType = useSelector((state) => state?.posType?.addedPosType);
  const updatedPosType = useSelector((state) => state?.posType?.updatedPosType);
  const addAPosTypeSuccess = useSelector(
    (state) => state?.posType?.success?.addAPosType
  );
  const updateAPosTypeSuccess = useSelector(
    (state) => state?.posType?.success?.updateAPosType
  );
  const deleteAPosTypeSuccess = useSelector(
    (state) => state?.posType?.success?.deleteAPosType
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

  const showEditModal = async (posType) => {
    setEditingPosType(posType);
    setIsEditModalOpen(true);
    await dispatch(getAPosType(posType?.posTypeCode));
  };

  const formik = useFormik({
    initialValues: {
      posTypeName: editingPosType?.posTypeName || "",
      posTypesShortDesc: editingPosType?.posTypesShortDesc || "",
      posTypeDescription: editingPosType?.posTypeDescription || "",
      posTypesStatus: editingPosType?.posTypesStatus || null,
    },
    enableReinitialize: true,
    validationSchema: POS_TYPES_SCHEMA,
    onSubmit: (values) => {
      if (editingPosType) {
        dispatch(
          updateAPosType({
            posTypeCode: editingPosType?.posTypeCode,
            posTypeData: values,
          })
        );
      } else {
        dispatch(addAPosType(values));
      }
    },
  });

  useEffect(() => {
    dispatch(getAllPosTypes());
  }, [dispatch]);

  useEffect(() => {
    if (addedPosType && addAPosTypeSuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetPosTypeState());
      dispatch(getAllPosTypes());
    }
  }, [addedPosType, addAPosTypeSuccess, dispatch]);

  useEffect(() => {
    if (updatedPosType && updateAPosTypeSuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetPosTypeState());
      dispatch(getAllPosTypes());
      setEditingPosType(null);
    }
  }, [updatedPosType, updateAPosTypeSuccess, dispatch]);

  const dataSource =
    posTypes && Array.isArray(posTypes)
      ? posTypes.map((posType, index) => ({
          key: index + 1,
          posTypeName: posType?.posTypeName,
          posTypesShortDesc: posType?.posTypesShortDesc,
          posTypeDescription: posType?.posTypeDescription,
          posTypesStatus: posType?.posTypesStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8 ">
                <button type="button" onClick={() => showEditModal(posType)}>
                  <MdOutlineEdit className="text-blue-600 font-medium text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPosTypeCode(posType?.posTypeCode);
                    showDeleteModal();
                  }}
                >
                  <RiDeleteBinLine className="text-red-600  font-medium  text-xl" />
                </button>
              </div>
            </>
          ),
        }))
      : [];

  const deletePosType = async () => {
    if (selectedPosTypeCode) {
      await dispatch(deleteAPosType(selectedPosTypeCode));
    }
  };

  useEffect(() => {
    if (deleteAPosTypeSuccess) {
      setIsDeleteModalOpen(false);
      setSelectedPosTypeCode(null);
      dispatch(resetPosTypeState());
      dispatch(getAllPosTypes());
    }
  }, [deleteAPosTypeSuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Point of Sale Types</h2>
        <div>
          <Button type="primary" htmlType="button" onClick={showModal}className="text-sm font-semibold px-4 h-10 text-white font-sans ">+ New POS Type</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
           <div>
             <h2 className="text-xl font-semibold">{editingPosType ? "Edit Point of Sale Type" : "Add a New point of Sale Type"}</h2>
           </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {handleCancel();setIsEditModalOpen(false);setEditingPosType(null);}}
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
                      htmlFor="posTypeName"
                      className="text-sm font-semibold"
                    >
                      Name
                    </label>
                    <Input
                      type="text"
                      id="posTypeName"
                      name="posTypeName"
                      placeholder="e.g. Canteen"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "posTypeName",
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
                      value={formik.values.posTypeName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.posTypeName && formik.errors.posTypeName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posTypeName &&
                          formik.errors.posTypeName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="posTypesShortDesc"
                      className="text-sm font-semibold"
                    >
                      Short Description
                    </label>
                    <Input
                      placeholder="e.g. Canteen"
                      type="text"
                      name="posTypesShortDesc"
                      id="posTypesShortDesc"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "posTypesShortDesc",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.posTypesShortDesc}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.posTypesShortDesc &&
                        formik.errors.posTypesShortDesc
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posTypesShortDesc &&
                          formik.errors.posTypesShortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="posTypeDescription"
                      className="text-sm font-semibold"
                    >
                      Description
                    </label>
                    <Input
                      placeholder="e.g. Canteen."
                      type="text"
                      name="posTypeDescription"
                      id="posTypeDescription"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "posTypeDescription",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.posTypeDescription}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.posTypeDescription &&
                        formik.errors.posTypeDescription
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posTypeDescription &&
                          formik.errors.posTypeDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="posTypesStatus"
                      className="text-sm font-semibold"
                    >
                      Status
                    </label>
                    <Select
                      placeholder="Select point of sale type status"
                      type="text"
                      name="posTypesStatus"
                      id="posTypesStatus"
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
                        formik.setFieldValue("posTypesStatus", value)
                      }
                      value={formik.values.posTypesStatus}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.posTypesStatus &&
                        formik.errors.posTypesStatus
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.posTypesStatus &&
                          formik.errors.posTypesStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between  mt-4 ">
                      <Button onClick={() => {handleCancel();setIsEditModalOpen(false);setEditingPosType(null);}} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
                      <Button type="primary" loading={addAPosTypeLoading || updateAPosTypeLoading} htmlType="submit" disabled={addAPosTypeLoading || updateAPosTypeLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans">{editingPosType ? "Update" : "Submit"}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table loading={getAllPosTypesLoading} columns={columns}  dataSource={dataSource} scroll={{ x: "max-content" }}/>
      </div>
    
      {/* delete pos type modal */}
      <Modal title="Confirm pos type deletion?" open={isDeleteModalOpen} footer={null} onCancel={handleDeleteModalCancel}>
        <div>
          <p className="text-sm">
            Are you sure you want to delete this pos type?{" "}
          </p>
        </div>

        <div className="flex items-center justify-end  mt-6  gap-8">
            <Button htmlType="button" onClick={handleDeleteModalCancel} className="w-28 text-sm font-semibold h-10 font-sans">Cancel</Button>
            <Button loading={deleteAPosTypeLoading} onClick={deletePosType} type="primary" htmlType="button" disabled={deleteAPosTypeLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans">Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default PosTypes;
