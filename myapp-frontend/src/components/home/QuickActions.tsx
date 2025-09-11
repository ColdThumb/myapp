import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../index';

interface ActionItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const QuickActions: React.FC = () => {
  const actions: ActionItem[] = [
    {
      title: '提交约稿',
      description: '发布您的创作需求，获得专业的内容创作服务',
      href: '/commission',
      color: 'text-primary',
      bgColor: 'bg-gray-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      title: '浏览文章',
      description: '查看已发布的文章作品，了解创作风格和质量',
      href: '/articles',
      color: 'text-success',
      bgColor: 'bg-success-light',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: '联系咨询',
      description: '有疑问？随时联系我进行项目咨询和沟通',
      href: '#contact',
      color: 'text-info',
      bgColor: 'bg-info-light',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">快速开始</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            选择您需要的服务，开启我们的合作之旅
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {actions.map((action, index) => (
            <Link 
              key={index}
              to={action.href}
              className="group block"
            >
              <Card 
                variant="elevated" 
                className="h-full text-center hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
              >
                <div className="p-8 space-y-6">
                  {/* 图标 */}
                  <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`${action.color} flex-shrink-0`}>
                      {action.icon}
                    </div>
                  </div>
                  
                  {/* 标题 */}
                  <h3 className="text-xl font-medium text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {action.title}
                  </h3>
                  
                  {/* 描述 */}
                  <p className="text-gray-600 leading-relaxed">
                    {action.description}
                  </p>
                  
                  {/* 箭头指示 */}
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;