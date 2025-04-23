import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import airlineReducer from './slices/airlineSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    airlines: airlineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 