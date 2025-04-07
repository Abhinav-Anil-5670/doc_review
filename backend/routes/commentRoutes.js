const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { addComment, getComments } = require('../controllers/commentController');

router.post('/:documentId', verifyToken, addComment);
router.get('/:documentId', getComments);

module.exports = router;
