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
  const [customer, setCustomer] = useState({ name: '', phone: '', tableNumber: '' });
  const [cart, setCart] = useState([]);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState({ name: 'Staff', role: 'bar' });

  // Edit bill state
  const [editingBill, setEditingBill] = useState(null);
  const [originalBillItems, setOriginalBillItems] = useState([]); // Track original items for payment breakdown

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
    setEditingBill(null);
    setCustomer({ name: '', phone: '', tableNumber: '' });
    toast('Cart cleared');
  };

  // Place order - backend auto-merges if phone exists today
  const handlePlaceOrder = async () => {
    try {
      const { kitchenItems, barItems } = separateOrders(cart);
      const result = await billingApi.create({
        customer,
        items: cart,
        paymentMethod: 'cash',
        status: 'open',
      });

      const order = {
        orderId: result.data.billId || result.data.billid,
        timestamp: result.data.createdAt,
        customer,
        cart,
        kitchenItems,
        barItems,
        isUpdate: result.isUpdate,
      };

      setCompletedOrder(order);

      if (result.isUpdate) {
        toast.success('Items added to existing bill!');
      } else {
        toast.success('New order created!');
      }

      loadMenuItems();
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  // Update bill when editing (keep open and print)
  const handleUpdateBill = async () => {
    if (!editingBill) return;

    try {
      const billId = editingBill.billid || editingBill.billId;
      await billingApi.update(billId, {
        customer,
        items: cart,
        status: 'open',
      });

      // Calculate already paid (from original bill)
      const alreadyPaidTotal = originalBillItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );

      // Create order for printing with payment breakdown
      const order = {
        orderId: billId,
        timestamp: new Date().toISOString(),
        customer,
        cart,
        kitchenItems: cart.filter(i => i.isKitchen),
        barItems: cart.filter(i => !i.isKitchen),
        isUpdate: true,
        alreadyPaidItems: originalBillItems, // Items already paid
        alreadyPaidTotal: alreadyPaidTotal,
      };

      setCompletedOrder(order);

      // Update original items for next update
      setOriginalBillItems([...cart]);

      toast.success('Bill updated! Print to show payment.');
      loadMenuItems();
    } catch (error) {
      console.error('Failed to update bill:', error);
      toast.error('Failed to update bill.');
    }
  };

  // Close bill
  const handleCloseBill = async () => {
    if (!editingBill) return;

    try {
      const billId = editingBill.billid || editingBill.billId;
      await billingApi.update(billId, {
        customer,
        items: cart,
        status: 'completed',
      });

      const order = {
        orderId: billId,
        timestamp: editingBill.createdAt,
        customer,
        cart,
        kitchenItems: cart.filter(i => i.isKitchen),
        barItems: cart.filter(i => !i.isKitchen),
      };

      setCompletedOrder(order);
      setEditingBill(null);
      toast.success('Bill closed!');
      loadMenuItems();
    } catch (error) {
      console.error('Failed to close bill:', error);
      toast.error('Failed to close bill.');
    }
  };

  // Edit bill from history
  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setCustomer(bill.customer || { name: '', phone: '' });
    setCart(bill.items || []);
    setOriginalBillItems(bill.items || []); // Store original items for payment tracking
    setActivePage('newbill');
    toast.success(`Editing bill ${bill.billid || bill.billId}`);
  };

  const handleNewOrder = () => {
    setCompletedOrder(null);
    setCart([]);
    setCustomer({ name: '', phone: '', tableNumber: '' });
    setEditingBill(null);
    setOriginalBillItems([]);
  };

  const handleLogout = () => {
    toast.success('Logged out');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'history':
        return <BillHistory onEditBill={handleEditBill} />;
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
                onUpdateBill={handleUpdateBill}
                onCloseBill={handleCloseBill}
                editingBill={editingBill}
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
