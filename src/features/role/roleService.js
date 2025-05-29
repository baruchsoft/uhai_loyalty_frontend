import { newRequest } from "../../utils/newRequest";

const addRole = async (roleData) => {
  const response = await newRequest.post(`roles`, roleData);
  if (response && response.data) {
    return response.data;
  }
};

const getRole = async (roleCode) => {
  const response = await newRequest.get(`roles/${roleCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const updateRole = async (roleCode, roleData) => {
  const response = await newRequest.put(`roles/${roleCode}`, roleData);
  if (response && response.data) {
    return response.data;
  }
};

const deleteRole = async (roleCode) => {
  const response = await newRequest.delete(`roles/${roleCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const getRoles = async () => {
  const response = await newRequest.get(`roles`);
  if (response && response.data) {
    return response.data;
  }
};

const roleService = {
  addRole,
  getRole,
  updateRole,
  deleteRole,
  getRoles,
};

export default roleService;
