import { newRequest } from "../../utils/newRequest";

const addPos = async (posData) => {
  const response = await newRequest.post(`pos/create`, posData);
  if (response && response.data) {
    return response.data;
  }
};

const getPos = async (posCode) => {
  const response = await newRequest.get(`pos/${posCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const getPoses = async () => {
  const response = await newRequest.get(`pos?page=0&size=20`);
  if (response && response.data) {
    return response.data;
  }
};

const updatePos = async (posCode, posData) => {
  const response = await newRequest.put(`pos/${posCode}`, posData);
  if (response && response.data) {
    return response.data;
  }
};

const deletePos = async (posCode) => {
  const response = await newRequest.delete(`pos/${posCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const posService = {
  addPos,
  getPos,
  getPoses,
  updatePos,
  deletePos,
};

export default posService;
