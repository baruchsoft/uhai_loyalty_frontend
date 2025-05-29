import { newRequest } from "../../utils/newRequest";

const addVillage = async (villageData) => {
  const response = await newRequest.post(`villages`, villageData);
  if (response.data) {
    return response.data;
  }
};

const getVillages = async () => {
  const response = await newRequest.get(`villages?page=0&size=10`);
  if (response.data) {
    return response.data;
  }
};

const getVillage = async (villageCode) => {
  const response = await newRequest.get(`villages/${villageCode}`);
  if (response.data) {
    return response.data;
  }
};

const updateVillage = async (villageCode, villageData) => {
  const response = await newRequest.put(`villages/${villageCode}`, villageData);
  if (response.data) {
    return response.data;
  }
};

const deleteVillage = async (villageCode) => {
  const response = await newRequest.delete(`villages/${villageCode}`);
  if (response.data) {
    return response.data;
  }
};

const villageService = {
  addVillage,
  getVillage,
  getVillages,
  updateVillage,
  deleteVillage,
};

export default villageService;
