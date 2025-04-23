import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { airlineService } from '../services/firebase/airline.service';
import { setAirlines } from '../store/slices/airlineSlice';
import { RootState } from '../store';

export const useAirlines = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Subscribe to airlines
    const unsubscribe = airlineService.subscribeToAirlines(
      user.uid,
      (airlines) => {
        dispatch(setAirlines(airlines));
      }
    );

    // Cleanup subscription on unmount or user change
    return () => {
      unsubscribe();
    };
  }, [dispatch, user]);
}; 