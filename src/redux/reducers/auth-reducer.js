import * as actionTypes from "../actions/Actions";

export const initialState = {
  lastLoginTime: null,
  role: null,
  isLoggedIn: false,
};

// ==============================|| Auth REDUCER ||============================== //

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        role: action.payload.role,
        lastLoginTime: action.payload.lastLoginTime,
        isLoggedIn: true,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        role: null,
        lastLoginTime: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default authReducer;
