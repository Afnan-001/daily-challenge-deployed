// test.js - Test script to verify the setup
require('dotenv').config();
const scheduler = require('./scheduler');

async function testSetup() {
  console.log('🧪 Testing WhatsApp Bot Setup...\n');
  
  try {
    // Test initialization
    console.log('1️⃣ Testing WhatsApp initialization...');
    await scheduler.initializeWhatsApp();
    
    console.log('\n2️⃣ Testing scheduler status...');
    const status = scheduler.getStatus();
    console.log('📊 Scheduler Status:', status);
    
    console.log('\n3️⃣ Testing daily task scheduling...');
    scheduler.scheduleDailyTask();
    
    console.log('\n✅ All tests completed successfully!');
    console.log('🤖 The bot is ready to run. Use "npm start" to launch it.');
    
    // Stop scheduler and exit
    scheduler.stop();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    scheduler.stop();
    process.exit(1);
  }
}

if (require.main === module) {
  testSetup();
}

module.exports = { testSetup };
