import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red } from '@mui/material/colors'; // For error color

// Define base colors - choose colors that feel modern and premium
const primaryColor = '#0B72B9'; // A slightly desaturated blue
const secondaryColor = '#FF8C00'; // A vibrant orange for contrast
const errorColor = red.A400;
const paperBg = '#FFFFFF';
const defaultBg = '#F4F6F8'; // A very light grey background
const darkPaperBg = '#1C2531';
const darkDefaultBg = '#12181F';
const primaryTextColor = '#212B36';
const secondaryTextColor = '#637381';
const darkPrimaryTextColor = '#FFFFFF';
const darkSecondaryTextColor = '#919EAB';

// Define base theme options
const baseThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    fontWeightRegular: 400,
    fontWeightMedium: 600, // Slightly bolder medium
    fontWeightBold: 700,
    h1: { fontSize: '2.25rem', fontWeight: 700 },
    h2: { fontSize: '1.75rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 700 },
    h4: { fontSize: '1.25rem', fontWeight: 700 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    // You can adjust other variants like body1, body2, button etc. if needed
  },
  shape: {
    borderRadius: 8, // Slightly more rounded corners
  },
};

// Create Light Theme
let lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: secondaryColor,
      contrastText: '#FFFFFF',
    },
    error: {
      main: errorColor,
    },
    background: {
      default: defaultBg,
      paper: paperBg,
    },
    text: {
      primary: primaryTextColor,
      secondary: secondaryTextColor,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: paperBg, // White AppBar
          color: primaryTextColor, // Dark text on AppBar
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow
        }
      }
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: paperBg,
                borderRight: `1px solid rgba(0, 0, 0, 0.12)`, // Subtle border
            }
        }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove uppercase default
          fontWeight: 600,
          padding: '8px 22px', // Slightly more padding
        },
        containedPrimary: {
           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Softer shadow
           '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
           }
        }
      }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none' // Ensure no gradient backgrounds by default
            },
            elevation1: {
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Consistent subtle shadow
            }
        }
    },
    MuiTableCell: {
        styleOverrides: {
            head: {
                fontWeight: 600,
                color: secondaryTextColor,
            }
        }
    }
    // Add other component overrides here (e.g., Card, TextField, etc.)
  }
});

// Create Dark Theme
let darkTheme = createTheme({
    ...baseThemeOptions,
    palette: {
      mode: 'dark',
      primary: {
        main: primaryColor, // Keep primary, adjust if needed for contrast
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: secondaryColor, // Keep secondary, adjust if needed for contrast
        contrastText: '#FFFFFF',
      },
      error: {
        main: errorColor,
      },
      background: {
        default: darkDefaultBg,
        paper: darkPaperBg,
      },
      text: {
        primary: darkPrimaryTextColor,
        secondary: darkSecondaryTextColor,
      },
      divider: 'rgba(255, 255, 255, 0.12)' // Lighter divider for dark mode
    },
    components: {
       MuiAppBar: {
         styleOverrides: {
           root: {
             backgroundColor: darkPaperBg, // Dark AppBar
             color: darkPrimaryTextColor, // Light text
             boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)', // Adjusted shadow
             borderBottom: '1px solid rgba(255, 255, 255, 0.12)' // Subtle border
           }
         }
       },
       MuiDrawer: {
           styleOverrides: {
               paper: {
                   backgroundColor: darkPaperBg,
                   borderRight: `1px solid rgba(255, 255, 255, 0.12)`,
               }
           }
       },
       MuiButton: {
         styleOverrides: {
           root: {
             textTransform: 'none',
             fontWeight: 600,
             padding: '8px 22px',
           },
         }
       },
       MuiPaper: {
           styleOverrides: {
               root: {
                  backgroundImage: 'none'
               },
               elevation1: {
                 boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)', // Adjusted shadow
               }
           }
       },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    color: darkSecondaryTextColor,
                },
                root: { // Ensure borders are visible
                    borderColor: 'rgba(255, 255, 255, 0.12)'
                }
            }
        }
       // Add other component overrides for dark mode if needed
     }
  });

// Apply responsive font sizes
lightTheme = responsiveFontSizes(lightTheme);
darkTheme = responsiveFontSizes(darkTheme);

export { lightTheme, darkTheme }; 