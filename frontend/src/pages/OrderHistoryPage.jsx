import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { useUiStore } from '../store/uiStore';
import { useNotificationStore } from '../store/notificationStore';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Gift,
  Truck,
  Calendar,
  MapPin,
  PackageCheck,
  FileText,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const STATUS_CONFIG = {
  PENDING_VERIFICATION: {
    label: 'Pending',
    variant: 'warning',
    icon: Clock,
    color: '#fee440',
  },
  CONFIRMED: {
    label: 'Confirmed',
    variant: 'success',
    icon: CheckCircle2,
    color: '#00f5d4',
  },
  SHIPPED: {
    label: 'Shipped',
    variant: 'info',
    icon: Package,
    color: '#00bbf9',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    variant: 'info',
    icon: Truck,
    color: '#4cc9f0',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    variant: 'info',
    icon: MapPin,
    color: '#7209b7',
  },
  DELIVERED: {
    label: 'Delivered',
    variant: 'success',
    icon: PackageCheck,
    color: '#06d6a0',
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'danger',
    icon: XCircle,
    color: '#ff007f',
  },
};

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING_VERIFICATION', label: 'Pending' },
  { key: 'ACTIVE', label: 'In Progress' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'REJECTED', label: 'Rejected' },
];

/* Status flow for timeline */
const TRACKING_STEPS = [
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'SHIPPED', label: 'Shipped' },
  { status: 'IN_TRANSIT', label: 'In Transit' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

/* ------------------------------------------------------------------ */

const OrderHistoryPage = () => {
  const { addToast } = useUiStore();
  const { addNotification } = useNotificationStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [billOrder, setBillOrder] = useState(null);

  const previousStatusesRef = useRef({});

  /* ---- Fetch orders ---- */
  const fetchOrders = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) {
        const cached = localStorage.getItem('user_orders_cache');
        if (cached) {
          try { setOrders(JSON.parse(cached)); } catch(e) {}
        } else {
          setLoading(true);
        }
      }

      const mergePendingOrders = (apiOrders) => {
        const pendingStr = localStorage.getItem('pending_sync_orders');
        if (!pendingStr) return apiOrders;
        try {
          const pending = JSON.parse(pendingStr);
          const offlineMocks = pending.map(p => ({
            id: p.tempId,
            status: 'PENDING_VERIFICATION',
            createdAt: p.createdAt,
            amount: p.payload.grandTotal,
            giftName: p.payload.items?.[0]?.gift?.name || 'Items',
            imageUrl: p.payload.items?.[0]?.gift?.imageUrl,
            deliveryAddress: p.payload.address,
            deliveryCharge: p.payload.deliveryCharge || 0,
            wrappingCharge: p.payload.wrappingCharge || 0,
            isOffline: true
          }));
          return [...offlineMocks, ...apiOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch(e) {
          return apiOrders;
        }
      };

      const res = await api.get(`/orders?t=${Date.now()}`);
      let newOrders = mergePendingOrders(res.data || []);
      
      try {
        const wrapsStr = localStorage.getItem('order_wraps_cache');
        if (wrapsStr) {
          const wraps = JSON.parse(wrapsStr);
          newOrders = newOrders.map(o => ({
            ...o,
            wrappingCharge: o.wrappingCharge || wraps[o.id] || 0
          }));
        }
      } catch (e) {}

      localStorage.setItem('user_orders_cache', JSON.stringify(newOrders));

      // Detect status changes — fire notification for newly confirmed/rejected orders
      const prev = previousStatusesRef.current;
      newOrders.forEach((order) => {
        if (order.isOffline) return;
        const oldStatus = prev[order.id];
        if (oldStatus && oldStatus !== order.status) {
          if (order.status === 'CONFIRMED') {
            addNotification('order_confirmed', 'Order Confirmed! 🎉', `Your order "${order.giftName}" (ord_${order.id}) has been verified and confirmed!`);
            addToast(`Order "${order.giftName}" has been confirmed!`, 'success', 6000);
          } else if (order.status === 'SHIPPED') {
            addNotification('order_confirmed', 'Order Shipped! 📦', `Your order "${order.giftName}" (ord_${order.id}) has been shipped!`);
            addToast(`Order "${order.giftName}" has been shipped!`, 'success', 6000);
          } else if (order.status === 'IN_TRANSIT') {
            addNotification('order_confirmed', 'Order In Transit 🚚', `Your order "${order.giftName}" (ord_${order.id}) is in transit!`);
            addToast(`Order "${order.giftName}" is in transit!`, 'info', 6000);
          } else if (order.status === 'OUT_FOR_DELIVERY') {
            addNotification('order_confirmed', 'Out for Delivery! 📍', `Your order "${order.giftName}" (ord_${order.id}) is out for delivery!`);
            addToast(`Order "${order.giftName}" is out for delivery!`, 'info', 6000);
          } else if (order.status === 'DELIVERED') {
            addNotification('order_confirmed', 'Order Delivered! ✅', `Your order "${order.giftName}" (ord_${order.id}) has been delivered successfully!`);
            addToast(`Order "${order.giftName}" has been delivered!`, 'success', 6000);
          } else if (order.status === 'REJECTED') {
            addNotification('order_rejected', 'Order Rejected', `Your order "${order.giftName}" (ord_${order.id}) payment was not verified.`);
            addToast(`Order "${order.giftName}" was rejected.`, 'error', 6000);
          }
        }
      });

      // Update refs
      const statusMap = {};
      newOrders.forEach((o) => { statusMap[o.id] = o.status; });
      previousStatusesRef.current = statusMap;

      setOrders(newOrders);
    } catch {
      if (!isPolling && !localStorage.getItem('user_orders_cache')) addToast('Failed to load order history', 'error');
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [addToast, addNotification]);

  useEffect(() => {
    fetchOrders(false);
    // Poll every 30 seconds for status updates
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  /* ---- Derived data ---- */
  const counts = {
    ALL: orders.length,
    PENDING_VERIFICATION: orders.filter((o) => o.status === 'PENDING_VERIFICATION').length,
    ACTIVE: orders.filter((o) => ['CONFIRMED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)).length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
    REJECTED: orders.filter((o) => o.status === 'REJECTED').length,
  };

  const filteredOrders = orders.filter((o) => {
    let matchesTab = false;
    if (activeTab === 'ALL') matchesTab = true;
    else if (activeTab === 'ACTIVE') matchesTab = ['CONFIRMED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status);
    else matchesTab = o.status === activeTab;
    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.giftName?.toLowerCase().includes(q) ||
      o.giftDescription?.toLowerCase().includes(q) ||
      o.recipient?.name?.toLowerCase().includes(q) ||
      o.transactionId?.toLowerCase().includes(q) ||
      o.trackingId?.toLowerCase().includes(q) ||
      `ord_${o.id}`.includes(q)
    );
  });

  /* ---- Helpers ---- */
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) =>
    amount != null
      ? `₹${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—';

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ========== HEADER ========== */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              fontSize: '2.2rem',
              background: 'var(--text-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '6px',
            }}
          >
            My Orders
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Track and manage all your corporate gift orders in one place.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(157,78,221,0.15), rgba(247,37,133,0.15))',
              border: '1px solid rgba(157,78,221,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={22} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
              }}
            >
              {orders.length}
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Total Orders
            </p>
          </div>
        </div>
      </div>

      {/* ========== SEARCH + TABS ========== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Search */}
        <div style={{ maxWidth: '420px' }}>
          <Input
            placeholder="Search orders by name, recipient, ID…"
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="order-search"
            style={{ marginBottom: 0 }}
          />
        </div>

        {/* Status tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-title)',
                  cursor: 'pointer',
                  border: isActive
                    ? '1px solid rgba(157,78,221,0.5)'
                    : '1px solid var(--glass-border)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(157,78,221,0.2), rgba(247,37,133,0.12))'
                    : 'rgba(255,255,255,0.03)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {tab.label}
                <span
                  style={{
                    background: isActive
                      ? 'var(--color-primary-glow)'
                      : 'var(--glass-border)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========== ORDERS LIST ========== */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '80px 0',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(157,78,221,0.2)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title={searchQuery ? 'No matching orders' : 'No orders yet'}
          description={
            searchQuery
              ? 'Try adjusting your search or switching to a different status tab.'
              : "You haven't placed any orders yet. Browse our curated gift catalog to get started."
          }
          actionText={!searchQuery ? 'Browse Gifts' : undefined}
          onAction={!searchQuery ? () => (window.location.href = '/gifts') : undefined}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING_VERIFICATION;
            const StatusIcon = statusCfg.icon;
            const isConfirmed = order.status === 'CONFIRMED';
            const isShipping = ['CONFIRMED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status);
            const isDelivered = order.status === 'DELIVERED';

            const bannerMessages = {
              CONFIRMED: { text: 'Order Confirmed!', sub: 'Your gift is being prepared for shipping.', color: '#00f5d4' },
              SHIPPED: { text: 'Order Shipped!', sub: 'Your gift is on its way to the courier.', color: '#00bbf9' },
              IN_TRANSIT: { text: 'In Transit', sub: 'Your gift is moving through the delivery network.', color: '#4cc9f0' },
              OUT_FOR_DELIVERY: { text: 'Out for Delivery!', sub: 'Your gift will arrive today. Stay available!', color: '#7209b7' },
              DELIVERED: { text: 'Delivered! 🎉', sub: 'Your gift has been successfully delivered.', color: '#06d6a0' },
            };
            const banner = bannerMessages[order.status];

            return (
              <Card
                key={order.id}
                hoverable
                glowColor={isDelivered ? 'green' : isShipping ? 'cyan' : 'purple'}
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Status banner for shipping states */}
                {banner && (
                  <div
                    style={{
                      background:
                        `linear-gradient(135deg, ${banner.color}18 0%, ${banner.color}0a 50%, rgba(157,78,221,0.1) 100%)`,
                      borderBottom: `1px solid ${banner.color}33`,
                      padding: '12px 20px',
                      margin: '-20px -20px 20px -20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Confetti dots */}
                    {[...Array(8)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          position: 'absolute',
                          width: `${4 + (i % 3) * 2}px`,
                          height: `${4 + (i % 3) * 2}px`,
                          borderRadius: '50%',
                          background: [
                            '#00f5d4', '#fee440', '#c8b6ff', '#ffb5d8',
                            '#00bbf9', '#9d4edd', '#f72585', '#00f5d4',
                          ][i],
                          opacity: 0.4,
                          top: `${10 + (i * 7) % 30}px`,
                          left: `${5 + i * 12.5}%`,
                        }}
                      />
                    ))}
                    <StatusIcon size={18} style={{ color: banner.color, flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: banner.color,
                        fontFamily: 'var(--font-title)',
                      }}
                    >
                      {banner.text}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {banner.sub}
                    </span>
                  </div>
                )}

                {/* Card body */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    alignItems: 'start',
                  }}
                >
                  {/* Left — order details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Top row: ref + status */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        ord_{order.id}
                      </span>
                      <Badge variant={statusCfg.variant}>
                        <StatusIcon size={12} style={{ marginRight: '4px' }} />
                        {statusCfg.label}
                      </Badge>
                    </div>

                    {/* Gift name + description */}
                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Gift
                          size={18}
                          style={{
                            color: 'var(--color-primary)',
                            flexShrink: 0,
                          }}
                        />
                        {order.giftName}
                      </h3>
                      {order.giftDescription && (
                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            paddingLeft: '26px',
                            maxWidth: '600px',
                          }}
                        >
                          {order.giftDescription}
                        </p>
                      )}
                    </div>

                    {/* Meta row */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px',
                        paddingLeft: '26px',
                      }}
                    >
                      {/* Amount */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        >
                          Amount
                        </span>
                        <span
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-title)',
                            color: 'var(--color-secondary)',
                          }}
                        >
                          {formatCurrency(order.amount)}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        >
                          Qty
                        </span>
                        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {order.quantity}
                        </span>
                      </div>

                      {/* Recipient */}
                      {order.recipient?.name && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              fontWeight: 600,
                              letterSpacing: '0.05em',
                            }}
                          >
                            Recipient
                          </span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {order.recipient.name}
                          </span>
                        </div>
                      )}

                      {/* Delivery type */}
                      {order.deliveryType && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              fontWeight: 600,
                              letterSpacing: '0.05em',
                            }}
                          >
                            Delivery
                          </span>
                          <span
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: 500,
                              color: 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Truck size={14} style={{ color: 'var(--text-muted)' }} />
                            {order.deliveryType}
                          </span>
                        </div>
                      )}

                      {/* Delivery Address */}
                      {order.deliveryAddress && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              fontWeight: 600,
                              letterSpacing: '0.05em',
                            }}
                          >
                            Ship To
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            📍 {order.deliveryAddress}
                          </span>
                        </div>
                      )}

                      {/* Date placed */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        >
                          Date Placed
                        </span>
                        <span
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Personal message */}
                    {order.personalMessage && (
                      <div
                        style={{
                          marginLeft: '26px',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(157,78,221,0.06)',
                          borderLeft: '3px solid rgba(157,78,221,0.35)',
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                        }}
                      >
                        "{order.personalMessage}"
                      </div>
                    )}
                  </div>

                  {/* Right — status glow indicator */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      paddingTop: '4px',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: `${statusCfg.color}15`,
                        border: `1px solid ${statusCfg.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 20px ${statusCfg.color}15`,
                      }}
                    >
                      <StatusIcon size={20} style={{ color: statusCfg.color }} />
                    </div>
                    {order.trackingId && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                          textAlign: 'center',
                          maxWidth: '80px',
                          wordBreak: 'break-all',
                        }}
                      >
                        {order.trackingId}
                      </span>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setBillOrder(order)}
                      style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', background: 'var(--surface-color)' }}
                    >
                      <FileText size={14} style={{ marginRight: '4px' }} />
                      View Bill
                    </Button>
                  </div>
                </div>

                {/* Tracking Timeline */}
                {isShipping && (
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '16px 0 4px',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}>
                      {/* Background line */}
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        left: '30px',
                        right: '30px',
                        height: '2px',
                        background: 'rgba(255,255,255,0.06)',
                        zIndex: 0,
                      }} />
                      {/* Progress line */}
                      {(() => {
                        const currentIdx = TRACKING_STEPS.findIndex(s => s.status === order.status);
                        const progressPercent = currentIdx >= 0 ? (currentIdx / (TRACKING_STEPS.length - 1)) * 100 : 0;
                        return (
                          <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '30px',
                            width: `calc(${progressPercent}% - ${progressPercent > 0 ? 0 : 30}px)`,
                            maxWidth: 'calc(100% - 60px)',
                            height: '2px',
                            background: 'linear-gradient(90deg, #00f5d4, #00bbf9, #4cc9f0)',
                            zIndex: 1,
                            transition: 'width 0.6s ease',
                          }} />
                        );
                      })()}

                      {TRACKING_STEPS.map((step, idx) => {
                        const currentIdx = TRACKING_STEPS.findIndex(s => s.status === order.status);
                        const isCompleted = idx < currentIdx;
                        const isCurrent = idx === currentIdx;
                        const StepIcon = STATUS_CONFIG[step.status]?.icon || CheckCircle2;
                        const stepColor = isCompleted ? '#06d6a0' : isCurrent ? STATUS_CONFIG[step.status]?.color || '#4cc9f0' : 'rgba(255,255,255,0.15)';

                        return (
                          <div
                            key={step.status}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              zIndex: 2,
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                width: isCurrent ? '32px' : '28px',
                                height: isCurrent ? '32px' : '28px',
                                borderRadius: '50%',
                                background: isCompleted || isCurrent ? `${stepColor}20` : 'rgba(255,255,255,0.03)',
                                border: `2px solid ${stepColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isCurrent ? `0 0 12px ${stepColor}40` : 'none',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <StepIcon size={isCurrent ? 16 : 14} style={{ color: stepColor }} />
                            </div>
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: isCurrent ? 700 : 500,
                                color: isCompleted || isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                                fontFamily: 'var(--font-title)',
                                textAlign: 'center',
                                lineHeight: 1.2,
                              }}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Bill Modal */}
      <Modal isOpen={!!billOrder} onClose={() => setBillOrder(null)} size="lg" title="Order Invoice">
        {billOrder && (
          <div id="invoice-print-area" style={{ padding: '20px', background: '#ffffff', color: '#000000', borderRadius: '8px', fontFamily: 'sans-serif' }}>
             {/* Header with Logo */}
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eaeaea', paddingBottom: '16px', marginBottom: '20px' }}>
                <img src="/logo.jpg" alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
                <div style={{ textAlign: 'right' }}>
                   <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>INVOICE</h2>
                   <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.9rem' }}>#{`ORD_${billOrder.id}`}</p>
                   <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.9rem' }}>Date: {new Date(billOrder.createdAt).toLocaleDateString()}</p>
                </div>
             </div>
             
             {/* Customer Details */}
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                   <h4 style={{ margin: '0 0 8px 0', color: '#444' }}>Billed To:</h4>
                   <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>{billOrder.user?.fullName || 'Customer'}</p>
                   <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>{billOrder.user?.email || ''}</p>
                </div>
                {billOrder.deliveryAddress && (
                  <div style={{ textAlign: 'right' }}>
                     <h4 style={{ margin: '0 0 8px 0', color: '#444' }}>Shipped To:</h4>
                     <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>{billOrder.recipient?.name || ''}</p>
                     <p style={{ margin: 0, fontSize: '0.9rem', color: '#333', maxWidth: '200px' }}>{billOrder.deliveryAddress}</p>
                  </div>
                )}
             </div>
             
             {/* Items Table */}
             <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                   <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#444' }}>Item</th>
                      <th style={{ padding: '10px', textAlign: 'center', color: '#444' }}>Qty</th>
                      <th style={{ padding: '10px', textAlign: 'right', color: '#444' }}>Price</th>
                      <th style={{ padding: '10px', textAlign: 'right', color: '#444' }}>Total</th>
                   </tr>
                </thead>
                <tbody>
                   <tr style={{ borderBottom: '1px solid #eaeaea' }}>
                      <td style={{ padding: '10px' }}>
                         <p style={{ margin: 0, fontWeight: 600 }}>{billOrder.giftName}</p>
                         <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>{billOrder.giftCategory || 'Gift'}</p>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{billOrder.quantity}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>₹{Math.round(billOrder.amount / (billOrder.quantity || 1))}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>₹{billOrder.amount}</td>
                   </tr>
                </tbody>
             </table>
             
             {/* Totals & Payment Info */}
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '50%' }}>
                   <h4 style={{ margin: '0 0 8px 0', color: '#444' }}>Payment Info:</h4>
                   <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>Status: {STATUS_CONFIG[billOrder.status]?.label || billOrder.status}</p>
                   <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#333' }}>Transaction Ref: {billOrder.transactionId || 'N/A'}</p>
                </div>
                <div style={{ width: '40%' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#666' }}>Items Subtotal:</span>
                      <span style={{ color: '#333' }}>₹{billOrder.amount}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#666' }}>Delivery Charge:</span>
                      <span style={{ color: '#333' }}>₹{billOrder.deliveryCharge || 0}</span>
                   </div>
                   {billOrder.wrappingCharge > 0 && (
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Gift Wrapping:</span>
                        <span style={{ color: '#333' }}>₹{billOrder.wrappingCharge}</span>
                     </div>
                   )}
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #eaeaea', color: '#000' }}>
                      <span>Grand Total:</span>
                      <span>₹{(billOrder.amount || 0) + (billOrder.deliveryCharge || 0) + (billOrder.wrappingCharge || 0)}</span>
                   </div>
                </div>
             </div>
             
             {/* Print Button */}
             <div className="no-print" style={{ marginTop: '30px', textAlign: 'center' }}>
                <Button variant="primary" onClick={() => {
                   const printContents = document.getElementById('invoice-print-area').innerHTML;
                   const printWindow = window.open('', '_blank');
                   printWindow.document.write(`
                     <html>
                       <head>
                         <title>Invoice - ORD_${billOrder.id}</title>
                         <style>
                           body { font-family: sans-serif; padding: 40px; color: #000; }
                           .no-print { display: none !important; }
                           table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                           th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eaeaea; }
                           th { background: #f8f9fa; }
                         </style>
                       </head>
                       <body>
                         ${printContents}
                         <script>
                           window.onload = function() {
                             setTimeout(function() {
                               window.print();
                               window.close();
                             }, 250);
                           };
                         </script>
                       </body>
                     </html>
                   `);
                   printWindow.document.close();
                }} icon={FileText}>
                   Print Invoice
                </Button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;
