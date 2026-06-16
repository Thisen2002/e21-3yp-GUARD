import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import guardLogo from '../assets/guard-logo.png';
import '../styles/layout.css';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard'     },
  { to: '/alerts',     label: 'Notifications' },
  { to: '/analytics',  label: 'Analytics'     },
  { to: '/devices',    label: 'Devices'       },
  { to: '/fish',       label: 'Fish Info'     },
];

export default function Layout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navItems = role === 'SUPER_ADMIN'
    ? [{ to: '/users', label: 'Users' }, { to: '/fish', label: 'Fish Info' }]
    : role === 'ADMIN'
    ? [...NAV_ITEMS, { to: '/users', label: 'Users' }]
    : NAV_ITEMS.filter(item => item.to !== '/users');

  /* Close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* Close menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menuOpen]);

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <nav className="topnav" ref={menuRef}>

        {/* Brand */}
        <div className="topnav-brand">
          <img src={guardLogo} alt="G.U.A.R.D" className="topnav-logo" />
          <span>G.U.A.R.D</span>
        </div>

        {/* Desktop nav links — hidden on mobile */}
        <div className="topnav-links--desktop">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="topnav-user">
          <button className="theme-toggle-switch" title="Toggle Theme" onClick={toggleTheme} aria-label="Toggle Dark Mode">
            <span className="theme-toggle-circle"></span>
          </button>
          <button className="topnav-notif" title="Profile" onClick={() => navigate('/profile')}>
            👤
          </button>
          <button className="topnav-logout" onClick={logout} title="Sign out">
            ⏻
          </button>

          {/* Hamburger button — mobile only */}
          <button
            className={`topnav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="ham-bar" />
            <span className="ham-bar" />
            <span className="ham-bar" />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`topnav-mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
          <div className="topnav-mobile-inner">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) => `topnav-mobile-link${isActive ? ' active' : ''}`}
                tabIndex={menuOpen ? 0 : -1}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
