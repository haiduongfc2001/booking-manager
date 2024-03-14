import * as CommonService from "./common-service";

const prePath = "/staff";

export const GetAllStaffs = async () => {
  return CommonService.getRequest(`${prePath}`);
};

export const GetStaffById = async ({ staffId }) => {
  return CommonService.getRequest(`${prePath}/${staffId}`);
};

export const CreateStaff = async ({ email, full_name, gender, phone, dob, hotel_id, role }) => {
  return CommonService.postRequest(`${prePath}`, {
    email,
    password: "Uua9D5ba",
    full_name,
    gender,
    phone,
    dob,
    avatar: "https://robohash.org/3XP.png?set=set2",
    hotel_id,
    role,
  });
};

export const DeleteStaff = async ({ staffId }) => {
  return CommonService.deleteRequest(`${prePath}/${staffId}`, {});
};

export const EditStaff = async ({
  staffId,
  email,
  full_name,
  gender,
  phone,
  dob,
  hotel_id,
  role,
}) => {
  return CommonService.patchRequest(`${prePath}/${staffId}`, {
    email,
    password: "Uua9D5ba",
    full_name,
    gender,
    phone,
    dob,
    avatar: "https://robohash.org/3XP.png?set=set2",
    hotel_id,
    role,
  });
};
