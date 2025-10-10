import React, { useState } from "react";

export default function DeleteDocumentModal({ isOpen, onClose, doc, onDeleteSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !doc) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:9191/submit/${doc.id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete doc");
      }
      console.log("message from server:", await res.text());
     if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          width: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>
          Confirm Delete
        </h2>
        <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px" }}>
          Are you sure you want to delete <strong>{doc.title}</strong>? This action
          cannot be undone.
        </p>

        {error && (
          <p style={{ color: "red", marginBottom: "8px", fontSize: "13px" }}>{error}</p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "#E5E7EB",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "#EF4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
