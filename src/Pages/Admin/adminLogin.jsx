import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaEye,
    FaEyeSlash,
    FaLock,
    FaEnvelope,
    FaSpinner,
    FaExclamationTriangle,
    FaShieldAlt,
    FaUserShield,
    FaInfoCircle,
    FaQuestionCircle,
    FaKey,
    FaChevronDown,
    FaChevronUp,
    FaMobile,
    FaDesktop,
    FaTablet
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../../assets/edem_logo.png';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [attempts, setAttempts] = useState(0);
    const [lockoutTimer, setLockoutTimer] = useState(0);
    const [rateLimited, setRateLimited] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);

    const MAX_ATTEMPTS = 5;
    const LOCKOUT_TIME = 15 * 60; // 15 minutes in seconds

    const { login } = useAuth();
    const navigate = useNavigate();

    // Get device information
    useEffect(() => {
        const getDeviceInfo = () => {
            const userAgent = navigator.userAgent;
            let browser = 'Unknown';
            if (userAgent.includes('Chrome')) browser = 'Chrome';
            else if (userAgent.includes('Firefox')) browser = 'Firefox';
            else if (userAgent.includes('Safari')) browser = 'Safari';
            else if (userAgent.includes('Edge')) browser = 'Edge';

            let deviceType = 'Desktop';
            let deviceIcon = <FaDesktop className="text-sm" />;
            if (/Mobile|Android|iPhone/.test(userAgent)) {
                deviceType = /iPad/.test(userAgent) ? 'Tablet' : 'Mobile';
                deviceIcon = deviceType === 'Tablet' ? <FaTablet className="text-sm" /> : <FaMobile className="text-sm" />;
            }

            setDeviceInfo({ browser, deviceType, platform: navigator.platform, deviceIcon });
        };
        getDeviceInfo();
    }, []);

    // Handle lockout state
    useEffect(() => {
        const lockoutData = localStorage.getItem('admin_lockout');
        if (lockoutData) {
            const { timestamp, attempts: storedAttempts } = JSON.parse(lockoutData);
            const timeElapsed = Math.floor((Date.now() - timestamp) / 1000);

            if (timeElapsed < LOCKOUT_TIME && storedAttempts >= MAX_ATTEMPTS) {
                setRateLimited(true);
                setAttempts(storedAttempts);
                setLockoutTimer(LOCKOUT_TIME - timeElapsed);
            } else {
                localStorage.removeItem('admin_lockout');
            }
        }
    }, []);

    // Lockout timer countdown
    useEffect(() => {
        let interval;
        if (rateLimited && lockoutTimer > 0) {
            interval = setInterval(() => {
                setLockoutTimer((prev) => {
                    if (prev <= 1) {
                        setRateLimited(false);
                        setAttempts(0);
                        localStorage.removeItem('admin_lockout');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [rateLimited, lockoutTimer]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFailedAttempt = () => {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
            setRateLimited(true);
            setLockoutTimer(LOCKOUT_TIME);
            localStorage.setItem('admin_lockout', JSON.stringify({
                timestamp: Date.now(),
                attempts: newAttempts
            }));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (rateLimited) return;
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const result = await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            if (result.success) {
                setAttempts(0);
                localStorage.removeItem('admin_lockout');
                // Redirect to dashboard on successful login
                navigate('/admin/dashboard');
            } else {
                if (result.code === 'ACCOUNT_NOT_APPROVED') {
                    setErrors({ general: 'Account pending approval by principal admin' });
                } else if (result.message.includes('Invalid credentials')) {
                    handleFailedAttempt();
                    setErrors({ general: result.message });
                } else {
                    setErrors({ general: result.message });
                }
            }
        } catch (error) {
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleUseDefaultAdmin = () => {
        setFormData({
            email: 'edemamet18@gmail.com',
            password: 'Admin@2024'
        });
        toast.info('Default admin credentials filled. Please change password after login.');
    };

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
                        Admin Portal
                    </h1>
                    <p className="text-secondary-light mt-1 sm:mt-2 text-xs sm:text-sm">
                        Secure administrative access
                    </p>
                </div>

                <div className="px-4 sm:px-6 py-5 sm:py-7">
                    {/* Security Status */}
                    {deviceInfo && (
                        <div className="bg-secondary-light bg-opacity-10 border border-secondary-light border-opacity-20 rounded-lg p-3 sm:p-4 mb-5 sm:mb-6">
                            <div className="flex items-start">
                                <FaShieldAlt className="text-secondary mt-0.5 mr-2 flex-shrink-0" />
                                <div className="text-secondary text-opacity-90 text-xs sm:text-sm">
                                    <div className="font-medium flex items-center">
                                        {deviceInfo.deviceIcon}
                                        <span className="ml-2">{deviceInfo.browser} on {deviceInfo.deviceType}</span>
                                    </div>
                                    <div className="text-secondary text-opacity-70 text-xs mt-1">
                                        All login attempts are monitored and logged
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Alerts */}
                    {errors.general && (
                        <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start">
                                <FaExclamationTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                                <div>
                                    <h4 className="text-red-800 font-medium text-xs sm:text-sm">Authentication Error</h4>
                                    <p className="text-red-700 text-xs sm:text-sm mt-1">{errors.general}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {rateLimited && (
                        <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start">
                                <FaExclamationTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                                <div>
                                    <h4 className="text-red-800 font-medium text-xs sm:text-sm">Account Temporarily Locked</h4>
                                    <p className="text-red-700 text-xs sm:text-sm mt-1">
                                        Too many failed attempts. Wait {formatTime(lockoutTimer)}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className={`text-sm ${errors.email ? 'text-red-500' : 'text-secondary'}`} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading || rateLimited}
                                    className={`w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.email
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        } ${(isLoading || rateLimited) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder="admin@example.com"
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

                        <div>
                            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className={`text-sm ${errors.password ? 'text-red-500' : 'text-secondary'}`} />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading || rateLimited}
                                    className={`w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${errors.password
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        } ${(isLoading || rateLimited) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading || rateLimited || !formData.password}
                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary transition text-sm ${(isLoading || rateLimited || !formData.password) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
                        </div>

                        {/* Attempt Warning */}
                        {attempts > 0 && attempts < MAX_ATTEMPTS && !rateLimited && (
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <div className="flex items-center">
                                    <FaExclamationTriangle className="text-orange-500 mr-2 text-xs" />
                                    <p className="text-orange-800 text-xs">
                                        <strong>{MAX_ATTEMPTS - attempts}</strong> attempt(s) remaining before lockout
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || rateLimited}
                            className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium transition flex items-center justify-center text-sm ${isLoading || rateLimited
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-secondary text-white hover:bg-gradient-to-r from-secondary to-primary hover:shadow-lg transform hover:scale-[1.02]'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2 text-xs" />
                                    Authenticating...
                                </>
                            ) : rateLimited ? (
                                <>
                                    <FaLock className="mr-2 text-xs" />
                                    Locked ({formatTime(lockoutTimer)})
                                </>
                            ) : (
                                <>
                                    <FaUserShield className="mr-2 text-xs" />
                                    Secure Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Default Admin Button */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleUseDefaultAdmin}
                            className="text-xs text-secondary hover:text-primary transition-colors flex items-center justify-center mx-auto"
                        >
                            <FaKey className="mr-1" />
                            Use default admin credentials
                        </button>
                    </div>

                    {/* Additional Links */}
                    <div className="mt-5 sm:mt-6 space-y-2 text-center">
                        <Link
                            to="/admin/password-reset"
                            className="block text-secondary hover:text-primary transition-colors text-xs sm:text-sm font-medium"
                        >
                            Forgot Password?
                        </Link>
                        <Link
                            to="/admin/register"
                            className="block text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm"
                        >
                            Need an admin account? Register here
                        </Link>

                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center mx-auto"
                        >
                            <FaQuestionCircle className="mr-1" />
                            Not receiving emails?
                        </button>
                    </div>

                    {/* Email Troubleshooting Help */}
                    {showHelp && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="text-yellow-800 font-medium text-xs mb-2 flex items-center">
                                <FaInfoCircle className="mr-1" />
                                Email Troubleshooting
                            </h4>
                            <ul className="text-yellow-700 text-xs space-y-1">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Check your spam/junk folder</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Verify your email service is not blocking messages</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Default admin email: <span className="font-mono">admin@lifelongreaders.com</span></span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Default password: <span className="font-mono">Admin@2024</span></span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Ensure your email server is properly configured</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Security Notice - Collapsible */}
                    <div className="mt-5 sm:mt-6">
                        <button
                            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                            className="w-full flex items-center justify-between p-3 bg-secondary-light bg-opacity-10 border border-secondary-light border-opacity-20 rounded-lg text-left"
                        >
                            <div className="flex items-center">
                                <FaShieldAlt className="text-secondary mr-2 flex-shrink-0" />
                                <span className="text-secondary font-medium text-sm sm:text-base">
                                    Enhanced Security
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
                                        <span>Email notifications for all login attempts</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>New device detection and alerts</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Account lockout after {MAX_ATTEMPTS} failed attempts</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Session management across devices</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Comprehensive audit logging</span>
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

export default AdminLogin;