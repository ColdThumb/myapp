import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../lib/api';
import type { LoginCredentials, AuthResponse, AuthError } from '../lib/api';
import { Button, Input, Card, CardHeader, CardBody } from '../components';

export default function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误信息
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('请填写所有必填字段');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(credentials);
      const data = response.data as AuthResponse;
      
      // 登录成功，跳转到首页
      navigate('/');
      // 可以在这里触发全局状态更新
      window.location.reload(); // 简单的方式刷新页面更新状态
    } catch (err: any) {
      console.error('登录失败:', err);
      
      if (err.response?.data) {
        const errorData = err.response.data as AuthError;
        setError(errorData.error || '登录失败');
      } else {
        setError('网络错误，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">登录账户</h2>
          <p className="mt-2 text-gray-600">欢迎回来！请登录您的账户</p>
        </div>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">用户登录</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱地址
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="请输入邮箱地址"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="请输入密码"
                  required
                  disabled={loading}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有账户？{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  立即注册
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}