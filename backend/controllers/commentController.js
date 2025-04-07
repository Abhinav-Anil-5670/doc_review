const pool = require('../config/db');

const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment } = req.body;
    const { documentId } = req.params;

    if (!documentId || !comment) {
      return res.status(400).json({ message: 'Document ID and comment text are required.' });
    }

    const result = await pool.query(
      'INSERT INTO comments (user_id, document_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [userId, documentId, comment]
    );

    res.status(201).json({ message: 'Comment added!', comment: result.rows[0] });

  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { documentId } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.name AS username
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.document_id = $1 
       ORDER BY c.created_at ASC`,
      [documentId]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
};

module.exports = { addComment, getComments };
