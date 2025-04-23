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
import { Airline } from '../../services/firebase/airline.service';

interface AirlineFormData {
  name: string;
}

interface AddEditAirlineProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: AirlineFormData) => Promise<void>;
  initialData?: Airline;
  mode: 'add' | 'edit';
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
});

const AddEditAirline: React.FC<AddEditAirlineProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const initialValues: AirlineFormData = {
    name: initialData?.name || '',
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        {mode === 'add' ? 'Add New Airline' : 'Edit Airline'}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(values);
          } finally {
            setSubmitting(false);
          }
        }}
        enableReinitialize
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Field
                  component={TextField}
                  name="name"
                  label="Airline Name"
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button 
                type="submit"
                variant="contained"
                disabled={isSubmitting || !dirty || !isValid}
              >
                {mode === 'add' ? 'Add Airline' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEditAirline; 