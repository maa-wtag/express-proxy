const express = require("express");
const axios = require("axios");

const app = express();

app.use("/api", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `https://api.example.com${req.url}`,
      data: req.body,
      headers: {
        "Content-Type": req.headers["content-type"],
      },
      responseType: "stream",
    });

    response.data.pipe(res);
  } catch (error) {
    res.status(500).send({ error: "Proxy request failed" });
  }
});

// Configure Express to trust the proxy
app.set("trust proxy", true); // For simple setups// Or for more control:
app.set("trust proxy", "loopback, 123.123.123.123"); // Trust specific IPs/ranges

// Instead of configuring CORS, proxy the requests
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://external-api.example.com",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // Remove the /api prefix when forwarding
    },
  })
);

app.listen(3000);
