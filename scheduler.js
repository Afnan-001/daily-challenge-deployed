// scheduler.js
require('dotenv').config();
const cron = require('node-cron');
const { startSocket, isSocketConnected } = require('./main');
const { sendGroupMessage } = require('./sendMessage');
const { delay } = require('@whiskeysockets/baileys');

class DailyScheduler {
  constructor() {
    this.isRunning = false;
    this.scheduledTask = null;
    this.isInitialized = false;
    // Get schedule from environment variables
    this.cronSchedule = process.env.SCHEDULE_CRON;
    this.timezone = process.env.SCHEDULE_TIMEZONE;
  }

  // Initialize WhatsApp connection and send test message
  async initializeWhatsApp() {
    if (this.isInitialized) {
      console.log('⚠️ WhatsApp already initialized, skipping...');
      return;
    }

    try {
      console.log('🔄 Starting WhatsApp socket connection...');
      await startSocket();
      console.log('✅ Socket started successfully');

      // Wait for connection with longer timeout for QR code scanning
      console.log('⏳ Waiting for WhatsApp connection...');
      console.log('📱 If this is first deployment, scan the QR code in the logs above');
      
      // Extended timeout for fresh authentication
      const maxWaitTime = 90000; // 90 seconds for QR scanning
      const checkInterval = 2000; // Check every 2 seconds
      let waitTime = 0;
      
      while (!isSocketConnected() && waitTime < maxWaitTime) {
        await delay(checkInterval);
        waitTime += checkInterval;
        
        if (waitTime % 20000 === 0) { // Log every 20 seconds
          console.log(`⏳ Still waiting for WhatsApp connection... (${Math.floor(waitTime/1000)}s elapsed)`);
        }
      }

      if (!isSocketConnected()) {
        throw new Error('Connection timeout: Could not establish WhatsApp connection within 90 seconds');
      }

      // Send test message to verify connection is working
      console.log('🧪 Sending test message to verify connection...');
      const testMessage = "🤖 WhatsApp Bot deployed successfully on Render! \n✅ Fresh authentication completed.\n⏰ Daily coding problems will be sent at 6:00 AM IST.";
      
      const success = await sendGroupMessage(testMessage);
      
      if (success) {
        console.log('✅ Test message sent successfully - WhatsApp bot is ready!');
        console.log('💾 Authentication session saved - no more QR codes needed');
        this.isInitialized = true;
      } else {
        console.log('⚠️ Test message failed, but connection may still work');
        this.isInitialized = true; // Mark as initialized even if test message fails
      }

    } catch (error) {
      console.error('💥 Error initializing WhatsApp:', error.message);
      console.log('🔄 Will retry initialization on next restart...');
      throw error; // Re-throw to let the caller handle it
    }
  }

  // Schedule the daily task
  scheduleDailyTask() {
    console.log(`⏰ Scheduling daily task with cron: ${this.cronSchedule} (${this.timezone})`);
    
    this.scheduledTask = cron.schedule(this.cronSchedule, async () => {
      await this.executeDailyTask();
    }, {
      scheduled: true,
      timezone: this.timezone
    });

    console.log('✅ Daily task scheduled for 6:00 AM IST');
  }

  // Execute the daily task
  async executeDailyTask() {
    if (this.isRunning) {
      console.log('⚠️ Daily task is already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting daily task execution...');
    console.log('📅 Date:', new Date().toLocaleString('en-IN', { timeZone: this.timezone }));

    try {
      // Initialize WhatsApp if not already done
      if (!this.isInitialized) {
        console.log('📱 WhatsApp not initialized yet, initializing now...');
        await this.initializeWhatsApp();
      } else {
        console.log('✅ Using existing WhatsApp connection');
        // Small delay to ensure connection is still active
        await delay(2000);
      }

      // Send daily problem
      const { sendDailyProblem } = require('./sendMessage');
      const success = await sendDailyProblem();
      
      if (success) {
        console.log('✅ Daily task completed successfully');
      } else {
        console.log('❌ Daily task completed with errors');
      }
    } catch (error) {
      console.error('💥 Error in daily task execution:', error.message);
    } finally {
      this.isRunning = false;
      console.log('🏁 Daily task execution finished');
    }
  }

  // Stop the scheduler
  stop() {
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      console.log('⏹️ Scheduler stopped');
    }
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      isInitialized: this.isInitialized,
      isScheduled: this.scheduledTask !== null,
      cronSchedule: this.cronSchedule,
      timezone: this.timezone
    };
  }
}

// Create singleton instance
const scheduler = new DailyScheduler();

module.exports = scheduler;