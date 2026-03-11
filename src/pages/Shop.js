import React, { useState } from 'react';
import { ShoppingBag, Star, Plus, Trash2, X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

export default function Shop() {
  const { t } = useTranslation();
  const { state, dispatch, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [redeemed, setRedeemed] = useState(null);
  const [activeTab, setActiveTab] = useState('loja');

  const myRedemptions = state.redemptions
    .filter(r => r.userId === currentUser.id)
    .map(r => ({
      ...r,
      reward: state.rewards.find(rw => rw.id === r.rewardId),
    }));

  function handleRedeem(reward) {
    if (currentUser.points < reward.cost) return;
    dispatch({ type: 'REDEEM_REWARD', payload: { rewardId: reward.id } });
    setRedeemed(reward.id);
    setTimeout(() => setRedeemed(null), 2500);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl flex items-center gap-2">
            <ShoppingBag size={22} />
            {t('shop.title')}
          </h2>
          <p className="text-pink-100 text-sm mt-0.5">{t('shop.subtitle')}</p>
        </div>
        <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
          <div className="flex items-center gap-1 text-yellow-300 font-bold text-xl">
            <Star size={18} fill="currentColor" />
            {currentUser.points}
          </div>
          <p className="text-pink-100 text-xs">{t('common.pts')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('loja')}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition ${activeTab === 'loja' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🛍️ {t('shop.tabShop')}
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition ${activeTab === 'historico' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          📦 {t('shop.tabHistory')}
        </button>
        <button
          onClick={() => setActiveTab('gerenciar')}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition ${activeTab === 'gerenciar' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ⚙️ {t('shop.newReward')}
        </button>
      </div>

      {/* Loja */}
      {activeTab === 'loja' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {state.rewards.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-400">
              <span className="text-4xl">🏪</span>
              <p className="mt-2 text-sm">{t('shop.noRewards')}</p>
            </div>
          )}
          {state.rewards.map(reward => {
            const canAfford = currentUser.points >= reward.cost;
            const justRedeemed = redeemed === reward.id;

            return (
              <div
                key={reward.id}
                className={`bg-white border rounded-2xl p-5 flex flex-col transition-all ${
                  justRedeemed ? 'border-green-400 bg-green-50' : canAfford ? 'border-gray-200 hover:border-pink-200' : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{reward.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{reward.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                    <span className="text-yellow-700 font-bold">{reward.cost}</span>
                    <span className="text-yellow-600 text-xs">{t('common.pts')}</span>
                  </div>
                  {justRedeemed ? (
                    <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                      <CheckCircle2 size={18} fill="currentColor" />
                      {t('shop.redeemed')}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className={`text-sm font-medium px-4 py-2 rounded-xl transition ${
                        canAfford
                          ? 'bg-pink-500 hover:bg-pink-600 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? t('shop.redeem') : t('shop.notEnoughPoints')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Histórico */}
      {activeTab === 'historico' && (
        <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
          {myRedemptions.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="text-4xl">📦</span>
              <p className="mt-2 text-sm">{t('shop.noHistory')}</p>
            </div>
          ) : (
            myRedemptions.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-4">
                <span className="text-2xl">{r.reward?.icon || '🎁'}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{r.reward?.title || 'Recompensa'}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.redeemedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-pink-600 font-semibold text-sm">
                  <Star size={13} fill="currentColor" />
                  -{r.reward?.cost || 0}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Gerenciar */}
      {activeTab === 'gerenciar' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-pink-300 text-pink-600 hover:border-pink-400 hover:bg-pink-50 py-3 rounded-2xl text-sm font-medium transition"
          >
            <Plus size={18} />
            {t('shop.newReward')}
          </button>
          <div className="space-y-3">
            {state.rewards.map(reward => (
              <div key={reward.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{reward.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{reward.title}</p>
                  <div className="flex items-center gap-1 text-yellow-600 text-xs">
                    <Star size={11} fill="currentColor" />
                    {reward.cost} {t('common.points')}
                  </div>
                </div>
                <button
                  onClick={() => dispatch({ type: 'DELETE_REWARD', payload: { rewardId: reward.id } })}
                  className="text-gray-300 hover:text-red-400 transition p-1"
                  title="Remover recompensa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && <RewardModal onClose={() => setShowModal(false)} dispatch={dispatch} />}
    </div>
  );
}

function RewardModal({ onClose, dispatch }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    description: '',
    cost: 50,
    icon: '🎁',
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    dispatch({ type: 'ADD_REWARD', payload: { ...form, cost: Number(form.cost) } });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg">{t('shop.modal.title')}</h3>
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
                placeholder={t('shop.modal.iconPlaceholder')}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.title')} *</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                placeholder={t('shop.modal.titlePlaceholder')}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.description')}</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
              placeholder={t('shop.modal.titlePlaceholder')}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t('common.cost')}</label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
              placeholder={t('shop.modal.costPlaceholder')}
              value={form.cost}
              onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              {t('common.cancel')}
            </button>
            <button type="submit" className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {t('shop.modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
