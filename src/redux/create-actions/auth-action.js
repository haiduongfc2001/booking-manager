import * as actionTypes from "../actions/Actions";

export const login = (role) => ({
  type: actionTypes.LOGIN,
  payload: { lastLoginTime: new Date(), role },
});

export const logout = () => ({
  type: actionTypes.LOGOUT,
});
