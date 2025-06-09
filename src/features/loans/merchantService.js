import { newRequest } from "../../utils/newRequest";

const addMerchant = async (posTypeData) => {
  const response = await newRequest.post(`merchants`, posTypeData);
  if (response && response.data) {
    return response.data;
  }
};
const updateMerchant = async (posTypeData) => {
  const response = await newRequest.post(`merchants`, posTypeData);
  if (response && response.data) {
    return response.data;
  }
};
const getMerchants = async () => {
  const response = await newRequest.get(`merchants`);
  if (response && response.data) {
    return response.data;
  }
};

const merchantService = {
  addMerchant,
  getMerchants,
  updateMerchant,
};

export default merchantService;
