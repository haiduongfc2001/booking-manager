import { combineReducers } from "redux";
import alertReducer from "./AlertReducer";
import customizationReducer from "./CustomizationReducer";
import loadingReducer from "./LoadingReducer";

// ==============================|| COMBINE REDUCER ||============================== //

const Reducer = combineReducers({
  alert: alertReducer,
  loading: loadingReducer,
  customization: customizationReducer,
});

export default Reducer;
