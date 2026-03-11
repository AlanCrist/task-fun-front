import React, { useState } from 'react';
import { CheckCircle2, Plus, Star, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['Cozinha', 'Limpeza', 'Lavanderia', 'Compras', 'Jardim', 'Pets', 'Organização', 'Outro'];

export default function Tasks() {
  const { t } = useTranslation();
  const { state, dispatch, currentUser, canCompleteTask } = useApp();
  const [filter, setFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [completedNow, setCompletedNow] = useState(null);

  const categories = ['Todos', ...CATEGORIES];
  const filtered = filter === 'Todos' ? state.tasks : state.tasks.filter(task => task.category === filter);

  function handleComplete(task) {
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId: task.id } });
    setCompletedNow(task.id);
    setTimeout(() => setCompletedNow(null), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">{t('tasks.title')}</h2>
          <p className="text-sm text-gray-500">{t('tasks.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
        >
          <Plus size={16} />
          {t('tasks.newTask')}
        </button>
      </div>

      {/* Pontos do usuário */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-xl">{currentUser.avatar}</div>
        <div>
          <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
          <div className="flex items-center gap-1 text-yellow-600 text-sm font-semibold">
            <Star size={14} fill="currentColor" />
            {currentUser.points} {t('common.points')}
          </div>
        </div>
      </div>

      {/* Filtros de categoria */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-full font-medium transition ${
              filter === cat
                ? 'bg-violet-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
            }`}
          >
            {cat === 'Todos' ? t('tasks.all') : t(`tasks.categories.${cat}`, cat)}
          </button>
        ))}
      </div>

      {/* Lista de tarefas */}
      <div className="space-y-3">
        {filtered.map(task => {
          const canDo = canCompleteTask(task.id);
          const justDone = completedNow === task.id;

          return (
            <div
              key={task.id}
              className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all ${
                justDone ? 'border-green-400 bg-green-50 scale-[1.01]' : 'border-gray-200 hover:border-violet-200'
              }`}
            >
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {task.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1 flex-shrink-0">
                    <Star size={13} className="text-yellow-500" fill="currentColor" />
                    <span className="text-yellow-700 font-bold text-sm">{task.points}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t(`tasks.categories.${task.category}`, task.category)}</span>
                  {task.isRecurring && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">🔄 {t('tasks.complete')}</span>
                  )}
                  {!canDo && !task.isRecurring && (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">✅ {t('tasks.alreadyDone')}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {justDone ? (
                  <div className="text-green-500 font-semibold text-sm flex items-center gap-1">
                    <CheckCircle2 size={20} fill="currentColor" />
                    +{task.points}
                  </div>
                ) : (
                  <button
                    onClick={() => handleComplete(task)}
                    disabled={!canDo}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition ${
                      canDo
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    {canDo ? t('tasks.complete') : t('tasks.completed')}
                  </button>
                )}
                <button
                  onClick={() => dispatch({ type: 'DELETE_TASK', payload: { taskId: task.id } })}
                  className="text-gray-300 hover:text-red-400 transition p-1"
                  title="Remover tarefa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <span className="text-4xl">📋</span>
            <p className="mt-2 text-sm">{t('tasks.noTasks')}</p>
          </div>
        )}
      </div>

      {showModal && <TaskModal onClose={() => setShowModal(false)} dispatch={dispatch} />}
    </div>
  );
}

function TaskModal({ onClose, dispatch }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    description: '',
    points: 10,
    icon: '✅',
    category: 'Limpeza',
    isRecurring: true,
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    dispatch({ type: 'ADD_TASK', payload: { ...form, points: Number(form.points) } });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg">{t('tasks.modal.title')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="w-16">
              <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.icon')}</label>
              <input
                className="w-full border border-gray-200 rounded-xl p-2 text-center text-2xl"
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                maxLength={2}
                placeholder={t('tasks.modal.iconPlaceholder')}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.title')} *</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                placeholder={t('tasks.modal.titlePlaceholder')}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.description')}</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
              placeholder={t('tasks.modal.titlePlaceholder')}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.points')}</label>
              <input
                type="number"
                min="1"
                max="500"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                placeholder={t('tasks.modal.pointsPlaceholder')}
                value={form.points}
                onChange={e => setForm(f => ({ ...f, points: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.category')}</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{t(`tasks.categories.${c}`, c)}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-violet-600"
              checked={form.isRecurring}
              onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked }))}
            />
            <span className="text-sm text-gray-700">{t('tasks.modal.isRecurring')}</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              {t('common.cancel')}
            </button>
            <button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {t('tasks.modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
