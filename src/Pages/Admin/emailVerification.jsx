// components/auth/EmailVerification.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
    FaEnvelope,
    FaShieldAlt,
    FaArrowLeft
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../../assets/edem_logo.png';


const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const [verificationState, setVerificationState] = useState('verifying'); // verifying, success, error
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { verifyEmail } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setVerificationState('error');
            setError('Verification token is missing');
            setIsLoading(false);
            return;
        }

        verifyEmailToken(token);
    }, [searchParams]);

    const verifyEmailToken = async (token) => {
        try {
            setIsLoading(true);
            const result = await verifyEmail(token);

            if (result.success) {
                setVerificationState('success');
                toast.success('Email verified successfully!');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/admin/login', {
                        state: {
                            message: 'Email verified successfully. You can now login.'
                        }
                    });
                }, 3000);
            } else {
                setVerificationState('error');
                setError(result.error || 'Verification failed');
            }
        } catch (error) {
            setVerificationState('error');
            setError('An unexpected error occurred during verification');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = () => {
        switch (verificationState) {
            case 'verifying':
                return <FaSpinner className="animate-spin text-blue-500 text-6xl" />;
            case 'success':
                return <FaCheckCircle className="text-green-500 text-6xl" />;
            case 'error':
                return <FaExclamationTriangle className="text-red-500 text-6xl" />;
            default:
                return <FaSpinner className="animate-spin text-blue-500 text-6xl" />;
        }
    };

    const getStatusColor = () => {
        switch (verificationState) {
            case 'verifying':
                return 'border-blue-200 bg-blue-50';
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    const getStatusMessage = () => {
        switch (verificationState) {
            case 'verifying':
                return {
                    title: 'Verifying Your Email',
                    message: 'Please wait while we verify your email address...'
                };
            case 'success':
                return {
                    title: 'Email Verified Successfully!',
                    message: 'Your email has been verified. You can now access your admin account.'
                };
            case 'error':
                return {
                    title: 'Verification Failed',
                    message: error || 'Unable to verify your email address.'
                };
            default:
                return {
                    title: 'Processing...',
                    message: 'Please wait...'
                };
        }
    };

    const statusInfo = getStatusMessage();

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
            <div className="relative z-10 w-full mt-6 mb-6 max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gray border-b border-secondary px-4 sm:px-6 py-6 sm:py-8 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                            src={logo}
                            alt="Admin Portal Logo"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                        Email Verification
                    </h1>
                    <p className="text-secondary-light mt-1 sm:mt-2 text-sm sm:text-base">
                        Secure account activation
                    </p>
                </div>

                <div className="px-4 sm:px-6 py-8 sm:py-12">
                    {/* Status Display */}
                    <div className={`text-center p-6 rounded-xl border-2 ${getStatusColor()}`}>
                        <div className="mb-4">
                            {getStatusIcon()}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-3">
                            {statusInfo.title}
                        </h2>

                        <p className="text-gray-600 text-sm sm:text-base mb-6">
                            {statusInfo.message}
                        </p>

                        {/* Additional Info Based on State */}
                        {verificationState === 'success' && (
                            <div className="mb-6">
                                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                                    <FaShieldAlt className="mr-2" />
                                    Account activated and ready to use
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    Redirecting to login in 3 seconds...
                                </p>
                            </div>
                        )}

                        {verificationState === 'error' && (
                            <div className="mb-6 space-y-3">
                                <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm font-medium mb-1">
                                        Common Issues:
                                    </p>
                                    <ul className="text-red-700 text-xs space-y-1 text-left">
                                        <li>• Verification link has expired</li>
                                        <li>• Link has already been used</li>
                                        <li>• Invalid or corrupted token</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => navigate('/admin/register')}
                                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition text-sm"
                                >
                                    Request New Verification
                                </button>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {verificationState === 'success' && (
                            <div className="space-y-3">
                                <Link
                                    to="/admin/login"
                                    className="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-gradient-to-r from-secondary to-primary hover:shadow-lg transform hover:scale-[1.02] transition"
                                >
                                    <FaShieldAlt className="mr-2" />
                                    Continue to Login
                                </Link>
                            </div>
                        )}

                        {verificationState === 'verifying' && isLoading && (
                            <div className="text-blue-600 text-sm">
                                <p>This may take a few moments...</p>
                            </div>
                        )}
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/admin/login"
                            className="inline-flex items-center text-secondary hover:text-primary transition-colors text-sm"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Login
                        </Link>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-8 p-4 bg-secondary-light bg-opacity-10 border border-secondary-light border-opacity-20 rounded-lg">
                        <div className="flex items-start">
                            <FaEnvelope className="text-secondary mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="text-secondary font-medium mb-2 text-sm sm:text-base">
                                    Email Security
                                </h4>
                                <ul className="text-secondary text-opacity-80 text-xs sm:text-sm space-y-1">
                                    <li>• Verification links expire after 24 hours</li>
                                    <li>• Each link can only be used once</li>
                                    <li>• Check your spam folder if email is missing</li>
                                    <li>• All verification attempts are logged</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-secondary opacity-5 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
};

export default EmailVerification;