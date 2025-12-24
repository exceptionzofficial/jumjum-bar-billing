// Utility functions for formatting

// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
};

// Format phone number with spaces
export const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 5) {
        return cleaned;
    }
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
};

// Format date and time
export const formatDateTime = (date = new Date()) => {
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// Format time only
export const formatTime = (date = new Date()) => {
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// Generate order ID
export const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
};

// Calculate totals
export const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + tax;
    return { subtotal, tax, total };
};

// Separate items into bar and kitchen orders
export const separateOrders = (items) => {
    const barItems = items.filter(item => !item.isKitchen);
    const kitchenItems = items.filter(item => item.isKitchen);
    return { barItems, kitchenItems };
};
