import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useZodForm } from '../hooks/useZodForm';
import { setCredentials, selectIsAuthenticated } from '../store/slices/authSlice';
import axiosInstance from '../api/axiosInstance';
import logo from '../assets/logo/logo1.png';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid institution email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'faculty'], {
    errorMap: () => ({ message: 'Please select your institutional role' }),
  }),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if already logged in (important for back button navigation)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { register, handleSubmit, errors, watch, setValue } = useZodForm(loginSchema, {
    email: '',
    password: '',
    role: 'faculty',
  });

  const selectedRole = watch('role');

  const onLogin = async (data) => {
    console.log('FRONTEND LOGIN SUBMIT:', { email: data.email, role: data.role });
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: data.email,
        password: data.password,
        role: data.role
      });

      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token }));
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/app/dashboard');
    } catch (error) {
      console.error('LOGIN ERROR DETAIL:', error);
      
      let message = 'An unexpected error occurred.';
      
      if (!error.response) {
        // No response from server (network error or server down)
        message = 'Server is currently offline. Please contact the administrator.';
      } else {
        // Server responded with an error (401, 400, etc.)
        message = error.response.data?.message || 'Authentication failed. Please check your credentials.';
      }
      
      toast.error(message, {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-body)',
      padding: '1.5rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          padding: '3rem 2rem',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: 'var(--shadow-md)',
          zIndex: 1,
          position: 'relative'
        }}
      >
        <h2 style={{ fontSize: '2.625rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', marginBottom: '1.5rem', textAlign: 'center' }}>
          Login
        </h2>
        {/* Logo Section */}
        <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '140px',
            height: '140px',
            background: 'var(--bg-card)',
            borderRadius: '100px',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' // Subtle lift for the logo itself
              }}
            />
          </div>
          <p style={{ color: '#64748b', fontSize: '1.5rem', fontWeight: 500, letterSpacing: '0.01em', textAlign: 'center', marginTop: '0.5rem' }}>
            Question Paper Generator
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onLogin)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  background: 'var(--bg-input)',
                  border: errors.email ? '1.5px solid #ef4444' : '1.5px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.background = '#fff';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--border)';
                  e.target.style.background = 'var(--bg-input)';
                }}
              />
            </div>
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500 }}>
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-sub)', marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '0.75rem 3rem 0.75rem 2.5rem',
                  background: 'var(--bg-input)',
                  border: errors.password ? '1.5px solid #ef4444' : '1.5px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.background = '#fff';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? '#ef4444' : 'var(--border)';
                  e.target.style.background = 'var(--bg-input)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500 }}>
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Role Selection */}
          <motion.div variants={itemVariants}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-sub)', marginBottom: '0.5rem' }}>
              Access Level
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['faculty', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setValue('role', role, { shouldValidate: true })}
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    borderRadius: '10px',
                    border: '1.5px solid',
                    borderColor: selectedRole === role ? 'var(--primary)' : 'var(--border)',
                    background: selectedRole === role ? 'rgba(99,102,241,0.1)' : 'var(--bg-card)',
                    color: selectedRole === role ? 'var(--primary)' : 'var(--text-sub)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize'
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem',
              marginTop: '0.5rem',
              background: '#6366f1',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.2s'
            }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
          </motion.button>
        </form>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;
