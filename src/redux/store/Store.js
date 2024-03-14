import { composeWithDevTools } from "@redux-devtools/extension";
import { legacy_createStore as createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import Reducer from "../reducers/reducer";

// ==============================|| REDUX - MAIN STORE ||============================== //

const persistConfig = {
  key: "__next",
  storage,
};

const persistedReducer = persistReducer(persistConfig, Reducer);

const store = createStore(persistedReducer, composeWithDevTools());
const persistor = persistStore(store);

export { persistor, store };
