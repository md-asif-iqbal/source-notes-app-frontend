'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  FiUsers,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiX,
  FiCheck,
  FiShield,
} from 'react-icons/fi';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  interests: string[];
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'user' | 'admin'>('user');
  const [formInterests, setFormInterests] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async (pageToFetch = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest<{
        success: boolean;
        pagination: PaginationData;
        users: UserRecord[];
      }>(`/users?page=${pageToFetch}&limit=6`);

      if (res.success) {
        setUsers(res.users);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/notes');
      } else {
        fetchUsers(1);
      }
    }
  }, [user, authLoading, router, fetchUsers]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('user');
    setFormInterests('');
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (u: UserRecord) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPassword('');
    setFormRole(u.role);
    setFormInterests(u.interests ? u.interests.join(', ') : '');
    setError(null);
    setModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const interestsArray = formInterests
        .split(',')
        .map((i) => i.trim().toLowerCase())
        .filter((i) => i.length > 0);

      if (editingUser) {
        await apiRequest(`/users/${editingUser._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            role: formRole,
            interests: interestsArray,
          }),
        });
      } else {
        await apiRequest('/users', {
          method: 'POST',
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            password: formPassword || 'Default123!',
            role: formRole,
            interests: interestsArray,
          }),
        });
      }

      setModalOpen(false);
      fetchUsers(editingUser ? pagination.page : 1);
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;

    try {
      await apiRequest(`/users/${userId}`, {
        method: 'DELETE',
      });
      fetchUsers(pagination.page);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  if (authLoading || (user?.role !== 'admin' && loading)) {
    return (
      <div className="flex h-64 items-center justify-center text-xs sm:text-sm text-slate-500">
        Verifying administrator credentials...
      </div>
    );
  }

  return (
    <div className="w-full py-2 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            <FiShield size={13} />
            <span>RBAC Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            User Management &amp; Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Create, update, remove, and list all system users (Supported by <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800">&#123; createdAt: -1 &#125;</code> index)
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreateModal} className="w-full sm:w-auto h-9">
          <FiUserPlus size={16} />
          <span>Add New User</span>
        </Button>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table Card */}
      <Card className="overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3.5 py-2.5 sm:px-4 sm:py-3">User Name</th>
                <th className="px-3.5 py-2.5 sm:px-4 sm:py-3">Email Address</th>
                <th className="px-3.5 py-2.5 sm:px-4 sm:py-3">Role</th>
                <th className="px-3.5 py-2.5 sm:px-4 sm:py-3">Interests (Scenario 1)</th>
                <th className="px-3.5 py-2.5 sm:px-4 sm:py-3">Joined Date</th>
                <th className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Loading users list...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No users recorded in system.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-900">
                      {u.name}
                    </td>
                    <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <FiMail size={12} className="text-slate-400 shrink-0" />
                        <span>{u.email}</span>
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 sm:px-4 sm:py-3">
                      <Badge variant={u.role === 'admin' ? 'admin' : 'user'} className="text-[9px]">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-3.5 py-2.5 sm:px-4 sm:py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.interests && u.interests.length > 0 ? (
                          u.interests.map((interest, idx) => (
                            <Badge key={idx} variant="tag" className="text-[9px]">
                              #{interest}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px]">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]">
                        <FiCalendar size={11} className="text-slate-400 shrink-0" />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-slate-900"
                          onClick={() => handleOpenEditModal(u)}
                          title="Edit User"
                        >
                          <FiEdit2 size={12} />
                        </Button>
                        {u._id !== user?._id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:text-red-600"
                            onClick={() => handleDeleteUser(u._id)}
                            title="Delete User"
                          >
                            <FiTrash2 size={12} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-600 bg-slate-50/50">
            <div className="text-center sm:text-left">
              Showing page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
              <span className="font-semibold text-slate-900">{pagination.totalPages}</span> (
              <span className="font-semibold text-slate-900">{pagination.total}</span> total users)
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={!pagination.hasPrevPage || loading}
                className="flex-1 sm:flex-none"
              >
                <FiChevronLeft size={15} />
                <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="flex-1 sm:flex-none"
              >
                <span>Next</span>
                <FiChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* User Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-6">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                  {editingUser ? 'Edit User Details' : 'Add New User'}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Configure account role and interests
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-600 shrink-0"
                onClick={() => setModalOpen(false)}
              >
                <FiX size={16} />
              </Button>
            </CardHeader>

            <form onSubmit={handleSaveUser}>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="space-y-1">
                  <label htmlFor="formName" className="block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <Input
                    id="formName"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="formEmail" className="block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <Input
                    id="formEmail"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>

                {!editingUser && (
                  <div className="space-y-1">
                    <label htmlFor="formPassword" className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <Input
                      id="formPassword"
                      type="password"
                      placeholder="Min 6 characters (default: Default123!)"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="formRole" className="block text-xs font-semibold text-slate-700">
                    Role (RBAC)
                  </label>
                  <select
                    id="formRole"
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs text-slate-900 focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as 'user' | 'admin')}
                  >
                    <option value="user">User (Standard Access)</option>
                    <option value="admin">Admin (Full System Access)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="formInterests" className="block text-xs font-semibold text-slate-700">
                    Interests (Comma-separated)
                  </label>
                  <Input
                    id="formInterests"
                    type="text"
                    placeholder="chess, reading, tech"
                    value={formInterests}
                    onChange={(e) => setFormInterests(e.target.value)}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 border-t border-slate-100 p-4 sm:p-6 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  <FiCheck size={15} />
                  <span>{submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
