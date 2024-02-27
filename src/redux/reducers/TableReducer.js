import * as actionTypes from "../actions/Actions";

export const initialState = {
  customer: {
    allCustomers: {},
  },
};

// ==============================|| Table REDUCER ||============================== //

const tableReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ALL_CUSTOMERS:
      return {
        ...state,
        customer: {
          ...state.customer,
          allCustomers: action.allCustomers,
        },
      };

    default:
      return state;
  }
};

export default tableReducer;
