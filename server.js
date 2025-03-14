const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const port = 3000; // or your desired port

// Define your proxy options
const proxyOptions = {
  target: "http://api.example.com", // Target service URL (the API you want to proxy to)
  changeOrigin: true, // for vhosts, modify the origin of the request
  pathRewrite: {
    "^/api": "", // rewrite path: remove '/api' prefix when forwarding to target
  },
};

// Create the proxy middleware
const apiProxy = createProxyMiddleware("/api", proxyOptions);

// Mount the proxy middleware
app.use("/api", apiProxy);

// Your other Express routes and middleware can go here

app.get("/", (req, res) => {
  res.send("Express Proxy Server is running!");
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
