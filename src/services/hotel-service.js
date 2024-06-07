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

export const CreateHotel = async ({
  name,
  province,
  district,
  ward,
  street,
  contact,
  description,
}) => {
  return CommonService.postRequest(`${prePath}/createHotel`, {
    name,
    province,
    district,
    ward,
    street,
    latitude: "190.9876",
    longitude: "200.5432",
    contact,
    description,
  });
};

export const DeleteHotel = async ({ hotel_id }) => {
  return CommonService.deleteRequest(`${prePath}/${hotel_id}/deleteHotel`, {});
};

export const EditHotel = async ({
  hotel_id,
  name,
  province,
  district,
  ward,
  street,
  contact,
  description,
}) => {
  return CommonService.patchRequest(`${prePath}/${hotel_id}/updateHotel`, {
    name,
    province,
    district,
    ward,
    street,
    latitude: "190.9876",
    longitude: "200.5432",
    contact,
    description,
  });
};

export const UpdateHotelImageById = async ({ hotel_id, hotel_image_id, caption, is_primary }) => {
  return CommonService.patchRequest(
    `${prePath}/${hotel_id}/image/${hotel_image_id}/updateHotelImageById`,
    {
      caption,
      is_primary,
    }
  );
};

export const DeleteHotelImageById = async ({ hotel_id, hotel_image_id }) => {
  return CommonService.deleteRequest(
    `${prePath}/${hotel_id}/image/${hotel_image_id}/deleteImage`,
    {}
  );
};

export const CreateHotelImage = async ({ hotel_id, formData }) => {
  return CommonService.postRequest(`${prePath}/${hotel_id}/createHotelImage`, formData);
};
