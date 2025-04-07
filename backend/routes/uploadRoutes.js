const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const pool = require('../config/db');
const router = express.Router();

// ✅ Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ✅ Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Upload Document with Versioning
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  const { name } = req.body;
  const filePath = `/uploads/${req.file.filename}`;
  const userId = req.user.id;

  if (!req.file || !name) {
    return res.status(400).json({ message: 'Missing file or document title' });
  }

  try {
    const existing = await pool.query(
      'SELECT MAX(version) AS max_version FROM documents WHERE title = $1 AND user_id = $2',
      [name, userId]
    );

    const currentVersion = existing.rows[0].max_version || 0;
    const newVersion = currentVersion + 1;

    await pool.query(
      `INSERT INTO documents (title, filename, file_path, user_id, version) 
       VALUES ($1, $2, $3, $4, $5)`,
      [name, req.file.originalname, filePath, userId, newVersion]
    );

    res.status(200).json({ message: 'File uploaded successfully', filePath, version: newVersion });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// ✅ Get All Documents
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.id, d.title, d.filename, d.file_path, d.version, d.user_id, u.name AS uploader_name
       FROM documents d
       JOIN users u ON d.user_id = u.id
       ORDER BY d.id DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error fetching documents' });
  }
});


// ✅ Delete a Document (soft delete can be added later)
router.delete('/documents/:id', authenticateToken, async (req, res) => {
  const docId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM documents WHERE id = $1 AND user_id = $2 RETURNING *',
      [docId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: 'Not authorized or file not found' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error deleting document' });
  }
});

module.exports = router;
