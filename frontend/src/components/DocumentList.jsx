import React, { useEffect, useState } from "react";
import { 
  IconFileDownload, 
  IconMessage, 
  IconTrash, 
  IconCheck, 
  IconUser, 
  IconCalendar, 
  IconChevronDown, 
  IconChevronUp,
  IconFileText,
  IconCircleCheck
} from '@tabler/icons-react';

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  let currentUserId = null;
  try {
    const decoded = JSON.parse(atob(token?.split(".")[1]));
    currentUserId = decoded?.id;
  } catch (err) {
    console.error("Token decoding error:", err);
  }

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/documents`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (documentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${documentId}`);
      const data = await res.json(); 
      setCommentsMap((prev) => ({ ...prev, [documentId]: data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };
  
  const handlePostComment = async (documentId) => {
    if (!newComment.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${documentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            comment: newComment
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewComment("");
      fetchComments(documentId); 
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleApprove = (documentId) => {
    try {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === documentId ? { ...doc, status: "approved" } : doc
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to simulate document approval");
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
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <IconFileText className="text-blue-500" size={32} />
          Document Management
        </h2>
        <p className="text-gray-500">Review and manage uploaded documents</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-gray-500">Upload your first document to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 ${
                doc.status === 'approved' 
                  ? 'border-l-4 border-green-500 bg-green-50' 
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-semibold ${
                        doc.status === 'approved' ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {doc.title}
                      </h3>
                      {doc.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <IconCircleCheck size={14} />
                          Approved
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-3 mt-2">
                      <span className="flex items-center gap-1">
                        <IconUser size={14} />
                        {doc.uploader_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconCalendar size={14} />
                        {`Version ${doc.version}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2">
                    <div className="flex space-x-2">
                      <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/documents/${doc.id}/download`}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                          doc.status === 'approved'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconFileDownload size={16} />
                        Download
                      </a>
                      {doc.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(doc.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <IconCheck size={16} />
                          Approve
                        </button>
                      )}
                    </div>
                    {doc.status !== 'approved' && (
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => toggleComments(doc.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium rounded-md shadow-sm"
                        >
                          {expandedComments === doc.id ? (
                            <>
                              <IconChevronUp size={16} />
                              Hide Comments
                            </>
                          ) : (
                            <>
                              <IconMessage size={16} />
                              Comments
                            </>
                          )}
                        </button>

                        {(currentUserId === doc.uploader_id || currentUserId === doc.user_id || currentUserId === doc.user?._id) && (
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm bg-red-600 hover:bg-red-700 text-white"
                          >
                            <IconTrash size={16} />
                            Delete
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                {expandedComments === doc.id && doc.status !== 'approved' && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <IconMessage size={18} className="text-gray-400" />
                      Comments ({commentsMap[doc.id]?.length || 0})
                    </h4>

                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                      {commentsMap[doc.id]?.length > 0 ? (
                        commentsMap[doc.id].map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                {comment.username?.charAt(0).toUpperCase() || "U"}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1 bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-baseline">
                                <p className="text-sm font-medium text-gray-900 mr-2">{comment.username || "User"}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleString()}
                                </p>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No comments yet. Be the first to comment!
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <input
                        type="text"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePostComment(doc.id)}
                      />
                      <button
                        onClick={() => handlePostComment(doc.id)}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentList;