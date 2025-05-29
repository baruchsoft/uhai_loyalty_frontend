import { newRequest } from "../../utils/newRequest";

const addUniversity = async (universityData) => {
  const response = await newRequest.post(`universities`, universityData);
  if (response && response.data) {
    return response.data;
  }
};

const getUniversity = async (universityCode) => {
  const response = await newRequest.get(`universities/${universityCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const updateUniversity = async (universityCode, universityData) => {
  const response = await newRequest.put(
    `universities/${universityCode}`,
    universityData
  );
  if (response && response.data) {
    return response.data;
  }
};

const deleteUniversity = async (universityCode) => {
  const response = await newRequest.delete(`universities/${universityCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const getUniversities = async () => {
  const response = await newRequest.get(`universities?page=0&size=10`);
  if (response && response.data) {
    return response.data;
  }
};

const universityService = {
  addUniversity,
  getUniversity,
  updateUniversity,
  deleteUniversity,
  getUniversities,
};

export default universityService;
