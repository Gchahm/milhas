import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { useAuthInitialize } from './hooks/useAuthInitialize';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CustomerList from './components/customers/CustomerList';
import AirlineList from './components/AirlineList';
import DashboardLayout from './components/layout/DashboardLayout';
import AppSnackbar from './components/common/AppSnackbar';
import { CircularProgress, Box } from '@mui/material';
import { useCustomers } from './hooks/useCustomers';

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
            path="/" 
            element={<Navigate to="/customers" />} 
          />
        </Routes>
      </Router>
      <AppSnackbar />
    </>
  );
};

export default App;
