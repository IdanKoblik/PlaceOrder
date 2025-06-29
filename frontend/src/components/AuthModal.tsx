import React, { useState } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleSignIn } from './GoogleSignIn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  requireAdmin?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Authentication Required",
  requireAdmin = false
}) => {
  const { user, isAuthenticated, checkAdminAccess } = useAuth();
  const [error, setError] = useState('');

  const handleSignInSuccess = () => {
    setError('');
    
    // Check if admin access is required
    if (requireAdmin && !checkAdminAccess()) {
      setError('Admin access required. Please contact your administrator.');
      return;
    }
    
    onSuccess();
  };

  const handleSignInError = (error: Error) => {
    setError(error.message || 'Authentication failed. Please try again.');
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  // If user is already authenticated but doesn't have admin access
  if (isAuthenticated && requireAdmin && !checkAdminAccess()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Access Denied</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="font-medium text-red-800">Admin Access Required</p>
              </div>
              <p className="text-sm text-red-700">
                You are signed in as <strong>{user?.name}</strong> ({user?.email}), 
                but you don't have administrator privileges for this feature.
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              Please contact your system administrator to request access to Table Management features.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            {requireAdmin 
              ? 'Administrator authentication is required to access Table Management features.'
              : 'Please sign in to continue.'
            }
          </p>
          
          {requireAdmin && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> Only authorized administrators can access this feature. 
                Your Google account must be registered as an admin.
              </p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <GoogleSignIn 
            onSuccess={handleSignInSuccess}
            onError={handleSignInError}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};