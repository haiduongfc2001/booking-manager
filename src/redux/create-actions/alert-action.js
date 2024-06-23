import * as actionTypes from "src/redux/actions/Actions";

export const closeAlert = () => ({ type: actionTypes.CLOSE_ALERT });

export const showAlert = (alert) => ({
  type: actionTypes.SHOW_ALERT,
  data: alert,
});
