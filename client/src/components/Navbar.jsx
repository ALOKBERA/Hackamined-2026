import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LogOut,
    LayoutDashboard,
    Sun,
    Moon,
    Command,
    User as UserIcon
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    if (!user) return null;

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-logo">
                <Command size={24} className="text-secondary" />
                <span>SnapSense <span className="gradient-text">AI</span></span>
            </Link>

            <div className="nav-links">
                <Link
                    to="/dashboard"
                    className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                    </div>
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        color: 'var(--text-secondary)',
                        padding: '8px',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)'
                    }}
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src={user.picture}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)' }}
                    />
                    <button
                        onClick={logout}
                        className="btn-ghost"
                        title="Sign Out"
                        style={{ padding: '8px' }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
