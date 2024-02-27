import * as actionTypes from "../actions/Actions";

export const setAllCustomers = (allCustomers) => ({
  type: actionTypes.SET_ALL_CUSTOMERS,
  allCustomers,
});
