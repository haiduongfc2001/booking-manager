import * as CommonService from "./common-service";

const prePath = "/booking";

export const GetAllBookings = async () => {
  return CommonService.getRequest(`${prePath}/getAllBookings`);
};

export const GetAllBookingsByHotelId = async ({ hotel_id, page, size }) => {
  return CommonService.getRequest(
    `${prePath}/${hotel_id}/getAllBookingsByHotelId?page=${page}&size=${size}`
  );
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

export const UpdateBooking = async ({ booking_id, status }) => {
  return CommonService.postRequest(`${prePath}/${booking_id}/updateBooking`, {
    status,
  });
};

export const DeleteBooking = async ({ booking_id }) => {
  return CommonService.deleteRequest(`${prePath}/${booking_id}/deleteBooking`, {});
};

export const GetBookingStats = async () => {
  return CommonService.getRequest(`${prePath}/getBookingStats`);
};

export const GetTotalBookingRevenue = async () => {
  return CommonService.getRequest(`${prePath}/getTotalBookingRevenue`);
};

export const GetTotalBookingRevenueByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/getTotalBookingRevenueByHotelId/${hotel_id}`);
};

export const GetMonthlyBookingRevenue = async () => {
  return CommonService.getRequest(`${prePath}/getMonthlyBookingRevenue`);
};

export const GetMonthlyBookingRevenueByHotelId = async ({ hotel_id }) => {
  return CommonService.getRequest(`${prePath}/getMonthlyBookingRevenueByHotelId/${hotel_id}`);
};
