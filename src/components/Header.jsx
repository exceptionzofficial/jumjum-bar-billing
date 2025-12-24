import { Clock, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatTime } from '../utils/formatters';
import './Header.css';

function Header() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

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

    return (
        <header className="header">
            <div className="header-brand">
                <div className="header-logo">🍺</div>
                <div className="header-title">
                    <h1>JumJum</h1>
                    <span className="header-subtitle">Bar & Kitchen</span>
                </div>
            </div>

            <div className="header-info">
                <div className="header-time">
                    <Clock size={24} />
                    <span>{formatTime(currentTime)}</span>
                </div>

                <div className={`header-status ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? <Wifi size={24} /> : <WifiOff size={24} />}
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
