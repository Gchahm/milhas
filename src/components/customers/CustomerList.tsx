import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customerService, type Customer } from '../../services/firebase/customer.service';
import { 
  setCustomers, 
  setLoading, 
  setError, 
  addCustomer,
  updateCustomer 
} from '../../store/slices/customerSlice';
import { RootState } from '../../store';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AddEditCustomer from './AddEditCustomer';

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customers
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return;
      
      dispatch(setLoading(true));
      try {
        const customerData = await customerService.getAllCustomers(user);
        dispatch(setCustomers(customerData));
        dispatch(setError(null));
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCustomers();
  }, [dispatch, user]);

  const handleAdd = () => {
    console.log('Opening dialog for add');
    setSelectedCustomer(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    console.log('Opening dialog for edit', customer);
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedCustomer(undefined);
  };

  const handleSubmit = async (formData: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
  }) => {
    if (!user) return;

    try {
      if (selectedCustomer) {
        // Update existing customer
        await customerService.updateCustomer(selectedCustomer.id, formData, user);
        const updatedCustomer = {
          ...selectedCustomer,
          ...formData
        };
        dispatch(updateCustomer(updatedCustomer));
        setSuccessMessage('Customer updated successfully!');
      } else {
        // Add new customer
        const newCustomer = await customerService.addCustomer(formData, user);
        dispatch(addCustomer(newCustomer));
        setSuccessMessage('Customer added successfully!');
      }
      handleClose();
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Customer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.cpf}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  {customer.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => handleEdit(customer)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddEditCustomer
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={selectedCustomer}
        mode={selectedCustomer ? 'edit' : 'add'}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomerList; 