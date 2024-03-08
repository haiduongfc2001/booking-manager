import * as CommonService from "./CommonService";

const prePath = "/hotel";

export const GetAllHotels = async () => {
  return CommonService.getRequest(`${prePath}`);
};
