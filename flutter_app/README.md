# 智能复习笔记 - Flutter Android 前端应用

基于 Flutter 3.x 开发的智能复习笔记 Android 应用，配合 Spring Boot 后端 API 使用。

## 功能特性

### ✅ 用户认证
- 用户注册（用户名、邮箱、密码验证）
- 用户登录（JWT Token 认证）
- 自动登录状态保持
- 退出登录

### ✅ 今日任务（核心功能）
- 显示当天需要复习的笔记任务
- 任务卡片展示笔记标题、分类、复习次数、AI 总结预览
- 支持下拉刷新
- 空状态友好提示

### ✅ 复习功能（核心功能）
- 显示完整笔记内容
- AI 总结折叠展开
- **监督机制**：
  - 倒计时显示（秒数大字体）
  - 倒计时期间禁用提交按钮（视觉和交互禁用）
  - 倒计时结束后才能提交复习结果
- 三种复习结果：记住了（绿色）、有点模糊（黄色）、忘记了（红色）
- 提交后显示下次复习时间
- 自动返回并刷新今日任务列表

### ✅ 笔记管理
- 笔记列表展示（支持分类筛选）
- 笔记详情查看
- 创建新笔记
  - 标题、内容输入
  - 分类选择（可选）
  - 监督机制设置（开关 + 时长）
  - 创建成功后自动加入今日复习计划
- 编辑笔记
- 删除笔记（带确认对话框）
- 长按笔记卡片显示快捷操作

### ✅ 分类管理
- 分类列表展示
- 创建分类
- 编辑分类名称
- 删除分类（有笔记时提示无法删除）

### ✅ UI/UX 特性
- Material Design 3 设计
- 简洁清爽的界面
- 色彩语义化（绿色=成功，橙色=警告，红色=错误）
- 所有操作有 Loading 状态
- 友好的错误提示
- 下拉刷新支持
- 空状态页面

## 技术栈

- **框架**: Flutter 3.x
- **语言**: Dart
- **状态管理**: Provider
- **网络请求**: Dio
- **本地存储**: SharedPreferences
- **路由**: Material Navigator

## 项目结构

```
lib/
├── main.dart                 # 应用入口
├── config/
│   ├── api_config.dart      # API 配置
│   └── theme_config.dart    # 主题配置
├── models/                   # 数据模型
│   ├── user.dart
│   ├── category.dart
│   ├── note.dart
│   ├── task.dart
│   └── api_response.dart
├── services/                 # API 服务层
│   ├── api_service.dart     # HTTP 请求基础封装
│   ├── auth_service.dart    # 认证服务
│   ├── category_service.dart
│   ├── note_service.dart
│   ├── task_service.dart
│   └── storage_service.dart # 本地存储
├── providers/                # 状态管理
│   ├── auth_provider.dart
│   ├── category_provider.dart
│   ├── note_provider.dart
│   └── task_provider.dart
├── screens/                  # 页面
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── home/
│   │   ├── home_screen.dart
│   │   └── task_list_widget.dart
│   ├── notes/
│   │   ├── note_list_screen.dart
│   │   ├── note_detail_screen.dart
│   │   └── note_edit_screen.dart
│   ├── categories/
│   │   └── category_manage_screen.dart
│   └── review/
│       ├── review_screen.dart
│       └── review_result_dialog.dart
├── widgets/                  # 通用组件
│   ├── custom_button.dart
│   ├── custom_text_field.dart
│   ├── loading_widget.dart
│   └── error_widget.dart
└── utils/
    ├── validators.dart       # 表单验证
    └── date_utils.dart       # 日期工具
```

## 环境要求

- Flutter SDK: 3.0.0 或更高
- Dart SDK: 2.17.0 或更高
- Android SDK: 21 (Android 5.0) 或更高
- 后端 API: 需要运行 Spring Boot 后端服务

## 安装步骤

### 1. 安装 Flutter SDK

