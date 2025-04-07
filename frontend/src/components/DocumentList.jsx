import React, { useEffect, useState } from "react";

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const token = localStorage.getItem("token");

  let currentUserId = null;
  try {
    const decoded = JSON.parse(atob(token?.split(".")[1]));
    currentUserId = decoded?.id;
  } catch (err) {
    console.error("Token decoding error:", err);
  }

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("📦 Documents response:", data); // Should be an array now

      if (res.ok && Array.isArray(data)) {
        setDocuments(data);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();

    const handleRefresh = () => {
      fetchDocuments();
    };

    window.addEventListener("documentUploaded", handleRefresh);

    return () => {
      window.removeEventListener("documentUploaded", handleRefresh);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Uploaded Documents
      </h2>

      {documents.length === 0 ? (
        <p className="text-center text-gray-500">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{doc.title}</p>
                <div className="text-sm text-gray-500">
                  <p>Uploaded by: {doc.uploader_name}</p>
                </div>
              </div>

              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/documents/${
                  doc.id
                }/download`}
                className="text-green-600 font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Optional: prevent broken download
                  // fetch and check status before allowing download
                }}
              >
                Download Document
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentList;
