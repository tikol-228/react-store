import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Panel from '../panel/Panel';
import { adminAPI } from '../services/api';
import { Loader, Lock } from 'lucide-react';

const PANEL_UNLOCK_KEY = 'react-store-admin-panel-unlocked';

const Admin: React.FC = () => {
  const [pinRequired, setPinRequired] = useState<boolean | null>(null);
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(PANEL_UNLOCK_KEY) === '1');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await adminAPI.getPanelAuth();
        if (cancelled) return;
        const required = Boolean(data.pinRequired);
        setPinRequired(required);
        if (!required) {
          setUnlocked(true);
        }
      } catch {
        if (!cancelled) {
          setPinRequired(false);
          setUnlocked(true);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminAPI.verifyPanelPin(pin);
      sessionStorage.setItem(PANEL_UNLOCK_KEY, '1');
      setUnlocked(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Неверный PIN');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-[#1B4B43]" size={40} />
      </div>
    );
  }

  if (pinRequired && !unlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-2 text-[#1B4B43] mb-2">
            <Lock size={22} />
            <h1 className="text-xl font-bold text-gray-900">Доступ к панели</h1>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Введите PIN панели (значение <code className="text-xs bg-gray-100 px-1 rounded">ADMIN_PANEL_PIN</code> на сервере). Сначала войдите как администратор через{' '}
            <Link to="/login" className="text-[#1B4B43] underline">
              вход
            </Link>
            .
          </p>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <input
              type="password"
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN панели"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4B43]/30"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#1B4B43] text-white rounded-lg font-semibold hover:bg-[#245c53] disabled:opacity-50"
            >
              {submitting ? 'Проверка…' : 'Войти в панель'}
            </button>
          </form>
          <Link to="/" className="block text-center text-sm text-gray-500 mt-6 hover:text-gray-800">
            На сайт
          </Link>
        </div>
      </div>
    );
  }

  return <Panel />;
};

export default Admin;
