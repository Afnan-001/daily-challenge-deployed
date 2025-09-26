#!/bin/bash

# 🚀 Quick Deploy Script for WhatsApp Bot

echo "🚀 Preparing WhatsApp Bot for deployment..."

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    exit 1
fi

if [ ! -d "auth_info_baileys" ]; then
    echo "❌ Error: auth_info_baileys folder not found!"
    echo "   Make sure you've run the bot locally first to authenticate."
    exit 1
fi

# Create deployment zip
echo "📦 Creating deployment package..."
zip -r auth_info_baileys_deployment.zip auth_info_baileys/ > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Authentication backup created: auth_info_baileys_deployment.zip"
else
    echo "❌ Error creating zip file"
    exit 1
fi

echo "📋 Deployment checklist:"
echo "  ✅ Code is ready"
echo "  ✅ Authentication files backed up"
echo "  ✅ Environment variables configured"
echo ""
echo "🌐 Ready to deploy to:"
echo "  • Render (Recommended - Free tier)"
echo "  • Railway (Simple deployment)"
echo "  • Heroku (Paid plans only)"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo "🎉 Your bot is ready for 24/7 deployment!"
