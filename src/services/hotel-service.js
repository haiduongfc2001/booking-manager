import * as CommonService from "./common-service";

const prePath = "/hotel";

export const GetAllHotels = async () => {
  return CommonService.getRequest(`${prePath}`);
};

export const GetHotelById = async ({ hotelId }) => {
  return CommonService.getRequest(`${prePath}/${hotelId}`);
};

export const CreateHotel = async ({ name, address, contact, description }) => {
  return CommonService.postRequest(`${prePath}`, {
    name,
    address,
    location: "Uua9D5ba",
    contact,
    description,
  });
};

export const DeleteHotel = async ({ hotelId }) => {
  return CommonService.deleteRequest(`${prePath}/${hotelId}`, {});
};

export const EditHotel = async ({ hotelId, name, address, contact, description }) => {
  return CommonService.patchRequest(`${prePath}/${hotelId}`, {
    name,
    address,
    location: "Uua9D5ba",
    contact,
    description,
  });
};
