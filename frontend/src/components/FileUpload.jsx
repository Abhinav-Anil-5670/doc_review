import React, { useRef, useState } from 'react';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    // Basic validation
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setMessage('File size must be less than 10MB');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    if (!fileName.trim()) {
      setMessage('Please enter a file name');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', fileName.trim());

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/documents/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setMessage(data.message || 'File uploaded successfully!');
      setFile(null);
      setFileName('');
      fileInputRef.current.value = '';
      window.dispatchEvent(new Event('documentUploaded'));
    } catch (err) {
      setMessage(err.message || 'Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Upload a Document</h2>

      <div className="mb-4">
        <label htmlFor="fileNameInput" className="block text-sm font-medium text-gray-700 mb-1">
          File Name *
        </label>
        <input
          id="fileNameInput"
          type="text"
          placeholder="Enter a descriptive name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="hiddenFileInput" className="block text-sm font-medium text-gray-700 mb-1">
          File *
        </label>
        <input
          type="file"
          onChange={handleChange}
          ref={fileInputRef}
          className="hidden"
          id="hiddenFileInput"
          required
        />
        <label
          htmlFor="hiddenFileInput"
          className="inline-block cursor-pointer px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
        >
          {file ? 'Change File' : 'Choose File'}
        </label>
        {file && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={isLoading || !file || !fileName.trim()}
        className={`w-full px-4 py-2 rounded text-white ${
          isLoading || !file || !fileName.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <p className={`mt-4 text-center ${
          message.includes('success') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default FileUpload;