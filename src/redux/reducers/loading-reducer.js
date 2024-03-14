import * as actionTypes from "../actions/actions";

export const initialState = {
  data: {
    isLoading: null,
  },
};

// ==============================|| Loading REDUCER ||============================== //

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_LOADING_API:
      return {
        ...state,
        data: {
          ...state.data,
          isLoading: true,
        },
      };
    case actionTypes.CLOSE_LOADING_API:
      return {
        ...state,
        data: {
          ...state.data,
          isLoading: false,
        },
      };
    default:
      return state;
  }
};

export default loadingReducer;
