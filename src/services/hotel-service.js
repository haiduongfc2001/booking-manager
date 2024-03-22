import * as CommonService from "./common-service";

const prePath = "/hotel";

export const GetAllHotels = async () => {
  return CommonService.getRequest(`${prePath}/getAllHotels`);
};

export const GetHotelList = async () => {
  return CommonService.getRequest(`${prePath}/getHotelList`);
};

export const GetHotelById = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/getHotelById`);
};

export const CreateHotel = async ({ name, address, contact, description }) => {
  return CommonService.postRequest(`${prePath}/createHotel`, {
    name,
    address,
    location: "Uua9D5ba",
    contact,
    description,
  });
};

export const DeleteHotel = async ({ hotel_id }) => {
  return CommonService.deleteRequest(`${prePath}/${hotel_id}/deleteHotel`, {});
};

export const EditHotel = async ({ hotel_id, name, address, contact, description }) => {
  return CommonService.patchRequest(`${prePath}/${hotel_id}/updateHotel`, {
    name,
    address,
    location: "Uua9D5ba",
    contact,
    description,
  });
};
