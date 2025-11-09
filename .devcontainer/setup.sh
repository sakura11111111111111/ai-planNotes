#!/bin/bash

echo "🚀 Setting up Smart Review Notes development environment..."

# 等待 MySQL 启动
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# 配置后端环境变量
echo "📝 Setting up backend environment..."
export DB_PASSWORD=aipassword
export JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-256-bits-long-for-security

# 安装后端依赖
echo "📦 Installing backend dependencies..."
if [ -f "pom.xml" ]; then
    mvn clean install -DskipTests
fi

# 安装 Flutter 依赖
echo "📱 Installing Flutter dependencies..."
if [ -d "flutter_app" ]; then
    cd flutter_app
    flutter pub get
    cd ..
fi

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Quick Start Guide:"
echo "  1. Start backend:  mvn spring-boot:run"
echo "  2. Start Flutter:  cd flutter_app && flutter run -d web-server --web-port 5900"
echo ""
echo "📖 Access points:"
echo "  - Backend API: http://localhost:8080"
echo "  - Flutter Web: http://localhost:5900"
echo ""
