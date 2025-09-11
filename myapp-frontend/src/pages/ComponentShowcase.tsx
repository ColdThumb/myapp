import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Input,
  Navbar,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
} from '../components';

const ComponentShowcase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const navItems = [
    { label: '首页', href: '/' },
    { label: '组件展示', href: '/showcase' },
    { label: '关于', href: '/about' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar 演示 */}
      <Navbar
        brand={
          <h1 className="text-xl font-semibold text-primary">
            设计系统展示
          </h1>
        }
        items={navItems}
        actions={
          <Button size="small" variant="primary">
            登录
          </Button>
        }
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            组件库展示
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            基于现代极简主义设计原则构建的组件系统
          </p>
        </div>

        {/* Button 组件展示 */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Button 按钮</h2>
            <p className="text-gray-600 mt-2">不同尺寸和样式的按钮组件</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* 按钮变体 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">样式变体</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              {/* 按钮尺寸 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">尺寸</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="small">Small</Button>
                  <Button size="medium">Medium</Button>
                  <Button size="large">Large</Button>
                </div>
              </div>

              {/* 加载状态 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">加载状态</h3>
                <div className="flex flex-wrap gap-4">
                  <Button loading={loading} onClick={handleLoadingDemo}>
                    {loading ? '加载中...' : '点击加载'}
                  </Button>
                  <Button disabled>禁用状态</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Badge 组件展示 */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Badge 徽章</h2>
            <p className="text-gray-600 mt-2">用于状态标识的徽章组件</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* 徽章变体 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">状态变体</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="success">成功</Badge>
                  <Badge variant="warning">警告</Badge>
                  <Badge variant="error">错误</Badge>
                  <Badge variant="info">信息</Badge>
                  <Badge variant="neutral">中性</Badge>
                </div>
              </div>

              {/* 带点的徽章 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">带状态点</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="success" dot>在线</Badge>
                  <Badge variant="warning" dot>忙碌</Badge>
                  <Badge variant="error" dot>离线</Badge>
                </div>
              </div>

              {/* 尺寸 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">尺寸</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge size="small">小尺寸</Badge>
                  <Badge size="medium">中等尺寸</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Input 组件展示 */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Input 输入框</h2>
            <p className="text-gray-600 mt-2">各种状态和样式的输入框组件</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="基础输入框"
                placeholder="请输入内容"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <Input
                label="带图标的输入框"
                placeholder="搜索..."
                leftIcon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              
              <Input
                label="错误状态"
                placeholder="输入内容"
                error="这是一个错误信息"
              />
              
              <Input
                label="帮助文本"
                placeholder="输入内容"
                helperText="这是帮助文本"
              />
              
              <Input
                label="小尺寸"
                size="small"
                placeholder="小尺寸输入框"
              />
              
              <Input
                label="大尺寸"
                size="large"
                placeholder="大尺寸输入框"
              />
            </div>
          </CardBody>
        </Card>

        {/* Card 组件展示 */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Card 卡片</h2>
            <p className="text-gray-600 mt-2">不同样式的卡片组件</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <h3 className="font-semibold">默认卡片</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600">这是一个默认样式的卡片组件。</p>
                </CardBody>
                <CardFooter>
                  <Button size="small">操作</Button>
                </CardFooter>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <h3 className="font-semibold">悬浮卡片</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600">这是一个带阴影的悬浮卡片。</p>
                </CardBody>
                <CardFooter>
                  <Button size="small" variant="outline">操作</Button>
                </CardFooter>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <h3 className="font-semibold">边框卡片</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600">这是一个带边框的卡片组件。</p>
                </CardBody>
                <CardFooter>
                  <Button size="small" variant="ghost">操作</Button>
                </CardFooter>
              </Card>
            </div>
          </CardBody>
        </Card>

        {/* Skeleton 组件展示 */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Skeleton 骨架屏</h2>
            <p className="text-gray-600 mt-2">用于加载状态的骨架屏组件</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">基础骨架屏</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <SkeletonAvatar />
                    <div className="flex-1">
                      <Skeleton height="1rem" width="60%" className="mb-2" />
                      <Skeleton height="0.875rem" width="40%" />
                    </div>
                  </div>
                  <SkeletonText lines={3} />
                  <div className="flex justify-between">
                    <SkeletonButton />
                    <Skeleton width="4rem" height="1rem" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">卡片骨架屏</h3>
                <Card>
                  <SkeletonCard />
                </Card>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 颜色系统展示 */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">颜色系统</h2>
            <p className="text-gray-600 mt-2">设计系统中的颜色规范</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* 中性色 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">中性色系</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="text-center">
                      <div 
                        className={`w-full h-12 rounded-md bg-gray-${shade} border border-gray-300`}
                      />
                      <span className="text-xs text-gray-600 mt-1 block">{shade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 功能色 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">功能色彩</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-full h-12 rounded-md bg-success border border-gray-300" />
                    <span className="text-sm text-gray-600 mt-2 block">Success</span>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 rounded-md bg-warning border border-gray-300" />
                    <span className="text-sm text-gray-600 mt-2 block">Warning</span>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 rounded-md bg-error border border-gray-300" />
                    <span className="text-sm text-gray-600 mt-2 block">Error</span>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 rounded-md bg-info border border-gray-300" />
                    <span className="text-sm text-gray-600 mt-2 block">Info</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ComponentShowcase;