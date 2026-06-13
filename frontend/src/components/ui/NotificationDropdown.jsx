import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, XCircle, Info, X, Package } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const iconMap = {
  order_confirmed: { icon: CheckCircle2, color: 'var(--color-success)' },
  order_rejected: { icon: XCircle, color: 'var(--color-danger)' },
  order_placed: { icon: Package, color: 'var(--color-primary)' },
  info: { icon: Info, color: 'var(--color-secondary)' }
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, markAsRead, markAllAsRead, clearAll, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s, background 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.background = 'none';
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'var(--color-danger)',
            color: '#ffffff',
            fontSize: '0.6rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-primary)',
            lineHeight: 1
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '380px',
          maxHeight: '480px',
          background: 'rgba(15, 15, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: '#ffffff' }}>
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(157, 78, 221, 0.2)',
                  color: 'var(--color-primary)',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 500
                  }}
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.72rem'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '400px' }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}>
                <Bell size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = iconMap[notif.type] || iconMap.info;
                const IconComp = config.icon;
                return (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    style={{
                      padding: '14px 20px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      background: notif.read ? 'transparent' : 'rgba(157, 78, 221, 0.03)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(157, 78, 221, 0.03)'}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: `${config.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComp size={16} style={{ color: config.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: notif.read ? 500 : 700,
                          color: '#ffffff'
                        }}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'var(--color-primary)',
                            flexShrink: 0
                          }} />
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {notif.message}
                      </p>
                      <span style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        marginTop: '4px',
                        display: 'block'
                      }}>
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
