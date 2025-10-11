import { ArrowLeft, CalendarCheck2, Download, FileText, MessageSquare } from 'lucide-react';

export default function ViewDocument({ doc, onClose }) {
  if (!doc) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'under_review':
      case 'under review':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'submitted':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'draft':
        return { bg: '#F3F4F6', text: '#374151' };
      case 'reupload':
      case 'rejected':
        return { bg: '#FEF2F2', text: '#991B1B' };
      case 'approved':
        return { bg: '#F0FDF4', text: '#166534' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }; 

  const statusColors = getStatusColor(doc.status);

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:9191/submit/${doc.id}/download`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.fileName || `-`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Download failed');
    }
  };

  // Process comments
  let comments = [];
  if (Array.isArray(doc?.reviewComments)) {
    comments = doc.reviewComments;
  } else if (
    typeof doc?.reviewComments === "string" &&
    doc.reviewComments.trim().length > 0
  ) {
    comments = [doc.reviewComments];
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '800px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              marginBottom: '12px'
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', margin: 0 }}>
            {doc.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: statusColors.bg,
              color: statusColors.text
            }}>
              {doc.status?.replace('_', ' ')}
            </span>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>
              Updated {formatDate(doc.updatedAt)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', marginBottom: '6px', display: 'block' }}>
              Description
            </label>
            <p style={{ fontSize: '14px', color: '#1F2937', lineHeight: 1.6, margin: 0 }}>
              {doc.description || 'No description provided'}
            </p>
          </div>

          {/* Attached File */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', marginBottom: '6px', display: 'block' }}>
              Attached File
            </label>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#E5E7EB',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <FileText size={20} color="#6B7280" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1F2937' }}>
                    {doc.fileName || `${doc.title}.file`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : 'Size unknown'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  e.currentTarget.style.borderColor = '#9CA3AF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>

          {/* Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '30px',
            paddingTop: '16px',
            borderTop: '1px solid #E5E7EB',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280' }}>Created</label>
              <div style={{ fontSize: '14px', color: '#1F2937', marginTop: '5px' }}>
                <CalendarCheck2 size={25} /> {formatDate(doc.createdAt)}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280' }}>Last Updated</label>
              <div style={{ fontSize: '14px', color: '#1F2937', marginTop: '5px' }}>
                <CalendarCheck2 size={25} /> {formatDate(doc.updatedAt)}
              </div>
            </div>
            {doc.submittedAt && (
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280' }}>Submitted At</label>
                <div style={{ fontSize: '14px', color: '#1F2937', marginTop: '5px' }}>
                  <CalendarCheck2 size={25} /> {formatDate(doc.submittedAt)}
                </div>
              </div>
            )}
            {doc.reviewedBy && (
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280' }}>Reviewed By</label>
                <div style={{ fontSize: '14px', color: '#1F2937' }}>{doc.reviewedBy}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '7px' }}>
                  <CalendarCheck2 size={20} /> {formatDate(doc.reviewedAt)}
                </div>
              </div>
            )}
            {doc.approvedBy && (
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280' }}>Approved By</label>
                <div style={{ fontSize: '14px', color: '#1F2937' }}>{doc.approvedBy}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '7px' }}>
                  <CalendarCheck2 size={20} /> {formatDate(doc.approvedAt)}
                </div>
              </div>
            )}
            {doc.rejectedBy && (
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280' }}>Rejected By</label>
                <div style={{ fontSize: '14px', color: '#1F2937' }}>{doc.rejectedBy}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '7px' }}>
                  <CalendarCheck2 size={20} /> {formatDate(doc.rejectedAt)}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Comments Section */}
          {comments.length > 0 && (
            <div style={{
              padding: '24px',
              backgroundColor: '#FAFBFC',
              borderRadius: '10px',
              border: '1px solid #E5E7EB'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <MessageSquare size={20} />
                Review History
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6B7280',
                  backgroundColor: '#E5E7EB',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}>
                  {comments.length}
                </span>
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '16px',
                      position: 'relative',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#D1D5DB';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#3B82F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#1F2937'
                          }}>
                            Review Comment #{index + 1}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#9CA3AF'
                          }}>
                            Review History
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        color: '#6B7280',
                        backgroundColor: '#F3F4F6',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}>
                        Comment {index + 1} of {comments.length}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      lineHeight: '1.6',
                      padding: '12px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      borderLeft: '3px solid #3B82F6'
                    }}>
                      {comment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}