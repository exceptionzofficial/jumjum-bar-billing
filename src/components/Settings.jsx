import { User, Moon, Sun, LogOut, ChevronRight, Info, Store } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

function Settings({ user, onLogout }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="settings">
            <h1>⚙️ Settings</h1>

            {/* Profile Card */}
            <div className="profile-card">
                <div className="profile-avatar">
                    {user?.name?.charAt(0) || 'S'}
                </div>
                <div className="profile-info">
                    <h2>{user?.name || 'Staff Member'}</h2>
                    <p>{user?.role || 'Bar Staff'}</p>
                </div>
            </div>

            {/* Appearance */}
            <div className="settings-section">
                <div className="section-title">Appearance</div>
                <div className="setting-item" onClick={toggleTheme}>
                    <div className={`setting-icon ${isDark ? 'purple' : 'blue'}`}>
                        {isDark ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div className="setting-info">
                        <div className="setting-label">Dark Mode</div>
                        <div className="setting-value">{isDark ? 'On' : 'Off'}</div>
                    </div>
                    <div className={`toggle-switch ${isDark ? 'active' : ''}`} />
                </div>
            </div>

            {/* About */}
            <div className="settings-section">
                <div className="section-title">About</div>
                <div className="setting-item">
                    <div className="setting-icon green">
                        <Store size={20} />
                    </div>
                    <div className="setting-info">
                        <div className="setting-label">Sri Kalki Jam Jam Resorts</div>
                        <div className="setting-value">Erode, Tamil Nadu</div>
                    </div>
                </div>
                <div className="setting-item">
                    <div className="setting-icon blue">
                        <Info size={20} />
                    </div>
                    <div className="setting-info">
                        <div className="setting-label">App Version</div>
                        <div className="setting-value">1.0.0</div>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <button className="logout-btn" onClick={onLogout}>
                <LogOut size={20} />
                Logout
            </button>

            <div className="version-info">
                JumJum Staff Panel v1.0.0
            </div>
        </div>
    );
}

export default Settings;
