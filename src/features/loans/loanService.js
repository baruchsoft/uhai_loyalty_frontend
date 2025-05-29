import { newRequest } from "../../utils/newRequest";

const addALoan = async (loanData) => {
  const response = await newRequest.post("loan", loanData);
  return response.data;
};

const getAllLoans = async () => {
  const response = await newRequest.get("loan");
  return response.data;
};

const getALoan = async (posCode) => {
  const response = await newRequest.get(`loan/posCode/${posCode}`);
  return response.data;
};

const getALoanByCustomer = async (customerId) => {
  const response = await newRequest.get(`loan/customer/${customerId}`);
  return response.data;
};

const updateALoan = async ({ loanId, loanData }) => {
  const response = await newRequest.put(`${"loan"}/${loanId}`, loanData);
  return response.data;
};

const deleteALoan = async (loanId) => {
  const response = await newRequest.delete(`${"loan"}/${loanId}`);
  return response.data;
};

const loanService = {
  addALoan,
  getAllLoans,
  getALoan,
  updateALoan,
  deleteALoan,
  getALoanByCustomer,
};

export default loanService;
