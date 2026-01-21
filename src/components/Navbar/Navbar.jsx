import { Link, useLocation, useParams } from 'react-router-dom';
import { Home, UtensilsCrossed, BarChart3, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRestaurant } from '../../context/RestaurantContext';
import SettingsPanel from './SettingsPanel';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  const { restaurantId } = useParams();
  const { isMobileMenuOpen, toggleMobileMenu } = useRestaurant();

  // Ensure we have a valid ID, fallback to 1 if missing (though routing handles this)
  const currentId = restaurantId || '1';

  const navigationItems = [
    {
      path: `/${currentId}/orders`,
      name: 'Orders',
      icon: Home,
      ariaLabel: 'Navigate to Orders'
    },
    {
      path: `/${currentId}/history`,
      name: 'History',
      icon: Clock,
      ariaLabel: 'View Order History'
    },
    {
      path: `/${currentId}/menu`,
      name: 'Menu',
      icon: UtensilsCrossed,
      ariaLabel: 'Navigate to Menu'
    },
    {
      path: `/${currentId}/report`,
      name: 'Dashboard',
      icon: BarChart3,
      ariaLabel: 'Navigate to Dashboard'
    }
  ];

  // Close drawer when navigating (mobile only)
  const handleNavClick = () => {
    if (isMobileMenuOpen) {
      toggleMobileMenu(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleMobileMenu(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <nav
        className={`${styles.navbar} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile Close Button */}
        <button
          className={styles.mobileCloseBtn}
          onClick={() => toggleMobileMenu(false)}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <ul className={styles.navList}>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className={styles.navItem}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''
                    }`}
                  aria-label={item.ariaLabel}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className={styles.activeBackground}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}

                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <span className={styles.iconContainer}>
                    <IconComponent
                      className={styles.navIcon}
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                  <span className={styles.navText}>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <SettingsPanel />
      </nav>
    </>
  );
};

export default Navbar;