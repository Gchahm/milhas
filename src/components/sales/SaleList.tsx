import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Button, Box, IconButton, CircularProgress, Alert,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { saleService } from '../../services/firebase/sale.service';
import { airlineService } from '../../services/firebase/airline.service';
import { Sale } from '../../models/sale.model';
import { RootState, AppDispatch } from '../../store';
import { setSalesLoading, setSalesSuccess, setSalesError } from '../../store/slices/saleSlice';
import { setLoading, setAirlines, setError } from '../../store/slices/airlineSlice';
import AddEditSale from './AddEditSale';
import { useSnackbar } from '../../hooks/useSnackbar';
import ConfirmationDialog from '../common/ConfirmationDialog';

type SaleFormData = Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>;

const SaleList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { sales, loading: salesLoading, error: salesError } = useSelector((state: RootState) => state.sales);
  const { customers, loading: customersLoading, error: customersError } = useSelector((state: RootState) => state.customers);
  const { airlines, loading: airlinesLoading, error: airlinesError } = useSelector((state: RootState) => state.airlines);
  const { user } = useSelector((state: RootState) => state.auth);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

  const isLoading = salesLoading || customersLoading || airlinesLoading;
  const combinedError = salesError || customersError || airlinesError;

  const customerMap = useMemo(() => {
      return new Map(customers.map(c => [c.id, c.name]));
  }, [customers]);

  const airlineMap = useMemo(() => {
      return new Map(airlines.map(a => [a.id, a.name]));
  }, [airlines]);

  const getCustomerName = (id: string) => customerMap.get(id) || t('Unknown Customer');
  const getAirlineName = (id: string) => airlineMap.get(id) || t('Unknown Airline');

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
    setSelectedSale(undefined);
  };

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
     const saleInfo = `${getCustomerName(saleToDelete.customerId)} / ${getAirlineName(saleToDelete.airlineId)} on ${format(saleToDelete.date, 'yyyy-MM-dd')}`;
     try {
       await saleService.deleteSale(saleToDelete.id, user);
       enqueueSnackbar(t('Sale for {{saleInfo}} deleted successfully!', { saleInfo }), { severity: 'success' });
     } catch (err: any) {
       const message = err.message || t('Failed to delete sale for {{saleInfo}}', { saleInfo });
       enqueueSnackbar(message, { severity: 'error' });
     } finally {
       handleCloseDeleteDialog();
     }
   };

  const handleSubmit = async (formData: SaleFormData) => {
    if (!user) {
      enqueueSnackbar(t('You must be logged in to save a sale.'), { severity: 'error' });
      throw new Error(t('Authentication required'));
    }
    const action = selectedSale ? t('update') : t('add');
    const saleInfo = `${getCustomerName(formData.customerId)} / ${getAirlineName(formData.airlineId)}`;

    try {
      if (selectedSale) {
        await saleService.updateSale(selectedSale.id, formData, user);
        enqueueSnackbar(t('Sale for {{saleInfo}} updated successfully!', { saleInfo }), { severity: 'success' });
      } else {
        await saleService.addSale(formData, user);
        enqueueSnackbar(t('Sale for {{saleInfo}} added successfully!', { saleInfo }), { severity: 'success' });
      }
      handleCloseDialog();
    } catch (err: any) {
      const message = err.message || t('Failed to {{action}} sale for {{saleInfo}}', { action, saleInfo });
      enqueueSnackbar(message, { severity: 'error' });
      throw err;
    }
  };

  if (!user) {
     return <Alert severity="warning">{t('Please log in to manage sales.')}</Alert>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">{t('Sales Management')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={isLoading}>
          {t('Add Sale')}
        </Button>
      </Box>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
      {combinedError && !isLoading && <Alert severity="error">{t('Error loading data:')} {combinedError}</Alert>}

      {!isLoading && !combinedError && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Date')}</TableCell>
                <TableCell>{t('Customer')}</TableCell>
                <TableCell>{t('Airline')}</TableCell>
                <TableCell align="right">{t('Value')}</TableCell>
                <TableCell align="right">{t('Cost')}</TableCell>
                <TableCell>{t('Created At')}</TableCell>
                <TableCell align="center">{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} align="center">{t('No sales found.')}</TableCell>
                </TableRow>
              )}
              {sales.map((sale) => (
                <TableRow key={sale.id} hover>
                  <TableCell>{format(sale.date, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{getCustomerName(sale.customerId)}</TableCell>
                  <TableCell>{getAirlineName(sale.airlineId)}</TableCell>
                  <TableCell align="right">{sale.value.toFixed(2)}</TableCell>
                  <TableCell align="right">{sale.cost.toFixed(2)}</TableCell>
                  <TableCell>{format(sale.createdAt, 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('Edit Sale')}>
                      <IconButton color="primary" onClick={() => handleEdit(sale)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('Delete Sale')}>
                      <IconButton color="error" onClick={() => handleDeleteRequest(sale)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {dialogOpen && (
        <AddEditSale
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          initialData={selectedSale}
          mode={selectedSale ? 'edit' : 'add'}
          customers={customers}
          airlines={airlines}
        />
      )}

       <ConfirmationDialog
         open={deleteDialogOpen}
         onClose={handleCloseDeleteDialog}
         onConfirm={handleConfirmDelete}
         title={t('Confirm Sale Deletion')}
         message={t('Are you sure you want to delete the sale for {{customer}} / {{airline}} on {{date}}? This action cannot be undone.', {
             customer: saleToDelete ? getCustomerName(saleToDelete.customerId) : '...',
             airline: saleToDelete ? getAirlineName(saleToDelete.airlineId) : '...',
             date: saleToDelete ? format(saleToDelete.date, 'yyyy-MM-dd') : '...'
         })}
         confirmText={t('Delete Sale')}
       />
    </>
  );
};

export default SaleList; 