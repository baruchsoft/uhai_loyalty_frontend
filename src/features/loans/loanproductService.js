import { newRequest } from "../../utils/newRequest";

const addLoanProduct = async (posTypeData) => {
  const response = await newRequest.post(`loan-products`, posTypeData);
  if (response && response.data) {
    return response.data;
  }
};
const updateLoanProduct = async (posTypeData) => {
  const response = await newRequest.post(`loan-products`, posTypeData);
  if (response && response.data) {
    return response.data;
  }
};
const getLoanProducts = async () => {
  const response = await newRequest.get(`loan-products/status/PENDING`);
  if (response && response.data) {
    return response.data;
  }
};

const loanproductService = {
  addLoanProduct,
  updateLoanProduct,
  getLoanProducts,
};

export default loanproductService;
