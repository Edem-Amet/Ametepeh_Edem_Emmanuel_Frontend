// components/auth/AdminRegister.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
    FaCheckCircle,
    FaExclamationTriangle,
    FaShieldAlt,
    FaUserPlus,
    FaArrowLeft,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../../assets/edem_logo.png';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [showRegistrationInfo, setShowRegistrationInfo] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const result = await register({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            if (result.success) {
                setRegistrationSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/admin/login', {
                        state: {
                            message: 'Registration submitted. Awaiting principal admin approval.'
                        }
                    });
                }, 3000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Success screen
    if (registrationSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
                <div className="max-w-md w-full bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 text-center">
                    <FaCheckCircle className="text-green-500 text-5xl sm:text-6xl mx-auto mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Registration Successful!</h2>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                        Your admin registration has been submitted successfully. A principal admin will review your application.
                    </p>
                    <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4 sm:mb-6">
                        <p className="text-blue-800 text-xs sm:text-sm">
                            <strong>What's next?</strong> You'll receive an email notification once your account is approved or if additional information is needed.
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                        Redirecting to login in 3 seconds...
                    </p>
                    <Link
                        to="/admin/login"
                        className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition text-sm sm:text-base"
                    >
                        Go to Login Now
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
                        Admin Registration
                    </h1>
                    <p className="text-secondary-light mt-1 sm:mt-2 text-xs sm:text-sm">
                        Request admin access to the bookshop
                    </p>
                </div>

                <div className="px-4 sm:px-6 py-5 sm:py-7">
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Name Field */}
                        <div className="mb-5 sm:mb-6">
                            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className={`text-sm ${errors.name ? 'text-red-500' : 'text-secondary'}`} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.name
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <FaExclamationTriangle className="mr-1 text-xs" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
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

                        {/* Password Field */}
                        <div className="mb-5 sm:mb-6">
                            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className={`text-sm ${errors.password ? 'text-red-500' : 'text-secondary'}`} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.password
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading || !formData.password}
                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary transition text-sm ${(isLoading || !formData.password) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                    <FaExclamationTriangle className="mr-1 text-xs" />
                                    {errors.password}
                                </p>
                            )}
                            <p className="mt-1.5 text-xs text-gray-500">
                                Password must be at least 8 characters long
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-5 sm:mb-6">
                            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className={`text-sm ${errors.confirmPassword ? 'text-red-500' : 'text-secondary'}`} />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.confirmPassword
                                        ? 'border-red-500 bg-red-50'
                                        : formData.confirmPassword && formData.password === formData.confirmPassword
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
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
                            className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium transition flex items-center justify-center text-sm ${isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-secondary text-white hover:bg-gradient-to-r from-secondary to-primary hover:shadow-lg transform hover:scale-[1.02]'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2 text-xs" />
                                    Submitting Registration...
                                </>
                            ) : (
                                <>
                                    <FaUserPlus className="mr-2 text-xs" />
                                    Submit Registration
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-gray-600 text-xs sm:text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/admin/login"
                                className="text-secondary hover:text-primary transition-colors font-medium"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    {/* Registration Info - Collapsible on mobile */}
                    <div className="mt-6 sm:mt-8">
                        <button
                            onClick={() => setShowRegistrationInfo(!showRegistrationInfo)}
                            className="w-full flex items-center justify-between p-3 bg-secondary-light bg-opacity-10 border border-secondary-light border-opacity-20 rounded-lg text-left"
                        >
                            <div className="flex items-center">
                                <FaShieldAlt className="text-secondary mr-2 flex-shrink-0" />
                                <span className="text-secondary font-medium text-sm sm:text-base">
                                    Registration Information
                                </span>
                            </div>
                            {showRegistrationInfo ? (
                                <FaChevronUp className="text-secondary text-xs" />
                            ) : (
                                <FaChevronDown className="text-secondary text-xs" />
                            )}
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showRegistrationInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pt-3 px-3 pb-1 bg-secondary-light bg-opacity-10 border border-secondary-light border-opacity-20 border-t-0 rounded-b-lg">
                                <ul className="text-secondary text-opacity-80 text-xs sm:text-sm space-y-1.5">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Your registration requires principal admin approval</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>You'll receive an email notification once approved</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Only authorized personnel can access admin features</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>All registration attempts are logged for security</span>
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-secondary opacity-5 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
};

export default AdminRegister;