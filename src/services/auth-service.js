import * as CommonService from "./common-service";

export const AdminLogin = async ({ email, password, role }) => {
  return CommonService.postRequest("/admin/login", { email, password, role });
};

export const ManagerLogin = async ({ email, password, role }) => {
  return CommonService.postRequest("/hotel/staff/login", { email, password, role });
};

export const ReceptionistLogin = async ({ email, password, role }) => {
  return CommonService.postRequest("/hotel/staff/login", { email, password, role });
};
