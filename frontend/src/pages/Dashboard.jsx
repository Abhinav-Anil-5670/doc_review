import React from 'react';
import FileUpload from '../components/FileUpload';
import DocumentList from '../components/DocumentList';

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Upload New Documents</h2>
            <span className="text-sm text-gray-500">Max file size: 10MB</span>
          </div>
          <FileUpload />
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Documents</h2>
            <div className="mt-1 flex items-center">
              <span className="text-sm text-gray-500">Sorted by: Most recent</span>
              <button className="ml-2 text-blue-600 text-sm font-medium">Change</button>
            </div>
          </div>
          <DocumentList />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Document Repository. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;