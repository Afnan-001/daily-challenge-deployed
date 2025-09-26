require('dotenv').config();
const scheduler = require('./scheduler');
const express = require('express');

function setupGracefulShutdown() {
  process.on('SIGINT', () => {
    console.log('\n👋 Received SIGINT. Shutting down scheduler gracefully...');
    scheduler.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n👋 Received SIGTERM. Shutting down scheduler gracefully...');
    scheduler.stop();
    process.exit(0);
  });

  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    scheduler.stop();
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    scheduler.stop();
    process.exit(1);
  });
}

async function main() {
  console.log('🚀 Starting WhatsApp Bot Scheduler...');
  console.log('⏰ Will run daily at 6:00 AM');
  
  setupGracefulShutdown();
  
  try {
    // 🔥 Initialize WhatsApp connection immediately on startup
    console.log('📱 Initializing WhatsApp connection...');
    await scheduler.initializeWhatsApp();
    
    // Start the scheduler for daily tasks
    scheduler.scheduleDailyTask();
    
    console.log('✅ Scheduler started successfully');
    console.log('🤖 Scheduler is running. Press Ctrl+C to exit.');

    // ✅ Start tiny HTTP server (to keep Render alive)
    const app = express();
    
    // Health check endpoint
    app.get('/', (req, res) => {
      const status = scheduler.getStatus();
      res.json({
        message: '🤖 WhatsApp Bot Scheduler is running 🚀',
        status: 'healthy',
        uptime: process.uptime(),
        schedulerStatus: status,
        timestamp: new Date().toISOString()
      });
    });

    // Status endpoint
    app.get('/status', (req, res) => {
      const status = scheduler.getStatus();
      res.json({
        ...status,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🌍 Health check server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start scheduler:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
