// API Service for JumJum Billing App
const API_BASE_URL = 'http://localhost:5000/api';

// Menu Items API
export const menuApi = {
    // Get all menu items
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/menu-items`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    // Get bar items only
    getBarItems: async () => {
        const response = await fetch(`${API_BASE_URL}/menu-items/bar`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    // Get kitchen items only
    getKitchenItems: async () => {
        const response = await fetch(`${API_BASE_URL}/menu-items/kitchen`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },
};

// Billing API
export const billingApi = {
    // Create new bill
    create: async (billData) => {
        const response = await fetch(`${API_BASE_URL}/billing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(billData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data;
    },

    // Get all bills
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/billing`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },
};

export default { menuApi, billingApi };
