import { createMenuItem, CATEGORIES } from '../types/menu';

export const mockMenuItems = [
  // Starters
  createMenuItem('1', 'Paneer Tikka', CATEGORIES.STARTERS, 180, true),
  createMenuItem('2', 'Chicken 65', CATEGORIES.STARTERS, 220, true),
  createMenuItem('3', 'Veg Spring Rolls', CATEGORIES.STARTERS, 150, true),
  
  // Mains
  createMenuItem('4', 'Butter Chicken', CATEGORIES.MAINS, 320, true),
  createMenuItem('5', 'Dal Makhani', CATEGORIES.MAINS, 240, true),
  createMenuItem('6', 'Veggie Pizza (Large)', CATEGORIES.MAINS, 380, true),
  createMenuItem('7', 'Chicken Biryani', CATEGORIES.MAINS, 280, true),
  
  // Breads
  createMenuItem('8', 'Tandoori Roti', CATEGORIES.BREADS, 45, true),
  createMenuItem('9', 'Butter Naan', CATEGORIES.BREADS, 55, true),
  createMenuItem('10', 'Garlic Naan', CATEGORIES.BREADS, 65, true),
  
  // Beverages
  createMenuItem('11', 'Mango Lassi', CATEGORIES.BEVERAGES, 80, true),
  createMenuItem('12', 'Masala Chai', CATEGORIES.BEVERAGES, 40, true),
];