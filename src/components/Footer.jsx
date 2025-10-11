export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#1F2937',
      color: '#E5E7EB',
      padding: '40px 130px',
      marginTop: '60px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '40px',
        marginBottom: '30px'
      }}>
        {/* Company Info */}
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px'
          }}>
            Document Management
          </h3>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#9CA3AF'
          }}>
            Streamline your document approval process with our comprehensive management system.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px'
          }}>
            Quick Links
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{ marginBottom: '12px' }}>
              <a href="#" style={{
                fontSize: '14px',
                color: '#9CA3AF',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = '#3B82F6'}
              onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                Dashboard
              </a>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <a href="#" style={{
                fontSize: '14px',
                color: '#9CA3AF',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.target.style.color = '#3B82F6'}
              onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                Help Center
              </a>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <a href="#" style={{
                fontSize: '14px',
                color: '#9CA3AF',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.target.style.color = '#3B82F6'}
              onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                Documentation
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px'
          }}>
            Contact
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{
              fontSize: '14px',
              color: '#9CA3AF',
              marginBottom: '12px'
            }}>
              Email: support@docmanager.com
            </li>
            <li style={{
              fontSize: '14px',
              color: '#9CA3AF',
              marginBottom: '12px'
            }}>
              Phone: +91 (800) 123-4567
            </li>
            <li style={{
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              Hours: Mon-Fri, 9AM-6PM IST
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid #374151',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#9CA3AF',
          margin: 0
        }}>
          © {currentYear} Document Management System. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{
            fontSize: '14px',
            color: '#9CA3AF',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => e.target.style.color = '#3B82F6'}
          onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
            Privacy Policy
          </a>
          <a href="#" style={{
            fontSize: '14px',
            color: '#9CA3AF',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => e.target.style.color = '#3B82F6'}
          onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}