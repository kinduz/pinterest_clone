import { combineReducers } from "redux";
import { authReducer } from "./AuthReducer";
import { sectionReducer } from "./sectionReducer";
import { postsReducer } from "./postsReducer";

export const rootReducer = combineReducers({
    auth: authReducer,
    sections: sectionReducer,
    posts: postsReducer,   
})