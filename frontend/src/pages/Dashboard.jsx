import React from 'react';
import FileUpload from '../components/FileUpload';
import DocumentList from '../components/DocumentList';

function Dashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mt-6">Welcome to the Dashboard!</h1>
      <FileUpload />
      <DocumentList />
    </div>
  );
}

export default Dashboard;
