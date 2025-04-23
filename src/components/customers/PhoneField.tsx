import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';

interface PhoneFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
}

const PhoneField: React.FC<PhoneFieldProps> = ({ name, ...props }) => {
  const [field, meta] = useField(name);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format the number
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    field.onChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  return (
    <TextField
      {...props}
      {...field}
      onChange={handleChange}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default PhoneField; 