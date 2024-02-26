import * as actionTypes from "../actions/Actions";

export const closeAlert = () => ({ type: actionTypes.CLOSE_ALERT });

export const showAlert = (alert) => ({
  type: actionTypes.SHOW_ALERT,
  data: alert,
});
