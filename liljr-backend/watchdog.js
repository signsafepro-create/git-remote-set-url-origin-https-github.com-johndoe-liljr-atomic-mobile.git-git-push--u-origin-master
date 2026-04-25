// watchdog.js
// Little Junior AI: Self-Monitoring Watchdog (Step 1)

const fs = require('fs');
const os = require('os');
const nodemailer = require('nodemailer');

const OWNER_EMAIL = process.env.OWNER_EMAIL || '';
const ALERT_THRESHOLD = 1; // Number of consecutive failures before alert

let failureCount = 0;

async function sendAlert(subject, message) {
  if (!OWNER_EMAIL) return;
  // Configure your SMTP or use a service like Gmail, Mailgun, etc.
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: OWNER_EMAIL,
    subject,
    text: message
  });
}

async function checkHealth() {
  // Example: check if server.js is running
  try {
    // Check memory, disk, and CPU
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const load = os.loadavg()[0];
    const disk = fs.statSync('.');
    // Add more checks as needed (DB, API, etc.)
    if (freeMem / totalMem < 0.1 || load > 5) {
      throw new Error('Resource usage critical');
    }
    failureCount = 0;
    return true;
  } catch (err) {
    failureCount++;
    if (failureCount >= ALERT_THRESHOLD) {
      await sendAlert('LIL JR ALERT: System Issue', `Issue detected: ${err.message}`);
    }
    return false;
  }
}

// Run every 60 seconds
timer = setInterval(checkHealth, 60000);

module.exports = { checkHealth };
