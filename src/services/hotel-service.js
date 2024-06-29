import * as CommonService from "./common-service";

const prePath = "/hotel";

export const GetAllHotels = async () => {
  return CommonService.getRequest(`${prePath}/getAllHotels`);
};

export const GetTotalHotels = async () => {
  return CommonService.getRequest(`${prePath}/getTotalHotels`);
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

export const UpdateHotel = async ({
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

// Amenity of hotel
export const DeleteAmenity = async ({ hotel_id, amenity_id }) => {
  return CommonService.deleteRequest(
    `${prePath}/${hotel_id}/amenity/${amenity_id}/deleteHotelAmenity`,
    {}
  );
};

export const CreateAmenity = async ({ hotel_id, amenity }) => {
  return CommonService.postRequest(`${prePath}/${hotel_id}/amenity/createHotelAmenity`, {
    amenity,
  });
};

export const UpdateAmenity = async ({ amenity_id, hotel_id, amenity }) => {
  return CommonService.patchRequest(`${prePath}/${amenity_id}/updateAmenity`, {
    hotel_id,
    amenity,
  });
};

// Policy of hotel
export const GetAllPoliciesByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/policy/getAllPoliciesByHotelId`);
};

export const CreatePolicy = async ({ hotel_id, type, value, description }) => {
  return CommonService.postRequest(`${prePath}/${hotel_id}/policy/createPolicy`, {
    type,
    value,
    description,
  });
};

export const CreateMultiplePolicies = async ({ hotel_id, policies }) => {
  return CommonService.postRequest(`${prePath}/${hotel_id}/policy/createMultiplePolicies`, {
    policies,
  });
};

export const DeletePolicy = async ({ hotel_id, policy_id }) => {
  return CommonService.deleteRequest(`${prePath}/${hotel_id}/policy/${policy_id}/deletePolicy`, {});
};

export const UpdatePolicy = async ({ policy_id, hotel_id, type, value, description }) => {
  return CommonService.patchRequest(`${prePath}/${hotel_id}/policy/${policy_id}/updatePolicy`, {
    type,
    value,
    description,
  });
};
