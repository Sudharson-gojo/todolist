import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

// Initial state for authentication
const initialState = {
  user: null,
  token: localStorage.getItem('token'), // Get token from localStorage
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Auth reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAIL:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  console.log('AuthProvider is initializing...');
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios default headers when token changes
  useEffect(() => {
    if (state.token) {
      // Set default authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      // Store token in localStorage
      localStorage.setItem('token', state.token);
    } else {
      // Remove authorization header and token from localStorage
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Load user on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
          
          const response = await axios.get('/api/auth/me');
          
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: response.data.data.user,
              token: state.token
            }
          });
        } catch (error) {
          console.error('Error loading user:', error);
          // Don't logout on connection errors, just set loading to false
          if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
            console.log('Backend server not running, skipping user load');
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          } else {
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data.data
      });

      return { success: true };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post('/api/auth/signup', {
        name,
        email,
        password
      });

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data.data
      });

      return { success: true };
    } catch (error) {
      let errorMessage = 'Signup failed';
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    signup,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
