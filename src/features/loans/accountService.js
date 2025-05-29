import { newRequest } from "../../utils/newRequest";

const getAllAccounts = async () => {
  const res = await newRequest.get("accounts");
  return res.data;
};

const getAccount = async (id) => {
  const res = await newRequest.get(`accounts/${id}`);
  return res.data;
};

const addAccount = async (data) => {
  const res = await newRequest.post("accounts", data);
  return res.data;
};

const updateAccount = async (id, data) => {
  const res = await newRequest.put(`accounts/${id}`, data);
  return res.data;
};

const getAccountByOwnerAndType = async (ownerId, accountType) => {
  const res = await newRequest.get(`accounts/by-ownerid-and-accounttype`, {
    params: {
      ownerId,
      accountType,
    },
  });
  return res.data;
};

const deleteAccount = async (id) => {
  const res = await newRequest.delete(`accounts/${id}`);
  return res.data;
};

const accountService = {
  getAllAccounts,
  getAccount,
  addAccount,
  updateAccount,
  deleteAccount,
  getAccountByOwnerAndType,
};

export default accountService;
