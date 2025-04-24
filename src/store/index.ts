import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import airlineReducer from './slices/airlineSlice';
import snackbarReducer from './slices/snackbarSlice';
import saleReducer from './slices/saleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    airlines: airlineReducer,
    snackbar: snackbarReducer,
    sales: saleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action paths in serializability check
        // ignoredActions: ['sales/setSalesSuccess'],
        // Ignore these field paths in all actions
        // ignoredActionPaths: ['payload.date', 'payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        // ignoredPaths: ['sales.sales'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 