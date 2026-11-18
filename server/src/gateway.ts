import http from "http";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
});

proxy.on("error", (err, req, res) => {
  console.warn("Proxy routing warning:", err.message);
  if (res && "writeHead" in res && !res.headersSent) {
    (res as http.ServerResponse).writeHead(502, { "Content-Type": "text/plain" });
    (res as http.ServerResponse).end("Bad Gateway - Rehmat Health Care Service starting up");
  }
});

const server = http.createServer((req, res) => {
  const url = req.url || "/";
  if (url.startsWith("/api") || url.startsWith("/socket.io")) {
    proxy.web(req, res, { target: "http://127.0.0.1:5000" });
  } else {
    proxy.web(req, res, { target: "http://127.0.0.1:3000" });
  }
});

server.on("upgrade", (req, socket, head) => {
  const url = req.url || "/";
  if (url.startsWith("/socket.io")) {
    proxy.ws(req, socket, head, { target: "http://127.0.0.1:5000" });
  } else {
    proxy.ws(req, socket, head, { target: "http://127.0.0.1:3000" });
  }
});

const PORT = 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Unified HTTPS Gateway running on port ${PORT}`);
  console.log(`   ├─ /api & /socket.io -> http://127.0.0.1:5000 (with WebSockets)`);
  console.log(`   └─ Pages & Next.js   -> http://127.0.0.1:3000`);
});
