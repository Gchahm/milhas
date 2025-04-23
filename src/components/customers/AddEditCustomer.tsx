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
import { Customer } from '../../services/firebase/customer.service';

interface CustomerFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

interface AddEditCustomerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: CustomerFormData) => Promise<void>;
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
  onSubmit,
  initialData,
  mode
}) => {
  const handleSubmit = async (
    values: CustomerFormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
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
        {mode === 'add' ? 'Add New Customer' : 'Edit Customer'}
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
                  label="Name"
                  fullWidth
                  variant="outlined"
                />
                
                <Field
                  component={TextField}
                  name="cpf"
                  label="CPF"
                  fullWidth
                  variant="outlined"
                  disabled={mode === 'edit'}
                />
                
                <Field
                  component={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  type="email"
                />
                
                <Field
                  component={TextField}
                  name="phone"
                  label="Phone"
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
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained"
                disabled={isSubmitting || !dirty || !isValid}
              >
                {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Customer' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEditCustomer; 