import { useState, useEffect } from 'react';
import { Receipt, Clock, User, ShoppingBag, Play, CheckCircle, RefreshCw } from 'lucide-react';
import { billingApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import './ActiveBills.css';

function ActiveBills({ onSelectBill, onClose }) {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingBills();
    }, []);

    const loadPendingBills = async () => {
        try {
            setLoading(true);
            const pendingBills = await billingApi.getPending();
            setBills(pendingBills || []);
        } catch (error) {
            console.error('Failed to load pending bills:', error);
            setBills([]);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCustomerName = (customer) => {
        if (!customer) return 'Walk-in';
        if (typeof customer === 'string') return customer;
        return customer.name || 'Walk-in';
    };

    const handleContinueBill = (bill) => {
        onSelectBill(bill);
        onClose();
    };

    const handleCloseBill = async (bill) => {
        try {
            await billingApi.updateStatus(bill.billid || bill.billId, 'completed');
            loadPendingBills();
        } catch (error) {
            console.error('Failed to close bill:', error);
        }
    };

    return (
        <div className="active-bills-overlay" onClick={onClose}>
            <div className="active-bills-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title">
                        <Receipt size={24} />
                        <h2>Active Bills</h2>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={loadPendingBills}>
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : bills.length === 0 ? (
                        <div className="empty-state">
                            <ShoppingBag size={48} />
                            <h3>No Active Bills</h3>
                            <p>All bills have been closed</p>
                        </div>
                    ) : (
                        <div className="bills-list">
                            {bills.map((bill) => (
                                <div key={bill.billid || bill.billId} className="bill-card">
                                    <div className="bill-header">
                                        <span className="bill-id">{bill.billid || bill.billId}</span>
                                        <span className="bill-time">
                                            <Clock size={14} />
                                            {formatTime(bill.createdAt)}
                                        </span>
                                    </div>

                                    <div className="bill-customer">
                                        <User size={16} />
                                        <span>{getCustomerName(bill.customer)}</span>
                                    </div>

                                    <div className="bill-items">
                                        {(bill.items || []).slice(0, 3).map((item, idx) => (
                                            <span key={idx} className="item-tag">
                                                {item.quantity}× {item.name}
                                            </span>
                                        ))}
                                        {(bill.items || []).length > 3 && (
                                            <span className="item-tag more">
                                                +{bill.items.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="bill-footer">
                                        <span className="bill-total">{formatCurrency(bill.total)}</span>
                                        <div className="bill-actions">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleContinueBill(bill)}
                                            >
                                                <Play size={14} />
                                                Continue
                                            </button>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleCloseBill(bill)}
                                            >
                                                <CheckCircle size={14} />
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ActiveBills;
