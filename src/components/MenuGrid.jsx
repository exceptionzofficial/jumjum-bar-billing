import { useState } from 'react';
import { categories, menuItems } from '../data/menuItems';
import ProductCard from './ProductCard';
import './MenuGrid.css';

function MenuGrid({ cart, onAdd, onRemove }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const getItemQuantity = (itemId) => {
        const cartItem = cart.find(item => item.id === itemId);
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
                        style={{
                            '--cat-color': cat.color,
                            borderColor: activeCategory === cat.id ? cat.color : 'transparent'
                        }}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        <span className="category-icon">
                            {cat.id === 'all' && '🔷'}
                            {cat.id === 'drinks' && '🥤'}
                            {cat.id === 'beer' && '🍺'}
                            {cat.id === 'cocktails' && '🍸'}
                            {cat.id === 'food' && '🍗'}
                            {cat.id === 'snacks' && '🍟'}
                        </span>
                        <span className="category-name">{cat.name}</span>
                        {cat.isKitchen && <span className="kitchen-badge">Kitchen</span>}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {filteredItems.map(item => (
                    <ProductCard
                        key={item.id}
                        item={item}
                        quantity={getItemQuantity(item.id)}
                        onAdd={onAdd}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
}

export default MenuGrid;
