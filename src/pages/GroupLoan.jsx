/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Button, Input, Modal, Spin, Table, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import {
  getAllLoans,
  addALoan,
  updateALoan,
  deleteALoan,
  resetLoanState,
} from "../features/loans/loanSlice";
import { getAllPoses } from "../features/pos/posSlice";
import { getAllMechants } from "../features/loans/merhcantSlice";
import { getAllCustomers } from "../features/customers/customerSlice";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  addGroupLoan,
  getGroupLoans,
  updateGroupLoan,
} from "../features/loans/grouploanSlice";

const LOAN_SCHEMA = Yup.object().shape({
  merchantId: Yup.number().required("Merchant ID is required."),
  loanProductId: Yup.number().required("Customer ID is required."),
  groupId: Yup.number().required("POS Code is required."),
  totalAmount: Yup.number().required("totalAmount is required."),
  status: Yup.string().required("Status is required."),
});

const GroupLoan = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  const loans = useSelector((state) => state?.grouploan?.grouploans);
  const poses = useSelector((state) => state?.pos?.poses);
  const customers = useSelector((state) => state?.customer?.customers);

  const merchants = useSelector((state) => state?.merchant?.merchants);
  const loanAdded = useSelector((state) => state?.loan?.success?.addALoan);
  const loanUpdated = useSelector((state) => state?.loan?.success?.updateALoan);
  const loanDeleted = useSelector((state) => state?.loan?.success?.deleteALoan);

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditingLoan(null);
  };

  const formik = useFormik({
    initialValues: {
      merchantId: editingLoan?.merchantId || "",
      loanProductId: editingLoan?.loanProductId || "",
      groupId: editingLoan?.groupId || "",
      totalAmount: editingLoan?.totalAmount || "",
      status: editingLoan?.status || "PENDING",
      disbursedAt: editingLoan?.disbursedAt || new Date(),
    },
    enableReinitialize: true,
    validationSchema: LOAN_SCHEMA,
    onSubmit: (values) => {
      if (editingLoan) {
        dispatch(
          updateGroupLoan({ groupId: editingLoan.groupId, data: values })
        );
        dispatch(getAllPoses());
        dispatch(getGroupLoans());
        dispatch(getAllMechants());
        dispatch(getAllCustomers());
      } else {
        dispatch(addGroupLoan(values));
        dispatch(getAllPoses());
        dispatch(getGroupLoans());
        dispatch(getAllMechants());
        dispatch(getAllCustomers());
      }
    },
  });

  useEffect(() => {
    dispatch(getGroupLoans());
    dispatch(getAllPoses());
    dispatch(getAllMechants());
    dispatch(getAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (loanAdded || loanUpdated) {
      formik.resetForm();
      closeModal();
      dispatch(resetLoanState());
      dispatch(getGroupLoans());
      dispatch(getAllPoses());
      dispatch(getAllMechants());
      dispatch(getAllCustomers());
    }
  }, [loanAdded, loanUpdated, dispatch, formik]);

  useEffect(() => {
    if (loanDeleted) {
      dispatch(resetLoanState());
      dispatch(getGroupLoans());
      dispatch(getAllPoses());
      dispatch(getAllMechants());
      dispatch(getAllCustomers());
    }
  }, [loanDeleted, dispatch]);

  const columns = [
    { title: "#", dataIndex: "key" },
    { title: "Merchant ID", dataIndex: "merchantId" },
    { title: "Loan Product", dataIndex: "loanProductId" },
    { title: "Group ", dataIndex: "groupId" },
    { title: "totalAmount", dataIndex: "totalAmount" },
    { title: "Disbursedment Date", dataIndex: "disbursedAt" },
    { title: "Status", dataIndex: "status" },

    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const dataSource = Array.isArray(loans)
    ? loans.map((loan, index) => ({
        key: index + 1,
        merchantId: loan.merchantId,
        loanProductId: loan.loanProductId,
        groupId: loan.groupId,
        totalAmount: loan.totalAmount,
        disbursedAt: loan.disbursedAt,
        status: loan.status,
        action: (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditingLoan(loan);
                setIsEditModalOpen(true);
              }}
            >
              <MdOutlineEdit className="text-blue-500" />
            </button>
            <button
              onClick={() => {
                setSelectedLoanId(loan.groupId);
                dispatch(deleteALoan(loan.groupId));
              }}
            >
              <RiDeleteBinLine className="text-red-500" />
            </button>
          </div>
        ),
      }))
    : [];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Loans</h2>
        <Button type="primary" onClick={showModal}>
          + GROUP LOAN
        </Button>
      </div>

      <Input.Search
        placeholder="Search loans..."
        style={{ width: 300, marginBottom: 20 }}
      />

      <Table columns={columns} dataSource={dataSource} />

      <Modal
        title={editingLoan ? "Edit GROUP LOAN" : "Add GROUP LOAN"}
        open={isModalOpen || isEditModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="merchantId" className="text-sm font-semibold">
              Merchant
            </label>
            <Select
              placeholder="Select Merchant ."
              type="text"
              name="merchantId"
              id="merchantId"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                Array.isArray(poses)
                  ? merchants &&
                    merchants.map((merchant) => ({
                      value: merchant.id,
                      label: merchant.merchantName,
                    }))
                  : []
              }
              onBlur={formik.handleBlur}
              onChange={(value) => formik.setFieldValue("merchantId", value)}
              value={formik.values.merchantId}
              className={`w-80 h-11 border-1.5 rounded-lg ${
                formik.touched.merchantId && formik.errors.merchantId
                  ? "border-red-600"
                  : ""
              }`}
            />
            <div>
              <p className="text-xs text-red-600">
                {formik.touched.merchantId && formik.errors.merchantId}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="loanProductId" className="text-sm font-semibold">
              Loan Product
            </label>
            <Select
              placeholder="Select Customer ."
              type="text"
              name="loanProductId"
              id="loanProductId"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                Array.isArray(poses)
                  ? customers &&
                    customers.map((customer) => ({
                      value: customer.id,
                      label: customer.fullName,
                    }))
                  : []
              }
              onBlur={formik.handleBlur}
              onChange={(value) => formik.setFieldValue("loanProductId", value)}
              value={formik.values.loanProductId}
              className={`w-80 h-11 border-1.5 rounded-lg ${
                formik.touched.loanProductId && formik.errors.loanProductId
                  ? "border-red-600"
                  : ""
              }`}
            />
            <div>
              <p className="text-xs text-red-600">
                {formik.touched.loanProductId && formik.errors.loanProductId}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="groupId" className="text-sm font-semibold">
              Group
            </label>
            <Select
              placeholder="Select groupId ."
              type="text"
              name="groupId"
              id="groupId"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                Array.isArray(poses)
                  ? poses &&
                    poses.map((pos) => ({
                      value: pos.posCode,
                      label: pos.groupName,
                    }))
                  : []
              }
              onBlur={formik.handleBlur}
              onChange={(value) => formik.setFieldValue("groupId", value)}
              value={formik.values.groupId}
              className={`w-80 h-11 border-1.5 rounded-lg ${
                formik.touched.groupId && formik.errors.groupId
                  ? "border-red-600"
                  : ""
              }`}
            />
            <div>
              <p className="text-xs text-red-600">
                {formik.touched.groupId && formik.errors.groupId}
              </p>
            </div>
          </div>
          <Input
            name="totalAmount"
            placeholder="totalAmount"
            value={formik.values.totalAmount}
            onChange={formik.handleChange}
          />
          <Select
            value={formik.values.status}
            onChange={(value) => formik.setFieldValue("status", value)}
            options={[
              { label: "PENDING", value: "PENDING" },
              { label: "APPROVED", value: "APPROVED" },
              { label: "REJECTED", value: "REJECTED" },
            ]}
          />
          <Button type="primary" htmlType="submit" className="mt-4">
            {editingLoan ? "Update GROUP LOAN" : "Add GROUP LOAN"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default GroupLoan;
