require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const compression = require('compression');
const apiRouter = require('./routes/api');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable X-Powered-By
app.disable('x-powered-by');

// Performance: Enable Gzip / Deflate compression
app.use(compression({
  threshold: 1024 // Only compress responses > 1KB
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', apiRouter);
app.use('/api', contactRouter);

// Serve Frontend Static Files with high-performance Cache-Control headers
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    // Cache control: no-cache in dev so edits reflect instantly, immutable in production
    if (process.env.NODE_ENV === 'production' && /\.(css|js|woff2?|png|jpg|jpeg|svg|webp|ico|pdf)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Fallback route for SPA or direct page access
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Gazi Fahim Hasan Portfolio Server is LIVE!`);
  console.log(`🌐 Website URL:  http://localhost:${PORT}`);
  console.log(`📡 API Health:   http://localhost:${PORT}/api/health`);
  console.log(`📊 Profile API:  http://localhost:${PORT}/api/profile`);
  console.log('====================================================');
});

module.exports = app;
