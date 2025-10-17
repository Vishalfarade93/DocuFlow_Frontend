import axios from "axios";
import {
  X,
  Download,
  FileText,
  User,
  Calendar,
  MessageSquare,
  Send,
  XCircle,
  RefreshCw,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function ViewDocumentModal({ doc, onClose, onUpload }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // Ensure comments are an array, handle string from backend if needed
  let comments = [];
  if (Array.isArray(doc?.reviewComments)) {
    comments = doc.reviewComments;
  } else if (
    typeof doc?.reviewComments === "string" &&
    doc.reviewComments.trim().length > 0
  ) {
    comments = [doc.reviewComments];
  }

  if (!doc) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING REVIEW":
        return { bg: "#DBEAFE", text: "#1E40AF" };
      case "CHANGES REQUESTED":
      case "CHANGES_REQUESTED":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "FORWARDED":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "REJECTED":
        return { bg: "#FEE2E2", text: "#991B1B" };
      case "APPROVED":
        return { bg: "#DCFCE7", text: "#166534" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  const statusColors = getStatusColor(doc.status);
  const isPending = doc.status?.toUpperCase() === "PENDING REVIEW";

  // Handle submit action
  const handleSubmit = async (action) => {
    if (!comment.trim()) {
    setError("* Comment is required.");
      return;
    }

    const data = new FormData();
    data.append("action", action);
    data.append("comment", comment);

    try {
      const response = await axios.put(
        `http://localhost:9191/review/${doc.id}/forward`,
        data,
        { withCredentials: true }
      );

      console.log (response.data.message || "Action submitted successfully!");
      setComment("");
      onClose();
      if (onUpload) onUpload();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }

 

  };
   const handleDownload = async () => {
  try {
    const response = await fetch(`http://localhost:9191/review/${doc.id}/download`, {
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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "900px",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            backgroundColor: "#F9FAFB",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#1F2937",
                }}
              >
                {doc.title}
              </h2>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: statusColors.bg,
                  color: statusColors.text,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {doc.status?.replace("_", " ")}
              </span>
            </div>

            {doc.description && (
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "14px",
                  color: "#6B7280",
                  lineHeight: "1.5",
                }}
              >
                {doc.description}
              </p>
            )}
            <p
              style={{
                margin: "6px 0 0 0",
                fontSize: "13px",
                color: "#9CA3AF",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FileText size={14} />
              {doc.fileName}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "8px",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#6B7280",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1F2937")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Info Section */}
          <div style={{ padding: "24px", borderBottom: "1px solid #E5E7EB" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "24px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  <User size={14} />
                  Submitted by
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1F2937",
                  }}
                >
                  {doc.owner || "Unknown"}
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  <Clock size={14} />
                  Submitted at
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1F2937",
                  }}
                >
                  {formatDate(doc.submittedAt) || "N/A"}
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  <Clock size={14} />
                  Last updated
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1F2937",
                  }}
                >
                  {formatDate(doc.updatedAt) || "N/A"}
                </div>
              </div>
              {doc.forwardedAt !== null && (
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      color: "#6B7280",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <Clock size={14} />
                    Forwarded At
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#1F2937",
                    }}
                  >
                    {formatDate(doc.forwardedAt) || "N/A"}
                  </div>
                </div>
              )}

              {doc.approvedBy && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  <User size={14} />
               Approved By
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1F2937",
                  }}
                >
                  <div style={{ color: "#555556ff", marginBottom: "4px" }}>{doc.approvedBy || "N/A"}</div>
                  {formatDate(doc.approvedAt) || "N/A"}
                </div>
              </div>
              )}


                      {doc.rejectedAt && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  <Clock size={14} />
               Rejected By
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1F2937",
                  }}
                >
                   <div style={{ color: "#555556ff", marginBottom: "4px" }}>{doc.rejectedBy || "N/A"}</div>
                  {formatDate(doc.rejectedAt) || "N/A"}
                </div>
              </div>
              )}

            </div>
          </div>

          {/* Download Section */}
           <div style={{ padding: "24px", borderBottom: "1px solid #E5E7EB" }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#6B7280",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Attached Document
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#E5E7EB",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FileText size={20} color="#6B7280" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F2937",
                    }}
                  >
                    {doc.fileName || `${doc.title}.pdf`}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>
                    {doc.fileSize
                      ? `${(doc.fileSize / 1024).toFixed(2)} KB`
                      : "Size unknown"}
                  </div>
                </div>
              </div>
              <button
               onClick={handleDownload}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  backgroundColor: "white",
                  border: "1px solid #D1D5DB",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "#374151",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F9FAFB";
                  e.currentTarget.style.borderColor = "#9CA3AF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                }}
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>
          {/* Comments Section - Enhanced */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "#FAFBFC",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1F2937",
                margin: "0 0 20px 0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <MessageSquare size={20} />
              Comments & Review History
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#6B7280",
                  backgroundColor: "#E5E7EB",
                  padding: "4px 10px",
                  borderRadius: "12px",
                }}
              >
                {comments.length}
              </span>
            </h3>

            {/* Comments List */}
            <div
              style={{
                minHeight: "100px",
                overflowY: "auto",
                marginBottom: "20px",
              }}
            >
              {comments.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {comments.map((c, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "10px",
                        padding: "16px",
                        position: "relative",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#D1D5DB";
                        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.07)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#E5E7EB";
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                      }}
                    >
                      {/* Comment Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#3B82F6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#1F2937",
                              }}
                            >
                              Review Comment #{index + 1}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#9CA3AF",
                              }}
                            >
                              Review History
                            </div>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#6B7280",
                            backgroundColor: "#F3F4F6",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontWeight: "500",
                          }}
                        >
                          Comment {index + 1} of {comments.length}
                        </span>
                      </div>

                      {/* Comment Body */}
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: "1.6",
                          padding: "12px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          borderLeft: "3px solid #3B82F6",
                        }}
                      >
                        {c}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "2px dashed #E5E7EB",
                  }}
                >
                  <MessageSquare
                    size={40}
                    color="#D1D5DB"
                    style={{ margin: "0 auto 12px", display: "block" }}
                  />
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontSize: "14px",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    No comments available yet.
                  </p>
                  <p
                    style={{
                      color: "#D1D5DB",
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Comments will appear here after review actions
                  </p>
                </div>
              )}
            </div>
                <div>
        {error && (
          <p
            style={{
              color: "#EF4444",
              fontSize: "14px",
              margin: 0,
              fontStyle: "italic",
              padding: "10px 0",
            }}
          >
            {error}
          </p>
        )}
      </div>
            {/* Add Comment Section */}
            {isPending && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "2px solid #3B82F6",
                  boxShadow: "0 2px 4px rgba(59, 130, 246, 0.1)",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: "10px",
                  }}
                >
                  <AlertCircle size={16} color="#3B82F6" />
                  Add Your Review Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Provide detailed feedback about the doc..."
                  rows={2}
                  style={{
                    width: "95%",
                    padding: "12px 14px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    resize: "vertical",
                    fontFamily: "inherit",
                    lineHeight: "1.5",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#3B82F6")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
                />
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    margin: "8px 0 0 0",
                  }}
                >
                  Your comment will be recorded with your review action
                </p>
              </div>
            )}

                  
          </div>
  
        </div>

        {/* Footer Buttons  */}
        <div
          style={{
            padding: "20px 24px",
            backgroundColor: "white",
            borderTop: "2px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "white",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              color: "#6B7280",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F9FAFB";
              e.currentTarget.style.borderColor = "#9CA3AF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.borderColor = "#D1D5DB";
            }}
          >
            Close
          </button>

          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {isPending ? (
              <>
                <button
                  onClick={() => handleSubmit("request_changes")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    backgroundColor: "white",
                    border: "2px solid #F59E0B",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    color: "#F59E0B",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FEF3C7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  <RefreshCw size={16} />
                  Request Changes
                </button>

                <button
                  onClick={() => handleSubmit("reject")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    backgroundColor: "white",
                    border: "2px solid #EF4444",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    color: "#EF4444",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FEE2E2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  <XCircle size={16} />
                  Reject
                </button>

                <button
                  onClick={() => handleSubmit("forward")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    backgroundColor: "#10B981",
                    border: "2px solid #10B981",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    color: "white",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#059669";
                    e.currentTarget.style.borderColor = "#059669";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#10B981";
                    e.currentTarget.style.borderColor = "#10B981";
                  }}
                >
                  <Send size={16} />
                  Forward
                </button>
              </>
            ) : (
              <p
                style={{
                  color: "#9CA3AF",
                  fontSize: "14px",
                  margin: 0,
                  fontStyle: "italic",
                  padding: "10px 0",
                }}
              >
                No actions available for this document
              </p>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}