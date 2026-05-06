import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, selectAuth, clearAuthError } from '../../features/auth';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, loading, error } = useSelector(selectAuth);

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  // Redirect when already authenticated
  useEffect(() => {
    if (isAuth) navigate('/admin/dashboard');
  }, [isAuth, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk({ username: form.username, password: form.password }));
  };

  return (
    <div className="admin-login-page">
      {/* Background */}
      <div className="admin-login-bg">
        <div className="al-orb al-orb-1" />
        <div className="al-orb al-orb-2" />
        <div className="al-grid" />
      </div>

      <div className="admin-login-card">
        {/* Header */}
        <div className="al-header">
          <div className="al-logo">
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <h1 className="al-title">Boshqaruv Paneli</h1>
          <p className="al-subtitle">Turon xalqaro maktabi CMS</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="al-form">
          <div className="form-group">
            <label className="form-label">Foydalanuvchi nomi</label>
            <div className="al-input-wrap">
              <User size={16} className="al-input-icon" />
              <input
                className="form-input al-input"
                placeholder="admin"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Parol</label>
            <div className="al-input-wrap">
              <Lock size={16} className="al-input-icon" />
              <input
                className="form-input al-input al-input-pw"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="al-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="al-error">{error}</div>}

          <button type="submit" className="btn btn-primary al-submit" disabled={loading}>
            {loading ? <span className="al-spinner" /> : null}
            {loading ? 'Kirilmoqmoqda…' : 'Tizimga kirish'}
          </button>
        </form>

        <div className="al-hint">
          <Lock size={12} /> Xavfsiz ulanish · TIS Boshqaruv paneli
        </div>
      </div>
    </div>
  );
}
