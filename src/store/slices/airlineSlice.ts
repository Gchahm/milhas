import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Airline } from '../../services/firebase/airline.service';

interface AirlineState {
  airlines: Airline[];
  loading: boolean;
  error: string | null;
}

const initialState: AirlineState = {
  airlines: [],
  loading: false,
  error: null,
};

const airlineSlice = createSlice({
  name: 'airlines',
  initialState,
  reducers: {
    setAirlines: (state, action: PayloadAction<Airline[]>) => {
      state.airlines = action.payload;
    },
    addAirline: (state, action: PayloadAction<Airline>) => {
      state.airlines.push(action.payload);
    },
    updateAirline: (state, action: PayloadAction<Airline>) => {
      const index = state.airlines.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.airlines[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setAirlines, 
  addAirline, 
  updateAirline, 
  setLoading, 
  setError 
} = airlineSlice.actions;
export default airlineSlice.reducer; 