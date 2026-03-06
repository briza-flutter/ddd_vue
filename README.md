# DDD Vue 项目结构与 DI 自动注册

## 项目架构

```
src/
├── domain/                    # 领域层 — 纯业务逻辑，无外部依赖
│   └── auth/
│       ├── entities/User.ts
│       ├── repositories/AuthRepository.ts    # 接口
│       └── value-objects/Credentials.ts
│
├── application/               # 应用层 — UseCase，编排领域逻辑
│   └── auth/
│       ├── LoginUseCase.ts        @Injectable()
│       ├── LogoutUseCase.ts       @Injectable()
│       └── GetCurrentUserUseCase.ts @Injectable()
│
├── infrastructure/            # 基础设施层 — 接口实现、外部服务
│   ├── auth/AuthRepositoryImpl.ts  @Injectable() implements AuthRepository
│   ├── http/httpClient.ts
│   └── storage/TokenStorage.ts
│
├── common/                    # 公共工具层 — 通用服务、工具类
│   └── logger/AppLogger.ts        @Injectable()
│
├── presentation/              # 展示层 — Vue 组件、路由、状态管理
│   ├── views/LoginView.vue, HomeView.vue
│   ├── stores/authStore.ts
│   └── router/index.ts
│
├── config/di/                 # DI 配置
│   ├── index.ts               # injector 实例 + customProviders + re-export injection-js
│   ├── tokens.ts              # InjectionToken 定义
│   ├── scan.ts                # 扫描目录配置（类似 @ComponentScan）
│   └── register.ts            # ⚡ 自动生成，勿手动编辑
│
└── main.ts                    # 入口：import reflect-metadata → registerDependencies() → createApp
```

## DI 自动注册脚本

**运行命令：** `npm run generate:di`

### 扫描目录配置

脚本从 `src/config/di/scan.ts` 读取扫描目录，类似 Spring Boot 的 `@ComponentScan`：

```ts
// src/config/di/scan.ts
export const scanDirs = [
  'application',     // UseCase
  'infrastructure',  // Repository 实现、外部服务
  'common',          // 公共工具类
]
```

新增模块目录时只需在 `scanDirs` 中添加一行。

### 自动注册规则

所有扫描目录共用同一套规则：

| 条件 | 注册方式 |
|------|---------|
| `@Injectable()` + `implements 接口` + tokens.ts 有对应 token | `{ provide: TOKEN, useClass: Impl }` |
| `@Injectable()` 但无匹配 token | 直接注册（类本身当 token） |

### 手动配置（useValue / useFactory / useExisting）

在 `config/di/index.ts` 的 `customProviders` 数组中配置：

```ts
export const customProviders: Provider[] = [
  { provide: API_BASE_URL, useValue: '/api' },
  { provide: HttpClient, useFactory: () => new HttpClient(config) },
  { provide: OldService, useExisting: NewService },
]
```

脚本生成的 `register.ts` 会自动 `...customProviders` 展开合并。

## 扩展新模块的步骤

### 1. 新增 UseCase（最常见）

```ts
// src/application/order/CreateOrderUseCase.ts
import { Inject, Injectable } from '../../config/di'
import { ORDER_REPOSITORY } from '../../config/di/tokens'

@Injectable()
export class CreateOrderUseCase {
  constructor(@Inject(ORDER_REPOSITORY) private orderRepo: OrderRepository) {}
  async execute(dto: CreateOrderDto): Promise<Order> { ... }
}
```

运行 `npm run generate:di` → 自动注册。

### 2. 新增 Repository 接口 + 实现

**Step 1 — 定义接口（domain 层）：**

```ts
// src/domain/order/repositories/OrderRepository.ts
export interface OrderRepository {
  create(order: Order): Promise<Order>
  findById(id: string): Promise<Order | null>
}
```

**Step 2 — 定义 Token：**

```ts
// src/config/di/tokens.ts
export const ORDER_REPOSITORY = new InjectionToken<OrderRepository>('OrderRepository')
```

**Step 3 — 实现（infrastructure 层）：**

```ts
// src/infrastructure/order/OrderRepositoryImpl.ts
import { Injectable } from '../../config/di'

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  async create(order: Order): Promise<Order> { ... }
  async findById(id: string): Promise<Order | null> { ... }
}
```

运行 `npm run generate:di` → 自动匹配 `ORDER_REPOSITORY` → `OrderRepositoryImpl`。

### 3. 新增独立服务（无接口）

```ts
// src/common/notification/NotificationService.ts
import { Injectable } from '../../config/di'

@Injectable()
export class NotificationService {
  send(message: string): void { ... }
}
```

运行 `npm run generate:di` → 自动注册，注入时直接用类当 token，不需要 `@Inject()`。

### 4. 新增扫描目录

如需添加新的顶层目录（如 `src/shared/`），只需修改 `src/config/di/scan.ts`：

```ts
export const scanDirs = [
  'application',
  'infrastructure',
  'common',
  'shared',          // ← 新增
]
```

## Token 使用场景

| 场景 | Token 类型 | 是否需要 `@Inject()` |
|------|-----------|---------------------|
| 依赖是 interface | `new InjectionToken<接口>()` | 需要 |
| 依赖是具体 class | 类本身 | 不需要 |
| 配置值 | `new InjectionToken<类型>()` | 需要 |

## 注意事项

- 所有注册的依赖都是**单例**（懒创建，首次 `.get()` 时实例化）
- `register.ts` 是自动生成文件，不要手动编辑
- 自定义 provider 写在 `config/di/index.ts` 的 `customProviders` 中
- 新增模块后记得运行 `npm run generate:di`
- `main.ts` 中 `import 'reflect-metadata'` 必须在最前面
