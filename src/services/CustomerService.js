import * as CommonService from "./CommonService";

const prePath = "/customer";

export const GetAllCustomers = async () => {
  return CommonService.getRequest(`${prePath}`);
};

export const GetCustomerById = async ({ customerId }) => {
  return CommonService.getRequest(`${prePath}/${customerId}`);
};

export const CreateCustomer = async ({
  email,
  username,
  full_name,
  gender,
  phone,
  avatar_url,
  address,
}) => {
  return CommonService.postRequest(`${prePath}`, {
    email,
    password: "Uua9D5ba",
    username,
    full_name,
    gender,
    phone,
    avatar_url,
    address,
  });
};
