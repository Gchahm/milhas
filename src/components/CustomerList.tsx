import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Customer, customerService } from '../services/firebase/customer.service';
import { 
  setCustomers, 
  setLoading, 
  setError, 
  addCustomer,
  updateCustomer 
} from '../store/slices/customerSlice';
import { RootState } from '../store';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

interface CustomerFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

const initialFormData: CustomerFormData = {
  name: '',
  cpf: '',
  email: '',
  phone: '',
};

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customers
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<CustomerFormData>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

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

  const validateForm = (): boolean => {
    const errors: Partial<CustomerFormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.cpf.trim()) {
      errors.cpf = 'CPF is required';
    } else if (!/^\d{11}$/.test(formData.cpf)) {
      errors.cpf = 'CPF must be 11 digits';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      name: customer.name,
      cpf: customer.cpf,
      email: customer.email,
      phone: customer.phone,
    });
    setEditingCustomerId(customer.id);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!user || !validateForm()) return;

    try {
      if (editingCustomerId) {
        // Update existing customer
        await customerService.updateCustomer(editingCustomerId, formData, user);
        const updatedCustomer = {
          ...formData,
          id: editingCustomerId,
          createdAt: customers.find(c => c.id === editingCustomerId)?.createdAt || new Date()
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

  const handleClose = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
    setFormErrors({});
    setEditingCustomerId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof CustomerFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Typography variant="h4">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
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

      {/* Customer Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCustomerId ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              margin="dense"
              label="CPF"
              name="cpf"
              fullWidth
              value={formData.cpf}
              onChange={handleChange}
              error={!!formErrors.cpf}
              helperText={formErrors.cpf}
              disabled={!!editingCustomerId} // CPF shouldn't be editable
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              margin="dense"
              label="Phone"
              name="phone"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCustomerId ? 'Save Changes' : 'Add Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
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
    </Container>
  );
};

export default CustomerList; 