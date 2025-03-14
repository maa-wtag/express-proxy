// Required dependencies
// npm install express http-proxy-middleware

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware for logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Proxy middleware options
const apiProxyOptions = {
  target: "https://api.example.com", // Target API
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    "^/api": "", // Remove /api prefix when forwarding
  },
  headers: {
    "X-Forwarded-Host": "localhost:3000",
  },
  // Handle proxy errors
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error occurred");
  },
  // Modify the response before sending back to client (optional)
  onProxyRes: (proxyRes, req, res) => {
    // Example: Add custom header to the response
    proxyRes.headers["X-Proxied-By"] = "Express-Proxy";
  },
  // Log proxy activity (optional)
  logLevel: "silent", // Change to 'debug' for troubleshooting
};

// Proxy all requests starting with /api to the target
app.use("/api", createProxyMiddleware(apiProxyOptions));

// Multiple proxy endpoints example:
// Proxy requests to a different API
const secondApiProxy = createProxyMiddleware({
  target: "https://another-api.example.com",
  changeOrigin: true,
  pathRewrite: {
    "^/second-api": "/v2", // Rewrite /second-api to /v2
  },
});
app.use("/second-api", secondApiProxy);

// WebSocket proxy example (if needed)
const wsProxy = createProxyMiddleware({
  target: "ws://websocket.example.com",
  ws: true, // Enable WebSocket proxying
  changeOrigin: true,
});
app.use("/socket", wsProxy);

// Serve static content (optional)
app.use(express.static("public"));

// Routes not proxied will be handled by Express
app.get("/", (req, res) => {
  res.send("Express Proxy Server is running");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

// ------- Advanced Configuration Options -------

/*
// HTTPS proxy setup
const https = require('https');
const fs = require('fs');

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(httpsOptions, app).listen(443, () => {
  console.log('HTTPS proxy server running on port 443');
});
*/

/*
// Rate limiting example (requires express-rate-limit package)
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Apply rate limiter to API endpoints
app.use('/api/', apiLimiter);
*/

/*
// Authentication before proxying (example)
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.VALID_API_KEY) {
    return res.status(401).send('Unauthorized');
  }
  
  next(); // Continue to proxy if authenticated
}, createProxyMiddleware(apiProxyOptions));
*/

// Export app for testing purposes
module.exports = app;
