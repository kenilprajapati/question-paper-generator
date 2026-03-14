import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Database, Wand2, Users, Map, LogOut, ChevronDown, User, Settings } from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Q</span>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', letterSpacing: '-0.025em' }}>QP Creator</h3>
        </div>

        {/* Main Console Section */}
        <div className="nav-group">
          <div className="nav-label">MAIN CONSOLE</div>
          <NavLink to="/app/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active': ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/app/bank" className={({isActive}) => `nav-link ${isActive ? 'active': ''}`}>
            <Database size={20} />
            <span>Question Bank</span>
          </NavLink>
          <NavLink to="/app/generator" className={({isActive}) => `nav-link ${isActive ? 'active': ''}`}>
            <Wand2 size={20} />
            <span>Paper Generator</span>
          </NavLink>
        </div>

        {/* Control Center Section */}
        <div className="nav-group">
          <div className="nav-label">CONTROL CENTER</div>
          <NavLink to="/app/admin" className={({isActive}) => `nav-link ${isActive ? 'active': ''}`}>
            <Users size={20} />
            <span>Faculty Management</span>
          </NavLink>
          <NavLink to="/app/subjects" className={({isActive}) => `nav-link ${isActive ? 'active': ''}`}>
            <Map size={20} />
            <span>Subject Mapping</span>
          </NavLink>
        </div>

        {/* Bottom Section */}
        <div style={{ marginTop: 'auto' }}>
          {/* Logout Button */}
          <button className="logout-btn" onClick={() => navigate('/')}>
            <LogOut size={20} />
            <span>Logout Account</span>
          </button>

          {/* User Profile Card */}
          <div className="profile-container" ref={profileRef}>
            <div className="profile-card" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="profile-avatar">
                <span>JM</span>
              </div>
              <div className="profile-info">
                <div className="profile-name">Dr. John Miller</div>
                <div className="profile-role">Faculty Member</div>
              </div>
              <ChevronDown 
                size={16} 
                className="profile-dropdown" 
                style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="profile-menu">
                <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); navigate('/app/profile'); }}>
                  <User size={18} />
                  <span>My Profile</span>
                </div>
                <div className="profile-menu-item" onClick={() => { setIsProfileOpen(false); navigate('/app/settings'); }}>
                  <Settings size={18} />
                  <span>Settings</span>
                </div>
                <div className="profile-menu-divider"></div>
                <div className="profile-menu-item profile-menu-logout" onClick={() => { setIsProfileOpen(false); navigate('/'); }}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
