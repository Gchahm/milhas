import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { saleService } from '../services/firebase/sale.service';
import { setSalesLoading, setSalesSuccess, setSalesError } from '../store/slices/saleSlice';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useSnackbar } from './useSnackbar'; // Import useSnackbar

/**
 * Custom hook to manage fetching and state for Sales data.
 * Handles subscription to sales updates based on the authenticated user.
 *
 * @returns An object containing:
 *  - sales: The array of Sale objects.
 *  - loading: Boolean indicating if sales data is currently loading.
 *  - error: String containing error message if fetching failed, null otherwise.
 */
export const useSales = () => {
    const { t } = useTranslation(); // For error messages
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar(); // For error notifications
    const { user } = useSelector((state: RootState) => state.auth);
    const { sales, loading, error } = useSelector((state: RootState) => state.sales);

    useEffect(() => {
        // Ensure user is authenticated before subscribing
        if (!user) {
            // Clear sales data if user logs out or isn't authenticated initially
            dispatch(setSalesSuccess([]));
            // Optionally set an error or simply return if no user means no data expected
            // dispatch(setSalesError(t('User not authenticated')));
            return;
        }

        // Start loading state
        dispatch(setSalesLoading());

        // Subscribe to sales data
        const unsubscribe = saleService.subscribeToSales(
            user.uid,
            (fetchedSales) => {
                // Update state on successful data fetch
                dispatch(setSalesSuccess(fetchedSales));
            },
            (err) => {
                const errorMessage = err.message || t('Failed to load sales data');
                console.error('Sales Subscription Error:', err);
                dispatch(setSalesError(errorMessage));
                enqueueSnackbar(errorMessage, { severity: 'error' });
            }
        );

        // Cleanup function to unsubscribe when component unmounts or user changes
        return () => {
            unsubscribe();
        };

    }, [user, dispatch]); // Dependencies: user, dispatch, t, enqueueSnackbar

    // Return the relevant state values
    return { sales, loading, error };
}; 