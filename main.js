// main.js
const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  DisconnectReason,
  delay
} = require('@whiskeysockets/baileys')
const P = require('pino')
const QRCode = require('qrcode')

let sock = null
let isConnected = false

// main.js (top of file)
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

// 🔹 Ensure auth_info_baileys directory exists for fresh authentication
const authPath = path.join(__dirname, "auth_info_baileys");
if (!fs.existsSync(authPath)) {
  console.log("📁 Creating fresh auth directory for WhatsApp authentication...");
  fs.mkdirSync(authPath, { recursive: true });
  console.log("✅ Auth directory created - ready for QR authentication");
}


async function startSocket() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

    sock = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' }), // Reduced logging for production
      browser: Browsers.ubuntu('Chrome'), // Changed to Ubuntu
      markOnlineOnConnect: false, // To avoid stopping phone notifications
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update
      
      if (qr) {
        console.log('📱 QR Code for WhatsApp Authentication:')
        console.log(await QRCode.toString(qr, { type: 'terminal', small: true }))
        console.log('🔍 Scan the QR code above with your WhatsApp mobile app')
        console.log('⏰ You have 60 seconds to scan the code...')
      }

      if (connection === 'open') {
        isConnected = true
        console.log('✅ Successfully connected to WhatsApp!')
        console.log('💾 Session will be saved automatically for future use')
      } else if (connection === 'close') {
        isConnected = false
        const reason = (lastDisconnect?.error)?.output?.statusCode
        
        if (reason === DisconnectReason.loggedOut) {
          console.error('❌ WhatsApp session expired. Will create new QR code on next restart.')
          console.log('🔄 Delete auth_info_baileys folder if you want to start fresh')
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log('🔄 Connection lost, reconnecting in 5s...')
          await delay(5000)
          startSocket()
        } else if (reason === DisconnectReason.connectionLost) {
          console.log('📡 Network connection lost, reconnecting in 10s...')
          await delay(10000)
          startSocket()
        } else {
          console.log(`🔄 Connection closed (reason: ${reason}), reconnecting in 5s...`)
          await delay(5000)
          startSocket()
        }
      }
    })

    return sock
  } catch (error) {
    console.error('Error starting socket:', error)
    // Retry after delay
    await delay(5000)
    return startSocket()
  }
}

function getSocket() {
  return sock
}

function isSocketConnected() {
  return isConnected && sock !== null
}

// Export but don't auto-start - let the consumer control when to start
module.exports = { getSocket, isSocketConnected, startSocket }