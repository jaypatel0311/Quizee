// slices/index.js
import { combineReducers } from "redux";
import storeDataReducer from "./storeDataSlice";

const rootReducer = combineReducers({
  storeData: storeDataReducer,
});

export default rootReducer;
