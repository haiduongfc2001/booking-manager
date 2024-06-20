import { composeWithDevTools } from "@redux-devtools/extension";
import { legacy_createStore as createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import Reducer from "../reducers/Reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ==============================|| REDUX - MAIN STORE ||============================== //

const persistConfig = {
  key: "__next",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, Reducer);

const store = createStore(persistedReducer, composeWithDevTools());
const persistor = persistStore(store);

export { persistor, store };
