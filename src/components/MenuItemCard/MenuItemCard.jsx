import { useState } from 'react';
import styles from './MenuItemCard.module.css';

const MenuItemCard = ({ item, onToggleStock }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    onToggleStock(item.id);
    setIsToggling(false);
  };

  return (
    <div className={`${styles.card} ${!item.inStock ? styles.outOfStock : ''}`}>
      <div className={styles.itemInfo}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <div className={styles.itemDetails}>
          <span className={styles.price}>₹{item.price}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.category}>{item.category}</span>
        </div>
      </div>
      
      <div className={styles.toggleSection}>
        <button
          className={`${styles.toggle} ${item.inStock ? styles.toggleOn : styles.toggleOff} ${isToggling ? styles.toggling : ''}`}
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={`Toggle ${item.name} stock status`}
        >
          <div className={styles.toggleSlider}></div>
        </button>
        <span className={`${styles.statusLabel} ${item.inStock ? styles.inStock : styles.outStock}`}>
          {item.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
};

export default MenuItemCard;