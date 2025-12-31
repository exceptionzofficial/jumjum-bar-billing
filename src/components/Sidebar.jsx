import { Home, PlusCircle, History, Settings } from 'lucide-react';
import './Sidebar.css';

function Sidebar({ activePage, onPageChange, user }) {
    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: Home },
        { id: 'newbill', label: 'New Bill', icon: PlusCircle },
        { id: 'history', label: 'Bill History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon">SK</div>
                    <div className="logo-text">
                        <h1>SRI KALKI</h1>
                        <span>Jam Jam Resorts</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-title">Menu</div>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => onPageChange(item.id)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="user-details">
                        <div className="user-name">{user?.name || 'Staff'}</div>
                        <div className="user-role">{user?.role || 'Bar Staff'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
