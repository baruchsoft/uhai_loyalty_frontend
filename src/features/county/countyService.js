import { newRequest } from "../../utils/newRequest";

const addCounty = async (countyData) => {
  const response = await newRequest.post(`counties`, countyData);
  if ( response && response.data) {
    return response.data;
  }
};

const getCounties = async () => {
  const response = await newRequest.get(`counties?page=0&size=20`);
  if ( response && response.data) {
    return response.data;
  }
};

const getCounty = async (countyCode) => {
  const response = await newRequest.get(`counties/${countyCode}`);
  if ( response && response.data) {
    return response.data;
  }
};

const updateCounty = async (countyCode, countyData) => {
  const response = await newRequest.put(`counties/${countyCode}`, countyData);
  if ( response && response.data) {
    return response.data;
  }
};

const deleteCounty = async (countyCode) => {
  const response = await newRequest.delete(`counties/${countyCode}`);
  if (response &&  response.data) {
    return response.data;
  }
};

const countyService = {
  addCounty,
  getCounties,
  getCounty,
  updateCounty,
  deleteCounty,
};

export default countyService;
