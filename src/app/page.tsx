'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  FiShield,
  FiFileText,
  FiUsers,
  FiShare2,
  FiCheckCircle,
  FiArrowRight,
  FiDatabase,
  FiLock,
} from 'react-icons/fi';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="w-full py-2 sm:py-6">
      {/* Hero Card */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-xs mb-6 sm:mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          <Badge variant="user" className="px-2.5 py-0.5 text-[11px] sm:text-xs">
            <FiShield className="mr-1 inline" size={13} />
            Technical Interview Task Submission
          </Badge>
          <Badge variant="outline" className="text-slate-600 bg-slate-50 text-[11px] sm:text-xs">
            Node.js + Express + MongoDB + Next.js
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-3">
          Secure Note-Taking &amp; RBAC Architecture
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl mb-6 sm:mb-8 leading-relaxed">
          A high-performance RESTful platform built with fine-tuned MongoDB database indexing
          using explicit <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-semibold text-slate-800">schema.index()</code> declarations,
          strict Role-Based Access Control, and optimized MongoDB Aggregation Pipelines.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          {user ? (
            <>
              <Link href="/notes" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <FiFileText size={17} />
                  <span>Open Notes Workspace</span>
                  <FiArrowRight size={15} />
                </Button>
              </Link>
              <Link href="/interests" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <FiUsers size={17} />
                  <span>Scenario 1 Aggregation</span>
                </Button>
              </Link>
              <Link href="/posts" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <FiShare2 size={17} />
                  <span>Scenario 2 ($lookup)</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <span>Sign In with Demo Credentials</span>
                  <FiArrowRight size={15} />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <span>Register New Account</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-10">
        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
              <FiLock size={19} />
            </div>
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
              Role-Based Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Regular Users manage only their own private notes. Admins inherit all user capabilities, manage user accounts, and view all notes across the platform.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-2">
              <FiDatabase size={19} />
            </div>
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
              Database Indexing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              All indexes are declared via <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-semibold text-slate-800">schema.index()</code>. Compound index <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-semibold text-slate-800">&#123;userId: 1, createdAt: -1&#125;</code> eliminates unnecessary indexes.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-2">
              <FiUsers size={19} />
            </div>
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
              Scenario 1 Aggregation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Groups users by interests using exactly one <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-semibold text-slate-800">collection.aggregate()</code> call supported by multi-key index on <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-semibold text-slate-800">interests</code>.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-2">
              <FiShare2 size={19} />
            </div>
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
              Scenario 2 ($lookup)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Retrieves all posts belonging to a particular user via a single pipeline with an optimized <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-semibold text-slate-800">$lookup</code> stage supported by foreign key index.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Indexing Reference Audit Table Preview */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Database Indexing Audit &amp; Performance Strategy
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Verified zero unnecessary indexes. Every single index is mapped directly to a required query or pipeline.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px] sm:text-xs self-start sm:self-auto">
              Mongoose schema.index()
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600 min-w-[500px]">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5 sm:px-4 sm:py-3">Collection / Model</th>
                  <th className="px-3.5 py-2.5 sm:px-4 sm:py-3">Index Definition</th>
                  <th className="px-3.5 py-2.5 sm:px-4 sm:py-3">Supported Query / Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-xs">
                <tr>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-900">User</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-mono text-blue-700">&#123; email: 1 &#125; (unique)</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3">Instant login credential lookup and unique email enforcement</td>
                </tr>
                <tr>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-900">User</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-mono text-blue-700">&#123; interests: 1 &#125;</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3">Scenario 1: Multi-key index for unwind &amp; grouping by interests</td>
                </tr>
                <tr>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-900">User</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-mono text-blue-700">&#123; createdAt: -1 &#125;</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3">Admin user management list with pagination sorting</td>
                </tr>
                <tr>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-900">Note</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-mono text-blue-700">&#123; userId: 1, createdAt: -1 &#125;</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3">User notes listing sorted newest first with pagination (Compound)</td>
                </tr>
                <tr>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-900">Note</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-mono text-blue-700">&#123; createdAt: -1 &#125;</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3">Admin view listing all users&apos; notes with pagination</td>
                </tr>
                <tr>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-900">Post</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3 font-mono text-blue-700">&#123; userId: 1, createdAt: -1 &#125;</td>
                  <td className="px-3.5 py-2.5 sm:px-4 sm:py-3">Scenario 2: Single $lookup stage joining user posts by userId</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
