import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk"; // Fix: Use named import
import studentReducer from "./reducers/studentReducer";

const rootReducer = combineReducers({
  student: studentReducer, 
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

