import { newRequest } from "../../utils/newRequest";

const customerRegister = async (customerData) =>{
  const response = await newRequest.post(`customers/create`, customerData);
  if(response && response.data){
    return response.data
  }
}

const getCustomer = async (customerId)=>{
  const response = await newRequest.get(`customers/${customerId}`);
  if(response && response.data){
    return response.data
  }
}

const getCustomers = async () => {
  const response = await newRequest.get(`customers?page=0&size=10`);
  if (response && response.data) {
    return response.data;
  }
};

const updateCustomer = async (updateData,customerId)=>{
  const response = await newRequest.put(`customers/update/${customerId}`,updateData);
  if(response && response.data){
    return response.data
  }
}

const deleteCustomer = async (customerId)=>{
  const response = await newRequest.delete(`customers/delete/${customerId}`);
  if(response && response.data){
    return response.data
  }
}

const customerService = {customerRegister, getCustomer, getCustomers, updateCustomer,deleteCustomer};


export default customerService;
