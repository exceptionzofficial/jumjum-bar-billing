import { X, Printer, ChefHat, RotateCcw, Check } from 'lucide-react';
import { formatCurrency, calculateTotals, separateOrders, formatPhoneNumber } from '../utils/formatters';
import './OrderSummary.css';

function OrderSummary({ order, onClose, onNewOrder }) {
    const { cart, customer, orderId, timestamp } = order;
    const { subtotal, tax, total } = calculateTotals(cart);
    const { kitchenItems, barItems } = separateOrders(cart);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="order-overlay">
            <div className="order-modal">
                <div className="order-success-banner">
                    <div className="success-icon">
                        <Check size={48} />
                    </div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Order ID: <strong>{orderId}</strong></p>
                </div>

                <div className="order-content">
                    {/* Customer Info */}
                    <div className="order-section">
                        <h3>👤 Customer</h3>
                        <div className="order-customer">
                            <p><strong>{customer.name}</strong></p>
                            <p>📱 {formatPhoneNumber(customer.phone)}</p>
                        </div>
                    </div>

                    {/* Bar Items */}
                    {barItems.length > 0 && (
                        <div className="order-section">
                            <h3>🍺 Bar Items</h3>
                            <div className="order-items">
                                {barItems.map(item => (
                                    <div key={item.id} className="order-item">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Kitchen Items */}
                    {kitchenItems.length > 0 && (
                        <div className="order-section kitchen">
                            <h3>
                                <ChefHat size={24} />
                                Kitchen Items
                                <span className="sent-badge">Sent to Kitchen</span>
                            </h3>
                            <div className="order-items">
                                {kitchenItems.map(item => (
                                    <div key={item.id} className="order-item">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Totals */}
                    <div className="order-totals">
                        <div className="order-total-row">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="order-total-row">
                            <span>GST (5%)</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="order-total-row grand">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <p className="order-timestamp">
                        🕐 {new Date(timestamp).toLocaleString('en-IN')}
                    </p>
                </div>

                {/* Actions */}
                <div className="order-actions">
                    <button className="btn btn-lg btn-secondary" onClick={handlePrint}>
                        <Printer size={24} />
                        <span>Print Receipt</span>
                    </button>
                    <button className="btn btn-lg btn-primary" onClick={onNewOrder}>
                        <RotateCcw size={24} />
                        <span>New Order</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;
