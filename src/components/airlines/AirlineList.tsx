import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type Airline } from '../../services/firebase/airline.service';
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
import AddEditAirline from './AddEditAirline';

const AirlineList = () => {
  const dispatch = useDispatch();
  const { airlines } = useSelector((state: RootState) => state.airlines);
  const { error } = useSelector((state: RootState) => state.airlines);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<Airline | undefined>();

  const handleAdd = () => {
    setSelectedAirline(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (airline: Airline) => {
    setSelectedAirline(airline);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedAirline(undefined);
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Airlines
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Airline
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {airlines.map((airline) => (
              <TableRow key={airline.id}>
                <TableCell>{airline.name}</TableCell>
                <TableCell>
                  {airline.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => handleEdit(airline)}
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

      <AddEditAirline
        open={dialogOpen}
        onClose={handleClose}
        initialData={selectedAirline}
        mode={selectedAirline ? 'edit' : 'add'}
      />
    </>
  );
};

export default AirlineList; 