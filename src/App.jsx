import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import CustomerForm from './components/CustomerForm';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import OrderSummary from './components/OrderSummary';
import { generateOrderId, separateOrders } from './utils/formatters';
import './App.css';

function App() {
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [cart, setCart] = useState([]);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Add item to cart
  const handleAddItem = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    // Quick feedback
    toast.success(`Added ${item.name}`, {
      duration: 1000,
      icon: item.isKitchen ? '🍳' : '🍺',
      style: {
        background: '#252542',
        color: '#fff',
        fontSize: '18px',
        padding: '16px',
      },
    });
  };

  // Remove item from cart
  const handleRemoveItem = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing && existing.quantity > 1) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.id !== item.id);
    });
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
    toast('Cart cleared', {
      icon: '🗑️',
      style: {
        background: '#252542',
        color: '#fff',
        fontSize: '18px',
        padding: '16px',
      },
    });
  };

  // Place order
  const handlePlaceOrder = () => {
    const orderId = generateOrderId();
    const timestamp = new Date().toISOString();
    const { kitchenItems, barItems } = separateOrders(cart);

    // Create order object
    const order = {
      orderId,
      timestamp,
      customer,
      cart,
      kitchenItems,
      barItems,
    };

    // Save order to localStorage (for kitchen dashboard to pick up)
    const existingOrders = JSON.parse(localStorage.getItem('jumjum_orders') || '[]');
    localStorage.setItem('jumjum_orders', JSON.stringify([...existingOrders, order]));

    // If there are kitchen items, save them separately for kitchen notification
    if (kitchenItems.length > 0) {
      const kitchenOrders = JSON.parse(localStorage.getItem('jumjum_kitchen_orders') || '[]');
      const kitchenOrder = {
        orderId,
        timestamp,
        customer,
        items: kitchenItems,
        status: 'pending',
      };
      localStorage.setItem('jumjum_kitchen_orders', JSON.stringify([...kitchenOrders, kitchenOrder]));

      toast.success('Kitchen notified! 🍳', {
        duration: 2000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontSize: '20px',
          padding: '20px',
        },
      });
    }

    // Set completed order to show summary
    setCompletedOrder(order);

    // Show success
    toast.success('Order placed successfully! 🎉', {
      duration: 3000,
      style: {
        background: '#10b981',
        color: '#fff',
        fontSize: '20px',
        padding: '20px',
      },
    });
  };

  // Start new order
  const handleNewOrder = () => {
    setCompletedOrder(null);
    setCart([]);
    setCustomer({ name: '', phone: '' });
  };

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

export default App;
