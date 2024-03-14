import Storage from "src/utils/storage";
import * as actionTypes from "../actions/actions";

export const initialState = {
  isOpen: [],
  opened: true,
  mode: "light",
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
  let id;
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id],
      };
    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened,
      };
    case actionTypes.SET_MODE: {
      const newMode = state.mode === "dark" ? "light" : "dark";
      Storage.updateLocalMode(newMode);
      return {
        ...state,
        mode: newMode,
      };
    }
    default:
      return state;
  }
};

export default customizationReducer;
