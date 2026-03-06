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

function parseTokensFromFile(filePath) {
  if (!fs.existsSync(filePath)) return []

  const content = fs.readFileSync(filePath, 'utf-8')
  const tokens = []
  const re = /export\s+const\s+(\w+)\s*=\s*new\s+InjectionToken\s*<\s*(\w+)\s*>/g
  let m
  while ((m = re.exec(content)) !== null) {
    tokens.push({ tokenName: m[1], interfaceName: m[2], filePath })
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

// 从 tokens.ts 和扫描目录中收集所有 InjectionToken
const allScannedFiles = scanDirs.flatMap((dir) => findTsFiles(path.join(srcDir, dir)))
const tokens = [
  ...parseTokensFromFile(tokensFilePath),
  ...allScannedFiles.flatMap(parseTokensFromFile),
]
const ifaceToToken = new Map(tokens.map((t) => [t.interfaceName, t]))

// 扫描所有配置目录
const allClasses = allScannedFiles.map(parseInjectableClass).filter(Boolean)

const tokenBindings = []
const standaloneClasses = []

for (const cls of allClasses) {
  if (cls.implementsInterface && ifaceToToken.has(cls.implementsInterface)) {
    const token = ifaceToToken.get(cls.implementsInterface)
    tokenBindings.push({
      tokenName: token.tokenName,
      tokenFilePath: token.filePath,
      className: cls.className,
      classFilePath: cls.filePath,
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

// 按文件分组收集需要导入的符号
const importMap = new Map()
function addImport(filePath, name) {
  if (!importMap.has(filePath)) importMap.set(filePath, new Set())
  importMap.get(filePath).add(name)
}

for (const b of tokenBindings) {
  addImport(b.tokenFilePath, b.tokenName)
  addImport(b.classFilePath, b.className)
}
for (const cls of standaloneClasses) {
  addImport(cls.filePath, cls.className)
}

for (const [filePath, names] of importMap) {
  imports.push(`import { ${[...names].join(', ')} } from '${relImport(registerFilePath, filePath)}'`)
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
