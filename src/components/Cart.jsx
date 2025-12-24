import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency, separateOrders } from '../utils/formatters';
import './Cart.css';

function Cart({ cart, customer, onAdd, onRemove, onClear, onPlaceOrder }) {
    const { kitchenItems, barItems } = separateOrders(cart);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + tax;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const isValid = customer.name.trim() && cart.length > 0;

    return (
        <div className="cart">
            <div className="cart-header">
                <div className="cart-title">
                    <ShoppingBag size={20} />
                    <h2>Order Summary</h2>
                </div>
                {cart.length > 0 && (
                    <button className="btn btn-ghost btn-icon" onClick={onClear} title="Clear cart">
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {cart.length === 0 ? (
                <div className="cart-empty">
                    <div className="empty-icon">
                        <ShoppingBag size={40} />
                    </div>
                    <p>No items added</p>
                    <span>Select items from the menu</span>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {/* Bar Items */}
                        {barItems.length > 0 && (
                            <div className="cart-section">
                                <div className="section-header bar">
                                    <span className="section-badge">BAR</span>
                                    <span className="section-count">{barItems.length} items</span>
                                </div>
                                {barItems.map(item => (
                                    <div key={item.itemId} className="cart-item">
                                        <div className="item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">{formatCurrency(item.price)}</span>
                                        </div>
                                        <div className="item-controls">
                                            <button className="qty-btn" onClick={() => onRemove(item)}>
                                                <Minus size={14} />
                                            </button>
                                            <span className="item-qty">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => onAdd(item)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="item-total">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Kitchen Items */}
                        {kitchenItems.length > 0 && (
                            <div className="cart-section">
                                <div className="section-header kitchen">
                                    <span className="section-badge">KITCHEN</span>
                                    <span className="section-count">{kitchenItems.length} items</span>
                                </div>
                                {kitchenItems.map(item => (
                                    <div key={item.itemId} className="cart-item">
                                        <div className="item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">{formatCurrency(item.price)}</span>
                                        </div>
                                        <div className="item-controls">
                                            <button className="qty-btn" onClick={() => onRemove(item)}>
                                                <Minus size={14} />
                                            </button>
                                            <span className="item-qty">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => onAdd(item)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="item-total">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Totals */}
                    <div className="cart-totals">
                        <div className="total-row">
                            <span>Items ({totalItems})</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="total-row">
                            <span>GST (5%)</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Total Amount</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Place Order */}
                    <button
                        className="btn btn-success btn-lg place-order-btn"
                        onClick={onPlaceOrder}
                        disabled={!isValid}
                    >
                        {!customer.name.trim() ? 'Enter Customer Name' : 'Place Order'}
                    </button>
                </>
            )}
        </div>
    );
}

export default Cart;
