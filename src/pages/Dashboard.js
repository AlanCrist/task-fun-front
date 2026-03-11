import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { currentUser, state, getGroupRanking, getRecentCompletions } = useApp();
  const { t } = useTranslation();
  const hasGroup = !!state.group.id;
  const ranking = getGroupRanking();
  const recentCompletions = getRecentCompletions(5);
  const userRank = ranking.findIndex(u => u.id === currentUser.id) + 1;
  const todayCompletions = state.completions.filter(c => {
    const today = new Date().toDateString();
    return c.userId === currentUser.id && new Date(c.completedAt).toDateString() === today;
  });
  const todayPoints = todayCompletions.reduce((sum, c) => sum + c.pointsEarned, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Saudação */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            {currentUser.avatar}
          </div>
          <div>
            <p className="text-violet-200 text-sm">{t('dashboard.hello')}</p>
            <h2 className="text-2xl font-bold">{currentUser.name}!</h2>
            <p className="text-violet-200 text-sm mt-0.5">
              {!hasGroup
                ? t('dashboard.noGroup')
                : userRank === 1
                ? t('dashboard.rank1')
                : t('dashboard.rankN', { rank: userRank })}
            </p>
          </div>
        </div>
      </div>

      {/* Cards de stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Star className="text-yellow-500" size={22} fill="currentColor" />}
          label={t('dashboard.availablePoints')}
          value={currentUser.points}
          bg="bg-yellow-50"
          border="border-yellow-200"
        />
        <StatCard
          icon={<Trophy className="text-violet-500" size={22} />}
          label={t('dashboard.totalPoints')}
          value={currentUser.totalPoints}
          bg="bg-violet-50"
          border="border-violet-200"
        />
        <StatCard
          icon={<CheckCircle2 className="text-green-500" size={22} />}
          label={t('dashboard.tasksToday')}
          value={todayCompletions.length}
          bg="bg-green-50"
          border="border-green-200"
        />
        <StatCard
          icon={<Star className="text-orange-500" size={22} fill="currentColor" />}
          label={t('dashboard.pointsToday')}
          value={todayPoints}
          bg="bg-orange-50"
          border="border-orange-200"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Ranking do grupo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              {hasGroup ? `${t('dashboard.ranking')} — ${state.group.name}` : t('dashboard.ranking')}
            </h3>
            <Link to="/group" className="text-violet-600 text-sm hover:underline flex items-center gap-1">
              {t('common.seeAll')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {ranking.slice(0, 4).map((user, i) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl ${user.id === currentUser.id ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50'}`}
              >
                <span className="w-6 text-center font-bold text-sm">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}
                </span>
                <span className="text-xl">{user.avatar}</span>
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {user.id === currentUser.id ? t('dashboard.you') : user.name}
                </span>
                <div className="flex items-center gap-1 text-yellow-600 text-sm font-semibold">
                  <Star size={13} fill="currentColor" />
                  {user.totalPoints}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades recentes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              {t('dashboard.recentActivity')}
            </h3>
            <Link to="/tasks" className="text-violet-600 text-sm hover:underline flex items-center gap-1">
              {t('dashboard.goToTasks')} <ArrowRight size={14} />
            </Link>
          </div>
          {recentCompletions.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <CheckCircle2 size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">{t('dashboard.noActivity')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentCompletions.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50">
                  <span className="text-xl">{c.task?.icon || '✅'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{c.task?.title}</p>
                    <p className="text-xs text-gray-400">{c.user?.name}</p>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+{c.pointsEarned} {t('common.pts')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA lojinha */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Lojinha de recompensas</h3>
          <p className="text-pink-100 text-sm">Você tem <strong>{currentUser.points} {t('common.points')}</strong> para usar!</p>
        </div>
        <Link
          to="/shop"
          className="bg-white text-pink-600 font-semibold text-sm px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-pink-50 transition"
        >
          <ShoppingBag size={16} />
          Ver loja
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg, border }) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-4`}>
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