参考 [Flutter 官方安装文档](https://flutter.dev/docs/get-started/install)

### 2. 克隆项目

```bash
cd ai-planNotes/flutter_app
```

### 3. 安装依赖

```bash
flutter pub get
```

### 4. 配置 API 地址

编辑 `lib/config/api_config.dart`：

```dart
// Android 模拟器访问本地后端
static const String baseUrl = 'http://10.0.2.2:8080/api';

// 或者使用您的计算机 IP（适用于真机）
// static const String baseUrl = 'http://192.168.1.100:8080/api';
```

### 5. 运行应用

**Android 模拟器**:
```bash
flutter run
```

**Android 真机**（需要开启 USB 调试）:
```bash
flutter run
```

**构建 APK**:
```bash
flutter build apk --release
```

生成的 APK 文件位于 `build/app/outputs/flutter-apk/app-release.apk`

## API 配置说明

### Android 模拟器
- 使用 `http://10.0.2.2:8080/api` 访问宿主机的 localhost
- 确保后端服务运行在 8080 端口

### Android 真机
- 使用计算机的局域网 IP，例如 `http://192.168.1.100:8080/api`
- 确保手机和计算机在同一局域网内
- 在 AndroidManifest.xml 中已配置 `usesCleartextTraffic="true"` 允许 HTTP 请求

### 获取计算机 IP 地址

**Windows**:
```bash
ipconfig
```

**macOS/Linux**:
```bash
ifconfig
```

查找 `192.168.x.x` 或 `10.x.x.x` 格式的 IP 地址

## 使用说明

### 1. 注册账号
- 打开应用后点击"去注册"
- 填写用户名（3-50字符）、邮箱、密码（至少8位，包含字母和数字）
- 点击"注册"按钮

### 2. 登录
- 输入用户名和密码
- 可勾选"记住我"保持登录状态
- 点击"登录"按钮

### 3. 创建笔记
- 进入"笔记"标签页
- 点击右下角"+"按钮
- 填写标题和内容
- 选择分类（可选）
- 设置是否开启监督机制
- 点击"创建"按钮
- 笔记创建成功后会自动加入今日复习计划

### 4. 复习笔记
- 进入"今日任务"标签页
- 查看今天需要复习的笔记列表
- 点击"开始复习"按钮
- 认真阅读笔记内容
- 如果开启了监督模式，等待倒计时结束
- 选择复习结果：记住了 / 有点模糊 / 忘记了
- 查看下次复习时间

### 5. 管理分类
- 进入"分类"标签页
- 点击右下角"+"按钮创建新分类
- 点击编辑图标修改分类名称
- 点击删除图标删除分类（需要确认）

## 监督机制说明

监督机制是本应用的核心功能之一，用于确保用户认真复习笔记内容：

1. **创建笔记时设置**：
   - 开启"监督机制"开关
   - 设置监督时长（建议 10-60 秒）

2. **复习时的表现**：
   - 页面顶部显示醒目的倒计时（橙色背景，大字体）
   - 倒计时进行中，复习结果按钮为灰色且不可点击
   - 倒计时结束后，按钮变为彩色且可点击
   - 用户可以在倒计时期间阅读笔记，但无法提前提交

3. **设计目的**：
   - 防止"走马观花"式复习
   - 确保用户真正理解和记忆笔记内容
   - 提高复习效果

## 开发说明

### 代码规范
- 使用 `flutter analyze` 检查代码
- 遵循 Dart 官方代码风格
- 使用 `analysis_options.yaml` 配置的 linter 规则

### 状态管理
- 使用 Provider 进行全局状态管理
- 每个主要功能模块有对应的 Provider

### 网络请求
- 统一封装在 `ApiService` 中
- 自动添加 JWT Token
- 统一错误处理
- Token 过期自动跳转登录页

### 本地存储
- 使用 SharedPreferences 存储 Token 和用户信息
- 封装在 `StorageService` 中

## 故障排除

### 网络请求失败
1. 检查后端服务是否运行（访问 http://localhost:8080）
2. 检查 API 地址配置是否正确
3. 真机测试时确保手机和电脑在同一局域网
4. 检查 AndroidManifest.xml 中的网络权限

### Token 过期
- 应用会自动检测 401 错误并跳转到登录页
- 重新登录即可

### 构建错误
```bash
flutter clean
flutter pub get
flutter run
```

## 功能验收

### ✅ 用户认证
- [x] 注册功能正常
- [x] 登录功能正常
- [x] Token 自动保存
- [x] 退出登录正常

### ✅ 今日任务
- [x] 任务列表正常显示
- [x] 任务卡片信息完整
- [x] 下拉刷新正常
- [x] 空状态显示正常

### ✅ 复习功能（核心）
- [x] 笔记内容显示正常
- [x] AI 总结折叠/展开正常
- [x] 监督机制倒计时正常
- [x] 倒计时期间按钮禁用
- [x] 倒计时结束后按钮可用
- [x] 三种复习结果提交正常
- [x] 显示下次复习时间
- [x] 自动返回并刷新任务列表

### ✅ 笔记管理
- [x] 笔记列表显示正常
- [x] 分类筛选正常
- [x] 创建笔记正常
- [x] 编辑笔记正常
- [x] 删除笔记正常
- [x] 笔记详情显示正常

### ✅ 分类管理
- [x] 分类列表显示正常
- [x] 创建分类正常
- [x] 编辑分类正常
- [x] 删除分类正常
- [x] 有笔记时无法删除提示

### ✅ UI/UX
- [x] 界面简洁清爽
- [x] Loading 状态显示
- [x] 错误提示友好
- [x] 色彩语义化
- [x] 空状态提示

## 许可证

本项目仅供学习和研究使用。

## 联系方式

如有问题，请提交 Issue。
