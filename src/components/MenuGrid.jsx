import { useState } from 'react';
import ProductCard from './ProductCard';
import './MenuGrid.css';

const categories = [
    { id: 'all', name: 'All Items', color: '#6b7280' },
    { id: 'drinks', name: 'Drinks', color: '#3b82f6' },
    { id: 'beer', name: 'Beer', color: '#d4a853' },
    { id: 'cocktails', name: 'Cocktails', color: '#ec4899' },
    { id: 'food', name: 'Food', color: '#22c55e' },
    { id: 'snacks', name: 'Snacks', color: '#a855f7' },
];

function MenuGrid({ menuItems, cart, onAdd, onRemove }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const getItemQuantity = (item) => {
        const cartItem = cart.find(i => i.itemId === item.itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    return (
        <div className="menu-grid-container">
            {/* Category Tabs */}
            <div className="category-tabs">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                        style={{ '--cat-color': cat.color }}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        <span className="category-name">{cat.name}</span>
                        {cat.id !== 'all' && (
                            <span className="category-count">
                                {menuItems.filter(i => i.category === cat.id).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {filteredItems.length === 0 ? (
                    <div className="no-items">
                        <p>No items found in this category</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <ProductCard
                            key={item.itemId}
                            item={item}
                            quantity={getItemQuantity(item)}
                            onAdd={onAdd}
                            onRemove={onRemove}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default MenuGrid;
