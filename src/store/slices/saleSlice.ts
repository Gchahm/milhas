import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sale } from '../../models/sale.model';

interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
};

const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSalesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSalesSuccess: (state, action: PayloadAction<Sale[]>) => {
      state.sales = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSalesError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Actions for individual updates can be added if needed,
    // but the subscription often handles this automatically.
    // addSaleOptimistic: (state, action: PayloadAction<Sale>) => {
    //   state.sales.unshift(action.payload); // Add to beginning
    // },
    // updateSaleOptimistic: (state, action: PayloadAction<Sale>) => {
    //   const index = state.sales.findIndex(s => s.id === action.payload.id);
    //   if (index !== -1) {
    //     state.sales[index] = action.payload;
    //   }
    // },
    // removeSaleOptimistic: (state, action: PayloadAction<string>) => {
    //   state.sales = state.sales.filter(s => s.id !== action.payload);
    // }
  },
});

export const {
  setSalesLoading,
  setSalesSuccess,
  setSalesError
} = saleSlice.actions;

export default saleSlice.reducer; 