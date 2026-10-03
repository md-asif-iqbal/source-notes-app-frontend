'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FiUsers, FiTag, FiMail, FiUser, FiInfo, FiRefreshCw, FiDatabase } from 'react-icons/fi';

interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface InterestGroup {
  interest: string;
  count: number;
  users: UserSummary[];
}

export default function InterestsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterestGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest<{
        success: boolean;
        scenario: string;
        totalInterests: number;
        data: InterestGroup[];
      }>('/users/group-by-interests');

      if (res.success) {
        setGroups(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch interest aggregation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchInterestGroups();
      }
    }
  }, [user, authLoading, router]);

  return (
    <div className="w-full py-2 sm:py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <FiDatabase size={13} />
            <span>MongoDB Aggregation Scenario 1</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Users Grouped by Interests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Computed in real time via a single <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800">collection.aggregate()</code> call
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchInterestGroups}
          disabled={loading}
          className="gap-2 w-full sm:w-auto h-9"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Pipeline</span>
        </Button>
      </div>

      {/* Pipeline Technical Context Card */}
      <Card className="mb-6 sm:mb-8 border-l-4 border-l-blue-600 shadow-xs">
        <CardContent className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-5">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FiInfo size={16} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              Pipeline Stages &amp; Database Indexing Strategy
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              <strong>Pipeline Stages:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-slate-800">$unwind: &quot;$interests&quot;</code> &rarr;{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-slate-800">$group: &#123; _id: &quot;$interests&quot;, count: &#123;$sum: 1&#125;, users: &#123;$push: ...&#125; &#125;</code> &rarr;{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-slate-800">$sort: &#123; _id: 1 &#125;</code>.
              Supported by the multi-key index: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-slate-800">userSchema.index(&#123; interests: 1 &#125;)</code>.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-4 sm:mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center text-xs sm:text-sm text-slate-500">
          Running aggregation pipeline...
        </div>
      ) : groups.length === 0 ? (
        <Card className="py-10 sm:py-12 text-center">
          <CardContent className="flex flex-col items-center p-4 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
              <FiUsers size={24} />
            </div>
            <h2 className="text-base font-semibold text-slate-900">No Interests Found</h2>
            <p className="text-xs text-slate-500 mt-1">
              No user accounts currently have interests listed in their profile.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {groups.map((group) => (
            <Card key={group.interest} className="flex flex-col justify-between shadow-xs">
              <CardHeader className="pb-2.5 sm:pb-3 border-b border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-700 font-bold text-xs shrink-0">
                      #
                    </div>
                    <CardTitle className="text-sm sm:text-base font-bold text-slate-900 capitalize break-words">
                      {group.interest}
                    </CardTitle>
                  </div>
                  <Badge variant="user" className="shrink-0 text-[10px]">
                    {group.count} {group.count === 1 ? 'User' : 'Users'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-3 space-y-2">
                {group.users.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50/60 p-2 sm:p-2.5 text-xs gap-2"
                  >
                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900 truncate">
                        <FiUser size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{u.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                        <FiMail size={11} className="text-slate-400 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </div>
                    <Badge variant={u.role === 'admin' ? 'admin' : 'user'} className="text-[9px] shrink-0">
                      {u.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
