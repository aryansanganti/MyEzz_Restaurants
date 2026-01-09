import { useState, useEffect } from 'react';
import OrderCard from '../../components/OrderCard/OrderCard';
import PrepTimeModal from '../../components/PrepTimeModal/PrepTimeModal';
import RingSpinner from '../../components/Spinner/Spinner';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate mock orders on component mount
  useEffect(() => {
    // Simulate API loading delay
    const loadOrders = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockOrders = [
        {
          id: 'ORD001',
          customerName: 'Yug Patel',
          items: [
            { name: 'Margherita Pizza', quantity: 1 },
            { name: 'Caesar Salad', quantity: 1 }
          ],
          total: 249.99,
          status: 'new',
          verificationCode: generateVerificationCode()
        },
        {
          id: 'ORD002',
          customerName: 'Aksh Maheshwari',
          items: [
            { name: 'Chicken Burger', quantity: 2 },
            { name: 'French Fries', quantity: 1 }
          ],
          total: 185.00,
          status: 'preparing',
          prepTime: 25,
          acceptedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          verificationCode: generateVerificationCode()
        },
        {
          id: 'ORD003',
          customerName: 'Nayan Chellani',
          items: [
            { name: 'French Fries', quantity: 1 }
          ],
          total: 157.50,
          status: 'ready',
          verificationCode: generateVerificationCode()
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  function generateVerificationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleAcceptOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleRejectOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleConfirmPrepTime = (prepTime) => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              status: 'preparing', 
              prepTime,
              acceptedAt: new Date()
            }
          : order
      ));
    }
    setSelectedOrder(null);
  };

  const handleMarkReady = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'ready' }
        : order
    ));
  };

  const handleHandToRider = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const newOrders = orders.filter(order => order.status === 'new');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  // Show loading spinner while fetching orders
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
        <h1 className={styles.title}>Kitchen Dashboard</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{newOrders.length}</span>
            <span className={styles.statLabel}>New Orders</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{preparingOrders.length}</span>
            <span className={styles.statLabel}>Preparing</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{readyOrders.length}</span>
            <span className={styles.statLabel}>Ready</span>
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
            {newOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAcceptOrder}
                onReject={handleRejectOrder}
              />
            ))}
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
            {preparingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onMarkReady={handleMarkReady}
              />
            ))}
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
            {readyOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onHandToRider={handleHandToRider}
              />
            ))}
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
    </div>
  );
}

export default Dashboard;