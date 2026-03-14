import React, { useState, useRef } from 'react';
import { User, Mail, Building2, Shield, Camera, Save, Edit2 } from 'lucide-react';

const initialData = {
  fullName: 'Dr. John Miller',
  email: 'john.miller@university.edu',
  department: 'Computer Science',
  role: 'Faculty Member',
};

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileRef = useRef();

  const initials = form.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.5rem 0', animation: 'fadeSlideIn 0.4s ease' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>My Profile</h2>

      {/* Profile Header Card */}
      <div className="card" style={{ borderRadius: 16, padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 700, color: '#fff',
            boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
            overflow: 'hidden'
          }}>
            {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <button
            onClick={() => fileRef.current.click()}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--primary)', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff'
            }}
          >
            <Camera size={13} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{form.fullName}</div>
          <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', marginTop: 2 }}>{form.role}</div>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span>Department: {form.department}</span>
            <span>Email: {form.email}</span>
          </div>
        </div>

        <button
          className={editing ? 'btn btn-sub' : 'btn btn-primary'}
          onClick={() => editing ? handleSave() : setEditing(true)}
          style={{ alignSelf: 'flex-start' }}
        >
          {editing ? <><Save size={16} /> Save Changes</> : <><Edit2 size={16} /> Edit Profile</>}
        </button>
      </div>

      {saved && (
        <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
          ✓ Profile updated successfully
        </div>
      )}

      {/* Editable Fields */}
      <div className="card" style={{ borderRadius: 16, padding: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Profile Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[
            { label: 'Full Name', key: 'fullName', icon: <User size={16} />, editable: true },
            { label: 'Email Address', key: 'email', icon: <Mail size={16} />, editable: true },
            { label: 'Department', key: 'department', icon: <Building2 size={16} />, editable: false },
            { label: 'Role', key: 'role', icon: <Shield size={16} />, editable: false },
          ].map(({ label, key, icon, editable }) => (
            <div key={key} className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-sub)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                {icon} {label} {!editable && <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>(read-only)</span>}
              </label>
              <input
                className="form-control"
                value={form[key]}
                readOnly={!editing || !editable}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                style={{
                  borderRadius: 10, fontSize: '0.9rem', padding: '0.7rem 0.875rem',
                  background: (!editing || !editable) ? '#f8fafc' : '#fff',
                  color: 'var(--text-main)', border: '1px solid var(--border)',
                  outline: 'none', transition: 'border 0.2s',
                  cursor: (!editing || !editable) ? 'default' : 'text'
                }}
                onFocus={e => { if (editing && editable) e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
          ))}
        </div>

        {editing && (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save Changes</button>
            <button className="btn btn-sub" onClick={() => { setEditing(false); setForm(initialData); }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
