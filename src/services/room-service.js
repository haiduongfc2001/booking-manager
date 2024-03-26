import * as CommonService from "./common-service";

const prePath = "/hotel";

export const GetAllRoomsByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/room/getAllRoomsByHotelId`);
};

export const GetRoomById = async ({ hotel_id, room_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/room/${room_id}/getRoomById`);
};

export const CreateRoom = async ({ hotel_id, formData }) => {
  return CommonService.postRequest(`${prePath}/${hotel_id}/room/createRoom`, formData);
};

export const DeleteRoom = async ({ hotel_id, room_id }) => {
  return CommonService.deleteRequest(`${prePath}/${hotel_id}/room/${room_id}/deleteRoom`, {});
};

export const EditRoom = async ({ hotel_id, room_id, formData }) => {
  return CommonService.patchRequest(`${prePath}/${hotel_id}/room/${room_id}/updateRoom`, formData);
};

export const UpdateRoomImageById = async ({
  hotel_id,
  room_id,
  room_image_id,
  caption,
  is_primary,
}) => {
  return CommonService.patchRequest(
    `${prePath}/${hotel_id}/room/${room_id}/image/${room_image_id}/updateRoomImageById`,
    {
      caption,
      is_primary,
    }
  );
};

export const DeleteRoomImageById = async ({ hotel_id, room_id, room_image_id }) => {
  return CommonService.deleteRequest(
    `${prePath}/${hotel_id}/room/${room_id}/image/${room_image_id}/deleteImage`,
    {}
  );
};

export const CreateRoomImages = async ({ hotel_id, room_id, formData }) => {
  return CommonService.postRequest(
    `${prePath}/${hotel_id}/room/${room_id}/createRoomImages`,
    formData
  );
};
