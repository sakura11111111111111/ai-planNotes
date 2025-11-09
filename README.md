# 智能复习笔记 - Smart Review Notes Backend

基于 Spring Boot 3.x 的智能复习笔记后端系统，支持用户认证、笔记管理和智能复习计划。

## 技术栈

- Java 17+
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security 6
- JWT 认证
- MySQL 8.0
- Maven

## 项目结构

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

## 快速开始

### 前置要求

- JDK 17 或更高版本
- Maven 3.6+
- MySQL 8.0

### 数据库配置

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

### 构建和运行

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

或者运行打包后的 jar:

```bash
java -jar target/ai-plan-notes-1.0.0.jar
```

应用将在 `http://localhost:8080` 启动。

## API 文档

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
