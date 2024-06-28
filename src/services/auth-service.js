import * as CommonService from "./common-service";

export const AdminLogin = async ({ email, password, role }) => {
  return CommonService.postRequest("/admin/login", { email, password, role });
};

export const StaffLogin = async ({ email, password, role }) => {
  return CommonService.postRequest("/hotel/staff/login", { email, password, role });
};
