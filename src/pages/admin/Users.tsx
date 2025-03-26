import { useState } from 'react';
import { Shield, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  useUsers,
  useUpdateUserRole,
  useDeleteUser,
} from '../../hooks/useAdmin';
import { formatDate } from '../../lib/utils';

const Users = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUsers(page);
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: deleteUser } = useDeleteUser();

  const handleRoleChange = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    if (
      window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`,
      )
    ) {
      updateRole({ userId, role: newRole as 'user' | 'admin' });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.',
      )
    ) {
      deleteUser(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load the users. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 gradient-text">Manage Users</h1>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Joined</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((user: any) => (
                <tr key={user._id} className="border-b border-border">
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black mr-3">
                        <img
                          src={user.avatar || '/placeholder.svg'}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-bold ${
                        user.role === 'admin'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3">{formatDate(user.createdAt)}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(user._id, user.role)}
                        leftIcon={<Shield className="w-4 h-4" />}
                      >
                        {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="neobrutalism-button px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="flex items-center px-4 font-bold">
                Page {page} of {data.pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  setPage(Math.min(data.pagination.totalPages, page + 1))
                }
                disabled={page === data.pagination.totalPages}
                className="neobrutalism-button px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Users;
