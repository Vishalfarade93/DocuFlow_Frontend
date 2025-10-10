import { Eye, MessageSquare, Send, XCircle, RefreshCw } from 'lucide-react';

export default function ReviewerDocumentTable({ documents,onViewDocument }) {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING_REVIEW':
      case 'PENDING REVIEW':
        return '#DBEAFE';
      case 'CHANGES_REQUESTED':
      case 'CHANGES REQUESTED':
        return '#FEF3C7';
      case 'FORWARDED':
        return '#D1FAE5';
      case 'REJECTED':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
  }; 

  const getStatusTextColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING_REVIEW':
      case 'PENDING REVIEW':
        return '#1E40AF';
      case 'CHANGES_REQUESTED':
      case 'CHANGES REQUESTED':
        return '#92400E';
      case 'FORWARDED':
        return '#065F46';
      case 'REJECTED':
        return '#991B1B';
      default:
        return '#374151';
    }
  };

   const formatTimeAgo = (isoDate) => {
    const now = new Date();
    const past = new Date(isoDate);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return `${years} years ago`;

  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <th style={{
              padding: '16px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: '600',
              color: '#6B7280'
            }}>
              Document Title
            </th>
            <th style={{
              padding: '16px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: '600',
              color: '#6B7280'
            }}>
              Submitter Name
            </th>
            <th style={{
              padding: '16px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: '600',
              color: '#6B7280'
            }}>
              Submission Date
            </th>
            <th style={{
              padding: '16px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: '600',
              color: '#6B7280'
            }}>
              Status
            </th>
            <th style={{
              padding: '16px',
              textAlign: 'right',
              fontSize: '13px',
              fontWeight: '600',
              color: '#6B7280'
            }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '16px' }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1F2937',
                  marginBottom: '4px'
                }}>
                  {doc.title}
                </div>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  {doc.fileName}
                </div>
              </td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#1F2937' }}>
                {doc.owner}
              </td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                {formatDate(doc.submittedAt)}
              </td>
              <td style={{ padding: '16px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '500',
                  backgroundColor: getStatusColor(doc.status),
                  color: getStatusTextColor(doc.status)
                }}>
                  {doc.status.replace('_', ' ')}
                </span>
              </td>
              <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {doc.status && (
                  <button
                    onClick={() => onViewDocument(doc)}
                    style={{
                      padding: '8px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#6B7280'
                    }}
                    title="View Document"
                  >
                    <Eye size={18} />
                  </button>
                  )}


              
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}