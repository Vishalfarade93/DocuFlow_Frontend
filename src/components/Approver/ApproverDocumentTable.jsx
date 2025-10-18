import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ApproverDocumentTable({ documents, onViewDocument }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING_APPROVAL':
      case 'PENDING APPROVAL':
        return '#FEF3C7';
      case 'APPROVED':
        return '#D1FAE5';
      case 'REJECTED':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING_APPROVAL':
      case 'PENDING APPROVAL':
        return '#92400E';
      case 'APPROVED':
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }; 

  // Pagination 
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = documents.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div>
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
                Forwarded By
              </th>
              <th style={{
                padding: '16px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: '600',
                color: '#6B7280'
              }}>
                Forwarded Date
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
            {currentDocuments.map((doc) => (
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
                    {doc.filename}
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#1F2937' }}>
                  {doc.owner}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#1F2937' }}>
                  {doc.reviewedBy}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                  {formatDate(doc.forwardedAt)}
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
           
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          padding: '0 4px'
        }}>
          <div style={{ fontSize: '14px', color: '#6B7280' }}>
            Showing {startIndex + 1} to {Math.min(endIndex, documents.length)} of {documents.length} documents
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                color: currentPage === 1 ? '#D1D5DB' : '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      backgroundColor: currentPage === page ? '#3B82F6' : 'white',
                      color: currentPage === page ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      minWidth: '40px'
                    }}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                color: currentPage === totalPages ? '#D1D5DB' : '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}