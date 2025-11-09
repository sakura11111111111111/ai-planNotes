// 登录页面
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth';
import { login } from '../../api/auth';
import { validateUsername, validatePassword } from '../../utils/validators';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除该字段的错误
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(formData);
      // 保存认证信息
      setAuth(response.token, { id: 0, username: formData.username, email: '' });
      // 跳转到首页
      navigate('/');
    } catch (error: any) {
      setApiError(error.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <BookOpen className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Plan Notes</h1>
          <p className="text-blue-100">智能复习笔记系统</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-lg shadow-xl p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">登录</h2>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="用户名"
              name="username"
              type="text"
              placeholder="请输入用户名"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              fullWidth
              autoComplete="username"
            />

            <Input
              label="密码"
              name="password"
              type="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              fullWidth
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth loading={loading}>
              登录
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              还没有账号？
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
