import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
  TextField as MuiTextField,
  Autocomplete
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { Sale } from '../../models/sale.model';
import { Customer } from '../../models/customer.model';
import { Airline } from '../../services/firebase/airline.service';

type SaleFormData = Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>;

interface AddEditSaleProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: SaleFormData) => Promise<void>;
  initialData?: Sale;
  mode: 'add' | 'edit';
  customers: Customer[];
  airlines: Airline[];
}

const AddEditSale: React.FC<AddEditSaleProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
  customers,
  airlines,
}) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    date: Yup.date()
      .required(t('Sale date is required'))
      .typeError(t('Invalid Date')),
    customerId: Yup.string()
        .required(t('Customer selection is required')),
    airlineId: Yup.string()
        .required(t('Airline selection is required')),
    value: Yup.number()
      .required(t('Sale value is required'))
      .positive(t('Value must be a positive number'))
      .typeError(t('Value must be a number')),
    cost: Yup.number()
      .required(t('Sale cost is required'))
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

  const findInitialCustomer = () => customers.find(c => c.id === initialValues.customerId) || null;
  const findInitialAirline = () => airlines.find(a => a.id === initialValues.airlineId) || null;

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
            resetForm();
          } catch (error) {
            // Error handled in parent
          } finally {
            setSubmitting(false);
          }
        }}
        enableReinitialize
      >
        {({ isSubmitting, dirty, isValid, setFieldValue, values, errors, touched }) => (
          <Form>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                   <Grid size={12}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                       <DatePicker
                         label={t('Sale Date')}
                         value={values.date}
                         onChange={(newValue) => setFieldValue('date', newValue)}
                         slotProps={{
                            textField: {
                                name: "date",
                                fullWidth: true,
                                variant: "outlined",
                                error: Boolean(touched.date && errors.date),
                                // helperText: touched.date && errors.date ? errors.date : ' '
                            }
                         }}
                         />
                     </LocalizationProvider>
                   </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        id="customer-autocomplete"
                        options={customers}
                        getOptionLabel={(option) => option.name}
                        value={findInitialCustomer()}
                        onChange={(event, newValue) => {
                            setFieldValue('customerId', newValue ? newValue.id : '');
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => (
                            <MuiTextField
                                {...params}
                                label={t('Customer')}
                                variant="outlined"
                                error={Boolean(touched.customerId && errors.customerId)}
                                helperText={touched.customerId && errors.customerId ? errors.customerId : ' '}
                            />
                        )}
                        />
                  </Grid>
                   <Grid size={{ xs: 12, sm: 6 }}>
                     <Autocomplete
                         id="airline-autocomplete"
                         options={airlines}
                         getOptionLabel={(option) => option.name}
                         value={findInitialAirline()}
                         onChange={(event, newValue) => {
                             setFieldValue('airlineId', newValue ? newValue.id : '');
                         }}
                          isOptionEqualToValue={(option, value) => option.id === value?.id}
                         renderInput={(params) => (
                             <MuiTextField
                                 {...params}
                                 label={t('Airline')}
                                 variant="outlined"
                                 error={Boolean(touched.airlineId && errors.airlineId)}
                                 helperText={touched.airlineId && errors.airlineId ? errors.airlineId : ' '}
                             />
                         )}
                         />
                   </Grid>
                   <Grid size={{ xs: 12, sm: 6 }}>
                     <Field
                       as={MuiTextField}
                       name="value"
                       label={t('Sale Value')}
                       type="number"
                       fullWidth
                       variant="outlined"
                       error={Boolean(touched.value && errors.value)}
                       helperText={touched.value && errors.value ? errors.value : ' '}
                      InputProps={{ inputProps: { min: 0 } }}
                     />
                   </Grid>
                   <Grid size={{ xs: 12, sm: 6 }}>
                     <Field
                       as={MuiTextField}
                       name="cost"
                       label={t('Sale Cost')}
                       type="number"
                       fullWidth
                       variant="outlined"
                       error={Boolean(touched.cost && errors.cost)}
                       helperText={touched.cost && errors.cost ? errors.cost : ' '}
                       InputProps={{ inputProps: { min: 0 } }}
                     />
                   </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={isSubmitting}>{t('Cancel')}</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting || !dirty || !isValid}>
                {isSubmitting ? <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> : null}
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