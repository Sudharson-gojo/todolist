import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/home', icon: '🏠' },
    { name: 'Daily', path: '/daily', icon: '📅' },
    { name: 'Weekly', path: '/weekly', icon: '📆' },
    { name: 'Monthly', path: '/monthly', icon: '🗓️' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo and Brand */}
          <div className="navbar-brand">
            <div className="logo">
              <div className="logo-icon">T</div>
              <span className="logo-text">TaskMaster</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Menu and Logout */}
          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">
                <span className="avatar-text">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="user-name">
                {user?.name || 'User'}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="mobile-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span className="mobile-nav-text">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
