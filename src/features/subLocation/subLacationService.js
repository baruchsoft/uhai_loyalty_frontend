import { newRequest } from "../../utils/newRequest";

const addSubLocation = async (subLocationData) => {
  const response = await newRequest.post(`sublocations/create`, subLocationData);
  if (response.data) {
    return response.data;
  }
};

const getSubLocations = async () => {
  const response = await newRequest.get(`sublocations?page=0&size=10`);
  if (response.data) {
    return response.data;
  }
};

const getSubLocation = async (subLocationCode) => {
  const response = await newRequest.get(`sublocations/${subLocationCode}`);
  if (response.data) {
    return response.data;
  }
};

const updateSubLocation = async (subLocationCode, subLocationData) => {
  const response = await newRequest.put( `sublocations/update/${subLocationCode}`, subLocationData);
  if (response.data) {
    return response.data;
  }
};

const deleteSubLocation = async (subLocationCode) => {
  const response = await newRequest.delete(`sublocations/delete/${subLocationCode}`);
  if (response.data) {
    return response.data;
  }
};

const subLocationService = {
  addSubLocation,
  getSubLocation,
  getSubLocations,
  updateSubLocation,
  deleteSubLocation,
};

export default subLocationService;
