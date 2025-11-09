// Header 组件
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Home, FolderOpen, StickyNote } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo 和标题 */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="text-blue-600" size={28} />
            <span className="text-xl font-bold text-gray-900">AI Plan Notes</span>
          </Link>

          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home size={18} />
              <span>首页</span>
            </Link>
            <Link
              to="/notes"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <StickyNote size={18} />
              <span>笔记</span>
            </Link>
            <Link
              to="/categories"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FolderOpen size={18} />
              <span>分类</span>
            </Link>
          </nav>

          {/* 用户信息和退出 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              欢迎，<span className="font-medium">{user?.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">退出</span>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端导航 */}
      <nav className="md:hidden bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-around">
            <Link
              to="/"
              className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home size={20} />
              <span className="text-xs mt-1">首页</span>
            </Link>
            <Link
              to="/notes"
              className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <StickyNote size={20} />
              <span className="text-xs mt-1">笔记</span>
            </Link>
            <Link
              to="/categories"
              className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FolderOpen size={20} />
              <span className="text-xs mt-1">分类</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
