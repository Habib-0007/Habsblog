'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { User, Mail, Calendar, Shield, Trash2, X } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import LoadingPage from '../../components/common/LoadingPage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users', page, limit],
    queryFn: () => adminApi.getUsers(page, limit),
    // keepPreviousData: true,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: 'user' | 'admin';
    }) => adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User role updated successfully');
      setIsRoleModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update user role');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteModal = (userId: string) => {
    setSelectedUser(userId);
    setIsDeleteModalOpen(true);
  };

  const openRoleModal = (userId: string, currentRole: 'user' | 'admin') => {
    setSelectedUser(userId);
    setNewRole(currentRole);
    setIsRoleModalOpen(true);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser);
    }
  };

  const handleUpdateRole = () => {
    if (selectedUser) {
      updateRoleMutation.mutate({ userId: selectedUser, role: newRole });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">
          Failed to load users. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-heading mb-8">Manage Users</h1>

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="card-title">All Users</h2>
          <div className="text-sm text-muted-foreground">
            Total: {data?.data.length || 0} users
          </div>
        </div>

        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((user: any) => (
                  <tr
                    key={user._id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden mr-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar || '/placeholder.svg'}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {user._id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-muted-foreground mr-2" />
                        <span
                          className={`badge ${
                            user.role === 'admin'
                              ? 'badge-primary'
                              : 'badge-outline'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            openRoleModal(
                              user._id,
                              user.role as 'user' | 'admin',
                            )
                          }
                          className="btn btn-sm btn-outline"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => openDeleteModal(user._id)}
                          className="btn btn-sm btn-outline text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="btn btn-sm btn-outline"
                >
                  Previous
                </button>

                {Array.from(
                  { length: data.pagination.totalPages },
                  (_, i) => i + 1,
                ).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`btn btn-sm ${
                      pageNum === page ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.pagination.totalPages}
                  className="btn btn-sm btn-outline"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete User Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Delete User</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone and will also delete all posts and comments by this user.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="btn btn-primary bg-red-500 hover:bg-red-600"
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting...
                  </span>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Change User Role</h3>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <p className="mb-4">Select the new role for this user:</p>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={newRole === 'user'}
                    onChange={() => setNewRole('user')}
                    className="h-4 w-4"
                  />
                  <span>User</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={newRole === 'admin'}
                    onChange={() => setNewRole('admin')}
                    className="h-4 w-4"
                  />
                  <span>Admin</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="btn btn-primary"
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Updating...
                  </span>
                ) : (
                  'Update Role'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
