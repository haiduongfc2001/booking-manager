import * as CommonService from "./common-service";

const prePath = "/hotel";

export const GetAllRoomTypesByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/getAllRoomTypesByHotelId`);
};

export const GetRoomById = async ({ room_type_id, room_id }) => {
  return CommonService.getRequest(
    `${prePath}/room_type/${room_type_id}/room/${room_id}/getRoomById`
  );
};

export const CreateRoom = async ({ room_type_id, number, description }) => {
  return CommonService.postRequest(`${prePath}/room_type/${room_type_id}/room/createRoom`, {
    number,
    description,
  });
};

export const DeleteRoom = async ({ room_type_id, room_id }) => {
  return CommonService.deleteRequest(
    `${prePath}/room_type/${room_type_id}/room/${room_id}/deleteRoom`,
    {}
  );
};

export const UpdateRoom = async ({ room_type_id, room_id, number, description }) => {
  return CommonService.patchRequest(
    `${prePath}/room_type/${room_type_id}/room/${room_id}/updateRoom`,
    {
      number,
      description,
    }
  );
};

export const UpdateRoomTypeImageById = async ({
  room_type_id,
  room_type_image_id,
  caption,
  is_primary,
}) => {
  return CommonService.patchRequest(
    `${prePath}/room/${room_type_id}/image/${room_type_image_id}/updateRoomImageById`,
    {
      caption,
      is_primary,
    }
  );
};

export const DeleteRoomTypeImageById = async ({ room_type_id, room_type_image_id }) => {
  return CommonService.deleteRequest(
    `${prePath}/room/${room_type_id}/image/${room_type_image_id}/deleteImage`,
    {}
  );
};

export const CreateRoomTypeImages = async ({ hotel_id, room_type_id, formData }) => {
  return CommonService.postRequest(
    `${prePath}/${hotel_id}/room/${room_type_id}/createRoomTypeImages`,
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

export const UpdateRoomType = async ({ hotel_id, room_type_id, data }) => {
  return CommonService.patchRequest(
    `${prePath}/${hotel_id}/room_type/${room_type_id}/updateRoomType`,
    data
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

export const UpdateBed = async ({ bed_id, room_type_id, type, description, quantity }) => {
  return CommonService.patchRequest(`${prePath}/room-type/${bed_id}/updateBed`, {
    room_type_id,
    type,
    description,
    quantity,
  });
};

// Amenity of room type
export const DeleteAmenity = async ({ room_type_id, amenity_id }) => {
  return CommonService.deleteRequest(
    `${prePath}/room-type/${room_type_id}/amenity/${amenity_id}/deleteRoomTypeAmenity`,
    {}
  );
};

export const CreateAmenity = async ({ room_type_id, amenity }) => {
  return CommonService.postRequest(
    `${prePath}/room-type/${room_type_id}/amenity/createRoomTypeAmenity`,
    { amenity }
  );
};

export const UpdateAmenity = async ({ amenity_id, room_type_id, amenity }) => {
  return CommonService.patchRequest(`${prePath}/room-type/${amenity_id}/updateAmenity`, {
    room_type_id,
    amenity,
  });
};

// Promotion of room type
export const GetAllPromotionsByRoomTypeId = async ({ room_type_id }) => {
  return CommonService.getRequest(
    `${prePath}/room-type/${room_type_id}/promotion/getAllPromotionsByRoomTypeId`
  );
};

export const CreatePromotion = async ({
  room_type_id,
  code,
  discount_type,
  discount_value,
  start_date,
  end_date,
  is_active,
}) => {
  return CommonService.postRequest(
    `${prePath}/room-type/${room_type_id}/promotion/createPromotion`,
    {
      code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      is_active,
    }
  );
};

export const GetPromotionById = async ({ room_type_id, promotion_id }) => {
  return CommonService.getRequest(
    `${prePath}/room-type/${room_type_id}/promotion/${promotion_id}/getPromotionById`
  );
};

export const UpdatePromotion = async ({
  room_type_id,
  promotion_id,
  code,
  discount_type,
  discount_value,
  start_date,
  end_date,
  is_active,
}) => {
  return CommonService.patchRequest(
    `${prePath}/room-type/${room_type_id}/promotion/${promotion_id}/updatePromotion`,
    {
      code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      is_active,
    }
  );
};

export const DeletePromotion = async ({ room_type_id, promotion_id }) => {
  return CommonService.deleteRequest(
    `${prePath}/room-type/${room_type_id}/promotion/${promotion_id}/deletePromotion`,
    {}
  );
};
