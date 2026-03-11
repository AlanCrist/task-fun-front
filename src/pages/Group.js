import React, { useState } from 'react';
import { Star, CheckCircle2, Copy, Check, Plus, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

function NoGroup() {
  const { t } = useTranslation();
  const { createGroup, joinGroup } = useApp();
  const [mode, setMode] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createGroup(name.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      await joinGroup(code.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-5 pt-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3">
          👨‍👩‍👧‍👦
        </div>
        <h2 className="font-bold text-gray-800 text-xl">{t('group.noGroup.title')}</h2>
        <p className="text-gray-500 text-sm mt-1">{t('group.noGroup.subtitle')}</p>
      </div>

      {!mode && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('create')}
            className="flex flex-col items-center gap-3 bg-white border-2 border-violet-200 hover:border-violet-400 rounded-2xl p-5 transition"
          >
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <Plus size={24} className="text-violet-600" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">{t('group.noGroup.createBtn')}</span>
          </button>
          <button
            onClick={() => setMode('join')}
            className="flex flex-col items-center gap-3 bg-white border-2 border-green-200 hover:border-green-400 rounded-2xl p-5 transition"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <LogIn size={24} className="text-green-600" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">{t('group.noGroup.joinBtn')}</span>
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {mode === 'create' && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">{t('group.noGroup.createBtn')}</h3>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t('group.noGroup.groupNameLabel')}</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400"
              placeholder={t('group.noGroup.groupNamePlaceholder')}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setMode(null); setError(''); }} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition">
              {loading ? '...' : t('group.noGroup.createSubmit')}
            </button>
          </div>
        </form>
      )}

      {mode === 'join' && (
        <form onSubmit={handleJoin} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">{t('group.noGroup.joinBtn')}</h3>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t('group.noGroup.groupCodeLabel')}</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 font-mono uppercase tracking-widest"
              placeholder={t('group.noGroup.groupCodePlaceholder')}
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              maxLength={8}
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setMode(null); setError(''); }} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition">
              {loading ? '...' : t('group.noGroup.joinSubmit')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function Group() {
  const { t } = useTranslation();
  const { state, currentUser, getGroupRanking, getUserCompletions, leaveGroup } = useApp();
  const ranking = getGroupRanking();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('ranking');
  const [leavingGroup, setLeavingGroup] = useState(false);

  if (!state.group.id) return <NoGroup />;

  function copyCode() {
    navigator.clipboard.writeText(state.group.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLeave() {
    if (!window.confirm(t('group.leaveConfirm'))) return;
    setLeavingGroup(true);
    try { await leaveGroup(); } finally { setLeavingGroup(false); }
  }

  const recentAll = [...state.completions]
    .slice(0, 20)
    .map(c => ({
      ...c,
      task: state.tasks.find(task => task.id === c.taskId),
      user: state.users.find(u => u.id === c.userId),
    }));

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Info do grupo */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">👨‍👩‍👧‍👦</div>
          <div className="flex-1">
            <h2 className="font-bold text-xl">{state.group.name}</h2>
            <p className="text-violet-200 text-sm">{state.group.memberIds.length} {t('group.members')}</p>
          </div>
          <button
            onClick={handleLeave}
            disabled={leavingGroup}
            className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-xs text-violet-200 hover:text-white transition"
            title={t('group.leaveGroup')}
          >
            {leavingGroup ? '...' : t('group.leaveGroup')}
          </button>
        </div>
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-xs mb-0.5">{t('group.code')}</p>
            <p className="font-mono font-bold text-lg tracking-widest">{state.group.code}</p>
          </div>
          <button
            onClick={copyCode}
            className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition"
            title={t('group.copyCode')}
          >
            {copied ? <Check size={18} className="text-green-300" /> : <Copy size={18} />}
          </button>
        </div>
        {copied && (
          <p className="text-green-300 text-xs mt-2 text-center">{t('group.copied')}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition ${activeTab === 'ranking' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🏆 {t('group.ranking')}
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition ${activeTab === 'feed' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          📋 {t('profile.recentActivity')}
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition ${activeTab === 'members' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          👤 {t('group.members')}
        </button>
      </div>

      {/* Ranking */}
      {activeTab === 'ranking' && (
        <div className="space-y-3">
          {ranking.map((user, i) => (
            <div
              key={user.id}
              className={`bg-white border rounded-2xl p-4 flex items-center gap-4 ${
                user.id === currentUser.id ? 'border-violet-300 ring-2 ring-violet-100' : 'border-gray-200'
              }`}
            >
              <div className="w-10 text-center">
                {i === 0 ? (
                  <span className="text-2xl">🥇</span>
                ) : i === 1 ? (
                  <span className="text-2xl">🥈</span>
                ) : i === 2 ? (
                  <span className="text-2xl">🥉</span>
                ) : (
                  <span className="text-lg font-bold text-gray-400">{i + 1}º</span>
                )}
              </div>
              <div className="w-12 h-12 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center text-2xl">
                {user.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  {user.id === currentUser.id && (
                    <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">{t('group.you')}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <CheckCircle2 size={11} className="text-green-500" />
                    {getUserCompletions(user.id).length} {t('profile.tasksCompleted')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-600 font-bold">
                  <Star size={15} fill="currentColor" />
                  <span>{user.totalPoints}</span>
                </div>
                <p className="text-xs text-gray-400">{user.points} {t('profile.availablePoints')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feed de atividades */}
      {activeTab === 'feed' && (
        <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
          {recentAll.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="text-4xl">📭</span>
              <p className="mt-2 text-sm">{t('profile.noActivity')}</p>
            </div>
          ) : (
            recentAll.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-4">
                <span className="text-2xl">{c.task?.icon || '✅'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    <span className="text-violet-600">{c.user?.name}</span> completou{' '}
                    <span className="font-semibold">{c.task?.title}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(c.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="text-green-600 font-semibold text-sm">+{c.pointsEarned} {t('common.pts')}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Membros */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-2 gap-3">
          {ranking.map((user, i) => (
            <div key={user.id} className={`bg-white border rounded-2xl p-4 text-center ${user.id === currentUser.id ? 'border-violet-300' : 'border-gray-200'}`}>
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2">
                {user.avatar}
              </div>
              <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
              {user.id === currentUser.id && (
                <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">{t('group.you')}</span>
              )}
              <div className="mt-2 flex items-center justify-center gap-1 text-yellow-600 font-bold text-sm">
                <Star size={13} fill="currentColor" />
                {user.totalPoints} {t('common.pts')}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {i === 0 ? '🥇 Líder' : `${i + 1}º lugar`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
