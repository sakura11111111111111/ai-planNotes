# 在 GitHub Codespaces 中运行智能复习笔记

## 🚀 快速开始

### 1. 打开 Codespaces

点击 GitHub 仓库页面的 **Code** 按钮，然后选择 **Codespaces** → **Create codespace on main**

### 2. 等待环境准备

Codespaces 会自动：
- ✅ 安装 Java 17 + Maven
- ✅ 安装 Flutter SDK
- ✅ 启动 MySQL 8.0 数据库
- ✅ 下载所有依赖

大约需要 3-5 分钟。

### 3. 启动后端

在终端中运行：

```bash
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动

### 4. 启动 Flutter Web（在 Codespaces 中推荐）

打开新终端，运行：

```bash
cd flutter_app
flutter run -d web-server --web-port 5900
```

Flutter Web 将在 `http://localhost:5900` 启动

Codespaces 会自动转发端口，你可以在浏览器中访问。

## 📊 数据库配置

MySQL 数据库已自动配置：
- **主机**: localhost
- **端口**: 3306
- **数据库**: ai_plan_notes
- **用户名**: aiuser
- **密码**: aipassword

后端会自动连接数据库。

## 🛠️ 开发工具

Codespaces 已预装：
- ✅ Java Extension Pack
- ✅ Spring Boot Tools
- ✅ Flutter & Dart 扩展
- ✅ Docker 扩展

## 🧪 测试

运行后端测试：

```bash
mvn test
```

## 📱 Flutter 选项

### 选项 1：Web 版本（推荐用于 Codespaces）
```bash
cd flutter_app
flutter run -d web-server --web-port 5900
```

### 选项 2：Android 模拟器（需要额外配置）
Codespaces 中运行 Android 模拟器需要更多配置，Web 版本更简单。

## 🔍 API 测试

后端启动后，可以使用以下方式测试 API：

### 使用 curl
```bash
# 注册用户
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### 使用 REST Client 扩展
在 VSCode 中安装 REST Client 扩展，可以直接测试 API。

## 🐛 常见问题

### MySQL 连接失败
等待 10-15 秒让 MySQL 完全启动，然后重启后端。

### Flutter Web 无法访问
确保端口 5900 已转发。点击 VSCode 底部的"端口"标签查看。

### 内存不足
Codespaces 免费版有 2-4 GB 内存限制。建议：
- 只运行后端或前端，不要同时运行
- 或升级到更大的 Codespace 机型

## 💡 提示

1. **保存工作**：Codespaces 会自动保存，但建议定期提交代码
2. **停止 Codespace**：不用时记得停止，以节省配额
3. **数据持久化**：MySQL 数据存储在 Docker volume 中，停止 Codespace 不会丢失

## 📚 更多文档

- [完整 README](./README.md)
- [API 文档](./API_DOCUMENTATION.md)
- [Flutter 实现说明](./FLUTTER_IMPLEMENTATION_SUMMARY.md)
