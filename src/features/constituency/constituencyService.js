import { newRequest } from "../../utils/newRequest";

const addConstituency = async (constituencyData) => {
  const response = await newRequest.post(`constituencies`, constituencyData);
  if (response && response.data) {
    return response.data;
  }
};

const getConstituency = async (constituencyCode) => {
  const response = await newRequest.get(`constituencies/${constituencyCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const getConstituencies = async () => {
  const response = await newRequest.get(`constituencies?page=0&size=20`);
  if (response && response.data) {
    return response.data;
  }
};

const updateConstituency = async (constituencyCode, constituencyData) => {
  const response = await newRequest.put(
    `constituencies/${constituencyCode}`,
    constituencyData
  );
  if (response && response.data) {
    return response.data;
  }
};

const deleteConstituency = async (constituencyCode) => {
  const response = await newRequest.delete(
    `constituencies/${constituencyCode}`
  );
  if (response && response.data) {
    return response.data;
  }
};
const constituencyService = {
  addConstituency,
  getConstituencies,
  getConstituency,
  updateConstituency,
  deleteConstituency,
};

export default constituencyService;
