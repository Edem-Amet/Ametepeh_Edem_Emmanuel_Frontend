import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    FaShieldAlt,
    FaBell,
    FaLock,
    FaDesktop,
    FaHistory,
    FaSpinner,
    FaCheckCircle,
    FaExclamationTriangle,
    FaToggleOn,
    FaToggleOff,
    FaSave,
    FaEye,
    FaTrash,
    FaMapMarkerAlt,
    FaSignOutAlt,
    FaEyeSlash,
    FaUserShield,
    FaClock,
    FaArrowLeft
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import logo from '../../assets/edem_logo.png';

const SecuritySettings = () => {
    const { user, isPrincipal, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('notifications');
    const [isLoading, setIsLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [notifications, setNotifications] = useState({
        newLogin: true,
        newDevice: true,
        passwordChange: true,
        suspiciousActivity: true
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Redirect if not principal admin
    useEffect(() => {
        if (!isAuthenticated || !isPrincipal) {
            toast.error('Principal admin access required');
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, isPrincipal, navigate]);

    useEffect(() => {
        if (isAuthenticated && isPrincipal) {
            loadSecurityData();
        }
    }, [isAuthenticated, isPrincipal]);

    const loadSecurityData = async () => {
        setIsLoading(true);
        try {
            // Load notification preferences
            if (user?.emailNotifications) {
                setNotifications(user.emailNotifications);
            }

            // Load active sessions
            const response = await axios.get('/api/admin/active-sessions');
            if (response.data.success) {
                setSessions(response.data.data);
            }
        } catch (error) {
            console.error('Load security data error:', error);
            toast.error('Failed to load security settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationToggle = async (key) => {
        const updatedNotifications = {
            ...notifications,
            [key]: !notifications[key]
        };

        setNotifications(updatedNotifications);

        try {
            const response = await axios.post('/api/admin/update-notifications', {
                emailNotifications: updatedNotifications
            });

            if (response.data.success) {
                toast.success('Notification preferences updated');
            }
        } catch (error) {
            console.error('Update notifications error:', error);
            setNotifications(notifications); // Revert on error
            toast.error('Failed to update notification preferences');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('/api/admin/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            if (response.data.success) {
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                toast.success('Password changed successfully');
            }
        } catch (error) {
            console.error('Change password error:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoutAllDevices = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post('/api/admin/logout-all');
            if (response.data.success) {
                toast.success('Logged out from all devices');
                navigate('/admin/login');
            }
        } catch (error) {
            console.error('Logout all devices error:', error);
            toast.error('Failed to logout from all devices');
            setIsLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const tabs = [
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'sessions', label: 'Active Sessions', icon: FaDesktop },
        { id: 'password', label: 'Password', icon: FaLock },
        { id: 'activity', label: 'Recent Activity', icon: FaHistory }
    ];

    if (!isPrincipal) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Access Denied</h2>
                    <p className="text-gray-600 mb-5">Principal admin privileges required</p>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-5 py-2.5 bg-gradient-to-r from-secondary to-primary text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-md"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="mr-3 p-2 text-secondary hover:text-primary transition-colors duration-300 rounded-full hover:bg-gray-100"
                        >
                            <FaArrowLeft className="text-lg" />
                        </button>
                        <img src={logo} alt="Logo" className="h-9 w-9 rounded-full mr-3" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Security Settings</h1>
                            <p className="text-gray-600 text-sm">Principal admin security management</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Mobile Tab Navigation */}
                <div className="lg:hidden mb-6 bg-white rounded-xl shadow-sm p-2">
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                    >
                        {tabs.map((tab) => (
                            <option key={tab.id} value={tab.id}>
                                {tab.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Desktop Tab Navigation */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-2 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-3 border-b-2 font-medium text-sm flex items-center transition-all duration-300 ${activeTab === tab.id
                                            ? 'border-secondary text-secondary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Icon className="mr-2 text-base" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-5">Email Notifications</h3>
                            <div className="space-y-3">
                                {[
                                    { key: 'newLogin', label: 'New Login Alerts', desc: 'Get notified of all login attempts' },
                                    { key: 'newDevice', label: 'New Device Alerts', desc: 'Alert when logging in from unrecognized devices' },
                                    { key: 'passwordChange', label: 'Password Changes', desc: 'Notify when password is changed' },
                                    { key: 'suspiciousActivity', label: 'Suspicious Activity', desc: 'Alert for potential security threats' }
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1 mr-3">
                                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">{label}</h4>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle(key)}
                                            disabled={isLoading}
                                            className={`ml-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {notifications[key] ? (
                                                <FaToggleOn className="text-2xl text-green-500" />
                                            ) : (
                                                <FaToggleOff className="text-2xl text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sessions Tab */}
                    {activeTab === 'sessions' && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
                                <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
                                <button
                                    onClick={handleLogoutAllDevices}
                                    disabled={isLoading}
                                    className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300 text-sm disabled:opacity-50 flex items-center justify-center"
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    {isLoading ? 'Logging out...' : 'Logout All Devices'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                {sessions.map((session, index) => (
                                    <div
                                        key={session.sessionId}
                                        className={`p-3 sm:p-4 rounded-lg border-2 ${session.isCurrent
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <div className="text-2xl pt-1">
                                                    {session.deviceInfo?.deviceType === 'mobile' ? '📱' : '💻'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                                                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                                                            {session.deviceInfo?.browser || 'Unknown Browser'}
                                                        </h4>
                                                        {session.isCurrent && (
                                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1 sm:mt-0">
                                                                Current Session
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                                        <div className="flex items-center">
                                                            <FaDesktop className="mr-2 text-gray-400 text-xs" />
                                                            {session.deviceInfo?.os} • {session.deviceInfo?.deviceType}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FaMapMarkerAlt className="mr-2 text-gray-400 text-xs" />
                                                            {session.deviceInfo?.location || 'Unknown Location'}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FaClock className="mr-2 text-gray-400 text-xs" />
                                                            Last active: {formatTimeAgo(session.lastActivity)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {sessions.length === 0 && (
                                    <div className="text-center py-6">
                                        <FaDesktop className="text-4xl text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No active sessions found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-5">Change Password</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm(prev => ({
                                                ...prev,
                                                currentPassword: e.target.value
                                            }))}
                                            className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                                            placeholder="Enter current password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({
                                                ...prev,
                                                current: !prev.current
                                            }))}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.current ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm(prev => ({
                                                ...prev,
                                                newPassword: e.target.value
                                            }))}
                                            className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({
                                                ...prev,
                                                new: !prev.new
                                            }))}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.new ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm(prev => ({
                                                ...prev,
                                                confirmPassword: e.target.value
                                            }))}
                                            className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({
                                                ...prev,
                                                confirm: !prev.confirm
                                            }))}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.confirm ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-secondary to-primary text-white hover:opacity-90 shadow-md'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Changing Password...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="mr-2" />
                                            Change Password
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Password Security Tips */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Password Security Tips</h4>
                                <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                                    <li>• Use at least 8 characters with mixed case, numbers, and symbols</li>
                                    <li>• Avoid common words or personal information</li>
                                    <li>• Don't reuse your last 5 passwords</li>
                                    <li>• Consider using a password manager</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-5">Recent Security Activity</h3>

                            {/* Account Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                                        <div>
                                            <p className="font-medium text-green-800 text-sm">Account Status</p>
                                            <p className="text-xs text-green-600">Principal Admin - Verified & Secure</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaClock className="text-blue-500 mr-2 text-sm" />
                                        <div>
                                            <p className="font-medium text-blue-800 text-sm">Last Login</p>
                                            <p className="text-xs text-blue-600">{formatTimeAgo(user?.lastLogin)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="space-y-3">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-start">
                                        <FaCheckCircle className="text-green-500 mt-0.5 mr-2 text-sm" />
                                        <div>
                                            <p className="font-medium text-green-800 text-sm">Successful Login</p>
                                            <p className="text-xs text-green-600">
                                                {formatDate(user?.lastLogin)} • Current session
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="flex items-start">
                                        <FaUserShield className="text-gray-500 mt-0.5 mr-2 text-sm" />
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">Account Created</p>
                                            <p className="text-xs text-gray-600">
                                                {formatDate(user?.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Security Recommendations */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5 mt-6">
                    <div className="flex items-start">
                        <FaExclamationTriangle className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0 text-sm" />
                        <div>
                            <h4 className="text-yellow-800 font-medium mb-2 text-sm sm:text-base">Principal Admin Security Recommendations</h4>
                            <ul className="text-yellow-700 text-xs sm:text-sm space-y-1">
                                <li>• Enable all email notifications for maximum security awareness</li>
                                <li>• Regularly review and clean up active sessions</li>
                                <li>• Change your password every 90 days</li>
                                <li>• Always logout when using shared or public computers</li>
                                <li>• Monitor your email for any suspicious login alerts</li>
                                <li>• Regularly review pending admin registrations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;