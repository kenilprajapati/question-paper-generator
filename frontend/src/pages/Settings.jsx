import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import { Lock, Bell, Palette, ShieldCheck, Eye, EyeOff, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Section({ icon, title, children }) {
  return (
    <div className="card" style={{ borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
        <div style={{ color: 'var(--primary)' }}>{icon}</div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: 2 }}>{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: checked ? 'var(--primary)' : '#cbd5e1',
          position: 'relative', transition: 'background 0.25s', flexShrink: 0
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-card)',
          transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
        }} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { theme: appearance, setTheme: setAppearance } = useTheme();
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false });
  const [notifs, setNotifs] = useState({ email: true, paper: true, faculty: false });
  const [twoFA, setTwoFA] = useState(false);
  const [loginHistory, setLoginHistory] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => axiosInstance.patch('/auth/updateMyPassword', data),
    onSuccess: (res) => {
      toast.success('Password updated successfully');
      setPasswords({ current: '', newPass: '', confirm: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed')
  });

  const handlePasswordUpdate = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      return toast.error('All fields are required.');
    }
    if (passwords.newPass !== passwords.confirm) {
      return toast.error('New passwords do not match.');
    }
    if (passwords.newPass.length < 8) {
      return toast.error('Password must be at least 8 characters.');
    }
    mutation.mutate({
      passwordCurrent: passwords.current,
      password: passwords.newPass,
      passwordConfirm: passwords.confirm
    });
  };

  const PwField = ({ label, field }) => (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6, display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="form-control"
          type={showPw[field] ? 'text' : 'password'}
          value={passwords[field]}
          onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
          style={{ borderRadius: 10, paddingRight: '2.75rem', fontSize: '0.9rem' }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          type="button"
          onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sub)' }}
        >
          {showPw[field] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  const themes = [
    { key: 'light', label: 'Light', icon: <Sun size={18} /> },
    { key: 'dark', label: 'Dark', icon: <Moon size={18} /> },
    { key: 'system', label: 'System', icon: <Monitor size={18} /> },
  ];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.5rem 0', animation: 'fadeSlideIn 0.4s ease' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Settings</h2>

      {/* Account / Password */}
      <Section icon={<Lock size={20} />} title="Account Settings">
        <PwField label="Current Password" field="current" />
        <PwField label="New Password" field="newPass" />
        <PwField label="Confirm New Password" field="confirm" />
        <button className="btn btn-primary" onClick={handlePasswordUpdate} disabled={mutation.isPending}>
          {mutation.isPending ? 'Updating...' : <><Lock size={15} /> Update Password</>}
        </button>
      </Section>

      {/* Notifications */}
      <Section icon={<Bell size={20} />} title="Notification Settings">
        <Toggle label="Email Notifications" sub="Receive updates via email" checked={notifs.email} onChange={v => setNotifs(p => ({ ...p, email: v }))} />
        <Toggle label="Paper Generation Alerts" sub="Notify when a paper is generated" checked={notifs.paper} onChange={v => setNotifs(p => ({ ...p, paper: v }))} />
        <Toggle label="Faculty Approval Alerts" sub="Notify on faculty approval actions" checked={notifs.faculty} onChange={v => setNotifs(p => ({ ...p, faculty: v }))} />
      </Section>

      {/* Appearance */}
      <Section icon={<Palette size={20} />} title="Appearance Settings">
        <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
          Choose how QP Creator looks on your device.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.875rem',
        }}>
          {themes.map(t => (
            <button
              key={t.key}
              onClick={() => setAppearance(t.key)}
              style={{
                padding: '1.25rem 0.75rem',
                borderRadius: 14,
                cursor: 'pointer',
                border: appearance === t.key ? '2px solid var(--primary)' : '2px solid var(--border)',
                background: appearance === t.key ? 'rgba(99,102,241,0.07)' : 'var(--bg-body)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                color: appearance === t.key ? 'var(--primary)' : 'var(--text-sub)',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                boxShadow: appearance === t.key ? '0 4px 14px rgba(99,102,241,0.15)' : 'none',
                width: '100%',
                minWidth: 0,
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: appearance === t.key ? 'rgba(99,102,241,0.12)' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s'
              }}>
                {t.icon}
              </div>
              <span style={{ whiteSpace: 'nowrap' }}>{t.label}</span>
              {appearance === t.key && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em',
                  background: 'var(--primary)', color: 'var(--text-on-primary)',
                  padding: '2px 10px', borderRadius: 20
                }}>Active</span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section icon={<ShieldCheck size={20} />} title="Security Settings">
        <Toggle label="Two-Factor Authentication" sub="Add an extra layer of security" checked={twoFA} onChange={setTwoFA} />
        <Toggle label="Login Activity History" sub="Track recent login sessions" checked={loginHistory} onChange={setLoginHistory} />
      </Section>
    </div>
  );
}
