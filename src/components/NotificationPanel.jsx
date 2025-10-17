import { X, Check, CheckCheck, Trash2, Clock, File } from 'lucide-react';
import { useEffect, useRef } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  MessageSquare,
  Bell
} from "lucide-react";


export default function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll
}) {
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  };

  const getNotificationIcon = (eventType) => {
  switch (eventType) {
    case "DOCUMENT_SUBMITTED":
      return <FileText size={20} color="#2563eb" />; 
    case "DOCUMENT_APPROVED":
      return <CheckCircle size={20} color="#16a34a" />;
    case "DOCUMENT_REJECTED":
      return <XCircle size={20} color="#dc2626" />; 
    case "DOCUMENT_REVISION_REQUESTED":
      return <RefreshCw size={20} color="#f59e0b" />;
    case "DOCUMENT_UNDER_REVIEW":
      return <Eye size={20} color="#9333ea" />;
    case "COMMENT_ADDED":
      return <MessageSquare size={20} color="#3b82f6" />; 
    default:
      return <Bell size={20} color="#6b7280" />; 
  }
};


  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute',
        top: '60px',
        right: '130px',
        width: '420px',
        maxHeight: '600px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        border: '1px solid #E5E7EB',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
              {unreadCount} unread
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              style={{
                padding: '6px 12px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              Mark all
            </button>
            
          )}
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} color="#6B7280" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{
        overflowY: 'auto',
        flex: 1,
        maxHeight: '480px'
      }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#9CA3AF'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
              No notifications yet
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
              You're all caught up!
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F3F4F6',
                backgroundColor: notification.isRead ? 'white' : '#EFF6FF',
                transition: 'all 0.2s',
                position: 'relative',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = notification.isRead ? '#F9FAFB' : '#DBEAFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : '#EFF6FF';
              }}
              onClick={() => {
                if (!notification.isRead) {
                  onMarkAsRead(notification.id);
                }
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: notification.isRead ? '#F3F4F6' : '#000000ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  {getNotificationIcon(notification.eventType)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1F2937',
                      lineHeight: '1.4'
                    }}>
                      {notification.documentTitle}
                    </p>
                    {!notification.isRead && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#3B82F6',
                        flexShrink: 0,
                        marginLeft: '8px',
                        marginTop: '4px'
                      }} />
                    )}
                  </div>

                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '13px',
                    color: '#4B5563',
                    lineHeight: '1.5'
                  }}>
                    {notification.message}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#9CA3AF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={12} />
                      {formatTimeAgo(notification.createdAt)}
                    </span>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                          }}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'transparent',
                            border: '1px solid #D1D5DB',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#6B7280'
                          }}
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(notification.id);
                        }}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: 'transparent',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#EF4444'
                        }}
                        title="Delete notification"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={onClearAll}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={14} />
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}