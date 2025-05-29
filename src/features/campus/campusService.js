import { newRequest } from "../../utils/newRequest";

const addCampus = async (campusData) => {
  const response = await newRequest.post(`campuses`, campusData);
  if (response && response.data) {
    return response.data;
  }
};

const getCampus = async (campusCode) => {
  const response = await newRequest.get(`campuses/${campusCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const updateCampus = async (campusCode, campusData) => {
  const response = await newRequest.put(`campuses/${campusCode}`, campusData);
  if (response && response.data) {
    return response.data;
  }
};

const deleteCampus = async (campusCode) => {
  const response = await newRequest.delete(`campuses/${campusCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const getCampuses = async () => {
  const response = await newRequest.get(`campuses`);
  if (response && response.data) {
    return response.data;
  }
};

const campusService = {
  addCampus,
  getCampus,
  updateCampus,
  deleteCampus,
  getCampuses,
};

export default campusService;
