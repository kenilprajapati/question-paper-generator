import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { UserPlus, Shield, MoreVertical, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../api/axiosInstance';
import SkeletonLoader from '../components/ui/Skeleton';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid institutional email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string(),
  role: z.enum(['admin', 'faculty']),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

function Admin() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  // Queries & Mutations
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosInstance.get('/auth/users');
      return response.data.data.users;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => axiosInstance.post('/auth/create-user', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Professional account created successfully');
      setShowAddModal(false);
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Creation failed')
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => axiosInstance.patch(`/auth/users/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Credential status updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed')
  });

  // Form Setup
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'faculty' }
  });

  const users = usersResponse || [];
  const SUPER_ADMIN_EMAIL = 'admin@institution.edu';

  return (
    <div className="screen active" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '2.5rem' 
        }}>
            <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Institutional Access Control
                </h1>
                <p style={{ color: 'var(--text-sub)', fontSize: '1rem' }}>
                  Manage faculty credentials and administrative privileges
                </p>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
            >
              <UserPlus size={18} />
              <span>Provision Account</span>
            </button>
        </div>
        
        {/* Users Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)', background: 'var(--bg-body)' }}>
                            <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase' }}>USER IDENTITY</th>
                            <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase' }}>ACCESS LEVEL</th>
                            <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase' }}>SECURITY STATUS</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase' }}>PRIVILEGES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                          [...Array(5)].map((_, i) => (
                            <tr key={i}>
                              <td colSpan="4" style={{ padding: '1.5rem' }}><SkeletonLoader height={40} /></td>
                            </tr>
                          ))
                        ) : users.length > 0 ? (
                          users.map(f => {
                            const isSuperAdmin = f.email === SUPER_ADMIN_EMAIL;
                            return (
                              <tr key={f._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', background: 'var(--bg-card)' }}>
                                  <td style={{ padding: '1.25rem' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{f.name}</span>
                                          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{f.email}</span>
                                      </div>
                                  </td>
                                  <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      {f.role === 'admin' ? <Shield size={16} color="#6366f1" /> : <ShieldAlert size={16} color="#94a3b8" />}
                                      <span style={{ textTransform: 'capitalize', fontWeight: 500, fontSize: '0.95rem' }}>{f.role}</span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '1.25rem' }}>
                                      <span className={`badge ${f.status === 'Active' ? 'badge-success' : f.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                                          {f.status}
                                      </span>
                                  </td>
                                  <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                      {isSuperAdmin ? (
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-sub)', fontSize: '0.75rem', fontStyle: 'italic', padding: '4px 8px', background: 'var(--bg-body)', borderRadius: '6px' }}>
                                          <Lock size={12} /> System Protected
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                          {f.status === 'Active' ? (
                                            <button 
                                              className="btn-sub" 
                                              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', border: '1px solid #fee2e2', background: '#fef2f2' }}
                                              onClick={() => statusMutation.mutate({ id: f._id, status: 'Revoked' })}
                                              disabled={statusMutation.isPending}
                                            >
                                              <XCircle size={14} /> Revoke
                                            </button>
                                          ) : (
                                            <button 
                                              className="btn-sub" 
                                              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', border: '1px solid #d1fae5', background: '#ecfdf5' }}
                                              onClick={() => statusMutation.mutate({ id: f._id, status: 'Active' })}
                                              disabled={statusMutation.isPending}
                                            >
                                              <CheckCircle size={14} /> Activate
                                            </button>
                                          )}
                                        </div>
                                      )}
                                  </td>
                              </tr>
                            );
                          })
                        ) : (
                            <tr><td colSpan="4" style={{ padding: '6rem', textAlign: 'center', color: 'var(--text-sub)' }}>No authorized personnel records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Provisioning Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              width: '100%',
              maxWidth: '500px',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Provision New Account</h2>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', marginBottom: '2rem' }}>Assign institutional credentials and access levels</p>

              <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Full Name</label>
                  <input 
                    {...register('name')} 
                    className="form-control" 
                    placeholder="Dr. James Miller" 
                    style={{ border: errors.name ? '1px solid #ef4444' : '1px solid var(--border)' }}
                  />
                  {errors.name && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>{errors.name.message}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Email Address</label>
                  <input 
                    {...register('email')} 
                    className="form-control" 
                    placeholder="miller@institution.edu" 
                    style={{ border: errors.email ? '1px solid #ef4444' : '1px solid var(--border)' }}
                  />
                  {errors.email && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Password</label>
                    <input 
                      type="password" 
                      {...register('password')} 
                      className="form-control" 
                      placeholder="••••••••" 
                      style={{ border: errors.password ? '1px solid #ef4444' : '1px solid var(--border)' }}
                    />
                    {errors.password && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>{errors.password.message}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Confirm</label>
                    <input 
                      type="password" 
                      {...register('passwordConfirm')} 
                      className="form-control" 
                      placeholder="••••••••" 
                      style={{ border: errors.passwordConfirm ? '1px solid #ef4444' : '1px solid var(--border)' }}
                    />
                    {errors.passwordConfirm && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>{errors.passwordConfirm.message}</span>}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Access Privileges</label>
                  <select {...register('role')} className="form-control">
                    <option value="faculty">Faculty Member</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-sub" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Provisioning...' : 'Confirm Provisioning'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

const Lock = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default Admin;
