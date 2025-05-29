import { newRequest } from "../../utils/newRequest";

const addPosType = async (posTypeData) => {
  const response = await newRequest.post(`pos-types`, posTypeData);
  if (response && response.data) {
    return response.data;
  }
};

const getPosType = async (posTypeCode) => {
  const response = await newRequest.get(`pos-types/${posTypeCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const getPosTypes = async () => {
  const response = await newRequest.get(`pos-types`);
  if (response && response.data) {
    return response.data;
  }
};

const updatePosType = async (posTypeCode, posTypeData) => {
  const response = await newRequest.put(
    `pos-types/${posTypeCode}`,
    posTypeData
  );
  if (response && response.data) {
    return response.data;
  }
};

const deletePosType = async (posTypeCode) => {
  const response = await newRequest.delete(`pos-types/${posTypeCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const posTypeService = {
  addPosType,
  getPosType,
  getPosTypes,
  updatePosType,
  deletePosType,
};

export default posTypeService;
