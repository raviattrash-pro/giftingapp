import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ShieldCheck, Truck, Plus, Minus, ArrowLeft, ArrowRight, Upload, Copy, MapPin, User, Phone, Mail, MessageSquare } from 'lucide-react';
import PincodeDistanceLib from 'pincode-distance';

const PincodeDistance = PincodeDistanceLib.default || PincodeDistanceLib;
const pd = new PincodeDistance();

import { useGiftStore } from '../store/giftStore';
import { useRecipientStore } from '../store/recipientStore';
import { useUiStore } from '../store/uiStore';
import { useBudgetStore } from '../store/budgetStore';
import { useNotificationStore } from '../store/notificationStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import api from '../services/api';

const GiftCheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity, removeFromCart, checkout, clearCart, paymentSettings, fetchPaymentSettings, fetchDeliveryQuote } = useGiftStore();
  const { recipients } = useRecipientStore();
  const { addToast } = useUiStore();
  const { addTransaction } = useBudgetStore();
  const { addNotification } = useNotificationStore();

  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Recipient details
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  // Delivery address
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [courierType, setCourierType] = useState('Instant'); // Default to Instant local booking!

  // Porter/Rapido states
  const [deliveryService, setDeliveryService] = useState('PORTER');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [deliveryQuotes, setDeliveryQuotes] = useState(null);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [adminDeliveryCharge, setAdminDeliveryCharge] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.gift.price * item.quantity, 0);

  // Payment
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [screenshotName, setScreenshotName] = useState('');

  // Coupon
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    fetchPaymentSettings();
  }, [fetchPaymentSettings]);

  useEffect(() => {
    const getQuote = async () => {
      if (pincode && pincode.trim().length >= 5) {
        setLoadingQuotes(true);
        try {
          // Calculate charges locally to bypass old backend bug
          const hour = scheduledTime ? parseInt(scheduledTime.split(':')[0]) : 12;
          const surcharge = (hour >= 8 && hour < 19) ? 75 : 0;
          
          let storePin = 400001;
          try {
            const localAddr = localStorage.getItem('admin_store_address');
            if (localAddr) {
              const m = localAddr.match(/\d{5,6}/);
              if (m) storePin = parseInt(m[0], 10);
            } else {
              const confRes = await api.get('/config/STORE_ADDRESS');
              if (confRes.data && confRes.data.value) {
                const m = confRes.data.value.match(/\d{5,6}/);
                if (m) storePin = parseInt(m[0], 10);
              }
            }
          } catch(e) {}

          let userPin = parseInt(pincode, 10) || 400001;
          let distanceKm = 1;
          try {
            const exactDistance = pd.getDistance(storePin.toString(), userPin.toString());
            // Multiply straight-line distance by 1.5 to approximate actual driving distance
            distanceKm = exactDistance > 0 ? Math.round(exactDistance * 1.5) : 1;
          } catch(e) {
            distanceKm = Math.abs(storePin - userPin);
            if (distanceKm === 0) distanceKm = 1;
          }

          const porterTotal = 50 + distanceKm * 9 + surcharge;
          const rapidoTotal = 40 + distanceKm * 11 + surcharge;
          
          const isBulk = subtotal >= 2000;
          let userSharePct = 50, adminSharePct = 50;
          if (distanceKm <= 3) {
              if (isBulk) { adminSharePct = 100; userSharePct = 0; }
          } else {
              if (!isBulk) { adminSharePct = 0; userSharePct = 100; }
          }

          // Calculate standard courier charges using Zone-based pricing
          let delhiveryTotal = 45, blueDartTotal = 65, dtdcTotal = 40, indiaPostTotal = 35;
          if (distanceKm > 500) {
              // National
              delhiveryTotal = 85; blueDartTotal = 145; dtdcTotal = 75; indiaPostTotal = 65;
          } else if (distanceKm > 50) {
              // Regional
              delhiveryTotal = 65; blueDartTotal = 95; dtdcTotal = 55; indiaPostTotal = 45;
          }

          const porterCharge = Math.round(porterTotal * (userSharePct/100));
          const rapidoCharge = Math.round(rapidoTotal * (userSharePct/100));
          const porterAdmin = Math.round(porterTotal * (adminSharePct/100));
          const rapidoAdmin = Math.round(rapidoTotal * (adminSharePct/100));
          
          const quotes = {
            allowInstant: true,
            distanceKm: distanceKm,
            porter: { userCharge: porterCharge, adminCharge: porterAdmin },
            rapido: { userCharge: rapidoCharge, adminCharge: rapidoAdmin },
            delhivery: { 
                userCharge: Math.round(delhiveryTotal * (userSharePct/100)), 
                adminCharge: Math.round(delhiveryTotal * (adminSharePct/100)) 
            },
            bluedart: { 
                userCharge: Math.round(blueDartTotal * (userSharePct/100)), 
                adminCharge: Math.round(blueDartTotal * (adminSharePct/100)) 
            },
            dtdc: { 
                userCharge: Math.round(dtdcTotal * (userSharePct/100)), 
                adminCharge: Math.round(dtdcTotal * (adminSharePct/100)) 
            },
            indiapost: { 
                userCharge: Math.round(indiaPostTotal * (userSharePct/100)), 
                adminCharge: Math.round(indiaPostTotal * (adminSharePct/100)) 
            }
          };
          
          setDeliveryQuotes(quotes);
          
          if (deliveryService === 'PORTER') {
            setDeliveryCharge(porterCharge);
            setAdminDeliveryCharge(porterAdmin);
          } else if (deliveryService === 'RAPIDO') {
            setDeliveryCharge(rapidoCharge);
            setAdminDeliveryCharge(rapidoAdmin);
          } else {
            if (porterCharge <= rapidoCharge && porterCharge > 0) {
              setDeliveryService('PORTER');
              setDeliveryCharge(porterCharge);
              setAdminDeliveryCharge(porterAdmin);
            } else if (rapidoCharge > 0) {
              setDeliveryService('RAPIDO');
              setDeliveryCharge(rapidoCharge);
              setAdminDeliveryCharge(rapidoAdmin);
            } else {
              setDeliveryService('PORTER');
              setDeliveryCharge(porterCharge);
              setAdminDeliveryCharge(porterAdmin);
            }
          }
        } catch (err) {
          console.error('Failed to get quotes', err);
        } finally {
          setLoadingQuotes(false);
        }
      }
    };
    
    getQuote();
  }, [address, city, pincode, scheduledTime, fetchDeliveryQuote, deliveryService, courierType, subtotal]);

  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
  const avgTaxRate = totalQty > 0 ? Math.round(cart.reduce((acc, item) => acc + (item.gift.luxuryTax ?? 8) * item.quantity, 0) / totalQty) : 8;
  const tax = Math.round(cart.reduce((acc, item) => acc + (item.gift.price * (item.gift.luxuryTax ?? 8) / 100) * item.quantity, 0));
  
  const courierMultiplier = courierType === 'Hand-delivery' ? 1.0 : courierType === 'Priority' ? 0.5 : 0.2;
  const deliveryCost = courierType === 'Instant' 
    ? deliveryCharge 
    : Math.round(cart.reduce((acc, item) => acc + (item.gift.courierHandling ?? 50) * courierMultiplier * item.quantity, 0));
  
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + tax + deliveryCost - discount);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    try {
      setCouponError('');
      const { data } = await api.get(`/coupons/validate/${couponCodeInput}`);
      setAppliedCoupon(data);
      addToast('Coupon applied!', 'success');
    } catch (err) {
      setCouponError('Invalid or expired coupon');
      setAppliedCoupon(null);
    }
  };

  const handleQtyChange = (itemId, currentQty, increment) => {
    updateCartItemQuantity(itemId, currentQty + increment);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyUpiId = () => {
    if (paymentSettings?.upiId) {
      navigator.clipboard.writeText(paymentSettings.upiId);
      addToast('UPI ID copied to clipboard', 'info');
    }
  };

  const handleCheckoutSubmit = async (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    if (!recipientName.trim()) {
      addToast('Please provide the recipient\'s name.', 'error');
      return;
    }

    if (!address.trim() || !city.trim() || !pincode.trim()) {
      addToast('Please provide the full delivery address (address, city, and pincode).', 'error');
      return;
    }

    if (!transactionId || !paymentScreenshot) {
      addToast('Please provide transaction ID and payment receipt screenshot.', 'error');
      return;
    }

    try {
      const result = await checkout({
        address,
        city,
        state,
        pincode,
        courierType: courierType === 'Instant' ? deliveryService : courierType,
        grandTotal,
        transactionId,
        paymentScreenshot,
        recipientName,
        recipientPhone,
        recipientEmail,
        personalMessage,
        scheduledDate,
        scheduledTime,
        deliveryService: courierType === 'Instant' ? deliveryService : null,
        deliveryCharge: courierType === 'Instant' ? deliveryCharge : deliveryCost,
        adminDeliveryCharge: courierType === 'Instant' ? adminDeliveryCharge : 0
      });

      // Log the transactions into local budget store for visualization
      cart.forEach(item => {
        const rec = recipients.find(r => r.id === item.recipientId);
        addTransaction({
          recipientName: recipientName || (rec ? rec.name : 'Corporate Distribution'),
          giftName: item.gift.name,
          cost: item.gift.price * item.quantity,
          category: item.gift.category,
          relationship: rec ? rec.relationship : 'External client'
        });
      });

      setOrderId(result.orderId);
      setCheckoutComplete(true);
      addToast('Your corporate order has been submitted for payment verification.', 'success');
      addNotification(
        'order_placed',
        'Order Submitted!',
        `Order #${result.orderId} has been placed and is pending payment verification.`
      );
    } catch (err) {
      addToast(err.response?.data?.message || 'Checkout failed. Please try again.', 'error');
    }
  };

  const courierOptions = [];

  if (checkoutComplete) {
    return (
      <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
        <div 
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(0, 245, 212, 0.1)',
            border: '1px solid var(--color-success)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 245, 212, 0.2)'
          }}
        >
          <ShieldCheck size={32} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', marginBottom: '8px' }}>Payment Pending Verification</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px auto' }}>
            Your premium order is now registered under Reference: <strong style={{ color: 'var(--color-primary)' }}>{orderId}</strong>.
            The admin will verify the manual payment details and process dispatch shortly.
          </p>
        </div>
        <Button onClick={() => navigate('/')} variant="primary">
          Return to Grand Salon
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Back button */}
      <div>
        <Button onClick={() => navigate('/')} variant="ghost" icon={ArrowLeft}>
          Back to Curations
        </Button>
      </div>

      {cart.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Shopping cart is empty"
          description="Browse our curated items list to stage luxury items for delivery."
          actionText="Browse Curations"
          onAction={() => navigate('/')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '7.5fr 4.5fr', gap: '24px' }} className="mobile-stack">
          
          {/* Left: Cart + Recipient + Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Cart Items */}
            <Card hoverable={false}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)', marginBottom: '20px' }}>
                Staged Gift Items ({cart.length})
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item) => {
                  const targetRecipient = recipients.find(r => r.id === item.recipientId);
                  return (
                    <div 
                      key={item.id}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={item.gift.imageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300'} 
                          alt={item.gift.name} 
                          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.gift.name}</h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.gift.category}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Qty controller */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', padding: '4px 8px', borderRadius: '4px' }}>
                          <button 
                            onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button 
                            onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span style={{ fontSize: '0.88rem', fontWeight: 600, width: '60px', textAlign: 'right' }}>
                          ₹{item.gift.price * item.quantity}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recipient Details */}
            <Card hoverable={false}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} style={{ color: 'var(--color-primary)' }} />
                Who is this gift for?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Input
                  label="Recipient's Full Name"
                  placeholder="e.g. John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Input
                    label="Phone Number"
                    placeholder="e.g. +91 98765 43210"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                  <Input
                    label="Email (Optional)"
                    placeholder="e.g. john@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card hoverable={false}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} style={{ color: 'var(--color-secondary)' }} />
                Delivery Address
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Input
                  label="Street Address / Landmark"
                  placeholder="e.g. 100 Executive Blvd, Suite 500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <Input
                    label="City"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                  <Input
                    label="Pincode"
                    placeholder="e.g. 400001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
                {/* Delivery Mode Toggle */}
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Delivery Mode
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div 
                      onClick={() => { setCourierType('Instant'); setDeliveryService('PORTER'); }}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        background: courierType === 'Instant' ? 'rgba(183,110,121,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${courierType === 'Instant' ? '#b76e79' : 'var(--glass-border)'}`,
                        color: courierType === 'Instant' ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: courierType === 'Instant' ? 600 : 400,
                        fontSize: '0.82rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ⚡ Instant Auto-Booking
                    </div>
                    <div 
                      onClick={() => { setCourierType('Standard'); setDeliveryService('DELHIVERY'); }}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        background: courierType === 'Standard' ? 'rgba(183,110,121,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${courierType === 'Standard' ? '#b76e79' : 'var(--glass-border)'}`,
                        color: courierType === 'Standard' ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: courierType === 'Standard' ? 600 : 400,
                        fontSize: '0.82rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      📦 Standard Shipping
                    </div>
                  </div>
                </div>

                {courierType === 'Instant' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                    {/* Date and Time Selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          value={scheduledDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                          Preferred Time (IST)
                        </label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    {/* Surcharge Notice Alert Box */}
                    {(() => {
                      const hour = parseInt(scheduledTime.split(':')[0]) || 12;
                      const isPeak = hour >= 8 && hour < 19;
                      return isPeak ? (
                        <div style={{
                          background: 'rgba(226, 165, 55, 0.08)',
                          border: '1px solid rgba(226, 165, 55, 0.25)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          fontSize: '0.76rem',
                          color: '#e2a537',
                          lineHeight: '1.4'
                        }}>
                          ⚠️ <strong>Peak Hours:</strong> Deliveries scheduled between <strong>8 AM and 7 PM IST</strong> carry a ₹75 surcharge. To save on delivery charges, select a time before 8 AM or after 7 PM IST.
                        </div>
                      ) : (
                        <div style={{
                          background: 'rgba(0, 245, 212, 0.08)',
                          border: '1px solid rgba(0, 245, 212, 0.25)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          fontSize: '0.76rem',
                          color: '#00f5d4',
                          lineHeight: '1.4'
                        }}>
                          ✅ <strong>Off-Peak Discount:</strong> Delivery scheduled during admin-preferred off-peak hours (before 8 AM or after 7 PM IST). Surcharge of ₹75 is waived!
                        </div>
                      );
                    })()}

                    {/* Live Quotes from Porter / Rapido */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Select Delivery Partner
                        </span>
                        {deliveryQuotes && deliveryQuotes.distanceKm && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                            <MapPin size={12} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '2px' }} />
                            Distance: {deliveryQuotes.distanceKm} km
                          </span>
                        )}
                      </div>

                      {loadingQuotes ? (
                        <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                          🔄 Fetching live delivery quotes from Porter and Rapido APIs...
                        </div>
                      ) : !pincode || pincode.trim().length < 6 ? (
                        <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                          📍 Enter a valid 6-digit pincode above to calculate Porter/Rapido delivery charges.
                        </div>
                      ) : deliveryQuotes ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          {/* Porter Card */}
                          <div
                            onClick={() => {
                              setDeliveryService('PORTER');
                              setDeliveryCharge(deliveryQuotes.porter?.userCharge || 0);
                              setAdminDeliveryCharge(deliveryQuotes.porter?.adminCharge || 0);
                            }}
                            style={{
                              padding: '12px',
                              borderRadius: 'var(--radius-md)',
                              background: deliveryService === 'PORTER' ? 'rgba(183,110,121,0.08)' : 'rgba(0,0,0,0.15)',
                              border: '2px solid',
                              borderColor: deliveryService === 'PORTER' ? '#b76e79' : 'var(--glass-border)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              transition: 'var(--transition-fast)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>🚛 Porter Bike</span>
                              {deliveryService === 'PORTER' && <span style={{ color: '#b76e79', fontSize: '0.78rem', fontWeight: 'bold' }}>✓ Selected</span>}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Total: ₹{deliveryQuotes.porter?.totalCharge}
                              {deliveryQuotes.porter?.adminCharge > 0 && ` (Admin pays: ₹${deliveryQuotes.porter?.adminCharge})`}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>⏱ {deliveryQuotes.porter?.estimatedTimeMinutes} mins</span>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>You pay</div>
                                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#b76e79' }}>₹{deliveryQuotes.porter?.userCharge}</span>
                              </div>
                            </div>
                          </div>

                          <div
                            onClick={() => {
                              setDeliveryService('RAPIDO');
                              setDeliveryCharge(deliveryQuotes.rapido?.userCharge || 0);
                              setAdminDeliveryCharge(deliveryQuotes.rapido?.adminCharge || 0);
                            }}
                            style={{
                              padding: '12px',
                              borderRadius: 'var(--radius-md)',
                              background: deliveryService === 'RAPIDO' ? 'rgba(183,110,121,0.08)' : 'rgba(0,0,0,0.15)',
                              border: '2px solid',
                              borderColor: deliveryService === 'RAPIDO' ? '#b76e79' : 'var(--glass-border)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              transition: 'var(--transition-fast)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>🛵 Rapido Parcel</span>
                              {deliveryService === 'RAPIDO' && <span style={{ color: '#b76e79', fontSize: '0.78rem', fontWeight: 'bold' }}>✓ Selected</span>}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Total: ₹{deliveryQuotes.rapido?.totalCharge}
                              {deliveryQuotes.rapido?.adminCharge > 0 && ` (Admin pays: ₹${deliveryQuotes.rapido?.adminCharge})`}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>⏱ {deliveryQuotes.rapido?.estimatedTimeMinutes} mins</span>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>You pay</div>
                                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#b76e79' }}>₹{deliveryQuotes.rapido?.userCharge}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                          ⚠️ Could not calculate rates. Try again.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Select Courier Partner
                      </span>
                      {deliveryQuotes && deliveryQuotes.distanceKm && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                          <MapPin size={12} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '2px' }} />
                          Distance: {deliveryQuotes.distanceKm} km
                        </span>
                      )}
                    </div>
                    {!pincode || pincode.trim().length < 6 ? (
                      <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                        📍 Enter a valid 6-digit pincode above to calculate courier delivery charges.
                      </div>
                    ) : deliveryQuotes && deliveryQuotes.delhivery ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        
                        {/* Delhivery */}
                        <div
                          onClick={() => {
                            setDeliveryService('DELHIVERY');
                            setDeliveryCharge(deliveryQuotes.delhivery.userCharge || 0);
                            setAdminDeliveryCharge(deliveryQuotes.delhivery.adminCharge || 0);
                          }}
                          style={{
                            padding: '12px', borderRadius: 'var(--radius-md)',
                            background: deliveryService === 'DELHIVERY' ? 'rgba(183,110,121,0.08)' : 'rgba(0,0,0,0.15)',
                            border: '2px solid', borderColor: deliveryService === 'DELHIVERY' ? '#b76e79' : 'var(--glass-border)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#E3000F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 'bold' }}>D</div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Delhivery</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>⏱ 2-3 Days</span>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>You pay</div>
                              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#b76e79' }}>₹{deliveryQuotes.delhivery.userCharge}</span>
                            </div>
                          </div>
                        </div>

                        {/* Blue Dart Express */}
                        <div
                          onClick={() => {
                            setDeliveryService('BLUEDART');
                            setDeliveryCharge(deliveryQuotes.bluedart.userCharge || 0);
                            setAdminDeliveryCharge(deliveryQuotes.bluedart.adminCharge || 0);
                          }}
                          style={{
                            padding: '12px', borderRadius: 'var(--radius-md)',
                            background: deliveryService === 'BLUEDART' ? 'rgba(183,110,121,0.08)' : 'rgba(0,0,0,0.15)',
                            border: '2px solid', borderColor: deliveryService === 'BLUEDART' ? '#b76e79' : 'var(--glass-border)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#002C6A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700', fontSize: '0.6rem', fontWeight: 'bold' }}>BD</div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Blue Dart</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>⏱ 1-2 Days</span>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>You pay</div>
                              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#b76e79' }}>₹{deliveryQuotes.bluedart.userCharge}</span>
                            </div>
                          </div>
                        </div>

                        {/* DTDC */}
                        <div
                          onClick={() => {
                            setDeliveryService('DTDC');
                            setDeliveryCharge(deliveryQuotes.dtdc.userCharge || 0);
                            setAdminDeliveryCharge(deliveryQuotes.dtdc.adminCharge || 0);
                          }}
                          style={{
                            padding: '12px', borderRadius: 'var(--radius-md)',
                            background: deliveryService === 'DTDC' ? 'rgba(183,110,121,0.08)' : 'rgba(0,0,0,0.15)',
                            border: '2px solid', borderColor: deliveryService === 'DTDC' ? '#b76e79' : 'var(--glass-border)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#ED1B24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 'bold' }}>DT</div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>DTDC</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>⏱ 3-5 Days</span>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>You pay</div>
                              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#b76e79' }}>₹{deliveryQuotes.dtdc.userCharge}</span>
                            </div>
                          </div>
                        </div>

                        {/* India Post */}
                        <div
                          onClick={() => {
                            setDeliveryService('INDIAPOST');
                            setDeliveryCharge(deliveryQuotes.indiapost.userCharge || 0);
                            setAdminDeliveryCharge(deliveryQuotes.indiapost.adminCharge || 0);
                          }}
                          style={{
                            padding: '12px', borderRadius: 'var(--radius-md)',
                            background: deliveryService === 'INDIAPOST' ? 'rgba(183,110,121,0.08)' : 'rgba(0,0,0,0.15)',
                            border: '2px solid', borderColor: deliveryService === 'INDIAPOST' ? '#b76e79' : 'var(--glass-border)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#F8B127', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B7100B', fontSize: '0.6rem', fontWeight: 'bold' }}>IP</div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>India Post</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>⏱ 5-7 Days</span>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>You pay</div>
                              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#b76e79' }}>₹{deliveryQuotes.indiapost.userCharge}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                        ⚠️ Could not calculate rates. Try again.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Personal Message */}
            <Card hoverable={false}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} style={{ color: 'var(--color-accent)' }} />
                Personal Message (Optional)
              </h3>
              <textarea
                rows={3}
                placeholder="Add a personal note to include with the gift..."
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  backdropFilter: 'blur(8px)',
                  resize: 'none'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border-focus)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              />
            </Card>
          </div>

          {/* Right: Summary & UPI Payment panel */}
          <div>
            <Card hoverable={false} style={{ border: '1px solid rgba(157, 78, 221, 0.2)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)', marginBottom: '20px' }}>
                  Order Summary
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Items Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Luxury Tax ({avgTaxRate}%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                    <span>Courier & Handling</span>
                    <span>₹{deliveryCost}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--color-success)', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{appliedCoupon.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex-between" style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-title)' }}>
                    <span>Grand Total</span>
                    <span style={{ color: 'var(--color-primary)' }}>₹{grandTotal}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    placeholder="Have a coupon code?" 
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <Button variant="outline" onClick={handleApplyCoupon} style={{ padding: '0 16px' }}>Apply</Button>
                </div>
                {couponError && <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '-12px', marginBottom: '16px' }}>{couponError}</div>}

                {/* Summary of recipient & address */}
                {recipientName && (
                  <div style={{
                    background: 'rgba(157, 78, 221, 0.04)',
                    border: '1px solid rgba(157, 78, 221, 0.15)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    marginBottom: '16px',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Delivering to:</div>
                    <div>{recipientName}{recipientPhone && ` • ${recipientPhone}`}</div>
                    {address && <div>{address}{city && `, ${city}`}{state && `, ${state}`}{pincode && ` - ${pincode}`}</div>}
                    {personalMessage && <div style={{ fontStyle: 'italic', marginTop: '4px', color: 'var(--text-muted)' }}>"{personalMessage}"</div>}
                    {courierType === 'Instant' && (
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px', marginTop: '6px', fontSize: '0.74rem', color: '#b76e79' }}>
                        ⚡ <strong>{deliveryService} local delivery</strong> scheduled for <strong>{scheduledDate}</strong> at <strong>{scheduledTime}</strong>
                      </div>
                    )}
                  </div>
                )}

                <div 
                  style={{
                    background: 'rgba(0, 245, 212, 0.03)',
                    border: '1px solid rgba(0, 245, 212, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.72rem',
                    color: 'var(--color-success)',
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Handwritten note cards & wax seals included.</span>
                </div>
              </div>

              {/* UPI QR Payment Configuration */}
              <div 
                style={{
                  borderTop: '1px solid var(--glass-border)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>Manual UPI Payment</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Scan the QR code below or use the UPI ID to transfer <strong>₹{grandTotal}</strong>, then upload details.
                </p>

                {paymentSettings && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    {paymentSettings.qrCodeUrl && (
                      <img 
                        src={paymentSettings.qrCodeUrl} 
                        alt="UPI QR Code" 
                        style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '4px solid #fff' }}
                      />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', width: '100%', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#ffffff', wordBreak: 'break-all' }}>
                        {paymentSettings.upiId}
                      </span>
                      <button 
                        type="button"
                        onClick={copyUpiId}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* UTR Input */}
                <Input
                  label="Transaction Ref No / UTR"
                  placeholder="e.g. 123456789012"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />

                {/* Screenshot Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Upload Payment Screenshot <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </span>
                  <label 
                    style={{
                      border: '1px dashed var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.01)',
                      textAlign: 'center'
                    }}
                    className="glass-card-hover"
                  >
                    <Upload size={20} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {screenshotName || 'Click to select payment screenshot'}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleScreenshotChange} 
                      style={{ display: 'none' }}
                      required
                    />
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleCheckoutSubmit} 
                variant="primary" 
                icon={ArrowRight} 
                style={{ width: '100%', marginTop: '10px' }}
                disabled={!transactionId || !paymentScreenshot || !recipientName || !address || !city || !pincode}
              >
                Submit Payment for Verification
              </Button>
            </Card>
          </div>

        </div>
      )}

    </div>
  );
};

export default GiftCheckoutPage;
