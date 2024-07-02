import * as actionTypes from "../actions/Actions";

export const login = ({ role, user_id, email, avatar }) => ({
  type: actionTypes.LOGIN,
  payload: { lastLoginTime: new Date(), role, user_id, email, avatar, isLoggedIn: true },
});

export const logout = () => ({
  type: actionTypes.LOGOUT,
});
