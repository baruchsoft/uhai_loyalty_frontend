import { newRequest } from "../../utils/newRequest";

const addRepayment = async (data) => {
  const res = await newRequest.post("", data);
  return res.data;
};

const getAllRepayments = async () => {
  const res = await newRequest.get("");
  return res.data;
};

const repaymentService = {
  addRepayment,
  getAllRepayments,
};

export default repaymentService;
