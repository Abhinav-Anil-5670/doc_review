const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/authMiddleware');
const {
  uploadDocument,
  getDocumentHistory,
  downloadDocument
} = require('../controllers/documentController');
const authenticate = require('../middleware/authMiddleware');

router.get('/history/:title', authenticate, getDocumentHistory);

router.get('/test', (req, res) => {
  res.json({ message: 'Document route working!' });
});

router.post('/upload', verifyToken, upload.single('file'), uploadDocument);

// Public Route: Download document by ID (No token needed)
router.get('/:id/download', downloadDocument);

module.exports = router;
