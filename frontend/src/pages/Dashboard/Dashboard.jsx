import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderCard from '../../components/OrderCard/OrderCard';
import PrepTimeModal from '../../components/PrepTimeModal/PrepTimeModal';
import RejectionModal from '../../components/RejectionModal/RejectionModal';
import RingSpinner from '../../components/Spinner/Spinner';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToReject, setOrderToReject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(prev => prev && true); // Keep loading true only on first load

        // Using a hardcoded Restaurant ID for demo
        const RESTAURANT_ID = 'rest_001';
        const response = await fetch(`http://localhost:5001/api/orders/${RESTAURANT_ID}/active`);

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();

        // Transform MongoDB _id to id if necessary, or just use as is
        const formattedOrders = data.map(o => ({
          ...o, // Spread first to avoid overwriting custom fields
          id: o._id,
          customerName: o.customer_id,
          status: o.status === 'pending' ? 'new' : o.status,
          items: o.items.map(i => ({ ...i, quantity: i.qty || i.quantity })), // Normalize qty -> quantity
          total: o.items.reduce((acc, i) => acc + (i.price * (i.qty || i.quantity || 1)), 0)
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error polling orders:', err);
      } finally {
        setLoading(false);
      }
    };

    // Initial Fetch
    fetchOrders();

    // Poll every 10 seconds
    const intervalId = setInterval(fetchOrders, 10000);

    return () => clearInterval(intervalId);
  }, []);

  function generateVerificationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const updateOrderStatus = async (orderId, status, additionalData = {}) => {
    try {
      // Optimistic Update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...additionalData } : o));

      // API Call
      await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...additionalData })
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert if needed (omitted for brevity)
    }
  };

  const handleAcceptOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleRejectOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setOrderToReject(order);
    setRejectionModalOpen(true);
  };

  const handleConfirmReject = (reason) => {
    if (orderToReject) {
      updateOrderStatus(orderToReject.id, 'cancelled', { rejectionReason: reason });
      setOrders(orders.filter(order => order.id !== orderToReject.id));
      setOrderToReject(null);
    }
  };

  const handleConfirmPrepTime = (prepTime) => {
    if (selectedOrder) {
      // Backend expects 'preparing'
      updateOrderStatus(selectedOrder.id, 'preparing', { prepTime, acceptedAt: new Date() });
    }
    setSelectedOrder(null);
  };

  const handleMarkReady = (orderId) => {
    updateOrderStatus(orderId, 'ready', { verificationCode: generateVerificationCode() });
  };

  const handleHandToRider = (orderId) => {
    // Backend expects 'out_for_delivery'
    // This triggers the Rider App broadcasting (if rider is assigned)
    updateOrderStatus(orderId, 'out_for_delivery');

    // Remove from dashboard view (since it's done for kitchen)
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const newOrders = orders.filter(order => order.status === 'new' || order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <RingSpinner size={48} />
          <p className={styles.loadingText}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.title}>Orders</h1> {/* Changed from Kitchen Dashboard to Orders */}
        <div className={styles.statsRibbon}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{newOrders.length}</span>
            <div className={styles.statDetails}>
              <span className={styles.statLabel}>New Orders</span>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{preparingOrders.length}</span>
            <div className={styles.statDetails}>
              <span className={styles.statLabel}>Preparing</span>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{readyOrders.length}</span>
            <div className={styles.statDetails}>
              <span className={styles.statLabel}>Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.kanbanBoard}>
        <div className={styles.kanbanColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnTitle}>
              New Orders
              <span className={styles.columnCount}>{newOrders.length}</span>
            </h2>
          </div>
          <div className={styles.columnContent}>
            <AnimatePresence mode="popLayout">
              {newOrders.map(order => (
                <motion.div
                  key={order.id}
                  layout
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <OrderCard
                    order={order}
                    onAccept={handleAcceptOrder}
                    onReject={handleRejectOrder}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {newOrders.length === 0 && (
              <div className={styles.emptyState}>
                <p>No new orders</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.kanbanColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnTitle}>
              Preparing
              <span className={styles.columnCount}>{preparingOrders.length}</span>
            </h2>
          </div>
          <div className={styles.columnContent}>
            <AnimatePresence mode="popLayout">
              {preparingOrders.map(order => (
                <motion.div
                  key={order.id}
                  layout
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <OrderCard
                    order={order}
                    onMarkReady={handleMarkReady}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {preparingOrders.length === 0 && (
              <div className={styles.emptyState}>
                <p>No orders in preparation</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.kanbanColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnTitle}>
              Ready
              <span className={styles.columnCount}>{readyOrders.length}</span>
            </h2>
          </div>
          <div className={styles.columnContent}>
            <AnimatePresence mode="popLayout">
              {readyOrders.map(order => (
                <motion.div
                  key={order.id}
                  layout
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <OrderCard
                    order={order}
                    onHandToRider={handleHandToRider}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {readyOrders.length === 0 && (
              <div className={styles.emptyState}>
                <p>No orders ready</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PrepTimeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmPrepTime}
        orderDetails={selectedOrder}
      />

      <RejectionModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        onConfirm={handleConfirmReject}
        orderDetails={orderToReject}
      />
    </div>
  );
}

export default Dashboard;
