import { X, Printer, CheckCircle, Plus } from 'lucide-react';
import { formatCurrency, separateOrders, formatPhoneNumber } from '../utils/formatters';
import './OrderSummary.css';

function OrderSummary({ order, onClose, onNewOrder }) {
    const { kitchenItems, barItems } = separateOrders(order.cart);

    const subtotal = order.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const totalItems = order.cart.reduce((sum, item) => sum + item.quantity, 0);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="order-overlay">
            <div className="order-modal">
                {/* Modal Header - Hide on Print */}
                <div className="modal-header no-print">
                    <div className="success-badge">
                        <CheckCircle size={20} />
                        <span>Order Confirmed</span>
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Invoice Content */}
                <div className="invoice" id="invoice-print">
                    {/* Invoice Header */}
                    <div className="invoice-header">
                        <div className="company-info">
                            <div className="company-logo">JJ</div>
                            <div className="company-details">
                                <h1>JumJum</h1>
                                <p>Bar & Kitchen</p>
                            </div>
                        </div>
                        <div className="invoice-meta">
                            <div className="invoice-title">TAX INVOICE</div>
                            <div className="invoice-number">#{order.orderId?.slice(-8) || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="invoice-divider"></div>

                    {/* Bill Info */}
                    <div className="invoice-info">
                        <div className="info-block">
                            <span className="info-label">Bill To</span>
                            <span className="info-value">{order.customer?.name || 'Customer'}</span>
                            {order.customer?.phone && (
                                <span className="info-sub">{formatPhoneNumber(order.customer.phone)}</span>
                            )}
                        </div>
                        <div className="info-block right">
                            <span className="info-label">Date & Time</span>
                            <span className="info-value">{formatDate(order.timestamp)}</span>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="invoice-table">
                        <div className="table-header">
                            <span className="col-item">Item</span>
                            <span className="col-qty">Qty</span>
                            <span className="col-rate">Rate</span>
                            <span className="col-amount">Amount</span>
                        </div>

                        {/* Bar Items */}
                        {barItems.length > 0 && (
                            <>
                                <div className="table-section-header">Bar Items</div>
                                {barItems.map((item, idx) => (
                                    <div key={idx} className="table-row">
                                        <span className="col-item">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-id">{item.itemId}</span>
                                        </span>
                                        <span className="col-qty">{item.quantity}</span>
                                        <span className="col-rate">{formatCurrency(item.price)}</span>
                                        <span className="col-amount">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Kitchen Items */}
                        {kitchenItems.length > 0 && (
                            <>
                                <div className="table-section-header">Kitchen Items</div>
                                {kitchenItems.map((item, idx) => (
                                    <div key={idx} className="table-row">
                                        <span className="col-item">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-id">{item.itemId}</span>
                                        </span>
                                        <span className="col-qty">{item.quantity}</span>
                                        <span className="col-rate">{formatCurrency(item.price)}</span>
                                        <span className="col-amount">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Totals */}
                    <div className="invoice-totals">
                        <div className="totals-row">
                            <span>Subtotal ({totalItems} items)</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="totals-row">
                            <span>GST @ 5%</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="totals-row grand-total">
                            <span>Total Amount</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Invoice Footer */}
                    <div className="invoice-footer">
                        <div className="footer-note">
                            Thank you for your visit!
                        </div>
                        <div className="footer-info">
                            <span>Payment: Cash</span>
                            <span>•</span>
                            <span>GSTIN: 29AXXXX1234X1ZX</span>
                        </div>
                    </div>
                </div>

                {/* Modal Actions - Hide on Print */}
                <div className="modal-actions no-print">
                    <button className="btn btn-secondary" onClick={handlePrint}>
                        <Printer size={18} />
                        Print Invoice
                    </button>
                    <button className="btn btn-primary" onClick={onNewOrder}>
                        <Plus size={18} />
                        New Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;
