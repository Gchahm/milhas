import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer as MuiDrawer,
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
  Tooltip,
  styled,
  Theme,
  CSSObject,
  Button
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
const miniDrawerWidth = 80;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  borderRight: `1px solid ${theme.palette.divider}`,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  borderRight: `1px solid ${theme.palette.divider}`,
  width: `${miniDrawerWidth}px`,
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

interface NavigationItem {
  textKey: string;
  path: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { textKey: 'dashboard.navDashboard', path: '/', icon: <DashboardIcon /> },
  { textKey: 'dashboard.navCustomers', path: '/customers', icon: <PeopleIcon /> },
  { textKey: 'dashboard.navAirlines', path: '/airlines', icon: <FlightIcon /> },
  { textKey: 'dashboard.navSales', path: '/sales', icon: <PointOfSaleIcon /> },
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
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
        open={open}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', px: [2.5] }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', opacity: open ? 1 : 0, transition: 'opacity 0.3s' }}>
            {t('dashboard.appTitle')}
          </Typography>
        </Toolbar>
        <Divider />

        <List sx={{ flexGrow: 1, px: 1.5 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.textKey} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <Tooltip title={!open ? t(item.textKey) : ""} placement="right">
                <ListItemButton
                  selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: '4px',
                    '&.Mui-selected': {
                      backgroundColor: (theme) => theme.palette.action.selected,
                      fontWeight: 'fontWeightBold'
                    },
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(item.textKey)} sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        <Divider />
        <Box sx={{ p: 2, mt: 'auto', overflow: 'hidden' }}>
          {user && (
            <Tooltip title={open ? "" : user.email} placement="top">
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mb: 1,
                  opacity: open ? 0.7 : 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: (theme) => theme.transitions.create('opacity', {
                    duration: theme.transitions.duration.enteringScreen,
                    delay: open ? theme.transitions.duration.enteringScreen * 0.5 : 0,
                  }),
                  height: open ? 'auto' : 0,
                  color: 'text.secondary'
                }}
              >
                {user.email}
              </Typography>
            </Tooltip>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
            <Tooltip title={mode === 'dark' ? t('dashboard.switchLightMode') : t('dashboard.switchDarkMode')}>
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={t('auth.logout')}>
              <IconButton onClick={handleLogout} color="inherit" size="small">
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
          marginLeft: `${miniDrawerWidth}px`,
          width: `calc(100% - ${miniDrawerWidth}px)`,
          bgcolor: 'background.default',
          minHeight: '100vh',
          transition: (theme) => theme.transitions.create(['margin-left', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 