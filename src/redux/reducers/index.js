import noteReducer from "./notes";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
  note: noteReducer,
});

export default rootReducers;