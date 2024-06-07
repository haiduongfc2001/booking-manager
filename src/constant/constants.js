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
    MANAGER: "ManagerLogin",
    RECEPTIONIST: "ReceptionistLogin",
  },
  CUSTOMER: {
    GET_ALL_CUSTOMERS: "GetAllCustomers",
    GET_CUSTOMER_BY_ID: "GetCustomerById",
    CREATE_CUSTOMER: "CreateCustomer",
    DELETE_CUSTOMER: "DeleteCustomer",
    EDIT_CUSTOMER: "EditCustomer",
  },
  HOTEL: {
    GET_ALL_HOTELS: "GetAllHotels",
    GET_HOTEL_LIST: "GetHotelList",
    GET_HOTEL_BY_ID: "GetHotelById",
    CREATE_HOTEL: "CreateHotel",
    DELETE_HOTEL: "DeleteHotel",
    EDIT_HOTEL: "EditHotel",
    DELETE_HOTEL_IMAGE_BY_ID: "DeleteHotelImageById",
    UPDATE_HOTEL_IMAGE_BY_ID: "UpdateHotelImageById",
    CREATE_HOTEL_IMAGE: "CreateHotelImage",
  },
  ROOM: {
    GET_ALL_ROOMS_BY_HOTEL_ID: "GetAllRoomsByHotelId",
    GET_ROOM_BY_ID: "GetRoomById",
    CREATE_ROOM: "CreateRoom",
    DELETE_ROOM: "DeleteRoom",
    EDIT_ROOM: "EditRoom",
    DELETE_ROOM_IMAGE_BY_ID: "DeleteRoomImageById",
    UPDATE_ROOM_IMAGE_BY_ID: "UpdateRoomImageById",
    CREATE_ROOM_IMAGES: "CreateRoomImages",
  },
  STAFF: {
    GET_ALL_STAFFS: "GetAllStaffs",
    GET_STAFF_BY_ID: "GetStaffById",
    CREATE_STAFF: "CreateStaff",
    DELETE_STAFF: "DeleteStaff",
    EDIT_STAFF: "EditStaff",
  },
  ADDRESS: {
    GET_ALL_PROVINCES: "GetAllProvinces",
    GET_ALL_DISTRICTS_BY_PROVINCE_ID: "GetAllDistrictsByProvinceId",
    GET_ALL_WARDS_BY_DISTRICT_ID: "GetAllWardsByDistrictId",
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
  PAGE_SIZE: 5,
  PAGE_SIZE_OPTIONS: [5, 10, 25],
  ROW_HEIGHT: 60,
  TABLE_HEIGHT: 420,
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
