/* eslint-disable no-unused-vars */
import { Button, Input, Modal, Select, Spin, Table } from "antd";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  addAccount,
  deleteAccount,
  getAllAccounts,
  getAccount,
  resetAccountState,
  updateAccount,
} from "../features/loans/accountSlice";
import { MdEmojiFoodBeverage, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const columns = [
  { title: "#", dataIndex: "key" },
  { title: "Owner Type", dataIndex: "ownerType" },
  { title: "Owner", dataIndex: "ownerId" },
  { title: "Balance", dataIndex: "balance" },
  { title: "Account Name", dataIndex: "accountName" },
  { title: "Account Type", dataIndex: "accountType" },
  { title: "Action", dataIndex: "action" },
];

const ACCOUNT_SCHEMA = Yup.object().shape({
  ownerType: Yup.string().required("Please provide the owner type."),
  balance: Yup.string().required("Please provide the account balance."),
  accountName: Yup.string().required("Please provide the account name."),
  accountType: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"], "Select a valid account type.")
    .required("Account type is required."),
});

const Accounts = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountCode, setSelectedAccountCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const loadingStates = useSelector((state) => state?.account?.loading);
  const accounts = useSelector((state) => state?.account?.accounts);
  const addedAccount = useSelector((state) => state?.account?.addedAccount);
  const updatedAccount = useSelector((state) => state?.account?.updatedAccount);
  const successFlags = useSelector((state) => state?.account?.success);

  const showModal = useCallback(() => setIsModalOpen(true), []);
  const handleCancel = useCallback(() => setIsModalOpen(false), []);
  const showDeleteModal = useCallback(() => setIsDeleteModalOpen(true), []);
  const handleDeleteModalCancel = useCallback(
    () => setIsDeleteModalOpen(false),
    []
  );

  const showEditModal = async (account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
    dispatch(getAccount(account?.accountCode));
  };

  const formik = useFormik({
    initialValues: {
      id: editingAccount?.id || "",
      ownerType: editingAccount?.ownerType || "",
      ownerId: editingAccount?.ownerId || 1,
      balance: editingAccount?.balance || "",
      accountName: editingAccount?.accountName || "",
      accountType: editingAccount?.accountType || "INACTIVE",
    },
    enableReinitialize: true,
    validationSchema: ACCOUNT_SCHEMA,
    onSubmit: (values) => {
      if (editingAccount) {
        dispatch(addAccount(values));
      } else {
        dispatch(addAccount(values));
      }
    },
  });

  useEffect(() => {
    dispatch(getAllAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (addedAccount && successFlags?.addedAccount) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetAccountState());
      dispatch(getAllAccounts());
    }
  }, [addedAccount, successFlags?.addedAccount, dispatch]);

  useEffect(() => {
    if (updatedAccount && successFlags?.updateAccount) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetAccountState());
      dispatch(getAllAccounts());
      setEditingAccount(null);
    }
  }, [updatedAccount, successFlags?.updateAccount, dispatch]);

  useEffect(() => {
    if (successFlags?.deleteAccount) {
      setIsDeleteModalOpen(false);
      setSelectedAccountCode(null);
      dispatch(resetAccountState());
      dispatch(getAllAccounts());
    }
  }, [successFlags?.deleteAccount, dispatch]);

  const dataSource =
    Array.isArray(accounts) &&
    accounts?.map((account, index) => ({
      key: index + 1,
      ownerType: account?.ownerType,
      ownerId: account?.ownerId,
      balance: account?.balance,
      accountName: account?.accountName,
      accountType: account?.accountType,
      action: (
        <div className="flex gap-4 items-center">
          <button onClick={() => showEditModal(account)}>
            <MdOutlineEdit className="text-blue-600 text-xl" />
          </button>
          <button
            onClick={() => {
              setSelectedAccountCode(account?.accountCode);
              showDeleteModal();
            }}
          >
            <RiDeleteBinLine className="text-red-600 text-xl" />
          </button>
        </div>
      ),
    }));

  const deleteAccountHandler = async () => {
    if (selectedAccountCode) {
      dispatch(deleteAccount(selectedAccountCode));
    }
  };

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Accounts</h2>
        <Button type="primary" onClick={showModal}>
          + Add Account
        </Button>
      </div>

      <Input
        style={{ width: "400px", marginBottom: "16px" }}
        placeholder="Search accounts..."
      />

      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loadingStates?.getAllAccounts}
      />

      <Modal
        title={
          <h2 className="text-lg font-semibold">
            {editingAccount ? "Edit Account" : "Add Account"}
          </h2>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setIsEditModalOpen(false);
          setEditingAccount(null);
        }}
        width={400}
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Owner Type</label>
            <Input
              id="ownerType"
              name="ownerType"
              onChange={formik.handleChange}
              value={formik.values.ownerType}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ownerType && formik.errors.ownerType && (
              <p className="text-xs text-red-600">{formik.errors.ownerType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Balance</label>
            <Input
              id="balance"
              name="balance"
              onChange={formik.handleChange}
              value={formik.values.balance}
              onBlur={formik.handleBlur}
            />
            {formik.touched.balance && formik.errors.balance && (
              <p className="text-xs text-red-600">{formik.errors.balance}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Account Name</label>
            <Input
              id="accountName"
              name="accountName"
              onChange={formik.handleChange}
              value={formik.values.accountName}
              onBlur={formik.handleBlur}
            />
            {formik.touched.accountName && formik.errors.accountName && (
              <p className="text-xs text-red-600">
                {formik.errors.accountName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Account Type</label>
            <Select
              id="accountType"
              value={formik.values.accountType}
              onChange={(value) => formik.setFieldValue("accountType", value)}
              options={[
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "INACTIVE", value: "INACTIVE" },
              ]}
              style={{ width: "100%" }}
            />
            {formik.touched.accountType && formik.errors.accountType && (
              <p className="text-xs text-red-600">
                {formik.errors.accountType}
              </p>
            )}
          </div>

          <div className="text-right">
            <Button
              htmlType="submit"
              type="primary"
              loading={
                loadingStates?.addAccount || loadingStates?.updateAccount
              }
            >
              {editingAccount ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onCancel={handleDeleteModalCancel}
        onOk={deleteAccountHandler}
        confirmLoading={loadingStates?.deleteAccount}
        okText="Delete"
        okType="danger"
        title="Are you sure?"
      >
        <p>This action cannot be undone. Do you want to delete this account?</p>
      </Modal>
    </div>
  );
};

export default Accounts;
