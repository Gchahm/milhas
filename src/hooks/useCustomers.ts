import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customerService } from '../services/firebase/customer.service';
import { setCustomers } from '../store/slices/customerSlice';
import { RootState } from '../store';

export const useCustomers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Subscribe to customers
    const unsubscribe = customerService.subscribeToCustomers(
      user.uid,
      (customers) => {
        dispatch(setCustomers(customers));
      }
    );

    // Cleanup subscription on unmount or user change
    return () => {
      unsubscribe();
    };
  }, [dispatch, user]);
}; 