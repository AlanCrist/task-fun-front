import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ListTodo, Users, ShoppingBag, UserCircle, Menu, X, Star
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_KEYS = [
  { to: '/', icon: LayoutDashboard, key: 'nav.dashboard' },
  { to: '/tasks', icon: ListTodo, key: 'nav.tasks' },
  { to: '/group', icon: Users, key: 'nav.group' },
  { to: '/shop', icon: ShoppingBag, key: 'nav.shop' },
  { to: '/profile', icon: UserCircle, key: 'nav.profile' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, error } = useApp();
  const { t } = useTranslation();
  const location = useLocation();

  const pageTitle = NAV_KEYS.find(n => n.to === location.pathname)?.key;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-violet-700 to-violet-900
          z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-violet-600">
          <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center text-lg">
            🏠
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">TarefasFun</h1>
            <p className="text-violet-300 text-xs">{t('nav.tagline')}</p>
          </div>
          <button
            className="ml-auto text-violet-300 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        {currentUser && (
          <div className="px-6 py-4 border-b border-violet-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-xl">
                {currentUser.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1 text-yellow-300 text-xs">
                  <Star size={11} fill="currentColor" />
                  <span>{currentUser.points} {t('common.pts')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_KEYS.map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-violet-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-violet-600 flex items-center justify-between">
          <span className="text-violet-400 text-xs">v1.0 · TarefasFun</span>
          <LanguageSwitcher compact />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:px-6">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h2 className="font-semibold text-gray-800">{pageTitle ? t(pageTitle) : 'Home'}</h2>
          {currentUser && (
            <div className="ml-auto flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <span className="text-yellow-700 font-semibold text-sm">{currentUser.points}</span>
              <span className="text-yellow-600 text-xs">{t('common.pts')}</span>
            </div>
          )}
        </header>

        {/* Erro global */}
        {error && (
          <div className="mx-4 mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
