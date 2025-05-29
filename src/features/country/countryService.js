import { newRequest } from "../../utils/newRequest";

const addCountry = async (countryData) => {
  const response = await newRequest.post(`countries`, countryData);
  if (response && response.data) {
    return response.data;
  }
};

const getCountry = async (countryCode) => {
  const response = await newRequest.get(`countries/${countryCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const getCountries = async () => {
  const response = await newRequest.get(`countries?page=0&size=20`);
  if (response && response.data) {
    return response.data;
  }
};

const updateCountry = async (countryCode, countryData) => {
  const response = await newRequest.put(
    `countries/${countryCode}`,
    countryData
  );
  if (response && response.data) {
    return response.data;
  }
};

const deleteCountry = async (countryCode) => {
  const response = await newRequest.delete(`countries/${countryCode}`);
  if (response && response.data) {
    return response.data;
  }
};

const countryService = {
  addCountry,
  getCountry,
  getCountries,
  updateCountry,
  deleteCountry,
};

export default countryService;
