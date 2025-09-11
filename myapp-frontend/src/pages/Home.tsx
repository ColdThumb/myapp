import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { commissionApi } from '../lib/api';
import type { Commission } from '../lib/api';
import { Button, Skeleton } from '../components';
import { Hero, Stats, QuickActions, Announcements } from '../components/home';

interface AuthorAnnouncement {
  id: number;
  title: string;
  content: string;
  date: string;
  important?: boolean;
}

interface AuthorInfo {
  name: string;
  bio: string;
  avatar?: string;
  specialties: string[];
  experience: string;
}

interface DashboardStats {
  pendingCommissions: number;
  inProgressCommissions: number;
  completedCommissions: number;
  totalArticles: number;
}

export default function Home() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    pendingCommissions: 0,
    inProgressCommissions: 0,
    completedCommissions: 0,
    totalArticles: 0
  });
  const [loading, setLoading] = useState(true);

  // 作者信息
  const authorInfo: AuthorInfo = {
    name: '张三',
    bio: '专业内容创作者，擅长技术文档、产品介绍和创意写作。拥有5年以上的写作经验，为多家知名企业提供过内容创作服务。',
    specialties: ['技术文档', '产品介绍', '创意写作', '营销文案'],
    experience: '5年+'
  };

  // 获取委托数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const commissionsData = await commissionApi.getCommissions();
        setCommissions(commissionsData);
        
        // 计算统计数据
        const pending = commissionsData.filter(c => c.status === 'pending').length;
        const inProgress = commissionsData.filter(c => c.status === 'in_progress').length;
        const completed = commissionsData.filter(c => c.status === 'completed').length;
        
        setStats({
          pendingCommissions: pending,
          inProgressCommissions: inProgress,
          completedCommissions: completed,
          totalArticles: 12 // 这里可以从文章API获取
        });
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 作者公告数据
  const [announcements] = useState<AuthorAnnouncement[]>([
    {
      id: 1,
      title: '欢迎来到我的个人创作空间',
      content: '大家好！我是张三，一名专业的内容创作者。在这里，我会分享我的创作心得，发布最新的作品，同时也接受各种内容创作的委托。期待与大家的合作！',
      date: '2024-01-15',
      important: true
    },
    {
      id: 2,
      title: '最新作品发布',
      content: '刚刚完成了一篇关于人工智能发展趋势的深度分析文章，欢迎大家阅读和讨论。',
      date: '2024-01-20'
    },
    {
      id: 3,
      title: '约稿服务说明',
      content: '目前接受技术文档、产品介绍、创意写作等类型的约稿。具体需求请通过约稿页面提交，我会在24小时内回复。',
      date: '2024-01-25',
      important: true
    },
    {
      id: 4,
      title: '春节期间服务安排',
      content: '春节期间（2月10日-17日）约稿服务暂停，已接受的委托会按时完成。祝大家新年快乐！',
      date: '2024-02-01'
    }
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Skeleton */}
        <div className="bg-primary py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Skeleton height="3rem" width="80%" className="bg-white/20" />
                  <Skeleton height="1.5rem" width="100%" className="bg-white/20" />
                  <Skeleton height="1.5rem" width="90%" className="bg-white/20" />
                </div>
                <div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} height="2rem" width="5rem" className="bg-white/20 rounded-full" />
                  ))}
                </div>
                <div className="flex gap-4">
                  <Skeleton height="3rem" width="8rem" className="bg-white/20" />
                  <Skeleton height="3rem" width="8rem" className="bg-white/20" />
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Skeleton variant="circular" width="12rem" height="12rem" className="bg-white/20" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Skeleton */}
        <Stats stats={stats} loading={true} />
        
        {/* Quick Actions Skeleton */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <Skeleton height="2rem" width="12rem" className="mx-auto mb-4" />
              <Skeleton height="1.5rem" width="24rem" className="mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-8 space-y-6">
                  <Skeleton variant="circular" width="4rem" height="4rem" className="mx-auto" />
                  <Skeleton height="1.5rem" width="8rem" className="mx-auto" />
                  <Skeleton height="1rem" width="100%" />
                  <Skeleton height="1rem" width="80%" className="mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero authorInfo={authorInfo} />
      
      {/* Stats Section */}
      <Stats stats={stats} />
      
      {/* Quick Actions Section */}
      <QuickActions />
      
      {/* Announcements Section */}
      <Announcements announcements={announcements} />
      
      {/* Mobile CTA */}
      <div className="md:hidden py-8 bg-gray-50">
        <div className="max-w-sm mx-auto px-6">
          <Button 
            size="large" 
            className="w-full"
            asChild
          >
            <Link to="/commission">
              我要约稿
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
