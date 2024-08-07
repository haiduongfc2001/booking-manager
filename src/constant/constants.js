export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
export const customerAdminServiceV2 = process.env.REACT_APP_CONSUMER_SERVICE;

export const ACCOUNT_TEST = {
  EMAIL_1: "haiduongfc2001@gmail.com",
  PASSWORD_1: "123456Aa",
  EMAIL_2: "admin@gmail.com",
  PASSWORD_2: "123456Aa",
};

/**
 * Toast Popup
 */
export const TOAST_KIND = {
  // Success
  SUCCESS: "success",
  SUCCESS_TITLE: "Success",
  SUCCESS_SEVERITY: "success",

  // Error
  ERROR: "error",
  ERROR_TITLE: "Error",
  ERROR_SEVERITY: "error",
};

export const TOAST_MESSAGE = {
  LOGIN_SUCCESS: "Login Successfully!",
  LOGOUT_SUCCESS: "Logout Successfully!",
  SESSION_TIMEOUT: "Session Timeout!",
  INVALID_USERNAME_PASSWORD: "Invalid username or password!",
  FILTER_ERROR: "Filter Error!",
  SERVER_ERROR: "Server Error!",
};

/**
 * Screen Title
 */
export const SCREEN_TITLE = {};

/**
 * Screen API
 */
export const API = {
  LOGIN: {
    ADMIN: "AdminLogin",
    STAFF: "StaffLogin",
  },
  CUSTOMER: {
    GET_ALL_CUSTOMERS: "GetAllCustomers",
    GET_CUSTOMER_BY_ID: "GetCustomerById",
    CREATE_CUSTOMER: "CreateCustomer",
    DELETE_CUSTOMER: "DeleteCustomer",
    UPDATE_CUSTOMER: "UpdateCustomer",
    GET_CUSTOMER_STATS: "GetCustomerStats",
  },
  HOTEL: {
    GET_ALL_HOTELS: "GetAllHotels",
    GET_TOTAL_HOTELS: "GetTotalHotels",
    GET_HOTEL_LIST: "GetHotelList",
    GET_HOTEL_BY_ID: "GetHotelById",
    CREATE_HOTEL: "CreateHotel",
    DELETE_HOTEL: "DeleteHotel",
    UPDATE_HOTEL: "UpdateHotel",
    DELETE_HOTEL_IMAGE_BY_ID: "DeleteHotelImageById",
    UPDATE_HOTEL_IMAGE_BY_ID: "UpdateHotelImageById",
    CREATE_HOTEL_IMAGE: "CreateHotelImage",
    AMENITY: {
      GET_ALL_AMENITIES: "GetAllAmenities",
      GET_AMENITY_BY_ID: "GetAmenityById",
      CREATE_AMENITY: "CreateAmenity",
      DELETE_AMENITY: "DeleteAmenity",
      UPDATE_AMENITY: "UpdateAmenity",
    },
    STAFF: {
      GET_ALL_STAFFS: "GetAllStaffs",
      GET_ALL_STAFFS_BY_HOTEL_ID: "GetAllStaffsByHotelId",
      GET_STAFF_BY_ID: "GetStaffById",
      CREATE_STAFF: "CreateStaff",
      DELETE_STAFF: "DeleteStaff",
      UPDATE_STAFF: "UpdateStaff",
    },
    POLICY: {
      GET_ALL_POLICIES_BY_HOTEL_ID: "GetAllPoliciesByHotelId",
      GET_POLICY_BY_ID: "GetPolicyById",
      CREATE_POLICY: "CreatePolicy",
      CREATE_MULTIPLE_POLICIES: "CreateMultiplePolicies",
      DELETE_POLICY: "DeletePolicy",
      UPDATE_POLICY: "UpdatePolicy",
    },
  },
  ROOM: {
    GET_ALL_ROOMS_BY_HOTEL_ID: "GetAllRoomsByHotelId",
    GET_ROOM_BY_ID: "GetRoomById",
    CREATE_ROOM: "CreateRoom",
    DELETE_ROOM: "DeleteRoom",
    UPDATE_ROOM: "UpdateRoom",
    DELETE_ROOM_IMAGE_BY_ID: "DeleteRoomImageById",
    UPDATE_ROOM_IMAGE_BY_ID: "UpdateRoomImageById",
    CREATE_ROOM_IMAGES: "CreateRoomImages",
  },
  ROOM_TYPE: {
    GET_ALL_ROOM_TYPES_BY_HOTEL_ID: "GetAllRoomTypesByHotelId",
    GET_ALL_AVAILABLE_ROOM_TYPES_BY_HOTEL_ID: "GetAllAvailableRoomTypesByHotelId",
    GET_ROOM_TYPE_BY_ID: "GetRoomTypeById",
    CREATE_ROOM_TYPE: "CreateRoomType",
    DELETE_ROOM_TYPE: "DeleteRoomType",
    UPDATE_ROOM_TYPE: "UpdateRoomType",
    DELETE_ROOM_TYPE_IMAGE_BY_ID: "DeleteRoomTypeImageById",
    UPDATE_ROOM_TYPE_IMAGE_BY_ID: "UpdateRoomTypeImageById",
    CREATE_ROOM_TYPE_IMAGES: "CreateRoomTypeImages",
    CREATE_ROOM_TYPE_IMAGE: "CreateRoomTypeImage",
    UPDATE_ROOM_TYPE_IMAGE: "UpdateRoomTypeImage",
    BED: {
      GET_ALL_BEDS: "GetAllBeds",
      GET_BED_BY_ID: "GetBedById",
      CREATE_BED: "CreateBed",
      DELETE_BED: "DeleteBed",
      UPDATE_BED: "UpdateBed",
    },
    AMENITY: {
      GET_ALL_AMENITIES: "GetAllAmenities",
      GET_AMENITY_BY_ID: "GetAmenityById",
      CREATE_AMENITY: "CreateAmenity",
      DELETE_AMENITY: "DeleteAmenity",
      UPDATE_AMENITY: "UpdateAmenity",
    },
    PROMOTION: {
      GET_ALL_PROMOTIONS: "GetAllPromotions",
      GET_ALL_PROMOTIONS_BY_ROOM_TYPE_ID: "GetAllPromotionsByRoomTypeId",
      GET_PROMOTION_BY_ID: "GetPromotionById",
      CREATE_PROMOTION: "CreatePromotion",
      DELETE_PROMOTION: "DeletePromotion",
      UPDATE_PROMOTION: "UpdatePromotion",
    },
  },
  ADDRESS: {
    GET_ALL_PROVINCES: "GetAllProvinces",
    GET_ALL_DISTRICTS_BY_PROVINCE_ID: "GetAllDistrictsByProvinceId",
    GET_ALL_WARDS_BY_DISTRICT_ID: "GetAllWardsByDistrictId",
  },
  BOOKING: {
    GET_ALL_BOOKINGS: "GetAllBookings",
    GET_ALL_BOOKINGS_BY_HOTEL_ID: "GetAllBookingsByHotelId",
    GET_BOOKING_BY_ID: "GetBookingById",
    GET_BOOKING_STATS: "GetBookingStats",
    GET_TOTAL_BOOKING_REVENUE: "GetTotalBookingRevenue",
    GET_TOTAL_BOOKING_REVENUE_BY_HOTEL_ID: "GetTotalBookingRevenueByHotelId",
    GET_MONTH_BOOKING_REVENUE: "GetMonthlyBookingRevenue",
    GET_MONTH_BOOKING_REVENUE_BY_HOTEL_ID: "GetMonthlyBookingRevenueByHotelId",
    CREATE_BOOKING: "CreateBooking",
    DELETE_BOOKING: "DeleteBooking",
    UPDATE_BOOKING: "UpdateBooking",
  },
  REVIEW: {
    GET_ALL_REVIEWS: "GetAllReviews",
    GET_HOTEL_REVIEWS: "GetHotelReviews",
    GET_ALL_REVIEWS_BY_HOTEL_ID: "GetAllReviewsByHotelId",
    GET_REVIEW_BY_ID: "GetReviewById",
    CREATE_REVIEW: "CreateReview",
    CREATE_REPLY_REVIEW: "CreateReplyReview",
    DELETE_REVIEW: "DeleteReview",
    UPDATE_REVIEW: "UpdateReview",
    UPDATE_REPLY_REVIEW: "UpdateReplyReview",
    DELETE_REPLY_REVIEW: "DeleteReplyReview",
  },
};

