import * as CommonService from "./common-service";

const prePath = "/hotel";

export const GetAllRoomsByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/room/getAllRoomsByHotelId`);
};