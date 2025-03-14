const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const apiProxy = httpProxy.createProxyServer({
  target: "http://localhost:3000",
});

app.all("/api/*", function (req, res) {
  apiProxy.web(req, res, { target: "http://localhost:8000" });
});

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
