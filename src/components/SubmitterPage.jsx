import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Submitter/Navbar';
import Hero from './Submitter/Hero';
import SearchFilter from './Submitter/SearchFilter';
import DocumentTable from './Submitter/DocumentTable';
import UploadDocument from './Submitter/UploadDocument';
import ViewDocument from './Submitter/ViewDocument';
import EditDocument from './Submitter/EditDocument';
import DeleteDocumentModal from './Submitter/DeleteDocumentModal';
import Footer from './Footer';

function SubmitterPage() {
  const navigate = useNavigate();

  // --- State Management ---
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [view, setView] = useState('list');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewMode, setViewMode] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [documentToDelete, setDocumentToDelete] = useState(null);


  // --- Fetch Documents ---
  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
     await new Promise((resolve) => setTimeout(resolve, 1300));
    try {
      const res = await fetch('http://localhost:9191/submit/my', {
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      
       const mappedDocs = data.map((doc) => ({
      ...doc,
      status: doc.status === 'APPROVER_REJECTED' ? 'REJECTED' : doc.status
    }));

    setDocuments(mappedDocs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // --- Document Stats ---
  const stats = {
    total: documents.length,
    drafts: documents.filter(d => d.status === 'DRAFT').length,
    submitted: documents.filter(d => d.status === 'SUBMITTED').length,
    underReview: documents.filter(d => d.status === 'FORWARDED').length,
    reupload: documents.filter(d => d.status === 'CHANGES_REQUESTED').length,
    approved: documents.filter(d => d.status === 'APPROVED').length,
    rejected: documents.filter(d => d.status === 'REJECTED').length 
  };

  // --- Filtering ---
  const filteredDocuments = documents.filter(doc => {
    const title = doc.title || '';
    const filename = doc.filename || '';
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Logout ---
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:9191/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  // Upload Submit 
  const handleUploadSubmit = async () => {
    setShowUploadModal(false);
    await fetchDocuments(); // refresh after upload
  };

  const handleEditSubmit = async () => {
    setViewMode(null);
    setSelectedDocument(null);
    await fetchDocuments();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Navbar onLogOut={() => handleLogout()} />

      <Hero
        stats={stats}
        onUploadClick={() => setShowUploadModal(true)}
      />

      <div style={{ margin: '0 130px 30px 130px' }}>
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          view={view}
          onViewChange={setView}
        />

        {loading ? (
          <div  style={{display:'flex',justifyContent:'center',alignItems:'center'}}>

        {loading && <img src='https://i.pinimg.com/originals/9f/97/18/9f97187c5333792fe39ed8df9d61a9f7.gif' style={{height:'200px', width:'200px',marginTop:'50px'}} alt='Loding....'></img>}
        </div>
        ) : error ? (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        ) : (
          <DocumentTable
            documents={filteredDocuments}
            onView={doc => {
              setSelectedDocument(doc);
              setViewMode('view');
            }}
            onEdit={doc => {
              setSelectedDocument(doc);
              setViewMode('edit');
            }}
            onDelete={doc => {
              setDocumentToDelete(doc);
              setShowDeleteModal(true);
            }}
          />
        )}
      </div>

      {/* Upload Modal */}
      <UploadDocument
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadSubmit}
      />

      {/* View Modal */}
      {viewMode === 'view' && selectedDocument && (
        <ViewDocument
          doc={selectedDocument}
          onClose={() => {
            setSelectedDocument(null);
            setViewMode(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {viewMode === 'edit' && selectedDocument && (
        <EditDocument
          doc={selectedDocument}
          onClose={() => {
            setSelectedDocument(null);
            setViewMode(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}
      {/* Delete Modal */}
      {showDeleteModal && documentToDelete && (
        <DeleteDocumentModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          doc={documentToDelete}
          onDeleteSuccess={async () => {
            console.log("Deleted doc:", documentToDelete);
            setDocumentToDelete(null);
            setShowDeleteModal(false);
           await fetchDocuments();
          }}
        />
      )}
      <Footer />
    </div>
  );
}

export default SubmitterPage;
