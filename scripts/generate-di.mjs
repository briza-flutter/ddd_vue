#!/usr/bin/env node
// DI 自动注册代码生成器
//
// 通过 scanDirs 配置扫描目录，类似 Spring Boot 的 @ComponentScan
// 用法：npm run generate:di

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, '../src')
const registerFilePath = path.join(srcDir, 'config/di/register.ts')
const tokensFilePath = path.join(srcDir, 'config/di/tokens.ts')
const scanConfigPath = path.join(srcDir, 'config/di/scan.ts')

// ── 读取扫描目录配置 ────────────────────────────────────
// 从 src/config/di/scan.ts 中解析 scanDirs 数组

function parseScanDirs() {
  const content = fs.readFileSync(scanConfigPath, 'utf-8')
  const match = content.match(/export\s+const\s+scanDirs\s*=\s*\[([\s\S]*?)\]/)
  if (!match) {
    console.error('❌ 无法解析 src/config/di/scan.ts 中的 scanDirs')
    process.exit(1)
  }
  const items = []
  const re = /['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(match[1])) !== null) {
    items.push(m[1])
  }
  return items
}

const scanDirs = parseScanDirs()

// ── 工具函数 ────────────────────────────────────────────

function findTsFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findTsFiles(fullPath))
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      results.push(fullPath)
    }
  }
  return results.sort()
}

function parseInjectableClass(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  if (!/@Injectable\(\)/.test(content)) return null

  const classMatch = content.match(
    /export\s+class\s+(\w+)(?:\s+implements\s+(\w+))?/,
  )
  if (!classMatch) return null

  return {
    filePath,
    className: classMatch[1],
    implementsInterface: classMatch[2] || null,
  }
}

function parseTokens() {
  if (!fs.existsSync(tokensFilePath)) return []

  const content = fs.readFileSync(tokensFilePath, 'utf-8')
  const tokens = []
  const re = /export\s+const\s+(\w+)\s*=\s*new\s+InjectionToken\s*<\s*(\w+)\s*>/g
  let m
  while ((m = re.exec(content)) !== null) {
    tokens.push({ tokenName: m[1], interfaceName: m[2] })
  }
  return tokens
}

function relImport(from, to) {
  let rel = path
    .relative(path.dirname(from), to)
    .replace(/\.ts$/, '')
    .replace(/\\/g, '/')
  if (!rel.startsWith('.')) rel = './' + rel
  return rel
}

// ── 主逻辑 ──────────────────────────────────────────────

const tokens = parseTokens()
const ifaceToToken = new Map(tokens.map((t) => [t.interfaceName, t.tokenName]))

// 扫描所有配置目录
const allClasses = scanDirs.flatMap((dir) => {
  const fullDir = path.join(srcDir, dir)
  return findTsFiles(fullDir).map(parseInjectableClass).filter(Boolean)
})

const tokenBindings = []
const standaloneClasses = []

for (const cls of allClasses) {
  if (cls.implementsInterface && ifaceToToken.has(cls.implementsInterface)) {
    tokenBindings.push({
      tokenName: ifaceToToken.get(cls.implementsInterface),
      className: cls.className,
      filePath: cls.filePath,
    })
  } else {
    standaloneClasses.push(cls)
  }
}

// ── 生成代码 ────────────────────────────────────────────

const imports = [
  "import { ReflectiveInjector } from 'injection-js'",
  "import { setInjector, customProviders } from './index'",
]

if (tokenBindings.length > 0) {
  const names = tokenBindings.map((b) => b.tokenName).join(', ')
  imports.push(`import { ${names} } from './tokens'`)
}

for (const b of tokenBindings) {
  imports.push(`import { ${b.className} } from '${relImport(registerFilePath, b.filePath)}'`)
}

for (const cls of standaloneClasses) {
  imports.push(`import { ${cls.className} } from '${relImport(registerFilePath, cls.filePath)}'`)
}

const providers = []
for (const b of tokenBindings) {
  providers.push(`    { provide: ${b.tokenName}, useClass: ${b.className} },`)
}
for (const cls of standaloneClasses) {
  providers.push(`    ${cls.className},`)
}

const output = `// AUTO-GENERATED — do not edit manually
// Run \`npm run generate:di\` to regenerate
${imports.join('\n')}

export function registerDependencies(): void {
  const i = ReflectiveInjector.resolveAndCreate([
${providers.join('\n')}
    ...customProviders,
  ])

  setInjector(i)
}
`

fs.writeFileSync(registerFilePath, output)

// ── 输出结果 ────────────────────────────────────────────

console.log(`✅ register.ts generated (scan: ${scanDirs.join(', ')})`)
console.log(`   Token bindings : ${tokenBindings.length}`)
for (const b of tokenBindings) {
  console.log(`     ${b.tokenName} → ${b.className}`)
}
console.log(`   Standalone     : ${standaloneClasses.length}`)
for (const cls of standaloneClasses) {
  console.log(`     ${cls.className}`)
}
