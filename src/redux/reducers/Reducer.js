import { combineReducers } from "redux";
import alertReducer from "./alert-reducer";
import customizationReducer from "./customization-reducer";
import loadingReducer from "./loading-reducer";

// ==============================|| COMBINE REDUCER ||============================== //

const Reducer = combineReducers({
  alert: alertReducer,
  loading: loadingReducer,
  customization: customizationReducer,
});

export default Reducer;
