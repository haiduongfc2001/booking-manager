// reducers/auth-reducer.js

import * as actionTypes from "../actions/Actions";

export const initialState = {
  lastLoginTime: null,
  user_id: null,
  email: null,
  avatar: null,
  role: null,
  isLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        role: action.payload.role,
        user_id: action.payload.user_id,
        email: action.payload.email,
        avatar: action.payload.avatar,
        lastLoginTime: action.payload.lastLoginTime,
        isLoggedIn: action.payload.isLoggedIn,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user_id: null,
        email: null,
        avatar: null,
        role: null,
        lastLoginTime: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default authReducer;
