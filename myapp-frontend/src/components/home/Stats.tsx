import React from 'react';
import { Card } from '../index';

interface DashboardStats {
  pendingCommissions: number;
  inProgressCommissions: number;
  completedCommissions: number;
  totalArticles: number;
}

interface StatsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const Stats: React.FC<StatsProps> = ({ stats, loading = false }) => {
  const statsData = [
    {
      label: '待处理委托',
      value: stats.pendingCommissions,
      description: '需要回复的新委托',
      color: 'text-warning',
      bgColor: 'bg-warning-light',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: '进行中委托',
      value: stats.inProgressCommissions,
      description: '正在创作的项目',
      color: 'text-info',
      bgColor: 'bg-info-light',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: '已完成委托',
      value: stats.completedCommissions,
      description: '成功交付的项目',
      color: 'text-success',
      bgColor: 'bg-success-light',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: '发布文章',
      value: stats.totalArticles,
      description: '公开分享的作品',
      color: 'text-primary',
      bgColor: 'bg-gray-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto" />
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
                  <div className="h-3 bg-gray-200 rounded w-32 mx-auto" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">创作数据</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            实时展示我的创作成果和服务状态
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card 
              key={index} 
              variant="elevated" 
              className="text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-6 space-y-4">
                {/* 图标 */}
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`${stat.color} flex-shrink-0`}>
                    {stat.icon}
                  </div>
                </div>
                
                {/* 数值 */}
                <div className={`text-4xl font-light ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </div>
                
                {/* 标签 */}
                <div className="space-y-1">
                  <div className="text-base font-medium text-gray-900">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.description}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;