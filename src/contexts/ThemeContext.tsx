import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
    children: React.ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  // Check system preference using MUI's hook (handles SSR and updates)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Determine initial mode based on preference
  const getInitialMode = (): ThemeMode => {
    // Optional: Check localStorage first for user override
    // try {
    //   const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    //   if (storedMode) {
    //     return storedMode;
    //   }
    // } catch (e) {
    //   console.error("Could not read theme preference from localStorage", e);
    // }
    // Fallback to system preference
    return prefersDarkMode ? 'dark' : 'light';
  };

  // Initialize state with the determined initial mode
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  // Optional: Effect to update state if system preference changes *during* the session
  // Note: useMediaQuery already handles this, but if you didn't use it,
  // you would add an effect like the one commented out below.
  // useEffect(() => {
  //   setMode(prefersDarkMode ? 'dark' : 'light');
  // }, [prefersDarkMode]);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      // Optional: Persist user's explicit choice
      // try {
      //    localStorage.setItem('themeMode', newMode);
      // } catch (e) {
      //    console.error("Could not save theme preference to localStorage", e);
      // }
      return newMode;
    });
  };

  // Select the theme object based on the mode state
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline applies baseline styles & background color */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 