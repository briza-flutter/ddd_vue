#!/usr/bin/env node
// DI 自动注册代码生成器
//
// 扫描规则：
//   1. src/application/ 下带 @Injectable() 的类 → 直接注册
//   2. src/infrastructure/ 下带 @Injectable() 且 implements 某接口的类
//      → 根据 tokens.ts 中的 InjectionToken<Interface> 自动匹配 token 绑定
//   3. tokens.ts 中所有 InjectionToken 定义会被自动读取
//
// 用法：npm run generate:di

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, '../src')
const registerFilePath = path.join(srcDir, 'config/di/register.ts')
const tokensFilePath = path.join(srcDir, 'config/di/tokens.ts')

/** 递归查找所有 .ts 文件 */
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

/** 解析文件中的 @Injectable() 类信息 */
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

/** 解析 tokens.ts，提取 token 名称与对应接口的映射 */
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

/** 计算相对导入路径 */
function relImport(from, to) {
  let rel = path
    .relative(path.dirname(from), to)
    .replace(/\.ts$/, '')
    .replace(/\\/g, '/') // Windows 兼容
  if (!rel.startsWith('.')) rel = './' + rel
  return rel
}

// ── 主逻辑 ──────────────────────────────────────────────

const tokens = parseTokens()
const ifaceToToken = new Map(tokens.map((t) => [t.interfaceName, t.tokenName]))

// 扫描 application 层（UseCase）
const useCases = findTsFiles(path.join(srcDir, 'application'))
  .map(parseInjectableClass)
  .filter(Boolean)

// 扫描 infrastructure 层（Repository 实现等）
const allImpls = findTsFiles(path.join(srcDir, 'infrastructure'))
  .map(parseInjectableClass)
  .filter(Boolean)

const tokenBindings = [] // { tokenName, className, filePath }
const standaloneImpls = [] // 没有匹配 token 的 @Injectable 类

for (const impl of allImpls) {
  if (impl.implementsInterface && ifaceToToken.has(impl.implementsInterface)) {
    tokenBindings.push({
      tokenName: ifaceToToken.get(impl.implementsInterface),
      className: impl.className,
      filePath: impl.filePath,
    })
  } else {
    standaloneImpls.push(impl)
  }
}

// ── 生成代码 ────────────────────────────────────────────

const imports = [
  "import { ReflectiveInjector } from 'injection-js'",
  "import { setInjector } from './index'",
]

// token imports
if (tokenBindings.length > 0) {
  const names = tokenBindings.map((b) => b.tokenName).join(', ')
  imports.push(`import { ${names} } from './tokens'`)
}

// infrastructure imports（token 绑定）
for (const b of tokenBindings) {
  imports.push(`import { ${b.className} } from '${relImport(registerFilePath, b.filePath)}'`)
}

// infrastructure imports（独立注册）
for (const impl of standaloneImpls) {
  imports.push(`import { ${impl.className} } from '${relImport(registerFilePath, impl.filePath)}'`)
}

// application imports
for (const uc of useCases) {
  imports.push(`import { ${uc.className} } from '${relImport(registerFilePath, uc.filePath)}'`)
}

// providers
const providers = []
for (const b of tokenBindings) {
  providers.push(`    { provide: ${b.tokenName}, useClass: ${b.className} },`)
}
for (const impl of standaloneImpls) {
  providers.push(`    ${impl.className},`)
}
for (const uc of useCases) {
  providers.push(`    ${uc.className},`)
}

const output = `// AUTO-GENERATED — do not edit manually
// Run \`npm run generate:di\` to regenerate
${imports.join('\n')}

export function registerDependencies(): void {
  const i = ReflectiveInjector.resolveAndCreate([
${providers.join('\n')}
  ])

  setInjector(i)
}
`

fs.writeFileSync(registerFilePath, output)

console.log('✅ register.ts generated')
console.log(`   Token bindings : ${tokenBindings.length}`)
for (const b of tokenBindings) {
  console.log(`     ${b.tokenName} → ${b.className}`)
}
console.log(`   Use cases      : ${useCases.length}`)
for (const uc of useCases) {
  console.log(`     ${uc.className}`)
}
if (standaloneImpls.length > 0) {
  console.log(`   Standalone     : ${standaloneImpls.length}`)
  for (const impl of standaloneImpls) {
    console.log(`     ${impl.className}`)
  }
}
