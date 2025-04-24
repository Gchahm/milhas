import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Grid,
  TextField as MuiTextField // Alias to avoid clash with Formik's Field
} from '@mui/material';
import { TextField } from 'formik-mui'; // Formik integration for TextField
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { Sale } from '../../models/sale.model';
import { format } from 'date-fns'; // For date formatting if needed outside DatePicker

// Assuming Airline and Customer types exist
// import { Airline } from '../../services/firebase/airline.service';
// import { Customer } from '../../models/customer.model'; // Assuming customer model exists

// Simplified input data type (without id, createdAt, updatedAt)
type SaleFormData = Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>;

interface AddEditSaleProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: SaleFormData) => Promise<void>;
  initialData?: Sale; // Use full Sale model here for initial values
  mode: 'add' | 'edit';
  // TODO: Pass airlines and customers lists for dropdowns
  // airlines: Airline[];
  // customers: Customer[];
}

const AddEditSale: React.FC<AddEditSaleProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
  // airlines,
  // customers,
}) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    date: Yup.date()
      .required(t('Date is required'))
      .typeError(t('Invalid Date')), // Handle invalid date input
    customerId: Yup.string()
        .required(t('Customer is required')),
    airlineId: Yup.string()
        .required(t('Airline is required')),
    value: Yup.number()
      .required(t('Value is required'))
      .positive(t('Value must be positive'))
      .typeError(t('Value must be a number')),
    cost: Yup.number()
      .required(t('Cost is required'))
      .min(0, t('Cost cannot be negative'))
      .typeError(t('Cost must be a number')),
  });

  const initialValues: SaleFormData = {
    date: initialData?.date || new Date(),
    customerId: initialData?.customerId || '',
    airlineId: initialData?.airlineId || '',
    value: initialData?.value || 0,
    cost: initialData?.cost || 0,
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {mode === 'add' ? t('Add New Sale') : t('Edit Sale')}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await onSubmit(values);
            resetForm(); // Reset form on successful submission
            // onClose is called within the parent's handleSubmit success path
          } catch (error) {
            // Error handled (snackbar) in parent component
          } finally {
            setSubmitting(false);
          }
        }}
        enableReinitialize // Important to update form when initialData changes for edit
      >
        {({ isSubmitting, dirty, isValid, setFieldValue, values }) => (
          <Form>
            <DialogContent>
              <Box sx={{ pt: 1 }}> {/* Reduced padding top */}
                <Grid container spacing={2}>
                   <Grid size={12}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                       <DatePicker
                         label={t('Sale Date')}
                         value={values.date}
                         onChange={(newValue) => setFieldValue('date', newValue)}
                         slotProps={{
                            textField: (params) => ({
                                name: "date",
                                fullWidth: true,
                                variant: "outlined",
                            })
                         }}
                         />
                     </LocalizationProvider>
                   </Grid>
                  <Grid size={{xs:12, sm:6}}>
                    {/* TODO: Replace with Select/Autocomplete for Customers */}
                    <Field
                      component={TextField}
                      name="customerId"
                      label={t('Customer ID')} // TEMP Label
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6}}>
                     {/* TODO: Replace with Select/Autocomplete for Airlines */}
                     <Field
                       component={TextField}
                       name="airlineId"
                       label={t('Airline ID')} // TEMP Label
                       fullWidth
                       variant="outlined"
                     />
                   </Grid>
                   <Grid size={{xs:12, sm:6}}>
                   <Field
                      component={TextField}
                      name="value"
                      label={t('Sale Value')}
                      type="number"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6}}>
                    <Field
                      component={TextField}
                      name="cost"
                      label={t('Sale Cost')}
                      type="number"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
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
                {isSubmitting ? t('Saving...') : mode === 'add' ? t('Add Sale') : t('Save Changes')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEditSale; 