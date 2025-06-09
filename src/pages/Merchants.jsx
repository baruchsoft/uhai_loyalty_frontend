/* eslint-disable no-unused-vars */
import { Button, Input, message, Modal, Select, Spin, Table } from "antd";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  deleteAPosType,
  getAPosType,
  resetPosTypeState,
  updateAPosType,
} from "../features/posTypes/posTypeSlice";
import { addMechant, getAllMechants, updateMechant } from "../features/loans/merhcantSlice";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import MerchantRegistration from "./MerchantRegistration";
import { RiDeleteBinLine } from "react-icons/ri";
import MerchantInfoForm from "./merchants/MerchantInfoForm";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "#",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "merchantName",
  },
  {
    title: "Email",
    dataIndex: "emailAddress",
  },
  {
    title: "PhoneNumber",
    dataIndex: "mobileNumber",
  },
  {
    title: "Address",
    dataIndex: "physicalAddress",
  },
  {
    title: "Type",
    dataIndex: "merchantType",
  },
  {
    title: "status",
    dataIndex: "status",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const POS_TYPES_SCHEMA = Yup.object().shape({
  merchantName: Yup.string().required("Please provide merchant name."),
  type: Yup.string().required("Please provide merchant short description."),
  emailAddress: Yup.string().required("Please provide email."),
  mobileNumber: Yup.string().required("Please provide mobileNumber."),
  physicalAddress: Yup.string().required("Please provide physicalAddress."),

  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "Please select a valid merchant status.")
    .required("Please select merchant status."),
});

const Merchants = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPosTypeCode, setSelectedPosTypeCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState(true);

  const getAllMechantsLoading = useSelector(
    (state) => state?.merchant?.loading?.getAllMerchants
  );
  const posTypes = useSelector((state) => state?.merchant?.merchants);

  console.log("posTypes", posTypes);

  const addAPosTypeLoading = useSelector(
    (state) => state?.merchant?.loading?.addMerchant
  );
  const updateAPosTypeLoading = useSelector(
    (state) => state?.merchant?.loading?.updateAPosType
  );
  const deleteAPosTypeLoading = useSelector(
    (state) => state?.merchant?.loading?.deleteAPosType
  );

  const addedPosType = useSelector((state) => state?.merchant?.addMerchant);
  const updatedPosType = useSelector(
    (state) => state?.merchant?.updatedPosType
  );
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
  }, []);

  const showDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteModalCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleEdit = async (emailAddress) => {
    const merchant = posTypes.find((m) => m.emailAddress === emailAddress);
    console.log("merchant", merchant);

    if (merchant) {
      setSelectedPosTypeCode(merchant);
      setIsModalOpen(true);
    } else {
      message.error("Merchant not found");
    }
  };

  console.log(selectedPosTypeCode, "selectedPosTypeCode");

  const formik = useFormik({
    initialValues: {
      merchantName: editingMerchant?.merchantName || "",
      merchantType: editingMerchant?.merchantType || "",
      emailAddress: editingMerchant?.emailAddress || "",
      mobilNumber: editingMerchant?.mobilNumber || "",
      physicalAddress: editingMerchant?.physicalAddress || "",
      status: editingMerchant?.status || "INACTIVE",
    },
    enableReinitialize: true,
    validationSchema: POS_TYPES_SCHEMA,
    onSubmit: (values) => {
      if (editingMerchant) {
        dispatch(updateMechant(values));
      } else {
        dispatch(addMechant(values));
      }
    },
  });

  useEffect(() => {
    dispatch(getAllMechants());
  }, [dispatch]);

  useEffect(() => {
    if (addedPosType && addAPosTypeSuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetPosTypeState());
      dispatch(getAllMechants());
    }
  }, [addedPosType, addAPosTypeSuccess, dispatch]);

  useEffect(() => {
    if (updatedPosType && updateAPosTypeSuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetPosTypeState());
      dispatch(getAllMechants());
      setEditingMerchant(null);
    }
  }, [updatedPosType, updateAPosTypeSuccess, dispatch]);

  const dataSource =
    posTypes && Array.isArray(posTypes)
      ? posTypes.map((posType, index) => ({
          key: index + 1,
          id: posType?.id,
          merchantName: posType?.merchantName,
          merchantType: posType?.merchantType,
          emailAddress: posType?.emailAddress,
          mobileNumber: posType?.mobileNumber,
          physicalAddress: posType?.physicalAddress,
          status: posType?.status,
          action: (
            <>
              <div className="flex flex-row items-center gap-8 ">
                <button
                  type="button"
                  onClick={() => handleEdit(posType?.emailAddress)}
                >
                  <MdOutlineEdit className="text-blue-600 font-medium text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleEdit(posType?.emailAddress);
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
      dispatch(getAllMechants());
    }
  }, [deleteAPosTypeSuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Merchants</h2>
        <div>
          <Link to="/admin/loans/merchants/create-merchant">
            <Button
              type="primary"
              className="text-sm font-semibold px-4 h-10 text-white font-sans"
            >
              + Merchant
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <Input
          style={{ width: "400px", height: "40px" }}
          placeholder="Search..."
        />
      </div>
      <div>
        {getAllMechantsLoading ? (
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
        title={editingMerchant ? "Edit Merchant" : "Add Merchant"}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingMerchant(null);
        }}
        destroyOnClose
      >
        <MerchantInfoForm initialData={selectedPosTypeCode} mode="edit" />
      </Modal>

      <Modal
        title="Confirm merchant deletion?"
        open={isDeleteModalOpen}
        footer={null}
        onCancel={handleDeleteModalCancel}
      >
        <div>
          <p className="text-sm">
            Are you sure you want to delete this merchant?{" "}
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

          {deleteAPosTypeLoading ? (
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
              onClick={deletePosType}
              type="primary"
              htmlType="button"
              disabled={deleteAPosTypeLoading}
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

export default Merchants;
