import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../lib/api';
import type { RegisterData, AuthResponse, AuthError } from '../lib/api';
import { Button, Input, Card, CardHeader, CardBody } from '../components';

export default function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除错误信息
    if (errors.length > 0) setErrors([]);
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) {
      newErrors.push('姓名不能为空');
    }
    
    if (!formData.email.trim()) {
      newErrors.push('邮箱不能为空');
    }
    
    if (!formData.password) {
      newErrors.push('密码不能为空');
    } else if (formData.password.length < 6) {
      newErrors.push('密码长度至少6位');
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.push('两次输入的密码不一致');
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const response = await authApi.register(formData);
      const data = response.data as AuthResponse;
      
      // 注册成功，跳转到首页
      navigate('/');
      // 可以在这里触发全局状态更新
      window.location.reload(); // 简单的方式刷新页面更新状态
    } catch (err: any) {
      console.error('注册失败:', err);
      
      if (err.response?.data) {
        const errorData = err.response.data as AuthError;
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors([errorData.error || '注册失败']);
        }
      } else {
        setErrors(['网络错误，请稍后重试']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">创建账户</h2>
          <p className="mt-2 text-gray-600">加入我们，开始您的创作之旅</p>
        </div>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">用户注册</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="text-red-600 text-sm space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入您的姓名"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱地址 *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="请输入邮箱地址"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码 *
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="请输入密码（至少6位）"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码 *
                </label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  placeholder="请再次输入密码"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  个人简介
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="简单介绍一下自己（可选）"
                  rows={3}
                  className="input resize-none"
                  disabled={loading}
                />
              </div>
              

              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? '注册中...' : '注册账户'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                已有账户？{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  立即登录
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}