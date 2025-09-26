# Deployment Guide 🚀

## Deploy to Render (Recommended)

### Step 1: Prepare Authentication Files
1. **Zip your authentication folder:**
   ```bash
   zip -r auth_info_baileys.zip auth_info_baileys/
   ```

### Step 2: Create GitHub Repository
1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: WhatsApp Daily Bot"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/daily-challenge.git
   git push -u origin main
   ```

### Step 3: Deploy on Render
1. **Go to [render.com](https://render.com)** and sign up
2. **Connect your GitHub account**
3. **Click "New" → "Web Service"**
4. **Select your repository**
5. **Configure the service:**
   - **Name:** `whatsapp-daily-bot`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 4: Set Environment Variables
In Render dashboard → Environment tab, add:

```
WHATSAPP_GROUP_ID=120363420131905026@g.us
TIMEZONE=Asia/Kolkata
LEETCODE_API_URL=http://localhost:3000/daily
GFG_API_URL=https://practiceapi.geeksforgeeks.org/api/v1/problems-of-day/problem/today/
API_TIMEOUT=30000
SCHEDULE_CRON=0 6 * * *
SCHEDULE_TIMEZONE=Asia/Kolkata
CONNECTION_DELAY=30000
SKIP_IMMEDIATE_EXECUTION=false
```

### Step 5: Upload Authentication Files
1. **Go to Render Dashboard → Environment**
2. **Add a new Secret File:**
   - **Filename:** `auth_info_baileys.zip`
   - **Content:** Upload your `auth_info_baileys.zip` file

### Step 6: Deploy
1. **Click "Deploy"**
2. **Wait for deployment to complete**
3. **Check logs for QR code (first time only)**
4. **Scan QR code with WhatsApp**
5. **Bot will send test message and start running 24/7!**

---

## Alternative: Railway Deployment

### Quick Deploy to Railway:
1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub and select repository**
3. **Add environment variables**
4. **Deploy!**

---

## Alternative: Heroku Deployment

### Deploy to Heroku:
1. **Install Heroku CLI**
2. **Login:** `heroku login`
3. **Create app:** `heroku create whatsapp-daily-bot`
4. **Set environment variables:**
   ```bash
   heroku config:set WHATSAPP_GROUP_ID=120363420131905026@g.us
   heroku config:set SCHEDULE_CRON="0 6 * * *"
   heroku config:set SCHEDULE_TIMEZONE=Asia/Kolkata
   # ... add other vars
   ```
5. **Deploy:** `git push heroku main`

---

## 🔧 Important Notes:

### Authentication Persistence:
- **First deployment:** You'll need to scan QR code once
- **After that:** Authentication persists, no more QR codes needed
- **If logged out:** Re-scan QR code in platform logs

### Free Tier Limitations:
- **Render:** 750 hours/month (enough for 24/7)
- **Railway:** $5 credit/month
- **Heroku:** No free tier (paid only)

### Monitoring:
- Check platform logs for any issues
- Bot sends test message on startup to confirm it's working
- Health check endpoint: `https://your-app.onrender.com/`

---

## ✅ After Deployment:
1. **Bot runs 24/7** ✅
2. **Sends daily problems at 6:00 AM IST** ✅
3. **No laptop needed** ✅
4. **Automatic restarts if it crashes** ✅
5. **Health monitoring included** ✅
