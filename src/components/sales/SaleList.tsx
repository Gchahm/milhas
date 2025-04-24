import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Button, Box, IconButton, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns'; // For formatting dates

import { saleService } from '../../services/firebase/sale.service';
import { Sale } from '../../models/sale.model';
import { RootState, AppDispatch } from '../../store';
import { setSalesLoading, setSalesSuccess, setSalesError } from '../../store/slices/saleSlice';
import AddEditSale from './AddEditSale'; // Import the Add/Edit dialog
import { useSnackbar } from '../../hooks/useSnackbar';
import ConfirmationDialog from '../common/ConfirmationDialog'; // Assuming a generic confirmation dialog exists

// Simplified input data type
type SaleFormData = Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>;

const SaleList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { sales, loading, error } = useSelector((state: RootState) => state.sales);
  const { user } = useSelector((state: RootState) => state.auth);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!user) {
      dispatch(setSalesError(t('Must be logged in to view sales')));
      return;
    }

    dispatch(setSalesLoading());
    const unsubscribe = saleService.subscribeToSales(
      user.uid,
      (fetchedSales) => {
        dispatch(setSalesSuccess(fetchedSales));
      },
      (err) => {
         console.error("Subscription error:", err);
         dispatch(setSalesError(err.message || t('Failed to load sales')));
         enqueueSnackbar(err.message || t('Failed to load sales'), { severity: 'error' });
      }
    );

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [dispatch, user, t, enqueueSnackbar]); // Add t and enqueueSnackbar to dependencies

  // --- Dialog Handlers ---
  const handleAdd = () => {
    setSelectedSale(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSale(undefined); // Clear selection on close
  };

  // --- Delete Handlers ---
   const handleDeleteRequest = (sale: Sale) => {
     setSaleToDelete(sale);
     setDeleteDialogOpen(true);
   };

   const handleCloseDeleteDialog = () => {
     setSaleToDelete(null);
     setDeleteDialogOpen(false);
   };

   const handleConfirmDelete = async () => {
     if (!saleToDelete || !user) return;
     try {
       await saleService.deleteSale(saleToDelete.id, user);
       enqueueSnackbar(t('Sale deleted successfully!'), { severity: 'success' });
       // Optimistic update handled by subscription, or could dispatch removeSaleOptimistic
     } catch (err: any) {
       console.error("Delete error:", err);
       const message = err.message || t('Failed to delete sale');
       enqueueSnackbar(message, { severity: 'error' });
       // Optionally dispatch an error action to Redux store if needed
     } finally {
       handleCloseDeleteDialog();
     }
   };

  // --- Submit Handler ---
  const handleSubmit = async (formData: SaleFormData) => {
    if (!user) {
      enqueueSnackbar(t('Must be logged in'), { severity: 'error' });
      throw new Error(t('Must be logged in')); // Throw error to keep dialog open via Formik
    }

    try {
      if (selectedSale) {
        // Edit mode
        await saleService.updateSale(selectedSale.id, formData, user);
        enqueueSnackbar(t('Sale updated successfully!'), { severity: 'success' });
      } else {
        // Add mode
        await saleService.addSale(formData, user);
        enqueueSnackbar(t('Sale added successfully!'), { severity: 'success' });
      }
      handleCloseDialog(); // Close dialog on success
      // No need to return anything, Formik handles state. Subscription updates list.
    } catch (err: any) {
      console.error("Submit error:", err);
      const message = err.message || t('Failed to save sale');
      enqueueSnackbar(message, { severity: 'error' });
      // Throw error so Formik's isSubmitting stays true until resolved/re-attempted
      throw err;
    }
  };

  // --- Render Logic ---
  if (!user) {
     // Or redirect to login
      return <Alert severity="warning">{t('Please log in to manage sales.')}</Alert>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          {t('Sales Management')} {/* Updated Title */}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          {t('Add Sale')}
        </Button>
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
      {error && !loading && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Date')}</TableCell>
                <TableCell>{t('Customer ID')}</TableCell>
                <TableCell>{t('Airline ID')}</TableCell>
                <TableCell align="right">{t('Value')}</TableCell>
                <TableCell align="right">{t('Cost')}</TableCell>
                <TableCell>{t('Created At')}</TableCell>
                <TableCell align="center">{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        {t('No sales found.')}
                    </TableCell>
                </TableRow>
              )}
              {sales.map((sale) => (
                <TableRow key={sale.id} hover>
                  <TableCell>{format(sale.date, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{sale.customerId}</TableCell> {/* TODO: Fetch/Display Customer Name */}
                  <TableCell>{sale.airlineId}</TableCell>  {/* TODO: Fetch/Display Airline Name */}
                  <TableCell align="right">{sale.value.toFixed(2)}</TableCell> {/* Format currency */}
                  <TableCell align="right">{sale.cost.toFixed(2)}</TableCell> {/* Format currency */}
                  <TableCell>{format(sale.createdAt, 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(sale)}
                      size="small"
                      aria-label={t('Edit Sale')} // Accessibility
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error" // Use error color for delete
                      onClick={() => handleDeleteRequest(sale)}
                      size="small"
                       aria-label={t('Delete Sale')} // Accessibility
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      {dialogOpen && ( // Conditionally render the dialog
        <AddEditSale
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          initialData={selectedSale}
          mode={selectedSale ? 'edit' : 'add'}
          // TODO: Pass fetched airlines/customers
          // airlines={[]}
          // customers={[]}
        />
      )}

       {/* Delete Confirmation Dialog */}
       <ConfirmationDialog
         open={deleteDialogOpen}
         onClose={handleCloseDeleteDialog}
         onConfirm={handleConfirmDelete}
         title={t('Confirm Deletion')}
         message={t('Are you sure you want to delete this sale? This action cannot be undone.')}
       />
    </>
  );
};

export default SaleList; 