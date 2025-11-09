# 智能复习笔记 - Smart Review Notes

完整的智能复习笔记系统，包含 Spring Boot 后端 API 和 Flutter Android 前端应用。

## 🎉 完整系统已实现！

### 后端 API（阶段 1 + 2）✅
**核心业务模块已全部实现：**
- ✅ 用户认证 (User Authentication)
- ✅ 分类管理 (Category Management)
- ✅ 笔记管理 (Note Management) 
- ✅ 复习任务 (Review Tasks)
- ✅ AI 总结 (AI Summary - V1.0 Mock)
- ✅ 艾宾浩斯复习算法 (Ebbinghaus Review Algorithm)

### Flutter Android 前端（阶段 3）✅
**完整的用户界面已实现：**
- ✅ 用户认证（登录、注册）
- ✅ 今日任务列表
- ✅ 核心复习功能（含监督机制）
- ✅ 笔记管理（CRUD）
- ✅ 分类管理（CRUD）
- ✅ Material Design 3 界面

📖 **API 文档**：[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

📋 **后端实现细节**：[PHASE2_IMPLEMENTATION_SUMMARY.md](./PHASE2_IMPLEMENTATION_SUMMARY.md)

📱 **Flutter 实现细节**：[FLUTTER_IMPLEMENTATION_SUMMARY.md](./FLUTTER_IMPLEMENTATION_SUMMARY.md)

## 技术栈

### 后端
- Java 17+
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security 6
- JWT 认证
- MySQL 8.0
- Maven

### 前端
- Flutter 3.x
- Dart
- Provider (状态管理)
- Dio (网络请求)
- SharedPreferences (本地存储)
- Material Design 3

## 项目结构

### 后端结构
```
src/main/java/com/aiplannotes/
├── config/           # 配置类 (Security配置)
├── controller/       # REST API 控制器
├── dto/             # 数据传输对象
├── entity/          # JPA 实体类
├── repository/      # 数据访问层
├── service/         # 业务逻辑层
├── security/        # 安全认证相关
├── exception/       # 异常处理
└── util/            # 工具类 (JWT工具)
```

### 前端结构
```
flutter_app/
├── lib/
│   ├── config/              # 配置（API、主题）
│   ├── models/              # 数据模型
│   ├── services/            # API 服务层
│   ├── providers/           # 状态管理
│   ├── screens/             # 页面（auth, home, notes, categories, review）
│   ├── widgets/             # 自定义组件
│   ├── utils/               # 工具类
│   └── main.dart            # 应用入口
└── android/                 # Android 配置
```

## 快速开始

### 后端 API

#### 前置要求
- JDK 17 或更高版本
- Maven 3.6+
- MySQL 8.0

#### 数据库配置

1. 创建 MySQL 数据库:

```sql
CREATE DATABASE ai_plan_notes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 配置环境变量 (可选):

```bash
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=your-secret-key-at-least-256-bits-long
```

或者直接修改 `src/main/resources/application.yml` 文件中的配置。

#### 构建和运行

1. 克隆项目:

```bash
git clone https://github.com/sakura11111111111111/ai-planNotes.git
cd ai-planNotes
```

2. 使用 Maven 构建项目:

```bash
mvn clean install
```

3. 运行应用:

```bash
mvn spring-boot:run
```

应用将在 `http://localhost:8080` 启动。

### Flutter Android 前端

#### 前置要求
- Flutter SDK 3.0+
- Dart SDK 2.17+
- Android SDK (API Level 21+)
- 后端 API 运行在 localhost:8080

#### 安装和运行

1. 进入 Flutter 项目目录:

```bash
cd flutter_app
```

2. 安装依赖:

```bash
flutter pub get
```

3. 配置 API 地址（如果需要）:

编辑 `lib/config/api_config.dart`：

```dart
// Android 模拟器
static const String baseUrl = 'http://10.0.2.2:8080/api';

// Android 真机（使用您的电脑 IP）
// static const String baseUrl = 'http://192.168.1.100:8080/api';
```

4. 运行应用:

```bash
flutter run
```

5. 构建 APK:

```bash
flutter build apk --release
```

详细说明请查看 [flutter_app/README.md](./flutter_app/README.md)

## 使用流程

### 1. 启动后端 API
```bash
cd ai-planNotes
mvn spring-boot:run
```

### 2. 启动 Flutter 应用
```bash
cd flutter_app
flutter run
```

### 3. 使用应用
1. 注册新账号
2. 登录系统
3. 创建笔记（可选择分类和监督模式）
4. 在"今日任务"查看复习任务
5. 开始复习并提交结果
6. 系统根据艾宾浩斯曲线安排下次复习


## API 文档

**完整 API 文档请查看 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

以下是部分示例：

### 用户认证

#### 1. 用户注册

**请求:**

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "xiaoli",
  "password": "password123",
  "email": "xiaoli@example.com"
}
```

**成功响应 (201):**

```json
{
  "code": 201,
  "message": "User registered successfully.",
  "data": {
    "userId": 1,
    "username": "xiaoli",
    "email": "xiaoli@example.com"
  }
}
```

**错误响应:**
- `400`: 参数验证失败
- `409`: 用户名或邮箱已存在

#### 2. 用户登录

**请求:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "xiaoli",
  "password": "password123"
}
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGc...",
    "tokenType": "Bearer",
    "expiresIn": 86400
  }
}
```

**错误响应:**
- `400`: 参数为空
- `401`: 用户名或密码错误

### 使用认证

其他需要认证的 API 请求需要在 Header 中包含 JWT Token:

```http
Authorization: Bearer <your_jwt_token>
```

## 数据库表结构

系统会自动创建以下数据表:

- `users` - 用户表
- `categories` - 分类表
- `notes` - 笔记表
- `ai_summaries` - AI总结表
- `review_records` - 复习记录表

详细的表结构和关系请参考 `entity` 包下的实体类。

## 配置说明

主要配置位于 `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ai_plan_notes
    username: root
    password: ${DB_PASSWORD:password}
  jpa:
    hibernate:
      ddl-auto: update  # 生产环境建议改为 validate

jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 86400000  # 24小时
```

## 开发指南

### 添加新功能

1. 在 `entity` 包中定义实体类
2. 在 `repository` 包中创建 Repository 接口
3. 在 `service` 包中实现业务逻辑
4. 在 `controller` 包中创建 REST API 端点
5. 在 `dto` 包中定义请求/响应对象

### 异常处理

系统使用统一的异常处理机制:

- 抛出 `BusinessException` 处理业务异常
- 全局异常处理器会自动转换为统一的 API 响应格式

### 参数校验

使用 Bean Validation 注解进行参数校验:

```java
@NotBlank(message = "Username must not be empty")
@Size(min = 3, max = 50)
private String username;
```

## 测试

运行测试:

```bash
mvn test
```

## 生产部署

1. 修改 `application.yml` 中的配置:
   - 将 `ddl-auto` 改为 `validate`
   - 设置强密码的环境变量

2. 打包应用:

```bash
mvn clean package -DskipTests
```

3. 运行 jar 文件:

```bash
java -jar target/ai-plan-notes-1.0.0.jar
```

## 安全注意事项

- ⚠️ 请务必修改 JWT Secret，使用至少 256 位的强密钥
- ⚠️ 生产环境中使用环境变量管理敏感配置
- ⚠️ 启用 HTTPS
- ⚠️ 定期更新依赖以修复安全漏洞

## 许可证

本项目仅供学习和研究使用。

## 联系方式

如有问题，请提交 Issue。
