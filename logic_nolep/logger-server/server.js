const http = require("http"); //untuk membuat server
const fs = require("fs").promises; //operasi file async atau await
const path = require("path"); //konsturksi path

const server = http.createServer(async (req, res) => {
  async function logRequest(req) {
    const timestamp = new Date().toISOString();
    const logData = `[${timestamp}] ${req.method} ${req.url} FROM ${req.socket.remoteAddress}\n`;

    const logPath = path.join(__dirname, "requests.log");

    try {
      await fs.appendFile(logPath, logData);
    } catch (error) {
      console.error("Logging error:", error);
    }
  }

  server.on("request", async (req, res) => {
    // Jalankan logging tanpa menunggu
    logRequest(req);

    // Handle response
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Home Page");
    } else {
      res.writeHead(404);
      res.end("Page Not Found");
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
