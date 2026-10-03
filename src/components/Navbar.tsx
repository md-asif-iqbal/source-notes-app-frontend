'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  FiShield,
  FiFileText,
  FiUsers,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiUser,
  FiShare2,
  FiMenu,
  FiX,
} from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/notes', label: 'Notes', icon: FiFileText },
    { href: '/interests', label: 'Interests (Scenario 1)', icon: FiUsers },
    { href: '/posts', label: 'Posts (Scenario 2)', icon: FiShare2 },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ href: '/admin/users', label: 'Admin Users', icon: FiShield });
  }

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 font-bold text-slate-900 tracking-tight shrink-0"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <FiShield size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold leading-none text-slate-900">SecureNotes</span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-wider text-slate-400 uppercase">RBAC &amp; Indexing</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                      active
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={14} className={active ? 'text-blue-600' : 'text-slate-400'} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Section / Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs text-slate-700">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                  <FiUser size={11} />
                </div>
                <div className="flex flex-col max-w-[120px] lg:max-w-none truncate">
                  <span className="font-semibold text-slate-900 truncate">{user.name}</span>
                </div>
                <Badge variant={user.role === 'admin' ? 'admin' : 'user'} className="text-[9px] px-1.5 py-0">
                  {user.role}
                </Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="hidden sm:inline-flex text-xs text-slate-600 hover:text-red-600 hover:border-red-200 h-8 px-2.5"
              >
                <FiLogOut size={13} />
                <span>Logout</span>
              </Button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex lg:hidden items-center justify-center p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs sm:text-sm">
                  <FiLogIn size={14} />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="h-8 px-2.5 text-xs sm:text-sm">
                  <FiUserPlus size={14} />
                  <span>Register</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer (320px - 1023px) */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="mb-3 flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                <FiUser size={13} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-900">{user.name}</span>
                <span className="text-[10px] text-slate-500">{user.email}</span>
              </div>
            </div>
            <Badge variant={user.role === 'admin' ? 'admin' : 'user'} className="text-[9px]">
              {user.role}
            </Badge>
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-400'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => {
                closeMobileMenu();
                logout();
              }}
              className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 text-left transition-colors"
            >
              <FiLogOut size={16} />
              <span>Log out of account</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
