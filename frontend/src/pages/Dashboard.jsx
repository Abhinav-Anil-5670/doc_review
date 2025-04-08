import React from 'react';
import FileUpload from '../components/FileUpload';
import DocumentList from '../components/DocumentList';

function Dashboard() {
  return (
    <div className="p-6 w-screen mx-auto bg-slate-100">
      <h1 className="text-2xl font-bold text-center mt-6">Document Repository</h1>
      <FileUpload />
      <DocumentList />
    </div>
  );
}

export default Dashboard;
