import { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
export default function UploadDocument({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [message, setMessage] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };
  const handleSubmit = async (action) => {
    if (!formData.file || !formData.title || !formData.description) {
      setMessage(" Please fill all required fields and upload a file.");
      return;
    }
    const data = new FormData();
    data.append("file", formData.file);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("action", action);
    try {
      const response = await axios.post(
        "http://localhost:9191/submit/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setMessage(` Document ${action === "submit" ? "submitted" : "saved as draft"} successfully!`);
      console.log("Upload response:", response.data);
      if (onSubmit) {
        onSubmit();
      }
      setFormData({ title: "", description: "", file: null });
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(" Failed to upload document.");
    }
  };
  if (!isOpen) return null;
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
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "600px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
            <div style={{ padding: "24px", borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#1F2937" }}>
            Upload New Document
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
              Fill in the details below to create a new document
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
              placeholder="Enter document title"
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
              placeholder="Enter document description"
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
              File Upload *
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
              <div style={{ fontSize: "40px", marginBottom: "12px" }}><Upload  size={40}/></div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  margin: "0 0 8px 0",
                }}
              >
                Drag and drop your file here, or click to browse
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  margin: "0 0 16px 0",
                }}
              >
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, JPG, PNG, JPEG
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,jpg,.png,.ppt,.jpeg"
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("fileInput").click()
                  }
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
              {formData.file && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#059669",
                    marginTop: "12px",
                  }}
                >
                  Selected: {formData.file.name}
                </p>
              )}
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
        </div>
        
        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button  style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              opacity:  0.9 ,
              color: '#374151',
      
            }} onClick={onClose}>Cancel</button>
          <button  style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              opacity:  0.9 ,
              color: '#374151',         
            } }  
            onClick={() => handleSubmit("draft")}>Save Draft</button>
          <button  style={{
              padding: '10px 20px',
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
            cursor: 'pointer',
              opacity: 0.9 ,
              color: 'white',         
            }} onClick={() => handleSubmit("submit")}>Submit for Review</button>
        </div>
      </div>
    </div>
  );
}
