import * as CommonService from "./common-service";

const prePath = "/customer";

export const GetAllCustomers = async () => {
  return CommonService.getRequest(`${prePath}/getAllCustomers`);
};

export const GetCustomerById = async ({ customerId }) => {
  return CommonService.getRequest(`${prePath}/${customerId}/getCustomerById`);
};

export const CreateCustomer = async ({
  email,
  username,
  full_name,
  gender,
  phone,
  avatar,
  address,
  dob,
}) => {
  return CommonService.postRequest(`${prePath}/createCustomer`, {
    email,
    password: "Uua9D5ba",
    username,
    full_name,
    gender,
    phone,
    avatar,
    address,
    dob,
  });
};

export const DeleteCustomer = async ({ customerId }) => {
  return CommonService.deleteRequest(`${prePath}/${customerId}/deleteCustomer`, {});
};

export const EditCustomer = async ({
  customerId,
  email,
  username,
  full_name,
  gender,
  phone,
  avatar,
  address,
  dob,
}) => {
  return CommonService.patchRequest(`${prePath}/${customerId}/updateCustomer`, {
    email,
    password: "Uua9D5ba",
    username,
    full_name,
    gender,
    phone,
    avatar,
    address,
    dob,
  });
};
