import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem('cc_token') || null,
  isAuthenticated: false,
  isLoading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload }, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('cc_token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token } });
    } catch {
      localStorage.removeItem('cc_token');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('cc_token', data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token: data.token } });
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('cc_token', data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token: data.token } });
      toast.success(`Welcome to CareerCampus, ${data.user.name}! 🎉`);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully!');
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const toggleSaveCareer = async (careerId) => {
    try {
      const { data } = await api.post(`/auth/save-career/${careerId}`);
      dispatch({ type: 'UPDATE_USER', payload: { savedCareers: data.savedCareers } });
      toast.success(data.message);
    } catch {
      toast.error('Failed to update saved careers.');
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, toggleSaveCareer, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
