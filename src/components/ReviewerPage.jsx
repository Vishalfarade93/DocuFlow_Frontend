import { useState, useEffect } from 'react';
import ReviewerNavbar from './Reviewer/Navbar';
import ReviewerSearchFilter from './Reviewer/ReviewerSearchFilter';
import ReviewerDocumentTable from './Reviewer/ReviewerDocumentTable';
import ReviewerStatsCard from './Reviewer/StatsCard';
import ReviewerHeader from './Reviewer/ReviewerHeader';
import { useNavigate } from 'react-router-dom';
import ViewDocumentModal from './Reviewer/ViewDocumentModal';
import Footer from './Footer';

export default function ReviewerPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    await new Promise((resolve) => setTimeout(resolve, 1300));

    try {
      const res = await fetch('http://localhost:9191/review/me', {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();

      // Map status values for frontend display
      const mappedDocs = data.map((doc) => ({
        ...doc,
        status:
          doc.status === 'SUBMITTED'
            ? 'Pending Review'
            : doc.status === 'CHANGES_REQUESTED'
            ? 'Changes Requested'
            : doc.status === 'FORWARDED'
            ? 'Forwarded'
            : doc.status === 'REJECTED'
            ? 'Rejected'
            : doc.status === 'APPROVED'
            ? 'Approved'
            : doc.status,
      }));

      setDocuments(mappedDocs);
    } catch (err) {
      console.error('Error fetching reviewer documents:', err);
      setError('Unable to fetch reviewer documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Stats 
  const stats = {
    pending: documents.filter((d) => d.status === 'Pending Review').length,
    changes: documents.filter((d) => d.status === 'Changes Requested').length,
    forwarded: documents.filter((d) => d.status === 'Forwarded').length,
    rejected: documents.filter((d) => d.status === 'Rejected').length,
  };

  // search and filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      (doc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.owner || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:9191/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  //  Handlers for modal
  const handleOpenModal = (doc) => {
    setSelectedDocument(doc);
    console.log(doc);
  };
  const handleCloseModal = () => setSelectedDocument(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <ReviewerNavbar onLogOut={handleLogout} />

      <div style={{ padding: '30px 130px' }}>
        <ReviewerHeader />

        {/* Stats Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <ReviewerStatsCard label="Pending Review" count={stats.pending} variant="pending" />
          <ReviewerStatsCard label="Changes Requested" count={stats.changes} variant="changes" />
          <ReviewerStatsCard label="Forwarded" count={stats.forwarded} variant="forwarded" />
          <ReviewerStatsCard label="Rejected" count={stats.rejected} variant="rejected" />
        </div>

        {/* Search & Filter */}
        <ReviewerSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/*  Loading & Error Handling */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading && (
              <img
                src="https://i.pinimg.com/originals/9f/97/18/9f97187c5333792fe39ed8df9d61a9f7.gif"
                style={{ height: '200px', width: '200px', marginTop: '50px' }}
                alt="Loading..."
              />
            )}
          </div>
        ) : error ? (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        ) : (
          <ReviewerDocumentTable
            documents={filteredDocuments}
            onViewDocument={handleOpenModal}
          />
        )}
      </div>

      {/*  View Modal */}
      {selectedDocument && (
        <ViewDocumentModal
          doc={selectedDocument}
          onClose={handleCloseModal}
          onUpload={async () => {
            handleCloseModal();
            await fetchDocuments();
          }}
        />
      )}
      <Footer />
    </div>
  );
}
