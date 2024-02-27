import { combineReducers } from "redux";
import alertReducer from "./AlertReducer";
import customizationReducer from "./CustomizationReducer";
import loadingReducer from "./LoadingReducer";
import tableReducer from "./TableReducer";

// ==============================|| COMBINE REDUCER ||============================== //

const Reducer = combineReducers({
  alert: alertReducer,
  loading: loadingReducer,
  customization: customizationReducer,
  table: tableReducer,
});

export default Reducer;
