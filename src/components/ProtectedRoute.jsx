// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaShieldAlt } from 'react-icons/fa';

const ProtectedRoute = ({ children, requireAdmin = false, requirePrincipal = false }) => {
    const { isAuthenticated, isLoading, user, isPrincipal } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
                    <p className="text-gray-600 text-sm sm:text-base">
                        Verifying authentication...
                    </p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/admin/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // Check if admin privileges are required
    if (requireAdmin && (!user || user.status !== 'approved')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <FaShieldAlt className="text-red-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">
                        {user?.status === 'pending'
                            ? 'Your account is pending approval. Please wait for a principal admin to approve your access.'
                            : user?.status === 'suspended'
                                ? 'Your account has been suspended. Please contact the administrator.'
                                : 'You don\'t have sufficient privileges to access this resource. Admin access is required.'
                        }
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                            Go Back
                        </button>
                        <Navigate to="/" replace />
                    </div>
                </div>
            </div>
        );
    }

    // Check if principal privileges are required
    if (requirePrincipal && !isPrincipal) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <FaShieldAlt className="text-red-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Principal Access Required</h2>
                    <p className="text-gray-600 mb-6">
                        This feature requires principal admin privileges. Only principal administrators can access this resource.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                            Go Back
                        </button>
                        <Navigate to="/admin/dashboard" replace />
                    </div>
                </div>
            </div>
        );
    }

    // If all checks pass, render the protected content
    return children;
};

export default ProtectedRoute;