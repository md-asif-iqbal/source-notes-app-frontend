'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  FiShare2,
  FiPlus,
  FiUser,
  FiCalendar,
  FiFilter,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiDatabase,
} from 'react-icons/fi';

interface PostItem {
  _id: string;
  title: string;
  content: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

interface UserAggregationResult {
  _id: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  createdAt: string;
}

export default function PostsPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination for public feed
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Scenario 2 Filter by User ($lookup aggregation)
  const [filterUserId, setFilterUserId] = useState<string | null>(null);
  const [aggregatedUser, setAggregatedUser] = useState<UserAggregationResult | null>(null);
  const [isAggregating, setIsAggregating] = useState(false);

  // Create Post Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchPublicPosts = useCallback(async (pageToFetch = 1) => {
    try {
      setLoading(true);
      setError(null);
      setAggregatedUser(null);
      setFilterUserId(null);

      const res = await apiRequest<{
        success: boolean;
        pagination: {
          page: number;
          totalPages: number;
          total: number;
        };
        posts: PostItem[];
      }>(`/posts?page=${pageToFetch}&limit=6`);

      if (res.success) {
        setPosts(res.posts);
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
        setTotalPosts(res.pagination.total);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPostsAggregation = async (userId: string) => {
    try {
      setIsAggregating(true);
      setError(null);
      setFilterUserId(userId);

      const res = await apiRequest<{
        success: boolean;
        scenario: string;
        user: UserAggregationResult;
        postCount: number;
        posts: PostItem[];
      }>(`/posts/user/${userId}`);

      if (res.success) {
        setAggregatedUser(res.user);
        setPosts(res.posts);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute $lookup aggregation');
    } finally {
      setIsAggregating(false);
    }
  };

  useEffect(() => {
    fetchPublicPosts(1);
  }, [fetchPublicPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setCreating(true);
      await apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
        }),
      });

      setModalOpen(false);
      setPostTitle('');
      setPostContent('');
      fetchPublicPosts(1);
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full py-2 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <FiDatabase size={13} />
            <span>MongoDB Aggregation Scenario 2 ($lookup)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Public Posts &amp; User Aggregation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Public feed with on-demand user post aggregation using a single <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800">$lookup</code> stage
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {filterUserId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPublicPosts(1)}
              className="gap-1.5 flex-1 sm:flex-none h-9"
            >
              <FiX size={14} />
              <span>Clear Filter</span>
            </Button>
          )}

          {user && (
            <Button variant="primary" onClick={() => setModalOpen(true)} className="flex-1 sm:flex-none h-9">
              <FiPlus size={16} />
              <span>Write Post</span>
            </Button>
          )}
        </div>
      </div>

      {/* Aggregation Context Card */}
      <Card className="mb-6 sm:mb-8 border-l-4 border-l-blue-600 shadow-xs">
        <CardContent className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-5">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FiInfo size={16} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              Scenario 2 Execution &amp; Indexing Strategy
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              Click <strong>&quot;Filter by Author ($lookup)&quot;</strong> on any post card below to run the aggregation pipeline joining the <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-slate-800">users</code> collection and <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-slate-800">posts</code> collection.
              Supported by foreign-key index: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-slate-800">postSchema.index(&#123; userId: 1, createdAt: -1 &#125;)</code>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filtered Active State Banner */}
      {aggregatedUser && (
        <Card className="mb-4 sm:mb-6 border-blue-200 bg-blue-50/60 shadow-xs">
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 sm:p-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Active $lookup Pipeline Result
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                Posts by: {aggregatedUser.name} ({aggregatedUser.email})
              </h2>
              <div className="flex flex-wrap gap-1 mt-1">
                {aggregatedUser.interests?.map((interest, i) => (
                  <Badge key={i} variant="tag" className="text-[10px]">
                    #{interest}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPublicPosts(1)}
              className="bg-white shrink-0 w-full sm:w-auto h-8 text-xs"
            >
              Reset to Public Feed
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="mb-4 sm:mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Posts Stream */}
      {loading || isAggregating ? (
        <div className="flex h-48 items-center justify-center text-xs sm:text-sm text-slate-500">
          Loading posts stream...
        </div>
      ) : posts.length === 0 ? (
        <Card className="py-10 sm:py-12 text-center">
          <CardContent className="flex flex-col items-center p-4 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
              <FiShare2 size={24} />
            </div>
            <h2 className="text-base font-semibold text-slate-900">No posts published yet</h2>
            <p className="text-xs text-slate-500 mt-1">
              Be the first user to share a public post.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {posts.map((post) => {
            const author = post.userId || aggregatedUser;
            return (
              <Card
                key={post._id}
                className="flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
              >
                <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                  <CardTitle className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-3 sm:pb-4 p-4 sm:p-6 pt-0">
                  <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed max-h-36 sm:max-h-40 overflow-y-auto">
                    {post.content}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-2.5 sm:gap-3 border-t border-slate-100 p-4 sm:p-6 pt-3 text-[11px] text-slate-500">
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 truncate max-w-[60%]">
                      <FiUser size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{author?.name || 'Anonymous'}</span>
                    </span>

                    <span className="flex items-center gap-1 text-slate-400 text-[10px] shrink-0">
                      <FiCalendar size={11} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {!filterUserId && author?._id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[11px] h-7 gap-1.5 bg-slate-50 hover:bg-slate-100"
                      onClick={() => fetchUserPostsAggregation(author._id)}
                    >
                      <FiFilter size={12} className="text-blue-600" />
                      <span>Filter by Author ($lookup)</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {!filterUserId && totalPages > 1 && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-600">
          <div className="text-center sm:text-left">
            Page <span className="font-semibold text-slate-900">{page}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span> (
            <span className="font-semibold text-slate-900">{totalPosts}</span> posts)
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPublicPosts(page - 1)}
              disabled={page <= 1 || loading}
              className="flex-1 sm:flex-none"
            >
              <FiChevronLeft size={15} />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPublicPosts(page + 1)}
              disabled={page >= totalPages || loading}
              className="flex-1 sm:flex-none"
            >
              <span>Next</span>
              <FiChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* Write Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-6">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                  Write Public Post
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Share insights visible to everyone across the platform
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

            <form onSubmit={handleCreatePost}>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="space-y-1">
                  <label htmlFor="postTitle" className="block text-xs font-semibold text-slate-700">
                    Post Title
                  </label>
                  <Input
                    id="postTitle"
                    type="text"
                    required
                    placeholder="e.g. Distributed Database Strategies"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="postContent" className="block text-xs font-semibold text-slate-700">
                    Content
                  </label>
                  <Textarea
                    id="postContent"
                    required
                    rows={5}
                    placeholder="Write detailed post content..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 border-t border-slate-100 p-4 sm:p-6 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={creating}>
                  <FiCheck size={15} />
                  <span>{creating ? 'Publishing...' : 'Publish Post'}</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
