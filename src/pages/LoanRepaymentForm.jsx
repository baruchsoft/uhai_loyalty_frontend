/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Button, Input, Select, DatePicker, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

// Example Redux slice functions
import {
  addRepayment,
  getAllRepayments,
  resetRepaymentState,
} from "../features/loans/repaymentSlice";
import { getAllLoans } from "../features/loans/loanSlice";

const REPAYMENT_SCHEMA = Yup.object().shape({
  loanId: Yup.number().required("Loan is required"),
  amount: Yup.number().required("Amount is required"),
  paidAt: Yup.date().required("Payment date is required"),
  fromAccount: Yup.number().required("From Account is required"),
  toAccount: Yup.number().required("To Account is required"),
  note: Yup.string().optional(),
});

const LoanRepaymentForm = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const accounts = useSelector((state) => state?.account?.accounts);
  const loans = useSelector((state) => state?.loan?.getAllLoans || []);
  const repayments = useSelector((state) => state?.repayment?.repayments || []);
  const repaymentAdded = useSelector(
    (state) => state?.repayment?.success?.addRepayment
  );

  useEffect(() => {
    dispatch(getAllLoans());
    dispatch(getAllRepayments());
  }, [dispatch]);

  useEffect(() => {
    if (repaymentAdded) {
      dispatch(getAllRepayments());
      dispatch(resetRepaymentState());
      formik.resetForm();
      setIsModalOpen(false);
    }
  }, [repaymentAdded, dispatch]);

  const formik = useFormik({
    initialValues: {
      loanId: "",
      amount: "",
      paidAt: dayjs().toISOString(),
      fromAccount: "",
      toAccount: "",
      note: "",
    },
    validationSchema: REPAYMENT_SCHEMA,
    onSubmit: (values) => {
      dispatch(addRepayment(values));
    },
  });

  const columns = [
    { title: "#", dataIndex: "key" },
    { title: "Loan ID", dataIndex: "loanId" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Paid At", dataIndex: "paidAt" },
    { title: "From", dataIndex: "fromAccount" },
    { title: "To", dataIndex: "toAccount" },
    { title: "Note", dataIndex: "note" },
  ];

  const dataSource = Array.isArray(repayments)
    ? repayments.map((r, i) => ({
        key: i + 1,
        loanId: r.loanId,
        amount: r.amount,
        paidAt: dayjs(r.paidAt).format("YYYY-MM-DD HH:mm"),
        fromAccount: r.fromAccount,
        toAccount: r.toAccount,
        note: r.note,
      }))
    : [];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Loan Repayments</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + ADD REPAYMENT
        </Button>
      </div>

      <Table columns={columns} dataSource={dataSource} />

      <Modal
        title="Add Loan Repayment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>Loan</label>
            <Select
              placeholder="Select Loan"
              options={loans.map((loan) => ({
                value: loan.id,
                label: `Loan #${loan.id}`,
              }))}
              value={formik.values.loanId}
              onChange={(value) => formik.setFieldValue("loanId", value)}
              className="w-full"
            />
            <p className="text-xs text-red-600">
              {formik.touched.loanId && formik.errors.loanId}
            </p>
          </div>

          <Input
            name="amount"
            placeholder="Amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
          />
          <p className="text-xs text-red-600">
            {formik.touched.amount && formik.errors.amount}
          </p>

          <DatePicker
            showTime
            className="w-full"
            value={dayjs(formik.values.paidAt)}
            onChange={(date) =>
              formik.setFieldValue("paidAt", date.toISOString())
            }
          />
          <p className="text-xs text-red-600">
            {formik.touched.paidAt && formik.errors.paidAt}
          </p>

          <div>
            <label className="text-sm font-medium">From Account</label>
            <Select
              placeholder="Select From Account"
              options={
                accounts?.map((merchant) => ({
                  value: merchant.id,
                  label: merchant.accountName,
                })) || []
              }
              value={formik.values.fromAccount}
              onChange={(value) => formik.setFieldValue("fromAccount", value)}
              className="w-full"
            />
            {formik.touched.fromAccount && formik.errors.fromAccount && (
              <p className="text-xs text-red-500">
                {formik.errors.fromAccount}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">To Account</label>
            <Select
              placeholder="Select To Account"
              options={
                accounts?.map((merchant) => ({
                  value: merchant.id,
                  label: merchant.accountName,
                })) || []
              }
              value={formik.values.toAccount}
              onChange={(value) => formik.setFieldValue("toAccount", value)}
              className="w-full"
            />
            {formik.touched.toAccount && formik.errors.toAccount && (
              <p className="text-xs text-red-500">{formik.errors.toAccount}</p>
            )}
          </div>

          <Input.TextArea
            name="note"
            placeholder="Note"
            value={formik.values.note}
            onChange={formik.handleChange}
            rows={3}
          />

          <Button type="primary" htmlType="submit">
            Submit Repayment
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default LoanRepaymentForm;
