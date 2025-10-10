import { useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";

export default function EditDocument({ doc, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: doc?.title || "",
    description: doc?.description || "",
    file: null,
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (action) => {
    if (!formData.title || !formData.description) {
      setMessage("⚠️ Please fill title and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("action", action);
      if (formData.file) {
        data.append("file", formData.file);
      }

      const response = await axios.put(
        `http://localhost:9191/submit/${doc.id}/update`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage(
        ` Document ${action === "submit" ? "submitted" : "saved as draft"} successfully!`
      );
      console.log("Update response:", response.data);

      // Notify parent to refresh
      if (onSubmit) onSubmit();

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setMessage("");
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("❌ Failed to update doc.");
      setIsSubmitting(false);
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
        overflow: "auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "700px",
          maxHeight: "90vh",
          overflow: "auto",
          margin: "auto",
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: "24px", borderBottom: "1px solid #E5E7EB" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
              color: "#1F2937",
            }}
          >
            Edit Document
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {/* Document Info */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: "8px",
              }}
            >
              Document Information
            </h3>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
              Update the details below to modify your doc
            </p>
          </div>

          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Document Title *
            </label>
            <input
              type="text"
              placeholder="Enter doc title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
                backgroundColor: "#F9FAFB",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Description *
            </label>
            <textarea
              placeholder="Enter doc description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
                backgroundColor: "#F9FAFB",
              }}
            />
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              File Upload
            </label>
            <div
              style={{
                border: "2px dashed #D1D5DB",
                borderRadius: "8px",
                padding: "40px",
                textAlign: "center",
                backgroundColor: "#F9FAFB",
              }}
            >
              {!formData.file ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "#E5E7EB",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FileText size={24} color="#6B7280" />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#1F2937",
                        }}
                      >
                        {doc?.fileName ||
                          `${doc?.title}.file`}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        Current file (upload new file to replace)
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#DBEAFE",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FileText size={24} color="#27cc5bff" />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F2937",
                      }}
                    >
                      {formData.file.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#059669" }}>
                      New file selected ✓
                    </div>
                  </div>
                </div>
              )}

              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,jpg,.png,.ppt,.jpeg"
                style={{ display: "none" }}
                id="editFileInput"
                
              />
              <label htmlFor="editFileInput">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("editFileInput").click()
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "white",
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Browse Files
                </button>
              </label>
            </div>
          </div>

          {message && (
            <p
              style={{
                fontSize: "14px",
                color: message.startsWith("✅") ? "#059669" : "#DC2626",
                marginTop: "10px",
              }}
            >
              {message}
            </p>
          )}

       {doc.reviewComments && (
              doc.reviewComments.map((comment, index) => (
                <div key={index}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280',marginBottom: '4px' }}>Review Comment {index + 1}</label>
              <div style={{ gridColumn: '1 / -1' }}>
               
                <div style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '14px',
                  color: '#1F2937'
                }}>
                  {comment}
                </div>
              </div>
                </div>
              ))
            )}
        </div>




        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              backgroundColor: "white",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              opacity: 0.9,
              color: "#374151",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              backgroundColor: "white",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              opacity: 0.9,
              color: "#374151",
            }}
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit("submit")}
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              opacity: 0.9,
              color: "white",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
