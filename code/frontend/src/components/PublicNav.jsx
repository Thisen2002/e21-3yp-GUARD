import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import guardLogo from '../assets/guard-logo.png';
import '../styles/navigation.css';

const NAV_ITEMS = [
  { to: '/',      label: 'Home',    end: true  },
  { to: '/about', label: 'About'              },
  { to: { pathname: '/', hash: '#contacts' }, label: 'Contact' },
  { to: '/login',    label: 'Sign In' },
  { to: '/register', label: 'Sign Up' },
];

export default function PublicNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const contactActive = location.pathname === '/' && location.hash === '#contacts';

  /* Close on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.hash]);

  /* Close on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menuOpen]);

  function handleNavClick(targetPath) {
    if (location.pathname === targetPath) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  return (
    <nav className="site-nav" ref={navRef} aria-label="Primary">

      {/* Brand */}
      <Link
        to="/"
        className="site-nav-brand"
        aria-label="Go to home page"
        onClick={() => handleNavClick('/')}
      >
        <span className="site-nav-logo">
          <img src={guardLogo} alt="G.U.A.R.D logo" />
        </span>
        <span className="site-nav-title">G.U.A.R.D</span>
      </Link>

      {/* Desktop links — hidden on mobile */}
      <div className="site-nav-links">
        {NAV_ITEMS.map((item) =>
          item.label === 'Contact' ? (
            <Link
              key={item.label}
              to="/#contacts"
              className={contactActive ? 'site-nav-link active' : 'site-nav-link'}
            >
              {item.label}
            </Link>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'site-nav-link active' : 'site-nav-link')}
              onClick={() =>
                handleNavClick(typeof item.to === 'string' ? item.to : item.to.pathname)
              }
            >
              {item.label}
            </NavLink>
          )
        )}
      </div>

      {/* Hamburger — mobile only */}
      <button
        className={`site-nav-hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span className="site-ham-bar" />
        <span className="site-ham-bar" />
        <span className="site-ham-bar" />
      </button>

      {/* Mobile dropdown */}
      <div className={`site-nav-mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="site-nav-mobile-inner">
          {NAV_ITEMS.map((item) =>
            item.label === 'Contact' ? (
              <Link
                key={item.label}
                to="/#contacts"
                className={contactActive ? 'site-nav-mobile-link active' : 'site-nav-mobile-link'}
                tabIndex={menuOpen ? 0 : -1}
              >
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'site-nav-mobile-link active' : 'site-nav-mobile-link'
                }
                tabIndex={menuOpen ? 0 : -1}
                onClick={() =>
                  handleNavClick(typeof item.to === 'string' ? item.to : item.to.pathname)
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>
      </div>
    </nav>
  );
}