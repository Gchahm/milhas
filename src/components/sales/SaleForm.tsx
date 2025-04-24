import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField as MuiTextField,
  Autocomplete,
  Typography,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { Sale } from '../../models/sale.model';
import { Customer } from '../../models/customer.model';
import { Airline } from '../../services/firebase/airline.service';
import { saleService } from '../../services/firebase/sale.service';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AddEditCustomer from '../customers/AddEditCustomer';
import AddEditAirline from '../airlines/AddEditAirline';
import AddIcon from '@mui/icons-material/Add';

type SaleFormData = Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>;

const SaleForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state: RootState) => state.auth);
  const { customers, airlines } = useSelector((state: RootState) => ({
    customers: state.customers.customers,
    airlines: state.airlines.airlines
  }));

  const [initialSale, setInitialSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showAirlineDialog, setShowAirlineDialog] = useState(false);

  const validationSchema = Yup.object().shape({
    date: Yup.date().required(t('sales.validation.dateRequired')).typeError(t('sales.validation.invalidDate')),
    customerId: Yup.string().required(t('customers.validation.selectRequired')),
    airlineId: Yup.string().required(t('airlines.validation.selectRequired')),
    value: Yup.number().required(t('sales.validation.valueRequired')).positive(t('sales.validation.valuePositive')).typeError(t('sales.validation.valueType')),
    cost: Yup.number().required(t('sales.validation.costRequired')).min(0, t('sales.validation.costMin')).typeError(t('sales.validation.costType')),
  });

  useEffect(() => {
    if (id && user) {
      const unsubscribe = saleService.subscribeToSales(
        user.uid,
        (sales) => {
          const sale = sales.find(s => s.id === id);
          if (sale) {
            setInitialSale(sale);
          }
          setLoading(false);
        },
        (error) => {
          enqueueSnackbar(error.message, { severity: 'error' });
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [id, user, enqueueSnackbar]);

  const initialValues: SaleFormData = {
    date: initialSale?.date || new Date(),
    customerId: initialSale?.customerId || '',
    airlineId: initialSale?.airlineId || '',
    value: initialSale?.value || 0,
    cost: initialSale?.cost || 0,
  };

  const handleSubmit = async (values: SaleFormData) => {
    if (!user) {
      enqueueSnackbar(t('auth.loginRequired'), { severity: 'error' });
      return;
    }

    try {
      if (id) {
        await saleService.updateSale(id, values, user);
        enqueueSnackbar(t('sales.notifications.updated'), { severity: 'success' });
      } else {
        await saleService.addSale(values, user);
        enqueueSnackbar(t('sales.notifications.added'), { severity: 'success' });
      }
      navigate('/sales');
    } catch (error: any) {
      enqueueSnackbar(error.message || t('common.error'), { severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {id ? t('sales.edit') : t('sales.addNew')}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty, isValid, setFieldValue, values, errors, touched }) => {
            const handleCustomerCreated = (customer: Customer) => {
              setFieldValue('customerId', customer.id);
            };

            const handleAirlineCreated = (airline: Airline) => {
              setFieldValue('airlineId', airline.id);
            };

            return (
              <Form>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label={t('sales.labelDate')}
                        value={values.date}
                        onChange={(newValue) => setFieldValue('date', newValue)}
                        slotProps={{
                          textField: {
                            name: "date",
                            fullWidth: true,
                            variant: "outlined",
                            error: Boolean(touched.date && errors.date),
                            helperText: touched.date && errors.date ? String(errors.date) : ' '
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Autocomplete
                        id="customer-autocomplete"
                        options={customers}
                        getOptionLabel={(option) => option.name}
                        value={customers.find(c => c.id === values.customerId) || null}
                        onChange={(event, newValue) => {
                          setFieldValue('customerId', newValue ? newValue.id : '');
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            label={t('sales.labelCustomer')}
                            variant="outlined"
                            error={Boolean(touched.customerId && errors.customerId)}
                            helperText={touched.customerId && errors.customerId ? errors.customerId : ' '}
                          />
                        )}
                        sx={{ flex: 1 }}
                      />
                      <Tooltip title={t('common.add')}>
                        <IconButton
                          onClick={() => setShowCustomerDialog(true)}
                          color="primary"
                          sx={{ mt: 1 }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Autocomplete
                        id="airline-autocomplete"
                        options={airlines}
                        getOptionLabel={(option) => option.name}
                        value={airlines.find(a => a.id === values.airlineId) || null}
                        onChange={(event, newValue) => {
                          setFieldValue('airlineId', newValue ? newValue.id : '');
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            label={t('sales.labelAirline')}
                            variant="outlined"
                            error={Boolean(touched.airlineId && errors.airlineId)}
                            helperText={touched.airlineId && errors.airlineId ? errors.airlineId : ' '}
                          />
                        )}
                        sx={{ flex: 1 }}
                      />
                      <Tooltip title={t('common.add')}>
                        <IconButton
                          onClick={() => setShowAirlineDialog(true)}
                          color="primary"
                          sx={{ mt: 1 }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <Field
                      as={MuiTextField}
                      name="value"
                      label={t('sales.labelValue')}
                      type="number"
                      fullWidth
                      variant="outlined"
                      error={Boolean(touched.value && errors.value)}
                      helperText={touched.value && errors.value ? errors.value : ' '}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Field
                      as={MuiTextField}
                      name="cost"
                      label={t('sales.labelCost')}
                      type="number"
                      fullWidth
                      variant="outlined"
                      error={Boolean(touched.cost && errors.cost)}
                      helperText={touched.cost && errors.cost ? errors.cost : ' '}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button onClick={() => navigate('/sales')}>
                        {t('common.cancel')}
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !dirty || !isValid}
                      >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> : null}
                        {isSubmitting ? t('common.saving') : id ? t('common.save') : t('sales.add')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

                <AddEditCustomer
                    open={showCustomerDialog}
                  onClose={() => setShowCustomerDialog(false)}
                  onSuccess={handleCustomerCreated}
                  mode="add"
                />

                <AddEditAirline
                  open={showAirlineDialog}
                  onClose={() => setShowAirlineDialog(false)}
                  onSuccess={handleAirlineCreated}
                  mode="add"
                />
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </Box>
  );
};

export default SaleForm; 