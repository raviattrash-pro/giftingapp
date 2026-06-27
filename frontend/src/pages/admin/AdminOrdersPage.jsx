import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useUiStore } from '../../store/uiStore';
import { Search, Eye, CheckCircle2, XCircle, Clock, FileText, User, Tag, DollarSign, Image as ImageIcon, Truck, Package, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';

const AdminOrdersPage = () => {
  const { addToast } = useUiStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'verified'

  // Screenshot modal state
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState('');
  const [currentOrderRef, setCurrentOrderRef] = useState('');

  // Confirmation modal state
  const [orderToConfirm, setOrderToConfirm] = useState(null);
  const [storeAddress, setStoreAddress] = useState('Fetching...');

  const fetchConfigs = async () => {
    try {
      const { data } = await api.get('/admin/app-config');
      setStoreAddress(data.STORE_ADDRESS || 'Not Set');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch orders list.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchConfigs();
  }, []);

  const handleConfirm = async () => {
    if (!orderToConfirm) return;
    try {
      await api.post(`/admin/orders/${orderToConfirm.id}/confirm`);
      addToast('Order confirmed and dispatch scheduled successfully.', 'success');
      
      // Auto redirect to Porter/Rapido web interface
      if (orderToConfirm.deliveryType === 'Instant') {
        const service = orderToConfirm.deliveryService === 'PORTER' ? 'porter' : 'rapido';
        const origin = encodeURIComponent(storeAddress !== 'Not Set' ? storeAddress : '100 Main St, Mumbai, 400001');
        const destination = encodeURIComponent(orderToConfirm.deliveryAddress || '');
        const schedule = encodeURIComponent(orderToConfirm.scheduledTime || '');
        
        let bookingUrl = '';
        if (service === 'porter') {
           bookingUrl = `https://porter.in/book?origin=${origin}&destination=${destination}&date=${schedule}`;
        } else {
           bookingUrl = `https://rapido.bike/book?pickup=${origin}&drop=${destination}&date=${schedule}`;
        }
        window.open(bookingUrl, '_blank');
      }

      setOrderToConfirm(null);
      fetchOrders();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to confirm order.', 'error');
    }
  };

  const handleReject = async (orderId) => {
    try {
      await api.post(`/admin/orders/${orderId}/reject`);
      addToast('Order has been rejected and cancelled.', 'warning');
      fetchOrders();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reject order.', 'error');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.post(`/admin/orders/${orderId}/status`, { status: newStatus });
      addToast(`Order status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
      fetchOrders();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status.', 'error');
    }
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      'CONFIRMED': 'SHIPPED',
      'SHIPPED': 'IN_TRANSIT',
      'IN_TRANSIT': 'OUT_FOR_DELIVERY',
      'OUT_FOR_DELIVERY': 'DELIVERED'
    };
    return flow[currentStatus] || null;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING_VERIFICATION': 'Pending',
      'CONFIRMED': 'Confirmed',
      'REJECTED': 'Rejected',
      'SHIPPED': 'Shipped',
      'IN_TRANSIT': 'In Transit',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'DELIVERED': 'Delivered'
    };
    return labels[status] || status;
  };

  const getStatusBadgeVariant = (status) => {
    if (status === 'CONFIRMED' || status === 'DELIVERED') return 'success';
    if (status === 'REJECTED') return 'danger';
    if (status === 'SHIPPED' || status === 'IN_TRANSIT' || status === 'OUT_FOR_DELIVERY') return 'info';
    return 'warning';
  };

  const openScreenshotModal = (screenshot, orderId) => {
    setCurrentScreenshot(screenshot);
    setCurrentOrderRef(`Order #${orderId}`);
    setIsScreenshotOpen(true);
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const giftMatch = o.giftName?.toLowerCase().includes(term);
    const userMatch = o.user?.fullName?.toLowerCase().includes(term) || o.user?.email?.toLowerCase().includes(term);
    const utrMatch = o.transactionId?.toLowerCase().includes(term);
    const orderIdMatch = `ord_${o.id}`.toLowerCase().includes(term);
    return giftMatch || userMatch || utrMatch || orderIdMatch;
  });

  const pendingOrders = filteredOrders.filter(o => o.status === 'PENDING_VERIFICATION');
  const fulfillmentOrders = filteredOrders.filter(o => ['CONFIRMED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status));
  const rejectedOrders = filteredOrders.filter(o => o.status === 'REJECTED');

  const displayedOrders = activeTab === 'pending' ? pendingOrders : activeTab === 'fulfillment' ? fulfillmentOrders : rejectedOrders;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 
          style={{ 
            fontFamily: 'var(--font-title)', 
            fontWeight: 800, 
            fontSize: '2rem',
            background: 'var(--text-gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px'
          }}
        >
          Manual Payment Verifications
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Review submitted UPI transfer receipts, compare transaction references (UTR), and approve orders to update stock levels.
        </p>
      </div>

      {/* Store Configuration Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Store Configuration</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Origin / Store Address (Used for distance calculation)</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
              {storeAddress}
            </span>
          </div>
          <Button 
            onClick={() => {
              const newAddr = prompt("Enter Store Address:", storeAddress === 'Not Set' ? '' : storeAddress);
              if (newAddr && newAddr.trim()) {
                api.put('/admin/app-config/STORE_ADDRESS', { value: newAddr.trim() })
                   .then(() => {
                     setStoreAddress(newAddr.trim());
                     localStorage.setItem('admin_store_address', newAddr.trim());
                     addToast('Store address updated!', 'success');
                   })
                   .catch(() => addToast('Failed to save store address', 'error'));
              }
            }}
            variant="outline"
          >
            Update Store Address
          </Button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'pending' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'pending' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s'
            }}
          >
            <Clock size={14} /> Pending ({orders.filter(o => o.status === 'PENDING_VERIFICATION').length})
          </button>
          <button
            onClick={() => setActiveTab('fulfillment')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'fulfillment' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'fulfillment' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s'
            }}
          >
            <Truck size={14} /> Fulfillment ({orders.filter(o => ['CONFIRMED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'rejected' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'rejected' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s'
            }}
          >
            <XCircle size={14} /> Rejected ({orders.filter(o => o.status === 'REJECTED').length})
          </button>
        </div>

        <div style={{ width: '300px' }} className="mobile-full-width">
          <Input
            icon={Search}
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
      </div>

      {/* List Container */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading order registry...</div>
      ) : displayedOrders.length === 0 ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No orders in this registry matching current search constraints.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {displayedOrders.map((order) => (
            <Card key={order.id} hoverable={false} className="glass-card-hover" style={{ padding: '20px' }}>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 2fr 2fr 2fr 1.5fr 2fr', 
                  gap: '16px', 
                  alignItems: 'center' 
                }}
                className="mobile-stack"
              >
                {/* Meta details */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ord_{order.id}</span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px', color: 'var(--text-primary)' }}>{order.giftName}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <DollarSign size={12} />
                    <span>Amount: <strong>₹{order.amount}</strong></span>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Qty: {order.quantity || 1}
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Purchaser</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <div style={{ padding: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--color-primary)' }}>
                      <User size={14} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)' }}>{order.user?.fullName}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{order.user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Payment verification */}
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Payment Info</span>
                  <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    <span>UTR: <strong style={{ color: 'var(--color-secondary)' }}>{order.transactionId || 'N/A'}</strong></span>
                  </div>
                  {order.personalMessage && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.personalMessage}
                    </div>
                  )}
                </div>

                {/* Delivery Details */}
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Delivery Details</span>
                  {order.recipient && (
                    <div style={{ marginTop: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                      <strong>To:</strong> {order.recipient.name}
                    </div>
                  )}
                  {order.deliveryAddress && (
                    <div style={{ marginTop: '2px', fontSize: '0.72rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'pre-wrap' }}
                      title={order.deliveryAddress}>
                      📍 {order.deliveryAddress}
                    </div>
                  )}
                  {order.deliveryType && (
                    <div style={{ marginTop: '2px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      🚚 {order.deliveryType} {order.deliveryCharge > 0 && `(₹${order.deliveryCharge})`}
                    </div>
                  )}
                  {order.scheduledDate && (
                    <div style={{ marginTop: '2px', fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                      📅 {order.scheduledDate} {order.scheduledTime ? `@ ${order.scheduledTime.substring(0, 5)}` : ''}
                    </div>
                  )}
                  {order.trackingId && (
                    <div style={{ marginTop: '4px', fontSize: '0.68rem', background: 'rgba(0, 245, 212, 0.05)', border: '1px solid rgba(0, 245, 212, 0.15)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', color: 'var(--color-success)' }}>
                      🆔 Booking ID: <strong>{order.trackingId}</strong>
                    </div>
                  )}
                </div>

                {/* Screenshot Thumb */}
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Receipt</span>
                  {order.paymentScreenshot === 'razorpay_verified_payment' ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: 'rgba(0, 245, 212, 0.1)', border: '1px solid var(--color-success)',
                      color: 'var(--color-success)', padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.7rem', fontWeight: 600, width: 'fit-content'
                    }}>
                      ✅ Razorpay Verified
                    </div>
                  ) : order.paymentScreenshot ? (
                    <div 
                      onClick={() => openScreenshotModal(order.paymentScreenshot, order.id)}
                      style={{
                        position: 'relative',
                        width: '64px',
                        height: '40px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(0,0,0,0.2)'
                      }}
                      className="glass-card-hover"
                    >
                      <img 
                        src={order.paymentScreenshot} 
                        alt="Receipt thumbnail" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 600 }}>View</span>
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No receipt</span>
                  )}
                </div>

                {/* Status or Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  {order.status === 'PENDING_VERIFICATION' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        size="sm" 
                        variant="primary" 
                        icon={CheckCircle2}
                        onClick={() => setOrderToConfirm(order)}
                      >
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger" 
                        icon={XCircle}
                        onClick={() => handleReject(order.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      {getNextStatus(order.status) && (
                        <Button
                          size="sm"
                          variant="glass"
                          icon={order.status === 'OUT_FOR_DELIVERY' ? CheckCircle2 : Truck}
                          onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                          style={{ fontSize: '0.72rem', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', background: 'var(--surface-color)' }}
                        >
                          Mark {getStatusLabel(getNextStatus(order.status))}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Full Screenshot Modal */}
      <Modal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        title={`Payment Receipt Verification - ${currentOrderRef}`}
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div 
            style={{ 
              width: '100%', 
              maxHeight: '450px', 
              borderRadius: 'var(--radius-md)', 
              overflowY: 'auto',
              border: '1px solid var(--glass-border)',
              background: '#0d1117',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}
          >
            {currentScreenshot && currentScreenshot.includes('razorpay_verified_payment') ? (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <CheckCircle2 size={48} color="var(--success-color)" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--success-color)', margin: '0 0 8px 0' }}>Payment Automatically Verified</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>This order was securely paid via Razorpay.</p>
              </div>
            ) : (
              <img 
                src={currentScreenshot} 
                alt="Full payment receipt screenshot" 
                style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div style="padding: 32px; color: var(--text-secondary); text-align: center;">Receipt image not found or broken.</div>';
                }}
              />
            )}
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsScreenshotOpen(false)} variant="glass">
              Close Preview
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation & Auto-Book Modal */}
      <Modal
        isOpen={!!orderToConfirm}
        onClose={() => setOrderToConfirm(null)}
        title="Confirm Order & Auto-Book Delivery"
        size="md"
      >
        {orderToConfirm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0, 245, 212, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 245, 212, 0.15)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-success)', marginBottom: '8px' }}>
                Payment Verified
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Confirming this order will decrement stock and prepare for dispatch.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ border: '1px solid var(--glass-border)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Origin (Store Address)</span>
                  <button 
                    onClick={() => {
                      const newAddr = prompt("Enter Store Address:", storeAddress === 'Not Set' ? '' : storeAddress);
                      if (newAddr && newAddr.trim()) {
                        api.put('/admin/app-config/STORE_ADDRESS', { value: newAddr.trim() })
                           .then(() => {
                             setStoreAddress(newAddr.trim());
                             localStorage.setItem('admin_store_address', newAddr.trim());
                           })
                           .catch(() => addToast('Failed to save store address', 'error'));
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#ffffff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                  {storeAddress}
                </div>
              </div>

              <div style={{ border: '1px solid var(--glass-border)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Destination (Customer Address)</span>
                <div style={{ fontSize: '0.82rem', color: '#ffffff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} style={{ color: 'var(--color-secondary)' }} />
                  {orderToConfirm.deliveryAddress}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--glass-border)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Logistics & Split Summary</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Delivery Mode</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {orderToConfirm.deliveryType === 'Instant' ? `${orderToConfirm.deliveryService} (Auto-Book)` : orderToConfirm.deliveryType}
                  </span>
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer Paid Delivery</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    ₹{orderToConfirm.deliveryCharge || 0}
                  </span>
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Admin Courier Cost (Split)</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2a537' }}>
                    ₹{orderToConfirm.adminDeliveryCharge || 0}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <Button variant="ghost" onClick={() => setOrderToConfirm(null)}>
                Cancel
              </Button>
              <Button variant="primary" icon={CheckCircle2} onClick={handleConfirm}>
                Confirm & Dispatch
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminOrdersPage;
