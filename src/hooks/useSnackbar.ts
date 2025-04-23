import { useDispatch } from 'react-redux';
import { showSnackbar, hideSnackbar, SnackbarSeverity } from '../store/slices/snackbarSlice';

export const useSnackbar = () => {
  const dispatch = useDispatch();

  const enqueueSnackbar = (
    message: string,
    options?: {
      severity?: SnackbarSeverity;
      autoHideDuration?: number;
    }
  ) => {
    dispatch(showSnackbar({
      message,
      ...options
    }));
  };

  const closeSnackbar = () => {
    dispatch(hideSnackbar());
  };

  return {
    enqueueSnackbar,
    closeSnackbar
  };
}; 