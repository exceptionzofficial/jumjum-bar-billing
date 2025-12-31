import { useState, useEffect } from 'react';
import { Search, X, RefreshCw, Edit, CheckCircle } from 'lucide-react';
import { billingApi } from '../services/api';
import './BillHistory.css';

function BillHistory({ onEditBill }) {
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        try {
            setLoading(true);
            const data = await billingApi.getAll();
            setBills(data);
            setFilteredBills(data);
        } catch (error) {
            console.error('Failed to load bills:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredBills(bills);
            return;
        }
        const query = searchQuery.toLowerCase();
        const filtered = bills.filter(bill => {
            const billId = (bill.billid || bill.billId || '').toLowerCase();
            const customerName = getCustomerName(bill.customer).toLowerCase();
            const customerPhone = getCustomerPhone(bill.customer).toLowerCase();
            return billId.includes(query) || customerName.includes(query) || customerPhone.includes(query);
        });
        setFilteredBills(filtered);
    }, [searchQuery, bills]);

    const getCustomerName = (customer) => {
        if (!customer) return 'Walk-in';
        if (typeof customer === 'string') return customer;
        return customer.name || 'Walk-in';
    };

    const getCustomerPhone = (customer) => {
        if (!customer || typeof customer === 'string') return '';
        return customer.phone || '';
    };

    const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Check if bill is from today and still open
    const isEditableBill = (bill) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const billDate = new Date(bill.createdAt);
        billDate.setHours(0, 0, 0, 0);
        return billDate.getTime() === today.getTime() && bill.status !== 'completed';
    };

    const handleEditBill = (bill) => {
        if (onEditBill) {
            onEditBill(bill);
        }
    };

    const handleCloseBill = async (bill, e) => {
        e.stopPropagation();
        try {
            await billingApi.updateStatus(bill.billid || bill.billId, 'completed');
            loadBills();
        } catch (error) {
            console.error('Failed to close bill:', error);
        }
    };

    if (loading) {
        return <div className="bill-history"><p>Loading bills...</p></div>;
    }

    return (
        <div className="bill-history">
            <div className="page-header">
                <h1>📋 Bill History</h1>
                <button className="btn btn-secondary" onClick={loadBills}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by bill ID, customer name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="btn-icon" onClick={() => setSearchQuery('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="bills-table">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Bill ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBills.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">No bills found</td>
                            </tr>
                        ) : (
                            filteredBills.map(bill => (
                                <tr key={bill.billid || bill.billId} className={isEditableBill(bill) ? 'editable-row' : ''}>
                                    <td className="bill-id-cell">{bill.billid || bill.billId}</td>
                                    <td>
                                        <div className="customer-cell">
                                            <span className="customer-name">{getCustomerName(bill.customer)}</span>
                                            {getCustomerPhone(bill.customer) && (
                                                <span className="customer-phone">{getCustomerPhone(bill.customer)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div>{formatDate(bill.createdAt)}</div>
                                        <small style={{ color: 'var(--text-secondary)' }}>{formatTime(bill.createdAt)}</small>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${bill.status === 'completed' ? 'success' : 'warning'}`}>
                                            {(bill.status || 'open').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="amount">{formatCurrency(bill.total)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="view-btn" onClick={() => setSelectedBill(bill)}>
                                                View
                                            </button>
                                            {isEditableBill(bill) && onEditBill && (
                                                <>
                                                    <button className="edit-btn" onClick={() => handleEditBill(bill)}>
                                                        <Edit size={14} /> Edit
                                                    </button>
                                                    <button className="close-btn" onClick={(e) => handleCloseBill(bill, e)}>
                                                        <CheckCircle size={14} /> Close
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bill Detail Modal */}
            {selectedBill && (
                <div className="modal-overlay" onClick={() => setSelectedBill(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Bill Details</h2>
                            <button className="btn-icon" onClick={() => setSelectedBill(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Bill ID</span>
                                <span className="detail-value">{selectedBill.billid || selectedBill.billId}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Customer</span>
                                <span className="detail-value">{getCustomerName(selectedBill.customer)}</span>
                            </div>
                            {getCustomerPhone(selectedBill.customer) && (
                                <div className="detail-row">
                                    <span className="detail-label">Phone</span>
                                    <span className="detail-value">{getCustomerPhone(selectedBill.customer)}</span>
                                </div>
                            )}
                            <div className="detail-row">
                                <span className="detail-label">Date</span>
                                <span className="detail-value">{formatDate(selectedBill.createdAt)} {formatTime(selectedBill.createdAt)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status</span>
                                <span className={`badge badge-${selectedBill.status === 'completed' ? 'success' : 'warning'}`}>
                                    {(selectedBill.status || 'open').toUpperCase()}
                                </span>
                            </div>

                            <div className="items-section">
                                <h3>Items</h3>
                                {(selectedBill.items || []).map((item, idx) => (
                                    <div key={idx} className="item-row">
                                        <div>
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty"> × {item.quantity}</span>
                                        </div>
                                        <span className="item-total">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="total-section">
                                <div className="detail-row">
                                    <span className="detail-label">Subtotal</span>
                                    <span className="detail-value">{formatCurrency(selectedBill.subtotal || selectedBill.total)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Tax</span>
                                    <span className="detail-value">{formatCurrency(selectedBill.tax || 0)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Total</span>
                                    <span className="grand-total">{formatCurrency(selectedBill.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BillHistory;
