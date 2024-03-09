export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
export const customerAdminServiceV2 = process.env.REACT_APP_CONSUMER_SERVICE;

export const ACCOUNT_TEST = {
  EMAIL_1: "haiduongfc2001@gmail.com",
  PASSWORD_1: "Password123456",
  EMAIL_2: "admin@gmail.com",
  PASSWORD_2: "Password123456",
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
  CUSTOMER: {
    GET_ALL_CUSTOMERS: "GetAllCustomers",
    GET_CUSTOMER_BY_ID: "GetCustomerById",
    CREATE_CUSTOMER: "CreateCustomer",
    DELETE_CUSTOMER: "DeleteCustomer",
    EDIT_CUSTOMER: "EditCustomer",
  },
  HOTEL: {
    GET_ALL_HOTELS: "GetAllHotels",
    GET_HOTEL_BY_ID: "GetHotelById",
    CREATE_HOTEL: "CreateHotel",
    DELETE_HOTEL: "DeleteHotel",
    EDIT_HOTEL: "EditHotel",
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
