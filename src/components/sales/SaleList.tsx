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

  const getCustomerName = (id: string) => customerMap.get(id) || t('customers.unknown');
  const getAirlineName = (id: string) => airlineMap.get(id) || t('airlines.unknown');

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
       enqueueSnackbar(t('sales.notifications.deletedContext', { saleInfo }), { severity: 'success' });
     } catch (err: any) {
       const message = err.message || t('sales.notifications.deleteErrorContext', { saleInfo });
       enqueueSnackbar(message, { severity: 'error' });
     } finally {
       handleCloseDeleteDialog();
     }
   };

  const handleSubmit = async (formData: SaleFormData) => {
    if (!user) {
      enqueueSnackbar(t('auth.loginRequired'), { severity: 'error' });
      throw new Error(t('auth.authenticationRequired'));
    }
    const saleInfo = `${getCustomerName(formData.customerId)} / ${getAirlineName(formData.airlineId)}`;

    try {
      if (selectedSale) {
        await saleService.updateSale(selectedSale.id, formData, user);
        enqueueSnackbar(t('sales.notifications.updatedContext', { saleInfo }), { severity: 'success' });
      } else {
        await saleService.addSale(formData, user);
        enqueueSnackbar(t('sales.notifications.addedContext', { saleInfo }), { severity: 'success' });
      }
      handleCloseDialog();
    } catch (err: any) {
      const action = selectedSale ? 'update' : 'add';
      const message = err.message || t(`sales.notifications.${action}ErrorContext`, { saleInfo });
      enqueueSnackbar(message, { severity: 'error' });
      throw err;
    }
  };

  if (!user) {
     return <Alert severity="warning">{t('auth.loginToView')}</Alert>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">{t('sales.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={isLoading}>
          {t('sales.add')}
        </Button>
      </Box>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
      {combinedError && !isLoading && <Alert severity="error">{t('common.error')}: {combinedError}</Alert>}

      {!isLoading && !combinedError && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('common.date')}</TableCell>
                <TableCell>{t('sales.labelCustomer')}</TableCell>
                <TableCell>{t('sales.labelAirline')}</TableCell>
                <TableCell align="right">{t('sales.labelValue')}</TableCell>
                <TableCell align="right">{t('sales.labelCost')}</TableCell>
                <TableCell>{t('common.createdAt')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} align="center">{t('sales.noSalesFound')}</TableCell>
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
                    <Tooltip title={t('sales.edit')}>
                      <IconButton color="primary" onClick={() => handleEdit(sale)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('sales.deleteButton')}>
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
         title={t('sales.confirmDeleteTitle')}
         message={t('sales.confirmDeleteMessageContext', {
             customer: saleToDelete ? getCustomerName(saleToDelete.customerId) : '...',
             airline: saleToDelete ? getAirlineName(saleToDelete.airlineId) : '...',
             date: saleToDelete ? format(saleToDelete.date, 'yyyy-MM-dd') : '...'
         })}
         confirmText={t('sales.deleteButton')}
         cancelText={t('common.cancel')}
       />
    </>
  );
};

export default SaleList; 