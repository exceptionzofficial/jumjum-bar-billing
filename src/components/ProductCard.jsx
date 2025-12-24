import { Plus, Minus, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import './ProductCard.css';

function ProductCard({ item, quantity = 0, onAdd, onRemove }) {
    const isKitchen = item.isKitchen;
    const isOutOfStock = item.stock === 0;
    const isLowStock = item.stock > 0 && item.stock <= (item.lowStockThreshold || 10);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'drinks': return 'D';
            case 'beer': return 'B';
            case 'cocktails': return 'C';
            case 'food': return 'F';
            case 'snacks': return 'S';
            default: return 'I';
        }
    };

    return (
        <div className={`product-card ${quantity > 0 ? 'in-cart' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="product-header">
                <span className={`product-type ${isKitchen ? 'kitchen' : 'bar'}`}>
                    {isKitchen ? 'KITCHEN' : 'BAR'}
                </span>
                {isLowStock && !isOutOfStock && (
                    <span className="low-stock-badge">
                        <AlertCircle size={12} />
                        Low
                    </span>
                )}
            </div>

            <div className="product-icon-wrapper">
                <div className={`product-icon ${item.category}`}>
                    {getCategoryIcon(item.category)}
                </div>
            </div>

            <div className="product-info">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-price">{formatCurrency(item.price)}</p>
                {item.itemId && (
                    <span className="product-id">{item.itemId}</span>
                )}
            </div>

            {isOutOfStock ? (
                <div className="out-of-stock-label">Out of Stock</div>
            ) : quantity > 0 ? (
                <div className="product-quantity-controls">
                    <button className="qty-btn minus" onClick={() => onRemove(item)}>
                        <Minus size={20} />
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button className="qty-btn plus" onClick={() => onAdd(item)}>
                        <Plus size={20} />
                    </button>
                </div>
            ) : (
                <button className="btn btn-primary product-add-btn" onClick={() => onAdd(item)}>
                    <Plus size={18} />
                    <span>Add</span>
                </button>
            )}
        </div>
    );
}

export default ProductCard;