/**
 * Status code of API Response
 */
export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Table Paging
 */
export const DATAGRID_OPTIONS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25],
  ROW_HEIGHT: 60,
  TABLE_HEIGHT_5_ITEMS: 420,
  TABLE_HEIGHT_10_ITEMS: 720,
};

export const PAGINATION = {
  INITIAL_PAGE: 1,
  PAGE_SIZE: 10,
};

/**
 * Image
 */
export const IMAGE = {
  MAX_NUMBER_OF_IMAGES: 5,
  MAX_FILE_SIZE: 100000,
};

export const ROLE = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  RECEPTIONIST: "RECEPTIONIST",
};

export const HOTEL_ID_FAKE = 1;
export const MANAGER_ID_FAKE = 21;
export const RECEPTIONIST_ID_FAKE = 22;
export const ADMIN_ID_FAKE = 1;

export const ROOM_STATUS = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
};

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

export const POLICY = {
  SURCHARGE_RATES: "SURCHARGE_RATES",
  TAX: "TAX",
  SERVICE_FEE: "SERVICE_FEE",
  CHECK_IN_TIME: "CHECK_IN_TIME",
  CHECK_OUT_TIME: "CHECK_OUT_TIME",
};

export const DISCOUNT_TYPE = {
  PERCENTAGE: "PERCENTAGE",
  FIXED_AMOUNT: "FIXED_AMOUNT",
};

export const DISCOUNT_TYPE_TRANSLATE = {
  PERCENTAGE: "Phần trăm tiền phòng",
  FIXED_AMOUNT: "Khoản tiền cố định",
};

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
  EXPIRED: "EXPIRED",
};

export const REFUND_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export const RATING_CATEGORIES = {
  AMAZING: "Tuyệt vời",
  VERY_GOOD: "Rất tốt",
  GOOD: "Tốt",
  SATISFIED: "Hài lòng",
  UNSATISFIED: "Không hài lòng",
};
