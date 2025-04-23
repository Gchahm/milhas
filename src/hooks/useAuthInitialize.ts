import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { authService } from '../services/firebase/auth.service';

export const useAuthInitialize = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = authService.initializeAuthListener((user) => {
      dispatch(setUser(user));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);
}; 