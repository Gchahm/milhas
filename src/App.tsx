import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { useAuthInitialize } from './hooks/useAuthInitialize';
import Login from './components/Login';
import CustomerList from './components/CustomerList';
import AddCustomer from './components/AddCustomer';
import SignUp from './components/SignUp';
import { Container, CircularProgress, Box } from '@mui/material';

const App = () => {
  useAuthInitialize();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Container>
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
            element={user ? <CustomerList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-customer" 
            element={user ? <AddCustomer /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/customers" />} 
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
