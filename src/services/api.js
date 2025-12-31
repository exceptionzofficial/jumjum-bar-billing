// API Service for JumJum Billing App
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://jumjum-backend.vercel.app/api';

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
    // Create new bill (auto-merges if phone exists today)
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

    // Update existing bill
    update: async (billId, billData) => {
        const response = await fetch(`${API_BASE_URL}/billing/${billId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(billData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data;
    },

    // Update bill status
    updateStatus: async (billId, status) => {
        const response = await fetch(`${API_BASE_URL}/billing/${billId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
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

    // Get today's bills
    getToday: async () => {
        const response = await fetch(`${API_BASE_URL}/billing/today`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    // Find bill by phone for today
    findByPhone: async (phone) => {
        const response = await fetch(`${API_BASE_URL}/billing/find-by-phone/${encodeURIComponent(phone)}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data;
    },

    // Get single bill by ID
    getById: async (billId) => {
        const response = await fetch(`${API_BASE_URL}/billing/${billId}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },
};

export default { menuApi, billingApi };
