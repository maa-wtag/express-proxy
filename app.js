const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Set up the proxy for routes starting with /api
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://example.com", // Replace with your target server
    changeOrigin: true, // For virtual hosted sites, this helps modify the origin header to the target URL
    pathRewrite: {
      "^/api": "", // Optionally remove the /api prefix when forwarding the request
    },
    // You can add more options here if needed
  })
);

const proxyOptionsWithHeaders = {
  target: "http://api.example.com",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
  onProxyReq: (proxyReq, req) => {
    // Add a custom header to the outgoing proxy request
    proxyReq.setHeader("X-Custom-Proxy-Header", "Value from Proxy");
    // You can also modify the request body here if needed
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add a custom header to the response coming back from the proxy
    proxyRes.headers["X-Proxy-Response-Header"] = "Processed by Proxy";
    // You can also modify the response body here (more complex, requires buffering and parsing)
  },
};

const apiProxyWithHeaders = createProxyMiddleware(
  "/api",
  proxyOptionsWithHeaders
);
app.use("/api", apiProxyWithHeaders);

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
