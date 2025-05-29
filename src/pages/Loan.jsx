import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Button, Input, Modal, Spin, Table, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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

const LOAN_SCHEMA = Yup.object().shape({
  merchantId: Yup.number().required("Merchant ID is required."),
  customerId: Yup.number().required("Customer ID is required."),
  posCode: Yup.number().required("POS Code is required."),
  amount: Yup.number().required("Amount is required."),
  status: Yup.string().required("Status is required."),
});

const LoanManagement = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  const loans = useSelector((state) => state?.loan?.getAllLoans);
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
      customerId: editingLoan?.customerId || "",
      posCode: editingLoan?.posCode || "",
      amount: editingLoan?.amount || "",
      status: editingLoan?.status || "PENDING",
    },
    enableReinitialize: true,
    validationSchema: LOAN_SCHEMA,
    onSubmit: (values) => {
      if (editingLoan) {
        dispatch(updateALoan({ posCode: editingLoan.posCode, data: values }));
        dispatch(getAllPoses());
        dispatch(getAllMechants());
        dispatch(getAllCustomers());
      } else {
        dispatch(addALoan(values));
        dispatch(getAllPoses());
        dispatch(getAllMechants());
        dispatch(getAllCustomers());
      }
    },
  });

  useEffect(() => {
    dispatch(getAllLoans());
    dispatch(getAllPoses());
    dispatch(getAllMechants());
    dispatch(getAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (loanAdded || loanUpdated) {
      formik.resetForm();
      closeModal();
      dispatch(resetLoanState());
      dispatch(getAllLoans());
      dispatch(getAllPoses());
      dispatch(getAllMechants());
      dispatch(getAllCustomers());
    }
  }, [loanAdded, loanUpdated, dispatch]);

  useEffect(() => {
    if (loanDeleted) {
      dispatch(resetLoanState());
      dispatch(getAllLoans());
      dispatch(getAllPoses());
      dispatch(getAllMechants());
      dispatch(getAllCustomers());
    }
  }, [loanDeleted, dispatch]);

  const columns = [
    { title: "#", dataIndex: "key" },
    { title: "Merchant ID", dataIndex: "merchantId" },
    { title: "Customer ID", dataIndex: "customerId" },
    { title: "POS Code", dataIndex: "posCode" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const dataSource =
    Array.isArray(loans) &&
    loans.map((loan, index) => ({
      key: index + 1,
      merchantId: loan.merchantId,
      customerId: loan.customerId,
      posCode: loan.posCode,
      amount: loan.amount,
      status: loan.status,
      action: (
        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditingLoan(loan);
              setIsEditModalOpen(true);
            }}
          >
            <FaEdit className="text-blue-500" />
          </button>
          <button
            onClick={() => {
              setSelectedLoanId(loan.posCode);
              dispatch(deleteALoan(loan.posCode));
            }}
          >
            <MdDelete className="text-red-500" />
          </button>
        </div>
      ),
    }));

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Loans</h2>
        <Button type="primary" onClick={showModal}>
          + REQUEST LOAN
        </Button>
      </div>

      <Input.Search
        placeholder="Search loans..."
        style={{ width: 300, marginBottom: 20 }}
      />

      <Table columns={columns} dataSource={dataSource} />

      <Modal
        title={editingLoan ? "Edit Loan" : "Add Loan"}
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
                      label: merchant.name,
                    }))
                  : []
              }
              onBlur={formik.handleBlur}
              onChange={(value) => formik.setFieldValue("merchantId", value)}
              value={formik.values.id}
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
          <div className="flex flex-col">
            <label htmlFor="customerId" className="text-sm font-semibold">
              Customer
            </label>
            <Select
              placeholder="Select Customer ."
              type="text"
              name="customerId"
              id="customerId"
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
                      label: customer.name,
                    }))
                  : []
              }
              onBlur={formik.handleBlur}
              onChange={(value) => formik.setFieldValue("customer", value)}
              value={formik.values.id}
              className={`w-80 h-11 border-1.5 rounded-lg ${
                formik.touched.customer && formik.errors.customerId
                  ? "border-red-600"
                  : ""
              }`}
            />
            <div>
              <p className="text-xs text-red-600">
                {formik.touched.customer && formik.errors.customerId}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="posCode" className="text-sm font-semibold">
              PosCode
            </label>
            <Select
              placeholder="Select posCode ."
              type="text"
              name="posCode"
              id="posCode"
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
                      label: pos.posCode,
                    }))
                  : []
              }
              onBlur={formik.handleBlur}
              onChange={(value) => formik.setFieldValue("posCode", value)}
              value={formik.values.posCode}
              className={`w-80 h-11 border-1.5 rounded-lg ${
                formik.touched.posCode && formik.errors.posCode
                  ? "border-red-600"
                  : ""
              }`}
            />
            <div>
              <p className="text-xs text-red-600">
                {formik.touched.posCode && formik.errors.posCode}
              </p>
            </div>
          </div>
          <Input
            name="amount"
            placeholder="Amount"
            value={formik.values.amount}
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
            {editingLoan ? "Update Loan" : "Add Loan"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default LoanManagement;
