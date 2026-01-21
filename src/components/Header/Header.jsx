import { useRestaurant } from '../../context/RestaurantContext';
import { Menu } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
  const { restaurantName, isOnline, setOnlineStatus, isMobileMenuOpen, toggleMobileMenu } = useRestaurant();

  const handleToggle = () => {
    setOnlineStatus(!isOnline);
  };

  return (
    <header className={styles.header}>
      {/* Mobile Menu Button - visible only on mobile via CSS */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => toggleMobileMenu(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <Menu size={24} />
      </button>

      <div className={styles.restaurantName}>
        {restaurantName}
      </div>
      <div className={styles.toggleContainer}>
        <span className={styles.statusLabel}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <button
          className={`${styles.toggle} ${isOnline ? styles.online : styles.offline}`}
          onClick={handleToggle}
          aria-label={`Toggle restaurant ${isOnline ? 'offline' : 'online'}`}
        >
          <div className={styles.toggleSlider}></div>
        </button>
      </div>
    </header>
  );
};

export default Header;