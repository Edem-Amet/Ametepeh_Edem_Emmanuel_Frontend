// context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    isPrincipal: false,
    sessionInfo: null,
    resetEmail: '' // Store email for password reset flow
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                isLoading: true
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                isPrincipal: action.payload.user?.isPrincipal || action.payload.user?.role === 'principal' || false,
                sessionInfo: action.payload.sessionInfo
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                isPrincipal: false,
                sessionInfo: null
            };
        case 'LOGOUT':
            return {
                ...initialState,
                isLoading: false
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };
        case 'SET_RESET_EMAIL':
            return {
                ...state,
                resetEmail: action.payload
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Setup axios interceptors
    useEffect(() => {
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = API_URL;

        const requestInterceptorId = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('adminToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && state.isAuthenticated) {
                    dispatch({ type: 'LOGOUT' });
                    localStorage.removeItem('adminToken');
                    toast.error('Session expired. Please login again.');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptorId);
            axios.interceptors.response.eject(responseInterceptorId);
        };
    }, [API_URL]);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                dispatch({ type: 'AUTH_START' });

                const storedToken = localStorage.getItem('adminToken');
                if (!storedToken) {
                    dispatch({ type: 'AUTH_FAILURE' });
                    return;
                }

                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

                const response = await axios.get('/api/admin/profile');

                if (response.data.success && response.data.admin) {
                    const user = response.data.admin;
                    const isPrincipalUser = user.role === 'principal' ||
                        (typeof user.isPrincipal === 'function' && user.isPrincipal()) ||
                        user.isPrincipal === true;

                    dispatch({
                        type: 'AUTH_SUCCESS',
                        payload: {
                            user: {
                                ...user,
                                isPrincipal: isPrincipalUser
                            },
                            token: storedToken,
                            sessionInfo: {
                                activeSessions: user.activeSessions || 0
                            }
                        }
                    });
                } else {
                    localStorage.removeItem('adminToken');
                    delete axios.defaults.headers.common['Authorization'];
                    dispatch({ type: 'AUTH_FAILURE' });
                }
            } catch (error) {
                console.error('Auth check failed:', error.response?.data || error.message);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('adminToken');
                    delete axios.defaults.headers.common['Authorization'];
                }

                dispatch({ type: 'AUTH_FAILURE' });
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'AUTH_START' });

        try {
            if (!credentials.email || !credentials.password) {
                throw new Error('Email and password are required');
            }

            const response = await axios.post('/api/admin/login', {
                email: credentials.email.trim().toLowerCase(),
                password: credentials.password
            });

            if (response.data.success) {
                const { data, token } = response.data;

                if (token) {
                    localStorage.setItem('adminToken', token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                const isPrincipalUser = data.role === 'principal' ||
                    (typeof data.isPrincipal === 'function' && data.isPrincipal()) ||
                    data.isPrincipal === true;

                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: {
                        user: {
                            ...data,
                            isPrincipal: isPrincipalUser
                        },
                        token: token,
                        sessionInfo: {
                            sessionId: data.sessionId,
                            activeSessions: data.activeSessions || 0
                        }
                    }
                });

                toast.success('Login successful!');
                return { success: true, data };
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem('adminToken');
            delete axios.defaults.headers.common['Authorization'];
            dispatch({ type: 'AUTH_FAILURE' });

            const message = error.response?.data?.message || error.message || 'Login failed';

            if (error.response?.data?.code === 'ACCOUNT_NOT_APPROVED') {
                toast.info('Your account is pending approval. A principal admin will review your registration.');
            } else {
                toast.error(message);
            }

            return {
                success: false,
                error: message,
                code: error.response?.data?.code
            };
        }
    };

    const logout = async (logoutAll = false) => {
        try {
            const endpoint = logoutAll ? '/api/admin/logout-all' : '/api/admin/logout';
            if (localStorage.getItem('adminToken')) {
                await axios.post(endpoint);
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            localStorage.removeItem('adminToken');
            delete axios.defaults.headers.common['Authorization'];
            dispatch({ type: 'LOGOUT' });
            toast.success(logoutAll ? 'Logged out from all devices' : 'Logged out successfully');
            return { success: true };
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            if (!userData.name || !userData.email || !userData.password) {
                throw new Error('All fields are required');
            }

            const email = userData.email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Please enter a valid email address');
            }

            if (userData.name.trim().length < 2) {
                throw new Error('Name must be at least 2 characters long');
            }

            if (userData.password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            const requestData = {
                name: userData.name.trim(),
                email: email,
                password: userData.password
            };

            const response = await axios.post('/api/admin/register', requestData);

            if (response.data.success) {
                toast.success('Registration submitted successfully. Awaiting principal admin approval.');
                return { success: true, data: response.data.data };
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const requestPasswordReset = async (email) => {
        try {
            if (!email) {
                throw new Error('Email is required');
            }

            const cleanEmail = email.trim().toLowerCase();

            // Store email for the reset flow
            dispatch({ type: 'SET_RESET_EMAIL', payload: cleanEmail });

            const response = await axios.post('/api/admin/request-password-reset', {
                email: cleanEmail
            });

            if (response.data.success) {
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Password reset request failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Password reset request failed';
            return { success: false, error: message };
        }
    };

    const verifyResetCode = async (email, code) => {
        try {
            if (!email || !code) {
                throw new Error('Email and code are required');
            }

            const response = await axios.post('/api/admin/verify-reset-code', {
                email: email.trim().toLowerCase(),
                code: code.trim()
            });

            if (response.data.success) {
                return {
                    success: true,
                    data: {
                        email: email.trim().toLowerCase(),
                        tempToken: code // Use the code as tempToken for your flow
                    }
                };
            } else {
                throw new Error(response.data.message || 'Code verification failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Code verification failed';
            return { success: false, error: message };
        }
    };

    const resetPassword = async (tempToken, newPassword) => {
        try {
            if (!tempToken || !newPassword) {
                throw new Error('Token and new password are required');
            }

            // Use stored email and the tempToken (which is the code)
            const response = await axios.post('/api/admin/reset-password', {
                email: state.resetEmail,
                code: tempToken,
                newPassword
            });

            if (response.data.success) {
                // Clear stored email after successful reset
                dispatch({ type: 'SET_RESET_EMAIL', payload: '' });
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Password reset failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Password reset failed';
            return { success: false, error: message };
        }
    };

    const value = {
        ...state,
        login,
        logout,
        register,
        requestPasswordReset,
        verifyResetCode,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;