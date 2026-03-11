import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

const AVATARS = ['🧑', '👩', '👨', '👧', '👦', '🧓', '👴', '👵', '🧒', '🦸', '🧙', '🧝', '🐱', '🐶', '🦊', '🐼', '🐨', '🦁'];

export default function Login() {
  const { login, register } = useApp();
  const { t } = useTranslation();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '🧑',
  });

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMsg('');
    if (!registerForm.name.trim()) return setErrorMsg(t('login.nameRequired'));
    setLoading(true);
    try {
      await register(registerForm.name, registerForm.email, registerForm.password, registerForm.avatar);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Star size={32} className="text-yellow-300" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-violet-800">Tarefas Fun</h1>
          <p className="text-violet-500 text-sm mt-1">{t('login.tagline')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setTab('login'); setErrorMsg(''); }}
              className={`flex-1 py-4 text-sm font-semibold transition ${tab === 'login' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('login.tabLogin')}
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMsg(''); }}
              className={`flex-1 py-4 text-sm font-semibold transition ${tab === 'register' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('login.tabRegister')}
            </button>
          </div>

          <div className="p-6">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                {errorMsg}
              </div>
            )}

            {/* Login */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400"
                    placeholder={t('login.emailPlaceholder')}
                    value={loginForm.email}
                    onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Senha</label>
                  <input
                    type="password"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400"
                    placeholder={t('login.passwordPlaceholder')}
                    value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  {loading ? t('login.loginLoading') : t('login.loginBtn')}
                </button>
              </form>
            )}

            {/* Register */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Avatar picker */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">{t('login.yourAvatar')}</label>
                  <div className="grid grid-cols-9 gap-1.5">
                    {AVATARS.map(av => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setRegisterForm(f => ({ ...f, avatar: av }))}
                        className={`text-xl p-1.5 rounded-xl transition ${av === registerForm.avatar ? 'bg-violet-100 ring-2 ring-violet-400 scale-110' : 'hover:bg-gray-100'}`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Nome</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400"
                    placeholder={t('login.namePlaceholder')}
                    value={registerForm.name}
                    onChange={e => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400"
                    placeholder={t('login.emailPlaceholder')}
                    value={registerForm.email}
                    onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Senha</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400"
                    placeholder={t('login.passwordMin', { min: 6 })}
                    value={registerForm.password}
                    onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  {loading ? t('login.registerLoading') : t('login.registerBtn')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
