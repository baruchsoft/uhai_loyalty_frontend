import { newRequest } from "../../utils/newRequest";

const addWard = async (wardData) => {
  const response = await newRequest.post(`wards`, wardData);
  if (response && response.data) {
    return response.data;
  }
};

const getWards = async () => {
  const response = await newRequest.get(`wards?page=0&size=20`);
  if (response && response.data) {
    return response.data;
  }
};

const getWard = async (wardCode) => {
  const response = await newRequest.get(`wards/${wardCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const updateWard = async (wardCode, wardData) => {
  const response = await newRequest.put(`wards/${wardCode}`, wardData);
  if (response && response.data) {
    return response.data;
  }
};

const deleteWard = async (wardCode) => {
  const response = await newRequest.delete(`wards/${wardCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const wardService = {
  addWard,
  getWard,
  getWards,
  updateWard,
  deleteWard,
};

export default wardService;
