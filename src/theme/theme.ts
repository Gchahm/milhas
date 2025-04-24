import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define colors based on the Minimal Design System
const primaryColor = '#00A389'; // Teal green from screenshots
const secondaryColor = '#8A3FFC'; // Purple from screenshots
const infoColor = '#0AB0CE'; // Cyan/info color from screenshots
const successColor = '#2ECC71'; // Success green from screenshots
const warningColor = '#FF9500'; // Orange/warning from screenshots
const errorColor = '#FF4D4F'; // Red/error from screenshots

// Gray scale
const gray100 = '#FFFFFF';
const gray200 = '#F7F9FC';
const gray300 = '#E9ECEF';
const gray400 = '#CED4DA';
const gray500 = '#A5A9B1';
const gray600 = '#6E7582';
const gray700 = '#495057';
const gray800 = '#343A40';
const gray900 = '#212529';

// Define base theme options
const baseThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { 
      fontSize: '2.25rem', 
      fontWeight: 600,
      lineHeight: 1.2
    },
    h2: { 
      fontSize: '1.875rem', 
      fontWeight: 600,
      lineHeight: 1.2
    },
    h3: { 
      fontSize: '1.5rem', 
      fontWeight: 600,
      lineHeight: 1.2
    },
    h4: { 
      fontSize: '1.25rem', 
      fontWeight: 600,
      lineHeight: 1.2
    },
    h5: { 
      fontSize: '1.125rem', 
      fontWeight: 600,
      lineHeight: 1.2
    },
    h6: { 
      fontSize: '1rem', 
      fontWeight: 600,
      lineHeight: 1.2
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem'
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
};

// Create Light Theme
let lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      light: '#CCF0EA', // Lighter variant
      dark: '#007F6B', // Darker variant
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: secondaryColor,
      light: '#E2D5FF', // Lighter variant
      dark: '#6D31C4', // Darker variant
      contrastText: '#FFFFFF',
    },
    info: {
      main: infoColor,
      light: '#D7F4F9', // Lighter variant
      dark: '#0889A1', // Darker variant
      contrastText: '#FFFFFF',
    },
    success: {
      main: successColor,
      light: '#D8F7E6', // Lighter variant
      dark: '#25A159', // Darker variant
      contrastText: '#FFFFFF',
    },
    warning: {
      main: warningColor,
      light: '#FFECCC', // Lighter variant
      dark: '#CC7800', // Darker variant
      contrastText: '#FFFFFF',
    },
    error: {
      main: errorColor,
      light: '#FFE2E2', // Lighter variant
      dark: '#CC3D3E', // Darker variant
      contrastText: '#FFFFFF',
    },
    background: {
      default: gray200,
      paper: gray100,
    },
    text: {
      primary: gray900,
      secondary: gray700,
    },
    divider: gray300,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: gray100, 
          color: gray900,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: gray100,
          borderRight: `1px solid ${gray300}`,
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none', 
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
        rounded: {
          borderRadius: 8,
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: gray700,
          backgroundColor: gray200,
        },
        root: {
          borderColor: gray300,
          padding: '12px 16px',
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: gray100,
          },
          '&:hover': {
            backgroundColor: gray200,
          },
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: gray500,
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryColor,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryColor,
            borderWidth: 1,
          },
        },
        notchedOutline: {
          borderColor: gray400,
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            paddingRight: 8,
          }
        },
        paper: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: gray800,
          fontSize: '0.75rem',
          padding: '8px 12px',
          borderRadius: 4,
        }
      }
    },
  }
});

// Create Dark Theme
let darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
      light: '#4DBDAC',
      dark: '#008C75',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: secondaryColor,
      light: '#A366FF',
      dark: '#6D31C4',
      contrastText: '#FFFFFF',
    },
    info: {
      main: infoColor,
      light: '#54C4DB',
      dark: '#0889A1',
      contrastText: '#FFFFFF',
    },
    success: {
      main: successColor,
      light: '#6EDEA0',
      dark: '#25A159',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: warningColor,
      light: '#FFB54C',
      dark: '#CC7800',
      contrastText: '#FFFFFF',
    },
    error: {
      main: errorColor,
      light: '#FF7C7D',
      dark: '#CC3D3E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: gray900,
      paper: gray800,
    },
    text: {
      primary: gray100,
      secondary: gray400,
    },
    divider: gray700,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: gray800,
          color: gray100,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: gray800,
          borderRight: `1px solid ${gray700}`,
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        },
        rounded: {
          borderRadius: 8,
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: gray400,
          backgroundColor: gray700,
        },
        root: {
          borderColor: gray700,
          padding: '12px 16px',
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: gray800,
          },
          '&:hover': {
            backgroundColor: gray700,
          },
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: gray500,
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryColor,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryColor,
            borderWidth: 1,
          },
        },
        notchedOutline: {
          borderColor: gray600,
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            paddingRight: 8,
          }
        },
        paper: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: gray700,
          fontSize: '0.75rem',
          padding: '8px 12px',
          borderRadius: 4,
        }
      }
    },
  }
});

// Apply responsive font sizes
lightTheme = responsiveFontSizes(lightTheme);
darkTheme = responsiveFontSizes(darkTheme);

export { lightTheme, darkTheme }; 