import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { FaUser, FaEnvelope, FaShieldAlt, FaSignOutAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const DashboardPage = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user) {
      setEditForm({
        username: user.username,
        email: user.email,
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditToggle = () => {
    if (isEditing && user) {
      // Reset form if canceling
      setEditForm({
        username: user.username,
        email: user.email,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await updateProfile(editForm.username, editForm.email);
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <FaUser className="mr-3 text-blue-500" />
              Account Settings
            </h2>
            <button
              onClick={isEditing ? handleEditToggle : () => setIsEditing(true)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isEditing
                  ? 'bg-gray-500 hover:bg-gray-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isEditing ? (
                <>
                  <FaTimes className="mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaUser className="mr-2 text-gray-500" />
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-900">{user.username}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaEnvelope className="mr-2 text-gray-500" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-900">{user.email}</span>
                </div>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaShieldAlt className="mr-2 text-gray-500" />
                Role
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* User ID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-900">#{user.id}</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSave className="mr-2" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/movies')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left"
            >
              <h4 className="font-semibold text-blue-900">Browse Movies</h4>
              <p className="text-sm text-blue-700 mt-1">Explore our movie collection</p>
            </button>
            
            <button
              onClick={() => navigate('/booking')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left"
            >
              <h4 className="font-semibold text-green-900">My Bookings</h4>
              <p className="text-sm text-green-700 mt-1">View your ticket history</p>
            </button>
            
            <button
              onClick={() => navigate('/events')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
            >
              <h4 className="font-semibold text-purple-900">Events</h4>
              <p className="text-sm text-purple-700 mt-1">Check upcoming events</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;