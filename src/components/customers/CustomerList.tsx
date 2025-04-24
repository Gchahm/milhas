import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customerService } from '../../services/firebase/customer.service';
import { showSnackbar } from '../../store/slices/snackbarSlice';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AddEditCustomer from './AddEditCustomer';
import { Customer } from '../../models/customer.model';
import { setError } from '../../store/slices/authSlice';

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state: RootState) => state.customers);
  const { error } = useSelector((state: RootState) => state.customers);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();

  const handleAdd = () => {
    setSelectedCustomer(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
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
        await customerService.updateCustomer(selectedCustomer.id, formData, user);
        dispatch(showSnackbar({
          message: 'Customer updated successfully!',
          severity: 'success'
        }));
      } else {
        await customerService.addCustomer(formData, user);
        dispatch(showSnackbar({
          message: 'Customer added successfully!',
          severity: 'success'
        }));
      }
      handleClose();
    } catch (error: any) {
      dispatch(setError(error.message));
      dispatch(showSnackbar({
        message: error.message,
        severity: 'error'
      }));
    }
  };

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
    </>
  );
};

export default CustomerList; 