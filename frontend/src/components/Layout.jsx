import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Database, Wand2, Users, Map, LogOut,
  ChevronDown, User, Settings, Sun, Moon, Monitor,
  ChevronLeft, Menu
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout, selectCurrentUser } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import logo1 from '../assets/logo/logo1.png';
import logoDark from '../assets/logo/logo1(2).png';

function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const user = useSelector(selectCurrentUser);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close mobile sidebar on navigation
  const handleNavClick = (to) => {
    navigate(to);
    setIsMobileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme-aware logo switching
  const [effectiveTheme, setEffectiveTheme] = useState(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  });

  useEffect(() => {
    const updateTheme = () => {
      if (theme === 'system') {
        setEffectiveTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const currentLogo = effectiveTheme === 'dark' ? logoDark : logo1;

  const navItems = [
    { to: '/app/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/app/bank', icon: <Database size={20} />, label: 'Question Bank' },
    { to: '/app/generator', icon: <Wand2 size={20} />, label: 'Paper Generator' },
  ];

  const adminItems = [
    { to: '/app/admin', icon: <Users size={20} />, label: 'Faculty Management' },
    { to: '/app/subjects', icon: <Map size={20} />, label: 'Subject Mapping' },
  ];

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 70 }
  };

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button onClick={() => setIsMobileOpen(true)} className="toggle-btn" style={{ background: 'transparent', border: 'none' }}>
          <Menu size={24} color="var(--text-main)" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={currentLogo} alt="Logo" style={{ height: '32px' }} />
          <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.1rem' }}>QP Generator</span>
        </div>
        <div style={{ width: '24px' }} /> {/* Spacer */}
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <motion.div
        className={`sidebar ${isMobileOpen ? 'sidebar-mobile-open' : ''}`}
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Fixed Header Section */}
        <div className="sidebar-header">
          <div className={`sidebar-brand ${isCollapsed ? 'sidebar-brand-collapsed' : ''}`}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="toggle-btn"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              style={{ alignSelf: isCollapsed ? 'center' : 'auto', marginBottom: isCollapsed ? '0.5rem' : '0' }}
            >
              {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
            </button>

            <div className="brand-logo-container" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
              <div className="brand-logo">
                <img src={currentLogo} alt="QP Creator Logo" />
              </div>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  style={{ fontSize: '1.125rem', fontWeight: '700', letterSpacing: '-0.025em', color: 'var(--text-main)', whiteSpace: 'nowrap', marginLeft: '-25px' }}
                >
                  QP Generator
                </motion.h3>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Body Section */}
        <div className="sidebar-body">
          <div className="nav-group">
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="nav-label">
                MAIN CONSOLE
              </motion.div>
            )}
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
              >
                <div style={{ minWidth: '20px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                {!isCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.label}</motion.span>
                )}
              </NavLink>
            ))}
          </div>

          {user?.role === 'admin' && (
            <div className="nav-group">
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="nav-label">
                  CONTROL CENTER
                </motion.div>
              )}
              {adminItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                >
                  <div style={{ minWidth: '20px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.label}</motion.span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Footer Section */}
        <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
          {/* THEME TOGGLE ROW/COLUMN */}
          <div style={{
            display: 'flex',
            flexDirection: isCollapsed ? 'column' : 'row',
            background: 'var(--border-light)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '1rem',
            gap: '4px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {[
              { id: 'light', icon: <Sun size={18} /> },
              { id: 'dark', icon: <Moon size={18} /> },
              { id: 'system', icon: <Monitor size={18} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                title={`${item.id} mode`}
                style={{
                  width: isCollapsed ? '100%' : 'auto',
                  flex: isCollapsed ? 'none' : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: theme === item.id ? 'var(--bg-card)' : 'transparent',
                  color: theme === item.id ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: theme === item.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {item.icon}
              </button>
            ))}
          </div>

          {/* User Profile Card */}
          <div className="profile-container" ref={profileRef}>
            <div
              className="profile-card"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{ padding: isCollapsed ? '0.5rem' : '0.875rem', justifyContent: isCollapsed ? 'center' : 'flex-start', background: 'var(--border-light)', border: '1px solid var(--border)' }}
            >
              <div className="profile-avatar">
                <span>{user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}</span>
              </div>
              {!isCollapsed && (
                <>
                  <motion.div className="profile-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="profile-name" style={{ color: 'var(--text-main)' }}>{user?.name || 'Guest User'}</div>
                    <div className="profile-role" style={{ textTransform: 'capitalize', color: 'var(--text-sub)' }}>
                      {user?.role || 'Guest'}
                    </div>
                  </motion.div>
                  <ChevronDown
                    size={16}
                    className="profile-dropdown"
                    style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-sub)' }}
                  />
                </>
              )}
            </div>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  className="profile-menu"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  style={{
                    bottom: '100%',
                    left: isCollapsed ? '-10px' : 0,
                    right: isCollapsed ? 'auto' : 0,
                    width: isCollapsed ? '200px' : 'auto',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                    padding: '0.5rem'
                  }}
                >
                  <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); setIsMobileOpen(false); navigate('/app/profile'); }}>
                    <User size={18} />
                    <span>My Profile</span>
                  </div>
                  <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); setIsMobileOpen(false); navigate('/app/settings'); }}>
                    <Settings size={18} />
                    <span>Settings</span>
                  </div>
                  <div className="profile-menu-divider" style={{ background: 'var(--border)' }}></div>
                  <div className="profile-menu-item profile-menu-logout" onClick={() => { dispatch(logout()); navigate('/login'); }}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="main-content"
        animate={{
          marginLeft: isCollapsed ? 70 : 260,
          width: isCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 260px)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}

export default Layout;
