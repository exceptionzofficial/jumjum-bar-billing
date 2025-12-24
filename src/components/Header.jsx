import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

function Header() {
    const [time, setTime] = useState(new Date());
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            clearInterval(timer);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <header className="header">
            <div className="header-brand">
                <div className="brand-logo">JJ</div>
                <div className="brand-text">
                    <h1>JumJum</h1>
                    <span>Bar & Kitchen</span>
                </div>
            </div>

            <div className="header-center">
                <div className="header-time">
                    <Clock size={18} />
                    <span className="time-display">{formatTime(time)}</span>
                    <span className="date-display">{formatDate(time)}</span>
                </div>
            </div>

            <div className="header-right">
                <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
