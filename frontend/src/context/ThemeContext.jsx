import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { setCredentials, selectCurrentUser } from '../store/slices/authSlice';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(user?.settings?.appearance || localStorage.getItem('theme') || 'system');

  const mutation = useMutation({
    mutationFn: (newAppearance) => axiosInstance.patch('/auth/updateMe', { 
      settings: { appearance: newAppearance } 
    }),
    onSuccess: (res) => {
      // Keep Redux in sync
      const updatedUser = res.data.data.user;
      dispatch(setCredentials({ 
        user: updatedUser, 
        token: localStorage.getItem('token') 
      }));
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    let activeTheme = theme;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      activeTheme = systemTheme;
    }

    root.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', theme);

    // Sync with backend if user is logged in and theme has changed from what's in DB
    if (user && theme !== user.settings?.appearance) {
      mutation.mutate(theme);
    }
  }, [theme, user]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      window.document.documentElement.setAttribute('data-theme', newSystemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update theme state when user object changes (e.g., after login)
  useEffect(() => {
    if (user?.settings?.appearance) {
      setTheme(user.settings.appearance);
    }
  }, [user?.settings?.appearance]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
