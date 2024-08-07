// Create a common server to communicate with API server
import axios from "axios";
import { ExtractErrorInfo } from "src/utils/extract-error-info";
import Storage from "src/utils/Storage";

// Create Base URL
const commonService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
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

// Create Base DELETE method
export const _delete = async (path, data = {}, options = {}) => {
  const response = await commonService.delete(path, {
    ...options,
    data: data,
  });
  return response.data;
};

// Create Base PATCH method
export const patch = async (path, data, options = {}) => {
  const response = await commonService.patch(path, data, options);
  return response.data;
};

// common get request handler
export const getRequest = async (endpoint) => {
  try {
    const res = await get(endpoint, {
      headers: {
        Authorization: "Bearer " + Storage.getLocalAccessToken(),
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
        Authorization: "Bearer " + Storage.getLocalAccessToken(),
      },
    });
    return res;
  } catch (error) {
    console.error("Error occurred:", error);
    return ExtractErrorInfo(error);
  }
};

// common delete request handler
export const deleteRequest = async (endpoint, data) => {
  try {
    const res = await _delete(endpoint, data, {
      headers: {
        Authorization: "Bearer " + Storage.getLocalAccessToken(),
      },
    });
    return res;
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// common patch request handler
export const patchRequest = async (endpoint, data) => {
  try {
    const res = await patch(endpoint, data, {
      headers: {
        Authorization: "Bearer " + Storage.getLocalAccessToken(),
      },
    });
    return res;
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
