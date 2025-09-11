import React from 'react';
import { Card, Badge } from '../index';

interface AuthorAnnouncement {
  id: number;
  title: string;
  content: string;
  date: string;
  important?: boolean;
}

interface AnnouncementsProps {
  announcements: AuthorAnnouncement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">最新公告</h2>
          <p className="text-lg text-gray-600">
            了解最新动态和重要通知
          </p>
        </div>
        
        <Card variant="elevated" className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {announcements.map((announcement, index) => (
              <article 
                key={announcement.id} 
                className="p-8 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="space-y-4">
                  {/* 标题和标签 */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {announcement.important && (
                        <Badge variant="error" className="flex-shrink-0 mt-1">
                          重要
                        </Badge>
                      )}
                      <h3 className="text-xl font-medium text-gray-900 leading-tight">
                        {announcement.title}
                      </h3>
                    </div>
                    <time 
                      className="text-sm text-gray-500 flex-shrink-0"
                      dateTime={announcement.date}
                    >
                      {formatDate(announcement.date)}
                    </time>
                  </div>
                  
                  {/* 内容 */}
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>
                  
                  {/* 分隔线（除了最后一个） */}
                  {index < announcements.length - 1 && (
                    <div className="pt-4">
                      <div className="w-16 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          
          {/* 查看更多 */}
          <div className="bg-gray-50 px-8 py-6 text-center">
            <button className="text-primary hover:text-primary-light font-medium transition-colors duration-200">
              查看所有公告
              <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Announcements;