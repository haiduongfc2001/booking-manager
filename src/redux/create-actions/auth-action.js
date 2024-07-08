import * as actionTypes from "../actions/Actions";

export const login = ({ role, user_id, hotel_id, email, full_name, avatar }) => ({
  type: actionTypes.LOGIN,
  payload: {
    lastLoginTime: new Date(),
    role,
    user_id,
    hotel_id,
    email,
    full_name,
    avatar,
    isLoggedIn: true,
  },
});

export const logout = () => ({
  type: actionTypes.LOGOUT,
});
