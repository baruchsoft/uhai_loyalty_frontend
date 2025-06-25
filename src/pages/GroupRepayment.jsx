/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Modal, Select, DatePicker, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  addGroupRepayment,
  getGroupRepayments,
} from "../features/loans/groupRepaymentSlice";
import { getGroupLoans } from "../features/loans/grouploanSlice";

const REPAYMENT_SCHEMA = Yup.object().shape({
  groupLoanId: Yup.number().required("Group Loan is required."),
  merchantId: Yup.number().required("Merchant is required."),
  groupId: Yup.number().required("Group ID is required."),
  amount: Yup.number().required("Amount is required."),
  paidAt: Yup.date().required("Paid At is required."),
  fromAccount: Yup.number().required("From Account is required."),
  toAccount: Yup.number().required("To Account is required."),
  note: Yup.string(),
});

const GroupRepayment = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupLoans = useSelector((state) => state?.loan?.groupLoans || []);
  const repayments = useSelector(
    (state) => state?.repayment?.groupRepayments || []
  );
  const merchants = useSelector((state) => state?.merchant?.merchants);
  const poses = useSelector((state) => state?.pos?.poses); // groups

  useEffect(() => {
    dispatch(getGroupLoans());
    dispatch(getGroupRepayments());
  }, [dispatch]);

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      groupLoanId: "",
      merchantId: "",
      groupId: "",
      amount: "",
      paidAt: new Date(),
      fromAccount: "",
      toAccount: "",
      note: "",
    },
    validationSchema: REPAYMENT_SCHEMA,
    onSubmit: (values) => {
      dispatch(addGroupRepayment(values));
      closeModal();
      dispatch(getGroupRepayments());
    },
  });

  const columns = [
    { title: "#", dataIndex: "key" },
    { title: "Group Loan ID", dataIndex: "groupLoanId" },
    { title: "Merchant ID", dataIndex: "merchantId" },
    { title: "Group ID", dataIndex: "groupId" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Paid At", dataIndex: "paidAt" },
    { title: "From Account", dataIndex: "fromAccount" },
    { title: "To Account", dataIndex: "toAccount" },
    { title: "Note", dataIndex: "note" },
  ];

  const dataSource =
    Array.isArray(repayments) &&
    repayments.map((r, i) => ({
      key: i + 1,
      ...r,
      paidAt: dayjs(r.paidAt).format("YYYY-MM-DD"),
    }));

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Group Loan Repayments</h2>
        <Button type="primary" onClick={showModal}>
          + Add Repayment
        </Button>
      </div>

      <Table columns={columns} dataSource={dataSource} />

      <Modal
        title="Add Group Repayment"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 mt-4"
        >
          <div>
            <label className="text-sm font-medium">Group Loan</label>
            <Select
              placeholder="Select Group Loan"
              options={groupLoans.map((loan) => ({
                value: loan.id,
                label: `Group ${loan.groupId} - Loan ${loan.id}`,
              }))}
              value={formik.values.groupLoanId}
              onChange={(value) => formik.setFieldValue("groupLoanId", value)}
              className="w-full"
            />
            {formik.touched.groupLoanId && formik.errors.groupLoanId && (
              <p className="text-xs text-red-500">
                {formik.errors.groupLoanId}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Merchant</label>
            <Select
              placeholder="Select Merchant"
              options={
                merchants?.map((merchant) => ({
                  value: merchant.id,
                  label: merchant.merchantName,
                })) || []
              }
              value={formik.values.merchantId}
              onChange={(value) => formik.setFieldValue("merchantId", value)}
              className="w-full"
            />
            {formik.touched.merchantId && formik.errors.merchantId && (
              <p className="text-xs text-red-500">{formik.errors.merchantId}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Group ID</label>
            <Select
              placeholder="Select Group"
              options={
                poses?.map((group) => ({
                  value: group.posCode,
                  label: group.groupName,
                })) || []
              }
              value={formik.values.groupId}
              onChange={(value) => formik.setFieldValue("groupId", value)}
              className="w-full"
            />
            {formik.touched.groupId && formik.errors.groupId && (
              <p className="text-xs text-red-500">{formik.errors.groupId}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Amount</label>
            <Input
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              type="number"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-xs text-red-500">{formik.errors.amount}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Paid At</label>
            <DatePicker
              className="w-full"
              value={dayjs(formik.values.paidAt)}
              onChange={(date) =>
                formik.setFieldValue("paidAt", date?.toISOString())
              }
            />
            {formik.touched.paidAt && formik.errors.paidAt && (
              <p className="text-xs text-red-500">{formik.errors.paidAt}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">From Account</label>
            <Input
              name="fromAccount"
              value={formik.values.fromAccount}
              onChange={formik.handleChange}
              type="number"
            />
            {formik.touched.fromAccount && formik.errors.fromAccount && (
              <p className="text-xs text-red-500">
                {formik.errors.fromAccount}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">To Account</label>
            <Input
              name="toAccount"
              value={formik.values.toAccount}
              onChange={formik.handleChange}
              type="number"
            />
            {formik.touched.toAccount && formik.errors.toAccount && (
              <p className="text-xs text-red-500">{formik.errors.toAccount}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Note</label>
            <Input
              name="note"
              value={formik.values.note}
              onChange={formik.handleChange}
            />
          </div>

          <Button type="primary" htmlType="submit">
            Submit Repayment
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default GroupRepayment;
