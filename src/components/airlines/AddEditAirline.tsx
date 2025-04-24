import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { TextField } from 'formik-mui';
import { Airline, airlineService } from '../../services/firebase/airline.service';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface AirlineFormData {
  name: string;
}

interface AddEditAirlineProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (airline: Airline) => void;
  initialData?: Airline;
  mode: 'add' | 'edit';
}

const AddEditAirline: React.FC<AddEditAirlineProps> = ({
  open,
  onClose,
  onSuccess,
  initialData,
  mode
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state: RootState) => state.auth);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('Name is required'))
      .min(2, t('Name must be at least 2 characters'))
      .max(50, t('Name must be less than 50 characters'))
  });

  const initialValues: AirlineFormData = {
    name: initialData?.name || '',
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (values: AirlineFormData) => {
    if (!user) return;

    try {
      if (mode === 'edit' && initialData) {
        await airlineService.updateAirline(initialData.id, values.name, user);
        enqueueSnackbar(t('airlines.notifications.updated'), { severity: 'success' });
      } else {
        const newAirline = await airlineService.addAirline(values.name, user);
        enqueueSnackbar(t('airlines.notifications.added'), { severity: 'success' });
        onSuccess?.(newAirline);
      }
      handleClose();
    } catch (error: any) {
      enqueueSnackbar(error.message || t('common.error'), { severity: 'error' });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        {mode === 'add' ? t('Add New Airline') : t('Edit Airline')}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Field
                  component={TextField}
                  name="name"
                  label={t('Airline Name')}
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={isSubmitting}>{t('Cancel')}</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !dirty || !isValid}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? t('Saving...') : mode === 'add' ? t('Add Airline') : t('Save Changes')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEditAirline; 