import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from '@mui/material';
import { TextField } from 'formik-mui';
import { Customer } from '../../models/customer.model';
import { customerService } from '../../services/firebase/customer.service';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface CustomerFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

interface AddEditCustomerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (customer: Customer) => void;
  initialData?: Customer;
  mode: 'add' | 'edit';
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  cpf: Yup.string()
    .required('CPF is required')
    .matches(/^\d{11}$/, 'CPF must be exactly 11 digits'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: Yup.string()
    .required('Phone is required')
    .matches(
      /^(\+\d{1,3}[- ]?)?\d{10,}$/,
      'Please enter a valid phone number'
    ),
});

const initialFormData: CustomerFormData = {
  name: '',
  cpf: '',
  email: '',
  phone: '',
};

const AddEditCustomer: React.FC<AddEditCustomerProps> = ({
  open,
  onClose,
  onSuccess,
  initialData,
  mode
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (
    values: CustomerFormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!user) return;

    try {
      if (mode === 'edit' && initialData) {
        await customerService.updateCustomer(initialData.id, values, user);
        enqueueSnackbar(t('customers.notifications.updated'), { severity: 'success' });
      } else {
        const newCustomer = await customerService.addCustomer(values, user);
        enqueueSnackbar(t('customers.notifications.added'), { severity: 'success' });
        onSuccess?.(newCustomer);
      }
      onClose();
    } catch (error: any) {
      enqueueSnackbar(error.message || t('common.error'), { severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        {mode === 'add' ? t('customers.add') : t('customers.edit')}
      </DialogTitle>
      <Formik
        initialValues={initialData || initialFormData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form>
            <DialogContent>
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Field
                  component={TextField}
                  name="name"
                  label={t('customers.name')}
                  fullWidth
                  variant="outlined"
                />
                
                <Field
                  component={TextField}
                  name="cpf"
                  label={t('customers.cpf')}
                  fullWidth
                  variant="outlined"
                  disabled={mode === 'edit'}
                />
                
                <Field
                  component={TextField}
                  name="email"
                  label={t('customers.email')}
                  fullWidth
                  variant="outlined"
                  type="email"
                />
                
                <Field
                  component={TextField}
                  name="phone"
                  label={t('customers.phone')}
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit"
                variant="contained"
                disabled={isSubmitting || !dirty || !isValid}
              >
                {isSubmitting ? t('common.saving') : mode === 'add' ? t('customers.add') : t('common.save')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEditCustomer; 