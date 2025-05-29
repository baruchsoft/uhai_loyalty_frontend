import { newRequest } from "../../utils/newRequest";

const addLocation = async (locationData) => {
  const response = await newRequest.post(`locations/create`, locationData);
  if (response && response.data) {
    return response.data;
  }
};

const getLocation = async (locationCode) => {
  const response = await newRequest.get(`locations/${locationCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const updateLocation = async (locationCode, locationData) => {
  const response = await newRequest.put(`locations/update/${locationCode}`, locationData);
  if (response && response.data) {
    return response.data;
  }
};

const getLocations = async () => {
  const response = await newRequest.get(`locations?page=0&size=10`);
  if (response && response.data) {
    return response.data;
  }
};

const deleteLocation = async (locationCode) => {
  const response = await newRequest.delete(`locations/delete/${locationCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const locationService = {
  getLocation,
  updateLocation,
  deleteLocation,
  getLocations,
  addLocation,
};

export default locationService;
