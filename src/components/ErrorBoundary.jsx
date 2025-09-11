import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorTime: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorTime: new Date().toISOString(),
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorTime: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                        <div className="text-red-500 mb-4 flex justify-center">
                            <FaExclamationTriangle size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                        <p className="mb-4 text-gray-600">
                            We've encountered an unexpected error. Our team has been notified.
                        </p>

                        {(import.meta && import.meta.env && import.meta.env.MODE === 'development') && (
                            <details className="mb-6 text-left bg-gray-50 p-3 rounded overflow-auto max-h-60 border border-gray-200">
                                <summary className="font-medium cursor-pointer text-gray-700">Error Details</summary>
                                <div className="mt-2">
                                    <p className="text-red-600 font-mono text-sm">
                                        {this.state.error?.toString()}
                                    </p>
                                    <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap overflow-x-auto">
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                    {this.state.errorTime && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Error occurred at: {new Date(this.state.errorTime).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <FaRedo /> Try Again
                            </button>
                            <a
                                href="/"
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                <FaHome /> Go Home
                            </a>
                        </div>

                        <div className="mt-6 text-sm text-gray-500">
                            <p>If the problem persists, please contact support with the error details above.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
