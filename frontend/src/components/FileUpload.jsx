import React, { useRef, useState } from 'react';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef();

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !fileName) {
      setMessage('Please enter a file name and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', fileName);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'File uploaded successfully!');
        setFile(null);
        setFileName('');
        fileInputRef.current.value = '';

        // Notify DocumentList to refresh
        window.dispatchEvent(new Event('documentUploaded'));
      } else {
        setMessage(data.message || 'Upload failed');
      }
    } catch (err) {
      setMessage('Error uploading file');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Upload a Document</h2>

      <input
        type="text"
        placeholder="Enter a file name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
      />

      <input
        type="file"
        onChange={handleChange}
        ref={fileInputRef}
        className="hidden"
        id="hiddenFileInput"
      />

      <label
        htmlFor="hiddenFileInput"
        className="inline-block cursor-pointer px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 mb-2"
      >
        {file ? 'Change File' : 'Choose File'}
      </label>

      {file && <p className="text-sm text-gray-600 mb-4">{file.name}</p>}

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Upload
      </button>

      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}

export default FileUpload;
