# WhatsApp Daily Problems Bot 🤖

A WhatsApp bot that automatically sends daily coding problems from LeetCode and GeeksforGeeks.

## Features ✨

- 📱 **Immediate QR Code Setup**: Scan QR code right when you start the app
- 🧪 **Connection Test**: Automatically sends a test message after successful connection
- ⏰ **Scheduled Daily Messages**: Sends coding problems daily at 6:00 AM IST
- 🔄 **Persistent Connection**: Maintains WhatsApp connection without re-authentication
- 🌐 **Health Check Server**: Includes HTTP server for deployment platforms like Render

## How It Works 🚀

1. **Start the app**: `npm start`
2. **QR Code appears immediately** - scan it with WhatsApp
3. **Test message sent** - confirms the bot is working
4. **Daily scheduler activated** - will send problems at 6:00 AM IST
5. **Bot runs continuously** - keeps connection alive

## Quick Start 📋

1. Clone the repository
2. Install dependencies: `npm install`  
3. Configure your `.env` file with your WhatsApp group ID
4. Run the bot: `npm start`
5. Scan the QR code when it appears
6. Wait for the test message to confirm it's working

## Scripts 📜

- `npm start` - Start the WhatsApp bot with immediate QR setup
- `npm run test` - Send a test daily message manually  
- `npm run test-setup` - Test the initialization process

## Configuration ⚙️

The bot is configured via environment variables in `.env`:

```env
WHATSAPP_GROUP_ID=your_group_id_here
SCHEDULE_CRON=0 6 * * *  # 6:00 AM daily
SCHEDULE_TIMEZONE=Asia/Kolkata
CONNECTION_DELAY=30000   # Time to wait for QR scanning
```

## New Behavior 🆕

- ✅ **QR Code signup happens immediately** when you run `npm start`
- ✅ **Test message sent automatically** after successful QR authentication  
- ✅ **CRON job scheduled for 6:00 AM IST** for daily problem messages
- ✅ **No more QR scanning during scheduled runs** - connection persists

## Deployment 🌐

Perfect for deployment on platforms like Render, Railway, or Heroku. The built-in HTTP health check server keeps the service alive.
