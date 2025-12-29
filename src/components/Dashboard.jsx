import { useState, useEffect } from 'react';
import { Receipt, IndianRupee, TrendingUp, Clock, PlusCircle, History } from 'lucide-react';
import { billingApi } from '../services/api';
import './Dashboard.css';

function Dashboard({ onNavigate }) {
    const [stats, setStats] = useState({ totalBills: 0, totalRevenue: 0 });
    const [recentBills, setRecentBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const bills = await billingApi.getAll();

            // Calculate today's stats
            const today = new Date().toDateString();
            const todayBills = bills.filter(b => new Date(b.createdAt).toDateString() === today);
            const totalRevenue = todayBills.reduce((sum, b) => sum + (b.total || 0), 0);

            setStats({
                totalBills: todayBills.length,
                totalRevenue,
                avgOrder: todayBills.length > 0 ? Math.round(totalRevenue / todayBills.length) : 0,
            });

            // Get recent 5 bills
            setRecentBills(bills.slice(0, 5));
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`;

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getCustomerName = (customer) => {
        if (!customer) return 'Walk-in';
        if (typeof customer === 'string') return customer;
        return customer.name || 'Walk-in';
    };

    if (loading) {
        return <div className="dashboard"><p>Loading...</p></div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>{getGreeting()}, Staff! 👋</h1>
                <p>Here's what's happening today at JumJum</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon blue"><Receipt size={22} /></div>
                        <span className="stat-label">Today's Bills</span>
                    </div>
                    <div className="stat-value">{stats.totalBills}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon green"><IndianRupee size={22} /></div>
                        <span className="stat-label">Today's Revenue</span>
                    </div>
                    <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon purple"><TrendingUp size={22} /></div>
                        <span className="stat-label">Avg Order Value</span>
                    </div>
                    <div className="stat-value">{formatCurrency(stats.avgOrder)}</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
                <div className="section-header"><h2>Quick Actions</h2></div>
                <div className="quick-actions">
                    <div className="action-card" onClick={() => onNavigate('newbill')}>
                        <div className="action-icon primary"><PlusCircle size={22} /></div>
                        <span className="action-label">New Bill</span>
                    </div>
                    <div className="action-card" onClick={() => onNavigate('history')}>
                        <div className="action-icon success"><History size={22} /></div>
                        <span className="action-label">View History</span>
                    </div>
                </div>
            </div>

            {/* Recent Bills */}
            <div className="section">
                <div className="section-header">
                    <h2>Recent Bills</h2>
                    <button className="btn btn-link" onClick={() => onNavigate('history')}>View All</button>
                </div>
                <div className="recent-bills">
                    {recentBills.length === 0 ? (
                        <div className="empty-state">No bills yet today</div>
                    ) : (
                        recentBills.map(bill => (
                            <div key={bill.billid || bill.billId} className="bill-item">
                                <div className="bill-icon"><Receipt size={18} /></div>
                                <div className="bill-info">
                                    <div className="bill-id">{bill.billid || bill.billId}</div>
                                    <div className="bill-customer">{getCustomerName(bill.customer)}</div>
                                </div>
                                <div>
                                    <div className="bill-amount">{formatCurrency(bill.total)}</div>
                                    <div className="bill-time">{formatTime(bill.createdAt)}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
