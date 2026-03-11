import React, { useState } from 'react';
import { Star, Trophy, CheckCircle2, Edit3, Check, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

const AVATARS = ['🧑', '👩', '👨', '👧', '👦', '🧓', '👴', '👵', '🧒', '🦸', '🧙', '🧝', '🐱', '🐶', '🦊', '🐼', '🐨', '🦁'];

export default function Profile() {
  const { t } = useTranslation();
  const { state, dispatch, currentUser, getUserCompletions, logout } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const completions = getUserCompletions(currentUser.id);
  const recentCompletions = completions.slice(0, 5).map(c => ({
    ...c,
    task: state.tasks.find(task => task.id === c.taskId),
  }));

  const myRedemptions = state.redemptions
    .filter(r => r.userId === currentUser.id)
    .map(r => ({ ...r, reward: state.rewards.find(rw => rw.id === r.rewardId) }));

  function handleSave() {
    dispatch({ type: 'UPDATE_PROFILE', payload: { name: name.trim() || currentUser.name, avatar } });
    setEditing(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Card do perfil */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-violet-50 border-2 border-violet-200 rounded-2xl flex items-center justify-center text-4xl">
              {editing ? avatar : currentUser.avatar}
            </div>
            {editing && (
              <div className="grid grid-cols-6 gap-1 w-32">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`text-lg p-1 rounded-lg transition ${av === avatar ? 'bg-violet-200 scale-110' : 'hover:bg-gray-100'}`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1">
            {editing ? (
              <input
                className="text-xl font-bold text-gray-800 border-b-2 border-violet-400 focus:outline-none bg-transparent w-full mb-2"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={30}
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800">{currentUser.name}</h2>
            )}
            <p className="text-sm text-gray-500 mb-3">{state.group.id ? `Membro de ${state.group.name}` : 'Sem grupo'}</p>

            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                <Star size={16} className="text-yellow-500" fill="currentColor" />
                <div>
                  <p className="text-yellow-700 font-bold leading-none">{currentUser.points}</p>
                  <p className="text-yellow-600 text-xs">{t('profile.availablePoints')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2">
                <Trophy size={16} className="text-violet-500" />
                <div>
                  <p className="text-violet-700 font-bold leading-none">{currentUser.totalPoints}</p>
                  <p className="text-violet-600 text-xs">{t('profile.totalPoints')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <div>
                  <p className="text-green-700 font-bold leading-none">{completions.length}</p>
                  <p className="text-green-600 text-xs">{t('profile.tasksCompleted')}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={editing ? handleSave : () => setEditing(true)}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition ${
              editing
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {editing ? <><Check size={15} /> {t('common.save')}</> : <><Edit3 size={15} /> {t('profile.editProfile')}</>}
          </button>
        </div>
      </div>

      {/* Sair da conta */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition"
      >
        <LogOut size={16} />
        {t('profile.logout')}
      </button>

      {/* Posição no ranking */}
      {state.group.id && <RankingPosition currentUser={currentUser} state={state} />}

      {/* Tarefas recentes */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-500" />
          {t('profile.recentActivity')}
        </h3>
        {recentCompletions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">{t('profile.noActivity')}</p>
        ) : (
          <div className="space-y-2">
            {recentCompletions.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">{c.task?.icon || '✅'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{c.task?.title || 'Tarefa'}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(c.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="text-green-600 font-semibold text-sm">+{c.pointsEarned}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resgates recentes */}
      {myRedemptions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🛍️ {t('profile.recentRedemptions')}
          </h3>
          <div className="space-y-2">
            {myRedemptions.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">{r.reward?.icon || '🎁'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{r.reward?.title || 'Recompensa'}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.redeemedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="text-pink-600 font-semibold text-sm">-{r.reward?.cost || 0} {t('common.pts')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RankingPosition({ currentUser, state }) {
  const { t } = useTranslation();
  const ranking = [...state.users].sort((a, b) => b.totalPoints - a.totalPoints);
  const rank = ranking.findIndex(u => u.id === currentUser.id) + 1;
  const leader = ranking[0];
  const diff = (leader?.totalPoints || 0) - currentUser.totalPoints;

  return (
    <div className={`rounded-2xl p-4 border ${rank === 1 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{rank === 1 ? '🏆' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🎯'}</span>
        <div>
          <p className="font-semibold text-gray-800">
            {rank === 1 ? 'Você é o líder do grupo!' : `${rank}º lugar no grupo`}
          </p>
          {rank > 1 && (
            <p className="text-sm text-gray-500">
              Faltam <strong className="text-violet-600">{diff} {t('common.points')}</strong> para alcançar {leader.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
