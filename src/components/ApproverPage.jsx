import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApproverNavbar from './Approver/ApproverNavbar';
import ApproverStatsCard from './Approver/ApproverStatsCard';
import ApproverHeader from './Approver/ApproverHeader';
import ApproverSearchFilter from './Approver/ApproverSearchFilter';
import ApproverDocumentTable from './Approver/ApproverDocumentTable';
import ViewApprovalModal from './Approver/ViewApprovalModal';
import Footer from './Footer';

function ApproverPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [view, setView] = useState('list');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fetch Approver Documents
  const fetchDocuments = async () => {
    setLoading(true);
     await new Promise((resolve) => setTimeout(resolve, 1300));
    try {
      const res = await fetch('http://localhost:9191/approve/me', {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        throw new Error('Failed to fetch approver documents');
      }

      const data = await res.json();
      const mappedDocs = data.map((doc) => ({
        ...doc,
        status:
          doc.status === 'FORWARDED'
            ? 'Pending Approval'
            : doc.status === 'APPROVED'
            ? 'Approved'
            : doc.status === 'APPROVER_REJECTED'
            ? 'Rejected'
            : doc.status,
      }));



      setDocuments(mappedDocs);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch approver documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchDocuments();
    
  }, []);

  // ✅ Stats
  const stats = {
    pending: documents.filter((d) => d.status === 'Pending Approval').length,
    approved: documents.filter((d) => d.status === 'Approved').length,
    rejected: documents.filter((d) => d.status === 'Rejected').length,
  };

  // ✅ Search and Filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      (doc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.submitterName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.forwardedBy || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Status' || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:9191/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  // ✅ Modal Handlers
  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  const handleCloseModal = async () => {
    setShowViewModal(false);
    setSelectedDocument(null);
    await fetchDocuments(); 
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <ApproverNavbar onLogout={handleLogout} />

      <div style={{ padding: '30px 130px' }}>
        <ApproverHeader />

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <ApproverStatsCard label="Pending Approvals" count={stats.pending} variant="pending" />
          <ApproverStatsCard label="Approved" count={stats.approved} variant="approved" />
          <ApproverStatsCard label="Rejected" count={stats.rejected} variant="rejected" />
        </div>

        {/* Search and Filter */}
        <ApproverSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          view={view}
          onViewChange={setView}
        />

        {/* Documents Table */}
        <ApproverDocumentTable
          documents={filteredDocuments}
          onViewDocument={handleViewDocument}
        />
        <div  style={{display:'flex',justifyContent:'center',alignItems:'center'}}>

        {loading && <img src='https://i.pinimg.com/originals/9f/97/18/9f97187c5333792fe39ed8df9d61a9f7.gif' style={{height:'200px', width:'200px',marginTop:'50px'}} alt='Loding....'></img>}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* View Approval Modal */}
      {showViewModal && selectedDocument && (
        <ViewApprovalModal
          doc={selectedDocument}
          onClose={handleCloseModal}
          onUpload={async()=>{
            await fetchDocuments();
          }}
        />
      )}
      <div>
      </div>
      <Footer />
    </div>
  );
}
export default ApproverPage;
