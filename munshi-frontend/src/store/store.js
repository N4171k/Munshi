import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import uiReducer from "./slices/uiSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        ui: uiReducer
    },
});

export default store;
