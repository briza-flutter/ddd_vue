// DI 扫描目录配置（类似 Spring Boot 的 @ComponentScan）
// generate:di 脚本会读取此配置，扫描这些目录下的 @Injectable() 类
// 新增模块目录时只需在这里添加一行
export const scanDirs = [
  'application',
  'infrastructure',
  'common',
]
