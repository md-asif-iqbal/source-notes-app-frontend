'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  FiFileText,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiTag,
  FiUser,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiX,
  FiCheck,
} from 'react-icons/fi';

interface NoteItem {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function NotesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [adminScope, setAdminScope] = useState<'all' | 'mine'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchNotes = useCallback(async (pageToFetch = 1) => {
    try {
      setLoading(true);
      setError(null);

      let url = `/notes?page=${pageToFetch}&limit=6`;
      if (user?.role === 'admin' && adminScope === 'mine') {
        url += '&scope=mine';
      }

      const res = await apiRequest<{
        success: boolean;
        pagination: PaginationData;
        notes: NoteItem[];
      }>(url);

      if (res.success) {
        setNotes(res.notes);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [user?.role, adminScope]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchNotes(1);
      }
    }
  }, [user, authLoading, router, fetchNotes]);

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
    setError(null);
    setModalOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setSaving(true);
      const tagsArray = noteTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (editingNote) {
        await apiRequest(`/notes/${editingNote._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent,
            tags: tagsArray,
          }),
        });
      } else {
        await apiRequest('/notes', {
          method: 'POST',
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent,
            tags: tagsArray,
          }),
        });
      }

      setModalOpen(false);
      fetchNotes(editingNote ? pagination.page : 1);
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await apiRequest(`/notes/${noteId}`, {
        method: 'DELETE',
      });
      fetchNotes(pagination.page);
    } catch (err: any) {
      alert(err.message || 'Failed to delete note');
    }
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="flex h-64 items-center justify-center text-xs sm:text-sm text-slate-500">
        Loading notes workspace...
      </div>
    );
  }

  return (
    <div className="w-full py-2 sm:py-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Notes Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            {user?.role === 'admin'
              ? 'Admin View: Manage notes across users or toggle to personal scope'
              : 'Secure, private encrypted note repository'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {user?.role === 'admin' && (
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setAdminScope('all')}
                className={`flex-1 sm:flex-none rounded-md px-2.5 sm:px-3 py-1 text-xs font-semibold transition-colors ${
                  adminScope === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Notes
              </button>
              <button
                type="button"
                onClick={() => setAdminScope('mine')}
                className={`flex-1 sm:flex-none rounded-md px-2.5 sm:px-3 py-1 text-xs font-semibold transition-colors ${
                  adminScope === 'mine'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Notes
              </button>
            </div>
          )}

          <Button variant="primary" onClick={handleOpenCreateModal} className="w-full sm:w-auto h-9">
            <FiPlus size={16} />
            <span>Create Note</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center text-xs sm:text-sm text-slate-500">
          Loading paginated notes...
        </div>
      ) : notes.length === 0 ? (
        <Card className="py-10 sm:py-12 text-center">
          <CardContent className="flex flex-col items-center p-4 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
              <FiFileText size={24} />
            </div>
            <h2 className="text-base font-semibold text-slate-900">No notes found</h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Get started by creating your first note in this workspace.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
              <FiPlus size={15} />
              <span>Create Note</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {notes.map((note) => {
            const isOwner = note.userId?._id === user?._id;
            const canManage = isOwner || user?.role === 'admin';

            return (
              <Card
                key={note._id}
                className="flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
              >
                <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
                      {note.title}
                    </CardTitle>
                    {canManage && (
                      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-slate-900"
                          onClick={() => handleOpenEditModal(note)}
                          title="Edit Note"
                        >
                          <FiEdit3 size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-red-600"
                          onClick={() => handleDeleteNote(note._id)}
                          title="Delete Note"
                        >
                          <FiTrash2 size={13} />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-3 sm:pb-4 p-4 sm:p-6 pt-0">
                  <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed max-h-36 sm:max-h-40 overflow-y-auto">
                    {note.content}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-2.5 sm:gap-3 border-t border-slate-100 p-4 sm:p-6 pt-3 text-[11px] text-slate-500">
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, idx) => (
                        <Badge key={idx} variant="tag" className="text-[10px]">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex w-full items-center justify-between gap-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700 truncate max-w-[60%]">
                      <FiUser size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{note.userId?.name || 'Unknown'}</span>
                      {note.userId?.role === 'admin' && (
                        <Badge variant="admin" className="ml-0.5 text-[8px] px-1 py-0 shrink-0">
                          Admin
                        </Badge>
                      )}
                    </span>

                    <span className="flex items-center gap-1 text-slate-400 text-[10px] shrink-0">
                      <FiCalendar size={11} />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-600">
          <div className="text-center sm:text-left">
            Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-semibold text-slate-900">{pagination.totalPages}</span> (
            <span className="font-semibold text-slate-900">{pagination.total}</span> total notes)
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNotes(pagination.page - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="flex-1 sm:flex-none"
            >
              <FiChevronLeft size={15} />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNotes(pagination.page + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="flex-1 sm:flex-none"
            >
              <span>Next</span>
              <FiChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-6">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                  {editingNote ? 'Edit Note' : 'Create New Note'}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {editingNote ? 'Update title, content, or tags' : 'Add a new secure note to your account'}
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

            <form onSubmit={handleSaveNote}>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="space-y-1">
                  <label htmlFor="noteTitle" className="block text-xs font-semibold text-slate-700">
                    Title
                  </label>
                  <Input
                    id="noteTitle"
                    type="text"
                    required
                    placeholder="e.g. Infrastructure Roadmap Q4"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="noteContent" className="block text-xs font-semibold text-slate-700">
                    Content
                  </label>
                  <Textarea
                    id="noteContent"
                    required
                    rows={5}
                    placeholder="Write detailed note content..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="noteTags" className="block text-xs font-semibold text-slate-700">
                    Tags (Comma-separated)
                  </label>
                  <Input
                    id="noteTags"
                    type="text"
                    placeholder="planning, security, sprint-1"
                    value={noteTags}
                    onChange={(e) => setNoteTags(e.target.value)}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 border-t border-slate-100 p-4 sm:p-6 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={saving}>
                  <FiCheck size={15} />
                  <span>{saving ? 'Saving...' : editingNote ? 'Save Changes' : 'Create Note'}</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
