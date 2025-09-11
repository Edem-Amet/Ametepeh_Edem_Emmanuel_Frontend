// components/auth/PasswordReset.jsx
import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaEye,
    FaEyeSlash,
    FaLock,
    FaEnvelope,
    FaSpinner,
    FaExclamationTriangle,
    FaCheckCircle,
    FaShieldAlt,
    FaKey,
    FaArrowLeft,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../../assets/Edet Tech Logo.png';

const PasswordReset = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [tempToken, setTempToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
    const [resetSuccess, setResetSuccess] = useState(false);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);

    const { requestPasswordReset, verifyResetCode, resetPassword } = useAuth();
    const navigate = useNavigate();

    // Password strength checker
    const checkPasswordStrength = useCallback((password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password),
            noCommon: !/password|admin|123456|qwerty/i.test(password)
        };

        const score = Object.values(checks).filter(Boolean).length;
        const feedback = [];

        if (!checks.length) feedback.push('At least 8 characters');
        if (!checks.uppercase) feedback.push('One uppercase letter');
        if (!checks.lowercase) feedback.push('One lowercase letter');
        if (!checks.number) feedback.push('One number');
        if (!checks.special) feedback.push('One special character');
        if (!checks.noCommon) feedback.push('Avoid common passwords');

        setPasswordStrength({ score, feedback });
        return score >= 5;
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return null;
    };

    const validateCode = (code) => {
        if (!code.trim()) return 'Reset code is required';
        if (!/^\d{6}$/.test(code)) return 'Reset code must be 6 digits';
        return null;
    };

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;

        // Special handling for code input (only numbers)
        if (name === 'code') {
            const numericValue = value.replace(/\D/g, '').substring(0, 6);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear errors and check password strength
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        if (name === 'newPassword') {
            checkPasswordStrength(value);
        }
    }, [errors, checkPasswordStrength]);

    // Step 1: Request reset code
    const handleRequestReset = async (e) => {
        e.preventDefault();

        const emailError = validateEmail(formData.email);
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const result = await requestPasswordReset(formData.email.trim().toLowerCase());

            if (result.success) {
                setStep(2);
                toast.success('Reset code sent! Check your email.');
            }
        } catch (error) {
            toast.error('Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify reset code
    const handleVerifyCode = async (e) => {
        e.preventDefault();

        const codeError = validateCode(formData.code);
        if (codeError) {
            setErrors({ code: codeError });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const result = await verifyResetCode(formData.email, formData.code);

            if (result.success) {
                setTempToken(result.data.tempToken);
                setStep(3);
                toast.success('Code verified! Set your new password.');
            }
        } catch (error) {
            toast.error('Invalid or expired code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (!checkPasswordStrength(formData.newPassword)) {
            newErrors.newPassword = 'Password does not meet security requirements';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const result = await resetPassword(tempToken, formData.newPassword);

            if (result.success) {
                setResetSuccess(true);
                toast.success('Password reset successfully!');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/admin/login');
                }, 3000);
            }
        } catch (error) {
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score <= 2) return 'bg-red-500';
        if (passwordStrength.score <= 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength.score <= 2) return 'Weak';
        if (passwordStrength.score <= 4) return 'Medium';
        return 'Strong';
    };

    // Success screen
    if (resetSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
                    <FaCheckCircle className="text-green-500 text-5xl sm:text-6xl mx-auto mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Password Reset Complete!</h2>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                        Your password has been successfully reset. All existing sessions have been terminated for security.
                    </p>
                    <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg mb-4 sm:mb-6">
                        <p className="text-green-800 text-xs sm:text-sm">
                            <strong>Security Note:</strong> You'll need to login again from all devices.
                        </p>
                    </div>
                    <Link
                        to="/admin/login"
                        className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition text-sm sm:text-base"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-4">
            <div className="relative z-10 w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gray border-b border-secondary px-4 sm:px-6 py-5 sm:py-7 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                            src={logo}
                            alt="Admin Portal Logo"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                        Password Recovery
                    </h1>
                    <p className="text-secondary-light mt-1 sm:mt-2 text-xs sm:text-sm">
                        Step {step} of 3 - Secure password reset
                    </p>
                </div>

                <div className="px-4 sm:px-6 py-5 sm:py-7">
                    {/* Progress Indicator */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium ${step >= 1 ? 'text-secondary' : 'text-gray-400'}`}>
                                Email
                            </span>
                            <span className={`text-xs font-medium ${step >= 2 ? 'text-secondary' : 'text-gray-400'}`}>
                                Verify
                            </span>
                            <span className={`text-xs font-medium ${step >= 3 ? 'text-secondary' : 'text-gray-400'}`}>
                                Reset
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div
                                className="h-1.5 sm:h-2 bg-secondary rounded-full transition-all duration-300"
                                style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleRequestReset} noValidate>
                            <div className="mb-5 sm:mb-6">
                                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className={`text-sm ${errors.email ? 'text-red-500' : 'text-secondary'}`} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.email
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                        <FaExclamationTriangle className="mr-1 text-xs" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.email}
                                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium transition flex items-center justify-center text-sm ${isLoading || !formData.email
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-secondary text-white hover:bg-gradient-to-r from-secondary to-primary hover:shadow-lg transform hover:scale-[1.02]'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2 text-xs" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        <FaEnvelope className="mr-2 text-xs" />
                                        Send Reset Code
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Code Verification */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} noValidate>
                            <div className="mb-5 sm:mb-6 text-center">
                                <FaEnvelope className="text-secondary text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    We've sent a 6-digit code to
                                </p>
                                <p className="font-medium text-gray-800 text-sm sm:text-base">{formData.email}</p>
                            </div>

                            <div className="mb-5 sm:mb-6">
                                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                    Verification Code
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaKey className={`text-sm ${errors.code ? 'text-red-500' : 'text-secondary'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="code"
                                        placeholder="Enter 6-digit code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        maxLength={6}
                                        className={`w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg text-sm text-center font-mono tracking-wider focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.code
                                            ? 'border-red-500 bg-red-50'
                                            : formData.code.length === 6
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                        autoComplete="one-time-code"
                                    />
                                </div>
                                {errors.code && (
                                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                        <FaExclamationTriangle className="mr-1 text-xs" />
                                        {errors.code}
                                    </p>
                                )}
                                <p className="mt-1.5 text-xs text-gray-500">
                                    Code expires in 15 minutes for security
                                </p>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <button
                                    type="submit"
                                    disabled={isLoading || formData.code.length !== 6}
                                    className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium transition flex items-center justify-center text-sm ${isLoading || formData.code.length !== 6
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-secondary text-white hover:bg-gradient-to-r from-secondary to-primary hover:shadow-lg transform hover:scale-[1.02]'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2 text-xs" />
                                            Verifying Code...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="mr-2 text-xs" />
                                            Verify Code
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    disabled={isLoading}
                                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm"
                                >
                                    <FaArrowLeft className="mr-2 text-xs" />
                                    Back to Email
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} noValidate>
                            <div className="mb-5 sm:mb-6 text-center">
                                <FaLock className="text-secondary text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    Create a strong new password for your account
                                </p>
                            </div>

                            {/* New Password */}
                            <div className="mb-5 sm:mb-6">
                                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className={`text-sm ${errors.newPassword ? 'text-red-500' : 'text-secondary'}`} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        placeholder="Create a strong password"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.newPassword
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading || !formData.newPassword}
                                        className={`absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary transition text-sm ${(isLoading || !formData.newPassword) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {formData.newPassword && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-600">Password Strength</span>
                                            <span className={`text-xs font-medium ${passwordStrength.score <= 2 ? 'text-red-600' :
                                                passwordStrength.score <= 4 ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                            ></div>
                                        </div>
                                        {passwordStrength.feedback.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-600 mb-1">Still needed:</p>
                                                <ul className="text-xs text-gray-500 space-y-1">
                                                    {passwordStrength.feedback.map((item, index) => (
                                                        <li key={index} className="flex items-center">
                                                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errors.newPassword && (
                                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                        <FaExclamationTriangle className="mr-1 text-xs" />
                                        {errors.newPassword}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-5 sm:mb-6">
                                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className={`text-sm ${errors.confirmPassword ? 'text-red-500' : 'text-secondary'}`} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Confirm your new password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.confirmPassword
                                            ? 'border-red-500 bg-red-50'
                                            : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading || !formData.confirmPassword}
                                        className={`absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary transition text-sm ${(isLoading || !formData.confirmPassword) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                                    <p className="mt-1.5 text-xs text-green-600 flex items-center">
                                        <FaCheckCircle className="mr-1 text-xs" />
                                        Passwords match
                                    </p>
                                )}
                                {errors.confirmPassword && (
                                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                        <FaExclamationTriangle className="mr-1 text-xs" />
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <button
                                    type="submit"
                                    disabled={isLoading || passwordStrength.score < 5 || formData.newPassword !== formData.confirmPassword}
                                    className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium transition flex items-center justify-center text-sm ${isLoading || passwordStrength.score < 5 || formData.newPassword !== formData.confirmPassword
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-secondary text-white hover:bg-gradient-to-r from-secondary to-primary hover:shadow-lg transform hover:scale-[1.02]'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2 text-xs" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            <FaShieldAlt className="mr-2 text-xs" />
                                            Reset Password
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={isLoading}
                                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm"
                                >
                                    <FaArrowLeft className="mr-2 text-xs" />
                                    Back to Code
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <Link
                            to="/admin/login"
                            className="text-secondary hover:text-primary transition-colors text-xs sm:text-sm flex items-center justify-center"
                        >
                            <FaArrowLeft className="mr-1 text-xs" />
                            Back to Login
                        </Link>
                    </div>

                    {/* Security Notice - Collapsible on mobile */}
                    <div className="mt-6 sm:mt-8">
                        <button
                            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                            className="w-full flex items-center justify-between p-3 bg-secondary-light bg-opacity-10 border border-secondary-light border-opacity-20 rounded-lg text-left"
                        >
                            <div className="flex items-center">
                                <FaShieldAlt className="text-secondary mr-2 flex-shrink-0" />
                                <span className="text-secondary font-medium text-sm sm:text-base">
                                    Security Information
                                </span>
                            </div>
                            {showSecurityInfo ? (
                                <FaChevronUp className="text-secondary text-xs" />
                            ) : (
                                <FaChevronDown className="text-secondary text-xs" />
                            )}
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSecurityInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pt-3 px-3 pb-1 bg-secondary-light bg-opacity-10 border border-secondary-light border-opacity-20 border-t-0 rounded-b-lg">
                                <ul className="text-secondary text-opacity-80 text-xs sm:text-sm space-y-1.5">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Reset codes expire in 15 minutes</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>All sessions will be terminated after reset</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Cannot reuse previous 5 passwords</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Password reset attempts are rate limited</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>All activities are logged for security</span>
                                    </li>
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
            </div>
        </div>
    );
};

export default PasswordReset;