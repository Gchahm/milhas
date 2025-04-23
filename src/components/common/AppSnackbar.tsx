import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { RootState } from '../../store';
import { hideSnackbar } from '../../store/slices/snackbarSlice';

const AppSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity, autoHideDuration } = useSelector(
    (state: RootState) => state.snackbar
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar; 