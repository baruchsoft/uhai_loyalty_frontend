import { newRequest } from "../../utils/newRequest";

 export const addPos = async (posData) => {
  try {
    const response = await newRequest.post(`pos/create`, posData);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPos = async (posCode) => {
  const response = await newRequest.get(`pos/${posCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const getPoses = async () => {
  const response = await newRequest.get(`pos?page=0&size=20`);
  if (response && response.data) {
    return response.data;
  }
};


export const updatePos = async (posCode, posData) => {
  try {
      const response = await newRequest.put(`pos/${posCode}`, posData);
      return response
  } catch (error) {
    console.log(error)
  }
};


const deletePos = async (posCode) => {
  const response = await newRequest.delete(`pos/${posCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const addSignatory = async(posCode, signatoryData)=>{
  const newsignatoryData = [signatoryData]
  console.log(newsignatoryData,"=>signaData")
  const response = await newRequest.post(`pos/${posCode}/signatories`,newsignatoryData);
  if(response){
    return response
  }
}

const posService = {addPos,getPos,getPoses,updatePos,deletePos,addSignatory};

export default posService;
