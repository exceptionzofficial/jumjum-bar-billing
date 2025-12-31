import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import ProductCard from './ProductCard';
import './MenuGrid.css';

const categories = [
    { id: 'all', name: 'All Items', color: '#6b7280' },
    { id: 'scotch', name: 'Scotch', color: '#c9a962' },
    { id: 'whisky', name: 'Whisky', color: '#d4a853' },
    { id: 'brandy', name: 'Brandy', color: '#a0522d' },
    { id: 'vodka', name: 'Vodka', color: '#87ceeb' },
    { id: 'rum', name: 'Rum', color: '#8b4513' },
    { id: 'gin', name: 'Gin', color: '#00ced1' },
    { id: 'wine', name: 'Wine', color: '#722f37' },
    { id: 'beer', name: 'Beer', color: '#f5a623' },
    { id: 'drinks', name: 'Other Drinks', color: '#3b82f6' },
    { id: 'cocktails', name: 'Cocktails', color: '#ec4899' },
    { id: 'food', name: 'Food', color: '#22c55e' },
    { id: 'snacks', name: 'Snacks', color: '#a855f7' },
];

function MenuGrid({ menuItems, cart, onAdd, onRemove }) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Get suggestions based on search query
    const getSuggestions = () => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        return menuItems.filter(item =>
            item.name.toLowerCase().startsWith(query)
        ).slice(0, 8); // Limit to 8 suggestions
    };

    const suggestions = getSuggestions();

    // Filter items based on category and search
    const filteredItems = menuItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = !searchQuery.trim() ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getItemQuantity = (item) => {
        const cartItem = cart.find(i => i.itemId === item.itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    const handleSuggestionClick = (item) => {
        setSearchQuery(item.name);
        setShowSuggestions(false);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowSuggestions(false);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="menu-grid-container">
            {/* Search Bar with Suggestions */}
            <div className="search-container" ref={searchRef}>
                <div className="search-wrapper">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search items... (type to see suggestions)"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    />
                    {searchQuery && (
                        <button className="search-clear" onClick={clearSearch}>
                            <X size={16} />
                        </button>
                    )}
                </div>
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="search-suggestions">
                        {suggestions.map(item => (
                            <div
                                key={item.itemId}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(item)}
                            >
                                <span className="suggestion-name">{item.name}</span>
                                <span className="suggestion-price">₹{item.price}</span>
                                <span className={`suggestion-category ${item.category}`}>
                                    {item.category}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                        <p>{searchQuery ? `No items found for "${searchQuery}"` : 'No items found in this category'}</p>
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
