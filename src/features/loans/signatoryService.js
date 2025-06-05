import { newRequest } from "../../utils/newRequest";

const addSignatory = async (sigdata) => {
  const response = await newRequest.post(`signatories`, sigdata);
  if (response && response.data) {
    return response.data;
  }
};

const getSignaories = async () => {
  const response = await newRequest.get(`merchants`);
  if (response && response.data) {
    return response.data;
  }
};

const signatoryService = {
  addSignatory,
  getSignaories,
};

export default signatoryService;
