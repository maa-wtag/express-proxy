const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

// Proxy requests to '/proxy' to Google
app.use("/proxy", proxy("www.google.com"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.use(
  "/api",
  proxy("www.example.org", {
    userResDecorator: function (proxyRes, proxyResData) {
      // Modify response data// This will cause the response to be buffered
      const data = JSON.parse(proxyResData.toString("utf8"));
      data.extra = "Additional information";
      return JSON.stringify(data);
    },
  })
);

function selectProxyHost() {
  return new Date().getTime() % 2
    ? "http://service-a.example.com"
    : "http://service-b.example.com";
}

app.use("/api", proxy(selectProxyHost));

app.use(
  "/api",
  proxy("example.org", {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      return new Promise(function (resolve, reject) {
        // Async operation to determine proxy request options
        someAsyncOperation()
          .then(function (result) {
            proxyReqOpts.headers["X-Custom"] = result;
            resolve(proxyReqOpts);
          })
          .catch(function (error) {
            reject("Failed to set proxy request options: " + error);
          });
      });
    },
  })
);
