import { useState, useEffect } from 'react';
import { Clock, CheckCircle, User } from 'lucide-react';
import styles from './OrderCard.module.css';

const OrderCard = ({ order, onAccept, onReject, onMarkReady, onHandToRider }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (order.status === 'preparing' && order.prepTime) {
      const endTime = new Date(order.acceptedAt).getTime() + (order.prepTime * 60 * 1000);
      
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const remaining = Math.max(0, endTime - now);
        
        if (remaining === 0) {
          clearInterval(timer);
          setTimeRemaining(0);
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [order.status, order.prepTime, order.acceptedAt]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCardClass = () => {
    switch (order.status) {
      case 'new':
        return styles.newOrder;
      case 'preparing':
        return styles.preparing;
      case 'ready':
        return styles.ready;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.orderCard} ${getCardClass()}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.orderId}>#{order.id}</h3>
        <span className={styles.statusBadge}>
          {order.status === 'new' && 'New Order'}
          {order.status === 'preparing' && 'Preparing'}
          {order.status === 'ready' && 'Ready'}
        </span>
      </div>

      <div className={styles.customerInfo}>
        <User size={16} />
        <span>{order.customerName}</span>
      </div>

      <div className={styles.orderItems}>
        {order.items.map((item, index) => (
          <div key={index} className={styles.orderItem}>
            <span className={styles.quantity}>{item.quantity}x</span>
            <span className={styles.itemName}>{item.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.orderTotal}>
        Total: <strong>₹{order.total.toFixed(2)}</strong>
      </div>

      {order.status === 'preparing' && timeRemaining !== null && (
        <div className={styles.timer}>
          <Clock size={16} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      )}

      {order.status === 'ready' && (
        <div className={styles.verificationCode}>
          <div className={styles.codeLabel}>Verification Code</div>
          <div className={styles.code}>{order.verificationCode}</div>
        </div>
      )}

      <div className={styles.cardActions}>
        {order.status === 'new' && (
          <>
            <button 
              className={styles.acceptBtn}
              onClick={() => onAccept(order.id)}
            >
              Accept
            </button>
            <button 
              className={styles.rejectBtn}
              onClick={() => onReject(order.id)}
            >
              Reject
            </button>
          </>
        )}

        {order.status === 'preparing' && (
          <button 
            className={styles.markReadyBtn}
            onClick={() => onMarkReady(order.id)}
          >
            <CheckCircle size={16} />
            Mark Ready
          </button>
        )}

        {order.status === 'ready' && (
          <button 
            className={styles.handToRiderBtn}
            onClick={() => onHandToRider(order.id)}
          >
            Handed to Rider
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;