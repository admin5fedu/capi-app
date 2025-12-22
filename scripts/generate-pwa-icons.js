/**
 * Script to download logo and generate PWA icons
 * Run with: node scripts/generate-pwa-icons.js
 */

import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logoUrl = 'https://capiconsulting.com/wp-content/uploads/2017/09/capi-consulting-logo-white.png'
const publicDir = path.join(__dirname, '..', 'public')

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Download logo
function downloadLogo() {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(publicDir, 'logo-original.png'))
    
    https.get(logoUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log('✅ Logo downloaded successfully')
          resolve()
        })
      } else {
        reject(new Error(`Failed to download logo: ${response.statusCode}`))
      }
    }).on('error', (err) => {
      fs.unlink(path.join(publicDir, 'logo-original.png'), () => {})
      reject(err)
    })
  })
}

// Note: Image resizing requires sharp or jimp package
// For now, we'll just download the logo
// You can manually resize it using an image editor or install sharp:
// npm install -D sharp
// Then uncomment the resize function below

async function main() {
  try {
    console.log('📥 Downloading logo from:', logoUrl)
    await downloadLogo()
    console.log('\n✅ Logo downloaded to public/logo-original.png')
    console.log('\n📝 Next steps:')
    console.log('1. Install sharp: npm install -D sharp')
    console.log('2. Resize logo to 192x192 and 512x512')
    console.log('3. Save as public/icon-192x192.png and public/icon-512x512.png')
    console.log('\nOr use an online tool like: https://realfavicongenerator.net/')
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Alternative: Download the logo manually and resize it to:')
    console.log('   - 192x192px -> public/icon-192x192.png')
    console.log('   - 512x512px -> public/icon-512x512.png')
  }
}

main()

