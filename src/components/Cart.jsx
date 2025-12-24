import { ShoppingCart, Plus, Minus, Trash2, Send } from 'lucide-react';
import { formatCurrency, calculateTotals, separateOrders } from '../utils/formatters';
import './Cart.css';

function Cart({ cart, onAdd, onRemove, onClear, onPlaceOrder, customer }) {
    const { subtotal, tax, total } = calculateTotals(cart);
    const { kitchenItems, barItems } = separateOrders(cart);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const canPlaceOrder = cart.length > 0 && customer.name && customer.phone;

    return (
        <div className="cart">
            <div className="cart-header">
                <div className="cart-title">
                    <ShoppingCart size={28} />
                    <h2>Current Order</h2>
                    {itemCount > 0 && <span className="badge">{itemCount}</span>}
                </div>
                {cart.length > 0 && (
                    <button className="btn btn-icon btn-danger" onClick={onClear} title="Clear Cart">
                        <Trash2 size={24} />
                    </button>
                )}
            </div>

            {cart.length === 0 ? (
                <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>
                    <p>Cart is empty</p>
                    <span>Add items from menu</span>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {/* Bar Items Section */}
                        {barItems.length > 0 && (
                            <div className="cart-section">
                                <div className="cart-section-header bar">
                                    <span>🍺 Bar Items</span>
                                    <span>{barItems.length} items</span>
                                </div>
                                {barItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <p>{formatCurrency(item.price)} × {item.quantity}</p>
                                        </div>
                                        <div className="cart-item-controls">
                                            <button className="btn btn-icon" onClick={() => onRemove(item)}>
                                                <Minus size={20} />
                                            </button>
                                            <span className="cart-item-quantity">{item.quantity}</span>
                                            <button className="btn btn-icon" onClick={() => onAdd(item)}>
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="cart-item-total">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Kitchen Items Section */}
                        {kitchenItems.length > 0 && (
                            <div className="cart-section">
                                <div className="cart-section-header kitchen">
                                    <span>🍳 Kitchen Items</span>
                                    <span>{kitchenItems.length} items</span>
                                </div>
                                {kitchenItems.map(item => (
                                    <div key={item.id} className="cart-item kitchen">
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <p>{formatCurrency(item.price)} × {item.quantity}</p>
                                        </div>
                                        <div className="cart-item-controls">
                                            <button className="btn btn-icon" onClick={() => onRemove(item)}>
                                                <Minus size={20} />
                                            </button>
                                            <span className="cart-item-quantity">{item.quantity}</span>
                                            <button className="btn btn-icon" onClick={() => onAdd(item)}>
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="cart-item-total">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="cart-summary">
                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>GST (5%)</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <button
                        className={`btn btn-xl btn-success cart-order-btn ${!canPlaceOrder ? 'disabled' : ''}`}
                        onClick={onPlaceOrder}
                        disabled={!canPlaceOrder}
                    >
                        <Send size={28} />
                        <span>Place Order</span>
                    </button>

                    {!canPlaceOrder && cart.length > 0 && (
                        <p className="cart-warning">
                            ⚠️ Enter customer name & phone to place order
                        </p>
                    )}

                    {kitchenItems.length > 0 && (
                        <p className="cart-kitchen-notice">
                            🍳 Kitchen items will be sent to kitchen
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default Cart;
