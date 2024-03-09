import * as CommonService from "./CommonService";

const prePath = "/hotel";

export const GetAllHotels = async () => {
  return CommonService.getRequest(`${prePath}`);
};

export const GetHotelById = async ({ hotelId }) => {
  return CommonService.getRequest(`${prePath}/${hotelId}`);
};
