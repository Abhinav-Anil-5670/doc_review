const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authenticate = require('../middleware/authMiddleware');

const {
  uploadDocument,
  getDocumentHistory,
  downloadDocument,
  deleteDocument
} = require('../controllers/documentController');

// ✅ Log that the file is loaded
console.log('✅ documentRoutes.js loaded');

// ✅ Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Document route working!' });
});

// ✅ Get document history (Authenticated)
router.get('/history/:title', authenticate, getDocumentHistory);

// ✅ Upload document (Authenticated, with file upload)
router.post('/upload', authenticate, upload.single('file'), uploadDocument);

// ✅ Public route: Download document
router.get('/:id/download', downloadDocument);

// ✅ Delete a document (Authenticated)
router.delete('/:documentId', authenticate, deleteDocument);

// ✅ Export the router LAST
module.exports = router;
