// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

// Context
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './Pages/Home';
import Banner from "./Pages/Banner";
import About from "./Pages/About";
import Navbar from "./Pages/Navbar";
import ResponsiveMenu from "./Pages/ResponsiveMenu";
import Projects from "./Pages/Projects";
import Contact from "./Pages/Contact";
import Research from "./Pages/Research";
import Expertise from './Pages/Expertise';
import HobbiesPage from "./Pages/HobbiesPage";
import Footer from './Pages/Footer';



// Existing Admin Pages
import AdminDashboard from './Pages/Admin/adminDashboard';
import SecuritySettings from './Pages/Admin/securitySettings';
import ManageBanner from './Pages/Admin/manageBanner';
import ManageResearch from './Pages/Admin/manageResearch';
import ManageProjects from './Pages/Admin/manageProjects';


// Auth Pages
import AdminLogin from './Pages/Admin/adminLogin';
import AdminRegister from './Pages/Admin/adminRegister';
import PasswordReset from './Pages/Admin/passwordReset';
import EmailVerification from './Pages/Admin/emailVerification';


// Login/Register wrappers to redirect if already authenticated
const AdminLoginWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLogin />;
};

const AdminRegisterWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminRegister />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Use Layout for public pages */}
      <Route element={<Layout />}>
        <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
        <Route path="/navbar" element={<ErrorBoundary><Navbar /></ErrorBoundary>} />
        <Route path="/responsivemenu" element={<ErrorBoundary><ResponsiveMenu /></ErrorBoundary>} />
        <Route path="/Banner" element={<ErrorBoundary><Banner /></ErrorBoundary>} />
        <Route path="/research" element={<ErrorBoundary><Research /></ErrorBoundary>} />
        <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />
        <Route path="/projects" element={<ErrorBoundary><Projects showAll={true} /></ErrorBoundary>} />
        <Route path="/contact" element={<ErrorBoundary><Contact /></ErrorBoundary>} />
        <Route path="/expertise" element={<ErrorBoundary><Expertise /></ErrorBoundary>} />
        <Route path="/hobbies" element={<ErrorBoundary><HobbiesPage /></ErrorBoundary>} />
        <Route path="/footer" element={<ErrorBoundary><Footer /></ErrorBoundary>} />
      </Route>


      {/* Admin Auth Routes */}
      <Route path="/admin/login" element={<AdminLoginWrapper />} />
      <Route path="/admin/register" element={<AdminRegisterWrapper />} />
      <Route path="/admin/password-reset" element={<ErrorBoundary><PasswordReset /></ErrorBoundary>} />
      <Route path="/admin/verify-email" element={<ErrorBoundary><EmailVerification /></ErrorBoundary>} />


      {/* Protected Admin Dashboard Route */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin={true}>
            <ErrorBoundary><AdminDashboard /></ErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Protected Content Management Routes - All authenticated admins can access */}
      <Route
        path="/admin/managebanner"
        element={
          <ProtectedRoute>
            <ErrorBoundary><ManageBanner /></ErrorBoundary>
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/manageresearch"
        element={
          <ProtectedRoute>
            <ErrorBoundary><ManageResearch /></ErrorBoundary>
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/manageprojects"
        element={
          <ProtectedRoute>
            <ErrorBoundary><ManageProjects /></ErrorBoundary>
          </ProtectedRoute>
        }
      />


      {/* Security Settings - Admin access required */}
      <Route
        path="/admin/security"
        element={
          <ProtectedRoute requireAdmin={true}>
            <ErrorBoundary><SecuritySettings /></ErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Admin redirect */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* 404 Route */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-gray-600 mb-6">Page not found</p>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      } />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastStyle={{
              fontSize: '14px'
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

