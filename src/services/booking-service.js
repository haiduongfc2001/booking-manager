import * as CommonService from "./common-service";

const prePath = "/booking";

export const GetAllBookings = async () => {
  return CommonService.getRequest(`${prePath}/booking/getAllBookings`);
};

export const GetAllBookingsByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/${hotel_id}/getAllBookingsByHotelId`);
};

export const CreateBooking = async ({
  hotel_id,
  code,
  discount_type,
  discount_value,
  start_date,
  end_date,
  is_active,
}) => {
  return CommonService.postRequest(`${prePath}/createBooking`, {
    code,
    discount_type,
    discount_value,
    start_date,
    end_date,
    is_active,
  });
};

export const GetBookingById = async ({ booking_id }) => {
  return CommonService.getRequest(`${prePath}/${booking_id}/getBookingById`);
};

export const UpdateBooking = async ({
  booking_id,
  code,
  discount_type,
  discount_value,
  start_date,
  end_date,
  is_active,
}) => {
  return CommonService.patchRequest(`${prePath}/${booking_id}/updateBooking`, {
    code,
    discount_type,
    discount_value,
    start_date,
    end_date,
    is_active,
  });
};

export const DeleteBooking = async ({ booking_id }) => {
  return CommonService.deleteRequest(`${prePath}/${booking_id}/deleteBooking`, {});
};
