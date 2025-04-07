const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// Root route - sends an HTML response for browser visibility
app.get('/', (req, res) => {
  res.send('<h1 style="font-family: sans-serif; color: green;">✅ Backend is working! 🚀</h1>');
});

// ✅ Import and use routes BEFORE the 404 fallback
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const documentRoutes = require('./routes/documentRoutes');
console.log('📂 Mounting /api/documents route');



app.use('/api/documents', documentRoutes);

const commentRoutes = require('./routes/commentRoutes');
console.log('Comment Routing');
app.use('/api/comments', commentRoutes);


const uploadRoutes = require('./routes/uploadRoutes');
console.log("Upload Routes");
app.use('/api', uploadRoutes);



// ❗ Place this last: 404 fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
const HOST = '127.0.0.1'; // Ensures consistent local behavior

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});
