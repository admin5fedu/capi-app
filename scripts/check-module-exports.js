#!/usr/bin/env node

/**
 * Script để kiểm tra và cảnh báo về các file index.ts trống trong modules
 * Chạy: node scripts/check-module-exports.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const featuresDir = path.join(__dirname, '../src/features')

function findEmptyIndexFiles(dir, baseDir = dir) {
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(baseDir, fullPath)

    if (entry.isDirectory()) {
      results.push(...findEmptyIndexFiles(fullPath, baseDir))
    } else if (entry.name === 'index.ts') {
      const content = fs.readFileSync(fullPath, 'utf8').trim()
      // Kiểm tra nếu file trống hoặc chỉ có comment
      if (!content || content.match(/^\/\/.*$/)) {
        // Kiểm tra xem có file index.tsx cùng thư mục không
        const indexPath = path.join(path.dirname(fullPath), 'index.tsx')
        if (fs.existsSync(indexPath)) {
          results.push({
            path: relativePath,
            fullPath,
            issue: 'Empty index.ts conflicts with index.tsx',
            fix: `Delete: ${relativePath}`,
          })
        }
      }
    }
  }

  return results
}

const issues = findEmptyIndexFiles(featuresDir)

if (issues.length > 0) {
  console.log('⚠️  Found potential module export issues:\n')
  issues.forEach((issue) => {
    console.log(`  ❌ ${issue.path}`)
    console.log(`     Issue: ${issue.issue}`)
    console.log(`     Fix: ${issue.fix}\n`)
  })
  console.log(`\nTotal: ${issues.length} issue(s) found`)
  process.exit(1)
} else {
  console.log('✅ No module export issues found')
  process.exit(0)
}
