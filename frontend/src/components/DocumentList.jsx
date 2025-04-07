import React, { useEffect, useState } from "react";
import axios from "axios";

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [newComment, setNewComment] = useState("");
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
      if (res.ok && Array.isArray(data)) {
        setDocuments(data);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  const fetchComments = async (documentId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/comments/${documentId}`
      );
      setCommentsMap((prev) => ({ ...prev, [documentId]: res.data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handlePostComment = async (documentId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/${documentId}`,
        {
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      fetchComments(documentId); // Refresh after posting
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const toggleComments = (docId) => {
    if (expandedComments === docId) {
      setExpandedComments(null);
    } else {
      setExpandedComments(docId);
      fetchComments(docId);
    }
  };

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document and all its data?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      alert(data.message);
      fetchDocuments(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
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
            <li key={doc.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{doc.title}</p>
                  <div className="text-sm text-gray-500">
                    <p>Uploaded by: {doc.uploader_name}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/documents/${doc.id}/download`}
                    className="text-green-600 font-medium hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>

                  <button
                    onClick={() => toggleComments(doc.id)}
                    className="text-blue-600 text-sm underline"
                  >
                    {expandedComments === doc.id ? "Hide Comments" : "Comments"}
                  </button>

                  {(currentUserId === doc.uploader_id || currentUserId === doc.user_id || currentUserId === doc.user?._id) && (
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 text-sm underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {expandedComments === doc.id && (
                <div className="mt-3 bg-gray-100 p-3 rounded">
                  <h4 className="font-semibold text-sm mb-2">Comments</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 mb-2">
                    {commentsMap[doc.id]?.length > 0 ? (
                      commentsMap[doc.id].map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-white px-2 py-1 rounded shadow-sm"
                        >
                          <p className="text-sm">
                            <strong>{comment.username || "User"}</strong>:{" "}
                            {comment.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No comments yet.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-grow p-1 border rounded text-sm"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      onClick={() => handlePostComment(doc.id)}
                      className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentList;
