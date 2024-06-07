import * as CommonService from "./common-service";

const prePath = "/hotel";

export const GetAllRoomsByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/getAllRoomsByHotelId`);
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

export const DeleteRoomType = async ({ hotel_id, room_type_id }) => {
  return CommonService.deleteRequest(
    `${prePath}/${hotel_id}/room-type/${room_type_id}/deleteRoomType`,
    {}
  );
};

export const GetRoomTypeById = async ({ hotel_id, room_type_id }) => {
  return CommonService.getRequest(
    `${prePath}/${hotel_id}/room_type/${room_type_id}/getRoomTypeById`
  );
};

// Bed of room type
export const DeleteBed = async ({ bed_id }) => {
  return CommonService.deleteRequest(`${prePath}/room-type/${bed_id}/deleteBed`, {});
};

export const CreateBed = async ({ room_type_id, type, description, quantity }) => {
  return CommonService.postRequest(`${prePath}/room-type/createBed`, {
    room_type_id,
    type,
    description,
    quantity,
  });
};

export const EditBed = async ({ bed_id, room_type_id, type, description, quantity }) => {
  return CommonService.patchRequest(`${prePath}/room-type/${bed_id}/updateBed`, {
    room_type_id,
    type,
    description,
    quantity,
  });
};
