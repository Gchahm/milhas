import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
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
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<CustomerFormData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        cpf: initialData.cpf,
        email: initialData.email,
        phone: initialData.phone,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [initialData, open]);

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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await onSubmit(formData);
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
            disabled={mode === 'edit'} // CPF shouldn't be editable in edit mode
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === 'add' ? 'Add Customer' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditCustomer; 