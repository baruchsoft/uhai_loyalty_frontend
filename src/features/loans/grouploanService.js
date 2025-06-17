import { newRequest } from "../../utils/newRequest";

const addGroupLoan = async (posTypeData) => {
  const response = await newRequest.post(`lgroup-loans`, posTypeData);
  if (response && response.data) {
    return response.data;
  }
};
const updateGroupLoan = async (posTypeData) => {
  const response = await newRequest.post(`lgroup-loans`, posTypeData);
  if (response && response.data) {
    return response.data;
  }
};
const getGroupLoans = async () => {
  const response = await newRequest.get(`lgroup-loans`);
  if (response && response.data) {
    return response.data;
  }
};

const grouploanService = {
  addGroupLoan,
  updateGroupLoan,
  getGroupLoans,
};

export default grouploanService;
