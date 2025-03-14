const express = require("express");
const bodyParser = require("body-parser");
const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");

const app = express();

// Apply body-parser for your API routes
app.use("/local-api", bodyParser.json());

// For proxied routes, either:// 1. Don't use body-parser before the proxy
app.use(
  "/remote-api",
  createProxyMiddleware({
    target: "http://api.example.com",
  })
);

// OR 2. Fix the request body if body-parser must be used
app.use(bodyParser.json()); // Apply body-parser globally
app.use(
  "/remote-api",
  createProxyMiddleware({
    target: "http://api.example.com",
    on: {
      proxyReq: fixRequestBody, // Fix proxied POST requests
    },
  })
);

app.listen(3000);
