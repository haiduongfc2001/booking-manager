import * as CommonService from "./common-service";

const prePath = "/hotel";

export const GetAllStaffs = async () => {
  return CommonService.getRequest(`${prePath}/getAllStaffs`);
};

export const GetStaffById = async ({ hotel_id, staff_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/staff/${staff_id}/getStaffById`);
};

export const CreateStaff = async ({ hotel_id, email, full_name, gender, phone, role }) => {
  return CommonService.postRequest(`${prePath}/${hotel_id}/createStaff`, {
    email,
    full_name,
    gender,
    phone,
    role,
  });
};

export const DeleteStaff = async ({ hotel_id, staff_id }) => {
  return CommonService.deleteRequest(`${prePath}/${hotel_id}/staff/${staff_id}/deleteStaff`, {});
};

export const UpdateStaff = async ({
  hotel_id,
  staff_id,
  email,
  full_name,
  gender,
  phone,
  role,
}) => {
  return CommonService.patchRequest(`${prePath}/${hotel_id}/staff/${staff_id}/updateStaff`, {
    email,
    full_name,
    gender,
    phone,
    role,
  });
};

export const GetAllStaffsByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/staff/getAllStaffsByHotelId`);
};
