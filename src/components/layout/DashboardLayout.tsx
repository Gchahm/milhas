import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  CssBaseline,
  Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FlightIcon from '@mui/icons-material/Flight';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { authService } from '../../services/firebase/auth.service';
import { setUser } from '../../store/slices/authSlice';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const drawerWidth = 260;

interface NavigationItem {
  textKey: string;
  path: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { textKey: 'nav_dashboard', path: '/', icon: <DashboardIcon /> },
  { textKey: 'nav_customers', path: '/customers', icon: <PeopleIcon /> },
  { textKey: 'nav_airlines', path: '/airlines', icon: <FlightIcon /> },
  { textKey: 'nav_sales', path: '/sales', icon: <PointOfSaleIcon /> },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode, toggleTheme } = useThemeMode();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      dispatch(setUser(null));
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
             width: drawerWidth,
             boxSizing: 'border-box',
             borderRight: `1px solid rgba(0, 0, 0, 0.12)`,
           },
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: [1] }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            {t('app_title', 'Sales App')}
          </Typography>
        </Toolbar>
        <Divider />

        <List sx={{ flexGrow: 1, px: 1 }}>
          {navigationItems.map((item) => (
            <Tooltip title={t(item.textKey)} placement="right" key={item.textKey}>
                <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                    <ListItemButton
                        selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                            minHeight: 48,
                            justifyContent: 'initial',
                            px: 2.5,
                            borderRadius: '4px',
                            '&.Mui-selected': {
                                backgroundColor: (theme) => theme.palette.action.selected,
                                fontWeight: 'fontWeightBold',
                            },
                            '&:hover': {
                                backgroundColor: (theme) => theme.palette.action.hover,
                            }
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: 3,
                                justifyContent: 'center',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={t(item.textKey)} sx={{ opacity: 1 }} />
                    </ListItemButton>
                </ListItem>
            </Tooltip>
          ))}
        </List>

        <Divider />
        <Box sx={{ p: 2, mt: 'auto' }}>
          {user && (
             <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, wordBreak: 'break-all' }}>
               {t('logged_in_as', 'Logged in as:')} {user.email}
             </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <Tooltip title={mode === 'dark' ? t('switch_light_mode', 'Switch to light mode') : t('switch_dark_mode', 'Switch to dark mode')}>
                <IconButton onClick={toggleTheme} color="inherit">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
              <Tooltip title={t('logout', 'Logout')}>
                <IconButton onClick={handleLogout} color="inherit">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 