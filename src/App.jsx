import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerForm from './components/CustomerForm';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import OrderSummary from './components/OrderSummary';
import BillHistory from './components/BillHistory';
import Settings from './components/Settings';
import { menuApi, billingApi } from './services/api';
import { separateOrders } from './utils/formatters';
import './App.css';

function BillingApp() {
  const [activePage, setActivePage] = useState('dashboard');
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [cart, setCart] = useState([]);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState({ name: 'Staff', role: 'bar' });

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
    toast.success(`Added ${item.name}`, { duration: 1000 });
  };

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

  const handleClearCart = () => {
    setCart([]);
    toast('Cart cleared');
  };

  const handlePlaceOrder = async () => {
    try {
      const { kitchenItems, barItems } = separateOrders(cart);
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

      setCompletedOrder(order);
      toast.success('Order placed successfully!');
      loadMenuItems();
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleNewOrder = () => {
    setCompletedOrder(null);
    setCart([]);
    setCustomer({ name: '', phone: '' });
  };

  const handleLogout = () => {
    toast.success('Logged out');
    // In real app, redirect to login
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'history':
        return <BillHistory />;
      case 'settings':
        return <Settings user={user} onLogout={handleLogout} />;
      case 'newbill':
      default:
        return (
          <>
            <div className="app-content">
              <CustomerForm customer={customer} onCustomerChange={setCustomer} />
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
          </>
        );
    }
  };

  if (loading && activePage === 'newbill') {
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
    <div className="app-layout">
      <Toaster position="top-center" />
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="app-main">
        {renderPage()}
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
