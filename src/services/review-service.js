import * as CommonService from "./common-service";

const prePath = "/review";

export const GetAllReviews = async () => {
  return CommonService.getRequest(`${prePath}/getAllReviews`);
};

export const GetAllReviewsByHotelId = async ({ hotel_id, page, size }) => {
  return CommonService.getRequest(
    `${prePath}/${hotel_id}/getAllReviewsByHotelId?page=${page}&size=${size}`
  );
};

export const DeleteReview = async ({ review_id }) => {
  return CommonService.deleteRequest(`${prePath}/${review_id}/deleteReview`, {});
};

export const CreateReplyReview = async ({ review_id, staff_id, reply }) => {
  return CommonService.postRequest(`${prePath}/${review_id}/createReplyReview`, {
    staff_id,
    reply,
  });
};

export const GetReviewById = async ({ review_id }) => {
  return CommonService.getRequest(`${prePath}/${review_id}/getReviewById`);
};

export const UpdateReplyReview = async ({ reply_review_id, review_id, staff_id, reply }) => {
  return CommonService.patchRequest(`${prePath}/updateReplyReview/${reply_review_id}`, {
    review_id,
    staff_id,
    reply,
  });
};

export const DeleteReplyReview = async ({ reply_review_id }) => {
  return CommonService.deleteRequest(`${prePath}/deleteReplyReview/${reply_review_id}`, {});
};

export const GetHotelReviews = async ({ hotel_id, page, size }) => {
  return CommonService.getRequest(
    `${prePath}/getHotelReviews/${hotel_id}?page=${page}&size=${size}`
  );
};
