const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

const uploadDocument = async (req, res) => {
  try {
    const userId = req.user?.id;
    const title = req.body?.title || 'Untitled';

    if (!req.file) {
      return res.status(400).json({ message: 'File is required for upload.' });
    }

    // const filePath = req.file.path;
    //const file_path = path.join('uploads', req.file.path); 
    const file_path =  req.file.path;

    const fileName = req.file.filename;

    const existing = await pool.query(
      'SELECT * FROM documents WHERE user_id = $1 AND title = $2 ORDER BY version DESC LIMIT 1',
      [userId, title]
    );

    let version = 1;
    if (existing.rows.length > 0) {
      version = existing.rows[0].version + 1;
    }

    const result = await pool.query(
      'INSERT INTO documents (user_id, title, filename, file_path, version) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, fileName, file_path, version]
    );

    res.status(201).json({ message: 'Document uploaded!', document: result.rows[0] });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

const getDocumentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const title = req.params.title;

    const result = await pool.query(
      `SELECT id, title, version, filename, file_path, uploaded_at
       FROM documents
       WHERE user_id = $1 AND title = $2
       ORDER BY version DESC`,
      [userId, title]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No versions found for this document.' });
    }

    res.status(200).json({ versions: result.rows });

  } catch (err) {
    console.error('Version history error:', err);
    res.status(500).json({ message: 'Failed to retrieve version history', error: err.message });
  }
};

const downloadDocument = async (req, res) => {
  const documentId = req.params.id;
  


  try {
    const result = await pool.query('SELECT * FROM documents WHERE id = $1', [documentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const document = result.rows[0];
    const filePath = path.resolve(__dirname, '..', document.file_path.replace(/^\/+/, ''));

    const filename = document.filename;
    console.log("📦 Stored path in DB:", document.file_path);
    console.log("🛠️ Resolved absolute path:", path.resolve(__dirname, '..', document.file_path));
    



    res.download(filePath, filename);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Failed to download document', error: err.message });
  }
};

module.exports = {
  uploadDocument,
  getDocumentHistory,
  downloadDocument // ✅ Export it here
};
