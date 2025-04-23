import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { airlineService, Airline } from '../services/firebase/airline.service';
import { 
  setAirlines, 
  setLoading, 
  setError, 
  addAirline,
  updateAirline 
} from '../store/slices/airlineSlice';
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

const AirlineList = () => {
  const dispatch = useDispatch();
  const { airlines, loading, error } = useSelector(
    (state: RootState) => state.airlines
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [airlineName, setAirlineName] = useState('');
  const [nameError, setNameError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingAirlineId, setEditingAirlineId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirlines = async () => {
      if (!user) return;
      
      dispatch(setLoading(true));
      try {
        const airlineData = await airlineService.getAllAirlines(user);
        dispatch(setAirlines(airlineData));
        dispatch(setError(null));
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAirlines();
  }, [dispatch, user]);

  const handleEdit = (airline: Airline) => {
    setAirlineName(airline.name);
    setEditingAirlineId(airline.id);
    setOpenDialog(true);
  };

  const validateForm = (): boolean => {
    if (!airlineName.trim()) {
      setNameError('Airline name is required');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!user || !validateForm()) return;

    try {
      if (editingAirlineId) {
        await airlineService.updateAirline(editingAirlineId, airlineName, user);
        dispatch(updateAirline({
          id: editingAirlineId,
          name: airlineName,
          createdAt: airlines.find(a => a.id === editingAirlineId)?.createdAt || new Date()
        }));
        setSuccessMessage('Airline updated successfully!');
      } else {
        const newAirline = await airlineService.addAirline(airlineName, user);
        dispatch(addAirline(newAirline));
        setSuccessMessage('Airline added successfully!');
      }
      handleClose();
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setAirlineName('');
    setNameError('');
    setEditingAirlineId(null);
  };

  if (loading) return <Typography>Loading...</Typography>;
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
          onClick={() => setOpenDialog(true)}
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

      {/* Airline Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAirlineId ? 'Edit Airline' : 'Add New Airline'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              margin="dense"
              label="Airline Name"
              fullWidth
              value={airlineName}
              onChange={(e) => setAirlineName(e.target.value)}
              error={!!nameError}
              helperText={nameError}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAirlineId ? 'Save Changes' : 'Add Airline'}
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
    </>
  );
};

export default AirlineList; 