import { Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import './ProductCard.css';

function ProductCard({ item, quantity = 0, onAdd, onRemove }) {
    const isKitchen = item.isKitchen;

    return (
        <div className={`product-card ${quantity > 0 ? 'in-cart' : ''}`}>
            <div className={`product-badge ${isKitchen ? 'kitchen' : 'bar'}`}>
                {isKitchen ? '🍳 Kitchen' : '🍺 Bar'}
            </div>

            <div className="product-icon">
                {item.category === 'drinks' && '🥤'}
                {item.category === 'beer' && '🍺'}
                {item.category === 'cocktails' && '🍸'}
                {item.category === 'food' && '🍗'}
                {item.category === 'snacks' && '🍟'}
            </div>

            <h3 className="product-name">{item.name}</h3>
            <p className="product-price">{formatCurrency(item.price)}</p>

            {quantity > 0 ? (
                <div className="product-quantity-controls">
                    <button className="btn btn-icon quantity-btn" onClick={() => onRemove(item)}>
                        <Minus size={28} />
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button className="btn btn-icon quantity-btn add" onClick={() => onAdd(item)}>
                        <Plus size={28} />
                    </button>
                </div>
            ) : (
                <button className="btn btn-primary product-add-btn" onClick={() => onAdd(item)}>
                    <Plus size={24} />
                    <span>Add</span>
                </button>
            )}
        </div>
    );
}

export default ProductCard;
