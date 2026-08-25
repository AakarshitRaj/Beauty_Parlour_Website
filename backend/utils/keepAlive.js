// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  keepAlive.js  —  backend/utils/keepAlive.js
//  Prevents Render free tier from sleeping by
//  pinging the /health endpoint every 14 minutes.
//  Only runs in production (not on your local PC).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const https = require('https');
const http  = require('http');

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in ms

const keepAlive = (serverUrl) => {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('ℹ️  Keep-alive disabled in development');
    return;
  }

  if (!serverUrl) {
    console.warn('⚠️  RENDER_EXTERNAL_URL not set — keep-alive disabled');
    return;
  }

  const pingUrl = `${serverUrl}/health`;
  const client  = pingUrl.startsWith('https') ? https : http;

  const ping = () => {
    const req = client.get(pingUrl, (res) => {
      console.log(`✅ Keep-alive ping → ${pingUrl} [${res.statusCode}]`);
    });

    req.on('error', (err) => {
      console.warn(`⚠️  Keep-alive ping failed: ${err.message}`);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.warn('⚠️  Keep-alive ping timed out');
    });
  };

  // First ping after 1 minute (let server fully start)
  setTimeout(ping, 60 * 1000);

  // Then ping every 14 minutes forever
  setInterval(ping, PING_INTERVAL);

  console.log(`🔄 Keep-alive active — pinging every 14 min → ${pingUrl}`);
};

module.exports = keepAlive;
