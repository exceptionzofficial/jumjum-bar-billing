// Menu Items Data with Kitchen/Bar separation
// Kitchen items will be sent to kitchen dashboard
// Bar items are prepared at bar

export const categories = [
  { id: 'all', name: 'All Items', icon: 'Grid3X3', color: '#6b7280' },
  { id: 'drinks', name: 'Drinks', icon: 'GlassWater', color: '#3b82f6', isKitchen: false },
  { id: 'beer', name: 'Beer', icon: 'Beer', color: '#f59e0b', isKitchen: false },
  { id: 'cocktails', name: 'Cocktails', icon: 'Wine', color: '#ec4899', isKitchen: false },
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed', color: '#10b981', isKitchen: true },
  { id: 'snacks', name: 'Snacks', icon: 'Cookie', color: '#8b5cf6', isKitchen: true },
];

export const menuItems = [
  // Drinks (Bar)
  { id: 1, name: 'Mineral Water', price: 30, category: 'drinks', icon: 'GlassWater', isKitchen: false },
  { id: 2, name: 'Soda', price: 40, category: 'drinks', icon: 'CupSoda', isKitchen: false },
  { id: 3, name: 'Fresh Lime', price: 60, category: 'drinks', icon: 'Citrus', isKitchen: false },
  { id: 4, name: 'Cold Coffee', price: 80, category: 'drinks', icon: 'Coffee', isKitchen: false },
  { id: 5, name: 'Mango Juice', price: 70, category: 'drinks', icon: 'GlassWater', isKitchen: false },
  
  // Beer (Bar)
  { id: 6, name: 'Kingfisher', price: 180, category: 'beer', icon: 'Beer', isKitchen: false },
  { id: 7, name: 'Budweiser', price: 220, category: 'beer', icon: 'Beer', isKitchen: false },
  { id: 8, name: 'Corona', price: 280, category: 'beer', icon: 'Beer', isKitchen: false },
  { id: 9, name: 'Heineken', price: 250, category: 'beer', icon: 'Beer', isKitchen: false },
  { id: 10, name: 'Carlsberg', price: 200, category: 'beer', icon: 'Beer', isKitchen: false },
  
  // Cocktails (Bar)
  { id: 11, name: 'Mojito', price: 350, category: 'cocktails', icon: 'Wine', isKitchen: false },
  { id: 12, name: 'Margarita', price: 380, category: 'cocktails', icon: 'Martini', isKitchen: false },
  { id: 13, name: 'Long Island', price: 450, category: 'cocktails', icon: 'GlassWater', isKitchen: false },
  { id: 14, name: 'Cosmopolitan', price: 400, category: 'cocktails', icon: 'Martini', isKitchen: false },
  { id: 15, name: 'Pina Colada', price: 380, category: 'cocktails', icon: 'Wine', isKitchen: false },
  
  // Food (Kitchen) - Side Dishes
  { id: 16, name: 'Chicken 65', price: 280, category: 'food', icon: 'Drumstick', isKitchen: true },
  { id: 17, name: 'Gobi Manchurian', price: 220, category: 'food', icon: 'Salad', isKitchen: true },
  { id: 18, name: 'Paneer Tikka', price: 260, category: 'food', icon: 'Beef', isKitchen: true },
  { id: 19, name: 'Tandoori Chicken', price: 350, category: 'food', icon: 'Drumstick', isKitchen: true },
  { id: 20, name: 'Fish Fry', price: 320, category: 'food', icon: 'Fish', isKitchen: true },
  { id: 21, name: 'Mutton Seekh', price: 380, category: 'food', icon: 'Beef', isKitchen: true },
  { id: 22, name: 'Chilli Chicken', price: 290, category: 'food', icon: 'Drumstick', isKitchen: true },
  { id: 23, name: 'Mushroom Fry', price: 240, category: 'food', icon: 'Salad', isKitchen: true },
  
  // Snacks (Kitchen)
  { id: 24, name: 'French Fries', price: 150, category: 'snacks', icon: 'Cookie', isKitchen: true },
  { id: 25, name: 'Onion Rings', price: 160, category: 'snacks', icon: 'Circle', isKitchen: true },
  { id: 26, name: 'Masala Papad', price: 80, category: 'snacks', icon: 'Circle', isKitchen: true },
  { id: 27, name: 'Peanut Masala', price: 120, category: 'snacks', icon: 'Cookie', isKitchen: true },
  { id: 28, name: 'Cheese Balls', price: 180, category: 'snacks', icon: 'Circle', isKitchen: true },
  { id: 29, name: 'Spring Roll', price: 200, category: 'snacks', icon: 'Cookie', isKitchen: true },
  { id: 30, name: 'Veg Pakora', price: 140, category: 'snacks', icon: 'Salad', isKitchen: true },
];

export default menuItems;
