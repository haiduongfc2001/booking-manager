// Create a common server to communicate with API server
import axios from "axios";
// import Storage from "../utils/Storage";

// Create Base URL
const commonService = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// Create Base GET method
export const get = async (path, options) => {
  const response = await commonService.get(path, options);
  return response.data;
};

// Create Base POST method
export const post = async (path, data, options = {}) => {
  const response = await commonService.post(path, data, options);
  return response.data;
};

// common get request handler
export const getRequest = async (endpoint) => {
  try {
    const res = await get(endpoint, {
      headers: {
        Authorization: "Bearer " + "ewqeeqeyqueqyeieyqwiequiye",
      },
    });
    return res;
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// common post request handler
export const postRequest = async (endpoint, data) => {
  try {
    const res = await post(endpoint, data, {
      headers: {
        Authorization: "Bearer " + "ewqeeqeyqueqyeieyqwiequiye",
      },
    });
    return res;
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
