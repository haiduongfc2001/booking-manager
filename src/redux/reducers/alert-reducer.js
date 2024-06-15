import * as actionTypes from "../actions/Actions";

export const initialState = {
  data: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
    isOpen: false,
    severity: "error",
    title: "Default Alert",
    message: "This is an error",
  },
};

// ==============================|| Alert REDUCER ||============================== //

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ALERT:
      return {
        ...state,
        data: {
          ...state.data,
          isOpen: true,
          anchorOrigin: action.data.anchorOrigin,
          severity: action.data.severity,
          title: action.data.title,
          message: action.data.message,
        },
      };
    case actionTypes.CLOSE_ALERT:
      return {
        ...state,
        data: {
          ...state.data,
          isOpen: false,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          severity: "error",
          title: "Default Alert",
          message: "This is an error",
        },
      };
    default:
      return state;
  }
};

export default alertReducer;
