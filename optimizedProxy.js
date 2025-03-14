const compression = require("compression");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Apply compression before proxying
app.use(compression());

// Configure caching headers
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://api.example.com",
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
      // Add caching headers if not present
      if (!proxyRes.headers["cache-control"]) {
        proxyRes.headers["cache-control"] = "public, max-age=300"; // Cache for 5 minutes
      }
    },
  })
);

app.listen(3000);
