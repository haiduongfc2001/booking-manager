import * as CommonService from "./CommonService";

const prePath = "/customer";

export const GetAllCustomers = async () => {
  return CommonService.getRequest(`${prePath}`);
};

export const GetCustomerById = async ({ customerId }) => {
  return CommonService.getRequest(`${prePath}/${customerId}`);
};
