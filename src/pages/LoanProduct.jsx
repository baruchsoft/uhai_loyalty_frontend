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
import TextArea from "antd/es/input/TextArea";

const LOAN_SCHEMA = Yup.object().shape({
  description: Yup.number().required("Merchant ID is required."),
  shortDesc: Yup.number().required("Customer ID is required."),
  name: Yup.number().required("POS Code is required."),
  interestRate: Yup.number().required("interestRate is required."),
  status: Yup.string().required("Status is required."),
});

const LoanProduct = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  const loans = useSelector((state) => state?.loan?.getAllLoans);
  const poses = useSelector((state) => state?.pos?.poses);
  const customers = useSelector((state) => state?.customer?.customers);
  const loanproducts = useSelector((state) => state?.loanproduct?.loanproducts);

  console.log("customers", customers);

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
      description: editingLoan?.description || "",
      shortDesc: editingLoan?.shortDesc || "",
      name: editingLoan?.name || "",
      interestRate: editingLoan?.interestRate || "",
      status: editingLoan?.status || "PENDING",
    },
    enableReinitialize: true,
    validationSchema: LOAN_SCHEMA,
    onSubmit: (values) => {
      if (editingLoan) {
        dispatch(updateALoan({ name: editingLoan.name, data: values }));
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
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
    { title: "ShortDesc", dataIndex: "shortDesc" },
    { title: "InterestRate", dataIndex: "interestRate" },
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
      description: loan.description,
      shortDesc: loan.shortDesc,
      name: loan.name,
      interestRate: loan.interestRate,
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
              setSelectedLoanId(loan.name);
              dispatch(deleteALoan(loan.name));
            }}
          >
            <RiDeleteBinLine className="text-red-500" />
          </button>
        </div>
      ),
    }));

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Loans</h2>
        <Button type="primary" onClick={showModal}>
          + Loan Product
        </Button>
      </div>

      <Input.Search
        placeholder="Search loan product..."
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
          <Input
            name="name"
            placeholder="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <TextArea
            name="description"
            placeholder="description"
            value={formik.values.description}
          />
          <TextArea
            name="shortDesc"
            placeholder="shortDesc"
            value={formik.values.shortDesc}
          />
          <Input
            name="interestRate"
            placeholder="interestRate"
            value={formik.values.interestRate}
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

export default LoanProduct;
