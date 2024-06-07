import * as CommonService from "./common-service";

const prePath = "/address";

export const GetAllProvinces = async () => {
  return CommonService.getRequest(`${prePath}/getAllProvinces`);
};

export const GetAllDistrictsByProvinceId = async ({ province_id }) => {
  return CommonService.getRequest(`${prePath}/province/${province_id}/districts/getAll`);
};

export const GetAllWardsByDistrictId = async ({ district_id }) => {
  return CommonService.getRequest(`${prePath}/province/district/${district_id}/wards/getAll`);
};
