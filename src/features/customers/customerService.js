import { newRequest } from "../../utils/newRequest";

const getCustomers = async (page = 0, size = 10) => {
  const response = await newRequest.get(`customers?page=${page}&size=${size}`);
  return response?.data;
};

const getCustomer = async (customerId) => {
  const response = await newRequest.get(`customers/${customerId}`);
  return response?.data;
};

const addCustomer = async (customerData) => {
  const response = await newRequest.post(`customers`, customerData);
  return response?.data;
};

const updateCustomer = async (customerId, customerData) => {
  const response = await newRequest.put(
    `customers/${customerId}`,
    customerData
  );
  return response?.data;
};

const deleteCustomer = async (customerId) => {
  const response = await newRequest.delete(`customers/${customerId}`);
  return response?.data;
};

const posService = {
  getCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};

export default posService;
