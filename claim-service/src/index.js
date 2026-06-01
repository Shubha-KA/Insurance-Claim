require('dotenv').config();
const express = require('express');
const cors = require('cors');
const claimRoutes = require('./routes/claims');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'claim-service' });
});

// Routes
app.use('/claims', claimRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Claim Service running on port ${PORT}`);
});
