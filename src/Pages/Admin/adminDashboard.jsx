// pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    FaBook,
    FaStar,
    FaBullseye,
    FaUsers,
    FaSignOutAlt,
    FaSync,
    FaCheck,
    FaTimes,
    FaCog,
    FaUserShield,
    FaEllipsisV,
    FaChevronDown,
    FaChevronUp,
    FaBell,
    FaUserCircle
} from 'react-icons/fa';
import logo from '../../assets/edem_logo.png';

const AdminDashboard = () => {
    const { user, logout, isPrincipal, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const [allAdmins, setAllAdmins] = useState([]);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch dashboard data on load
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchDashboardData();
            if (isPrincipal) {
                fetchPendingAdmins();
            }
        }
    }, [isAuthenticated, user, isPrincipal]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/admin/dashboard-stats');
            if (response.data.success) {
                setDashboardData(response.data.data);
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPendingAdmins = async () => {
        if (!isPrincipal) return;

        try {
            const response = await axios.get('/api/admin/pending-registrations');
            if (response.data.success) {
                setPendingAdmins(response.data.data.pendingRegistrations);
            }
        } catch (error) {
            console.error('Fetch pending admins error:', error);
        }
    };

    const fetchAllAdmins = async () => {
        if (!isPrincipal) {
            toast.error('Principal access required');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get('/api/admin/admins');
            if (response.data.success) {
                setAllAdmins(response.data.data.admins);
                setShowAdminModal(true);
            }
        } catch (error) {
            console.error('Fetch admins error:', error);
            toast.error('Failed to fetch admin list');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveAdmin = async (adminId) => {
        try {
            const response = await axios.post(`/api/admin/approve/${adminId}`);
            if (response.data.success) {
                toast.success('Admin approved successfully');
                fetchPendingAdmins();
            }
        } catch (error) {
            console.error('Approve admin error:', error);
            toast.error('Failed to approve admin');
        }
    };

    const handleRejectAdmin = async (adminId, reason = '') => {
        try {
            const response = await axios.post(`/api/admin/reject/${adminId}`, { reason });
            if (response.data.success) {
                toast.success('Admin rejected');
                fetchPendingAdmins();
            }
        } catch (error) {
            console.error('Reject admin error:', error);
            toast.error('Failed to reject admin');
        }
    };

    const handleLogoutAll = async () => {
        if (!isPrincipal) {
            toast.error('Principal access required');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('/api/admin/logout-all');
            if (response.data.success) {
                toast.success('Logged out from all devices');
                navigate('/admin/login');
            }
        } catch (error) {
            console.error('Logout all error:', error);
            toast.error('Failed to logout from all devices');
        } finally {
            setIsLoading(false);
            setShowLogoutModal(false);
        }
    };

    const handleRegularLogout = async () => {
        try {
            const result = await logout(false);
            if (result.success) {
                navigate('/admin/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    const toggleAdminStatus = async (adminId, currentStatus) => {
        if (!isPrincipal) {
            toast.error('Principal access required');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/admin/toggle-status/${adminId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                fetchAllAdmins();
            }
        } catch (error) {
            console.error('Toggle admin status error:', error);
            toast.error('Failed to update admin status');
        } finally {
            setIsLoading(false);
        }
    };

    // Management routes for all authenticated admins
    const managementRoutes = [
        {
            title: 'Manage Banner',
            description: 'Update homepage Banner sections',
            icon: <FaBullseye className="text-xl" />,
            path: '/admin/managebanner',
            color: 'bg-blue-500'
        },
        {
            title: 'Manage Research',
            description: 'Add, edit, and organize Research Works',
            icon: <FaBook className="text-xl" />,
            path: '/admin/manageresearch',
            color: 'bg-green-500'
        },
        {
            title: 'Manage Blogs',
            description: 'Create and manage blog posts',
            icon: <FaBook className="text-xl" />,
            path: '/admin/manageblogs',
            color: 'bg-yellow-500'
        },
        {
            title: 'Manage Projects',
            description: 'Manage Personal Projects',
            icon: <FaStar className="text-xl" />,
            path: '/admin/manageprojects',
            color: 'bg-purple-500'
        }
    ];

    // Add security settings for principal only
    if (isPrincipal) {
        managementRoutes.push({
            title: 'Security Settings',
            description: 'Admin security and system settings',
            icon: <FaCog className="text-xl" />,
            path: '/admin/security',
            color: 'bg-red-500'
        });
    }

    if (isLoading && !dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mb-20 pb-12">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm border-b p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={logo} alt="Logo" className="h-8 w-8 rounded-full mr-2" />
                        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        {isPrincipal && pendingAdmins.length > 0 && (
                            <button
                                onClick={() => setShowPendingModal(true)}
                                className="relative p-2 bg-orange-100 text-orange-600 rounded-lg"
                            >
                                <FaBell />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {pendingAdmins.length}
                                </span>
                            </button>
                        )}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="p-2 bg-gray-100 rounded-lg"
                        >
                            <FaEllipsisV className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {showMobileMenu && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-b z-10">
                        <div className="p-4 space-y-3">
                            <button
                                onClick={fetchDashboardData}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-2 bg-secondary text-white rounded-lg disabled:opacity-50"
                            >
                                <FaSync className="mr-2" />
                                {isLoading ? 'Refreshing...' : 'Refresh'}
                            </button>

                            {isPrincipal && (
                                <>
                                    <button
                                        onClick={fetchAllAdmins}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg"
                                    >
                                        <FaUsers className="mr-2" />
                                        All Admins
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <img src={logo} alt="Logo" className="h-10 w-10 rounded-full mr-3" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-gray-500 text-sm">Welcome back, {user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={fetchDashboardData}
                                disabled={isLoading}
                                className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary disabled:opacity-50 transition duration-200 text-sm"
                            >
                                <FaSync className="mr-2" />
                                {isLoading ? 'Refreshing...' : 'Refresh'}
                            </button>

                            {isPrincipal && (
                                <>
                                    {pendingAdmins.length > 0 && (
                                        <button
                                            onClick={() => setShowPendingModal(true)}
                                            className="relative flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 text-sm"
                                        >
                                            <FaBell className="mr-2" />
                                            Pending
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {pendingAdmins.length}
                                            </span>
                                        </button>
                                    )}
                                    <button
                                        onClick={fetchAllAdmins}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm"
                                    >
                                        <FaUsers className="mr-2" />
                                        All Admins
                                    </button>
                                </>
                            )}

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    {showUserMenu ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <button
                                            onClick={() => setShowLogoutModal(true)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FaSignOutAlt className="mr-2 text-red-500" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                {/* User Info Card */}
                <div className="mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{user?.name}</h2>
                                    <p className="text-gray-500 text-sm sm:text-base">{user?.email}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isPrincipal ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {isPrincipal ? 'Principal Admin' : 'Admin'}
                                        </span>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="text-xs sm:text-sm text-gray-500">Last Login</p>
                                <p className="text-gray-900 font-medium text-sm sm:text-base">
                                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                                    Active Sessions: {user?.activeSessions || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Principal Only Stats */}
                    {isPrincipal && (
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs sm:text-sm">Total Admins</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {dashboardData?.adminStats?.totalAdmins || '...'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FaUsers className="text-red-600 text-lg sm:text-xl" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Management Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {managementRoutes.map((route, index) => (
                        <Link
                            key={index}
                            to={route.path}
                            className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="p-4 sm:p-6">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${route.color} rounded-lg flex items-center justify-center text-white text-lg sm:text-xl mb-3 sm:mb-4`}>
                                    {route.icon}
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{route.title}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">{route.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Pending Admins Modal - Principal Only */}
            {showPendingModal && isPrincipal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Pending Admin Approvals</h2>
                                <button
                                    onClick={() => setShowPendingModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="overflow-auto max-h-[calc(90vh-80px)]">
                            <div className="p-4 sm:p-6">
                                <div className="space-y-3 sm:space-y-4">
                                    {pendingAdmins.map((admin) => (
                                        <div key={admin._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {admin.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base">{admin.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500">{admin.email}</p>
                                                    <p className="text-xs text-gray-400">
                                                        Registered: {new Date(admin.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 self-end sm:self-auto">
                                                <button
                                                    onClick={() => handleApproveAdmin(admin._id)}
                                                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                                                >
                                                    <FaCheck className="mr-1" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectAdmin(admin._id, 'Application rejected by principal admin')}
                                                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
                                                >
                                                    <FaTimes className="mr-1" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingAdmins.length === 0 && (
                                        <p className="text-center text-gray-500 py-6 sm:py-8">No pending approvals</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* All Admins Modal - Principal Only */}
            {showAdminModal && isPrincipal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Administrators</h2>
                                <button
                                    onClick={() => setShowAdminModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="overflow-auto max-h-[calc(90vh-80px)]">
                            <div className="p-4 sm:p-6">
                                <div className="space-y-3 sm:space-y-4">
                                    {allAdmins.map((admin) => (
                                        <div key={admin._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {admin.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base">{admin.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500">{admin.email}</p>
                                                    <p className="text-xs text-gray-400">
                                                        Last login: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 self-end sm:self-auto">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    admin.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {admin.status}
                                                </span>
                                                {admin.status !== 'pending' && (
                                                    <button
                                                        onClick={() => toggleAdminStatus(admin._id, admin.status)}
                                                        className={`px-2 py-1 text-xs font-medium rounded-lg transition flex items-center ${admin.status === 'approved'
                                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                                            : 'bg-green-600 text-white hover:bg-green-700'
                                                            }`}
                                                    >
                                                        {admin.status === 'approved' ? 'Suspend' : 'Activate'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {allAdmins.length === 0 && (
                                        <p className="text-center text-gray-500 py-6 sm:py-8">No administrators found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Logout Options</h2>
                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Choose how you want to logout:</p>

                            <div className="space-y-2 sm:space-y-3">
                                <button
                                    onClick={handleRegularLogout}
                                    className="w-full flex items-center justify-center px-4 py-2 sm:py-3 bg-secondary text-white rounded-lg hover:bg-primary transition duration-200"
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    Logout This Device
                                </button>

                                {isPrincipal && (
                                    <button
                                        onClick={handleLogoutAll}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center px-4 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition duration-200"
                                    >
                                        <FaUserShield className="mr-2" />
                                        {isLoading ? 'Logging out...' : 'Logout All Devices'}
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="w-full px-4 py-2 sm:py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;