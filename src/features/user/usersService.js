import { newRequest } from "../../utils/newRequest";

const addUser = async (userData) => {
  const response = await newRequest.post(`auth/register`, userData);
  if (response && response.data) {
    return response.data;
  }
};

const getUsers = async () => {
  const response = await newRequest.get(`users/getAll?page=0&size=20`);
    if (response && response.data) {
    return response.data;
  }
};

const getUser = async (userId) => {
  const response = await newRequest.get(`users/${userId}`);
  if (response && response.data) {
    return response.data;
  }
};

const deleteUser = async (userId) => {
  const response = await newRequest.delete(`users/${userId}`);
  if (response && response.data) {
    return response.data;
  }
};

const updateUser = async (userId, userData) => {
  const response = await newRequest.put(`users/update/${userId}`, userData);
  if (response && response.data) {
    return response.data;
  }
};

const updatePassword = async (passwordData) =>{
  const response = await newRequest.patch(`users/change-password`,passwordData );
  if(response && response.data){
    return response.data
  }
}


const userService = { addUser, getUsers, deleteUser, updateUser, getUser,updatePassword };

export default userService;
