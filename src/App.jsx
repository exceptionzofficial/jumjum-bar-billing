import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import CustomerForm from './components/CustomerForm';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import OrderSummary from './components/OrderSummary';
import { menuApi, billingApi } from './services/api';
import { separateOrders } from './utils/formatters';
import './App.css';

function BillingApp() {
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [cart, setCart] = useState([]);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load menu items from API
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const items = await menuApi.getAll();
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      toast.error('Failed to load menu. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const handleAddItem = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.itemId === item.itemId);
      if (existing) {
        return prev.map(i =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    toast.success(`Added ${item.name}`, {
      duration: 1000,
      style: {
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
      },
    });
  };

  // Remove item from cart
  const handleRemoveItem = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.itemId === item.itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.itemId !== item.itemId);
    });
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
    toast('Cart cleared', {
      style: {
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
      },
    });
  };

  // Place order
  const handlePlaceOrder = async () => {
    try {
      const { kitchenItems, barItems } = separateOrders(cart);

      // Create bill via API
      const result = await billingApi.create({
        customer,
        items: cart,
        paymentMethod: 'cash',
      });

      const order = {
        orderId: result.data.billId || result.data.billid,
        timestamp: result.data.createdAt,
        customer,
        cart,
        kitchenItems,
        barItems,
      };

      // Set completed order to show summary
      setCompletedOrder(order);

      // Show success
      toast.success('Order placed successfully!', {
        duration: 3000,
        style: {
          background: '#22c55e',
          color: '#fff',
        },
      });

      // Reload menu items to get updated stock
      loadMenuItems();

    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  // Start new order
  const handleNewOrder = () => {
    setCompletedOrder(null);
    setCart([]);
    setCustomer({ name: '', phone: '' });
  };

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loading-content">
          <div className="loading-logo">JJ</div>
          <h2>JumJum</h2>
          <p>Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Toaster position="top-center" />

      <Header />

      <main className="app-main">
        <div className="app-content">
          <CustomerForm
            customer={customer}
            onCustomerChange={setCustomer}
          />

          <MenuGrid
            menuItems={menuItems}
            cart={cart}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
          />
        </div>

        <aside className="app-sidebar">
          <Cart
            cart={cart}
            customer={customer}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
            onClear={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
          />
        </aside>
      </main>

      {completedOrder && (
        <OrderSummary
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BillingApp />
    </ThemeProvider>
  );
}

export default App;
