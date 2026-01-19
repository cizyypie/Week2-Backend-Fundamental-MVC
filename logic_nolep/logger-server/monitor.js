import os from "os";
import axios from "axios";
import { createServer } from 'http';
import { promises as fs } from 'fs';
import { join } from 'path';

let isMonitoring = false;

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  return `${days}d ${hours}h`;
}

async function logRequest(req) {
  const logData = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  try {
    await fs.appendFile(join(process.cwd(), "requests.log"), logData);
  } catch (err) {
    console.error("Log error:", err);
  }
}

const server = createServer(async (req, res) => {
  logRequest(req);

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("test aja");
  } else if (req.url === "/health") {
    const memory = {
      total: formatBytes(os.totalmem()),
      used: formatBytes(os.totalmem() - os.freemem()),
      free: formatBytes(os.freemem())
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(memory));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

async function checkServerHealth() {
  try {
    const response = await axios.get('http://localhost:3000/health');
    console.log('Server Health:', response.data);
  } catch (error) {
    console.error('Server unreachable');
  }
}

function startMonitoring(interval = 10000) {
  if (isMonitoring) return;
  isMonitoring = true;

  const timer = setInterval(() => {
    const stats = {
      uptime: formatUptime(os.uptime()),
      totalMem: formatBytes(os.totalmem()),
      usedMem: formatBytes(os.totalmem() - os.freemem()),
      freeMem: formatBytes(os.freemem()),
      loadAvg: os.loadavg().map(n => n.toFixed(2))
    };

    console.log(`
=== System Monitor ===
Uptime: ${stats.uptime}
Memory Usage:
  Total : ${stats.totalMem}
  Used  : ${stats.usedMem}
  Free  : ${stats.freeMem}
CPU Load (1, 5, 15m): [${stats.loadAvg.join(', ')}]
    `);

    // Auto-shutdown jika memory < 100MB
    if (os.freemem() < 100 * 1024 * 1024) {
      console.warn('Memory critical! Shutting down...');
      clearInterval(timer);
      server.close();
      process.exit(1);
    }
  }, interval);

  setInterval(checkServerHealth, 15000);

  return timer;
}

try {
  const monitor = startMonitoring();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(monitor);
    console.log('Monitoring stopped');
    server.close();
    process.exit();
  });
} catch (error) {
  console.error('Monitoring failed:', error);
}