import { useState } from 'react';
import { LogOut } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';
import NotificationBell from '../NotificationBell';
import NotificationPanel from '../NotificationPanel';

export default function ApproverNavbar({ onLogout }) {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  return (
    <>
      <div
        className="navbar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '80px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fffffff0',
          zIndex: 1000,
          alignItems: 'center'
        }}
      >
        {/* Left Section: Logo + Username */}
        <div
          style={{
            marginLeft: '130px',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#000000ff',
          }}
        >
          <div>
            <p style={{ marginBottom: '-25px', fontSize: '23px', marginTop: '10px' }}>
              DocuFlow
            </p>
            <div>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 'normal',
                  color: '#6B7280',
                  display: 'flex',
                  justifyContent: 'center',
                  fontFamily: 'Pacifico',
                }}
              >
                {user.username}
              </p>
            </div>
          </div>
        </div>

      
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginRight: '130px' }}>
         
          <NotificationBell
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            unreadCount={unreadCount}
          />

        
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#1F2937',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              height: '40px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
            onClick={onLogout}
          >
            <LogOut size={16} style={{ marginRight: '6px' }} />
            Logout
          </button>
        </div>
      </div>

    
      <NotificationPanel
        isOpen={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDelete={deleteNotification}
        onClearAll={clearAllNotifications}
      />
    </>
  );
}
