import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Typography } from '@mui/material';
import { RootState, AppDispatch } from './store';
import { useAuthInitialize } from './hooks/useAuthInitialize';
import { useCustomers } from './hooks/useCustomers';
import { useAirlines } from './hooks/useAirlines';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CustomerList from './components/customers/CustomerList';
import AirlineList from './components/airlines/AirlineList';
import DashboardLayout from './components/layout/DashboardLayout';
import AppSnackbar from './components/common/AppSnackbar';
import { CircularProgress, Box } from '@mui/material';
import SaleList from './components/sales/SaleList';
import SaleForm from './components/sales/SaleForm';
import { useSales } from './hooks/useSales';
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const App = () => {
  useAuthInitialize();
  useCustomers();
  useAirlines();
  useSales();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/customers" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/customers" /> : <SignUp />} 
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airlines"
            element={
              <ProtectedRoute>
                <AirlineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <SaleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/create"
            element={
              <ProtectedRoute>
                <SaleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/edit/:id"
            element={
              <ProtectedRoute>
                <SaleForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <AppSnackbar />
    </>
  );
};

export default App;
