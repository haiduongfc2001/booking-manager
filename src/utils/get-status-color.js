import { BOOKING_STATUS, PAYMENT_STATUS, REFUND_STATUS } from "src/constant/constants";

// Hàm để xác định màu sắc dựa trên trạng thái của booking
export const getBookingStatusColor = (status) => {
  switch (status) {
    case BOOKING_STATUS.PENDING:
      return "warning";
    case BOOKING_STATUS.CONFIRMED:
      return "success";
    case BOOKING_STATUS.CHECKED_IN:
      return "primary";
    case BOOKING_STATUS.CHECKED_OUT:
      return "secondary";
    case BOOKING_STATUS.CANCELLED:
      return "error";
    default:
      return "default";
  }
};

export const getPaymentStatusColor = (status) => {
  switch (status) {
    case PAYMENT_STATUS.PENDING:
      return "warning";
    case PAYMENT_STATUS.COMPLETED:
      return "success";
    case PAYMENT_STATUS.FAILED:
      return "error";
    case PAYMENT_STATUS.CANCELLED:
      return "error";
    case PAYMENT_STATUS.REFUNDED:
      return "info";
    case PAYMENT_STATUS.EXPIRED:
      return "default";
    default:
      return "default";
  }
};

export const getRefundStatusColor = (status) => {
  switch (status) {
    case REFUND_STATUS.PENDING:
    case 3:
      return "warning";
    case REFUND_STATUS.COMPLETED:
    case 1:
      return "success";
    case REFUND_STATUS.FAILED:
    case 2:
      return "error";
    default:
      return "default";
  }
};
