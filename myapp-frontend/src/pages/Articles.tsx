import { useState, useEffect } from 'react';
import { articleApi } from '../lib/api';
import type { Article } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PublishArticleModal from '../components/PublishArticleModal';

export default function Articles() {
  const { user, isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // 移除了不再需要的答案验证相关状态，现在由详情页面处理
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [actualSearchQuery, setActualSearchQuery] = useState('');

  useEffect(() => {
    fetchArticles();
  }, [currentPage, actualSearchQuery, visibilityFilter]);

  useEffect(() => {
    setCurrentPage(1); // 搜索或筛选时重置到第一页
  }, [actualSearchQuery, visibilityFilter]);

  const handleSearch = () => {
    setActualSearchQuery(searchQuery);
  };

  const handleReset = () => {
    setSearchQuery('');
    setVisibilityFilter('');
    setActualSearchQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleApi.getArticles(
        currentPage, 
        10, 
        actualSearchQuery || undefined, 
        visibilityFilter || undefined
      );
      setArticles(response.data.articles);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('获取文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return { text: '公开', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'restricted':
        return { text: '受限', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      case 'private':
        return { text: '私有', bgColor: 'bg-red-100', textColor: 'text-red-800' };
      default:
        return { text: '未知', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };

  const handleArticleClick = (article: Article) => {
    // 直接跳转到文章详情页面，让详情页面处理权限验证
    window.open(`/articles/${article.id}`, '_blank');
  };

  // 移除了handleAnswerVerification函数，现在由详情页面处理验证逻辑

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">文章列表</h1>
              <p className="text-gray-600">浏览所有已发布的文章内容</p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowPublishModal(true)}
                className="btn btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                发布文章
              </button>
            )}
          </div>
        </div>
        
        {/* 搜索和筛选栏 */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="搜索文章标题或内容..." 
                  className="input w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="input w-auto"
                  value={visibilityFilter}
                  onChange={(e) => setVisibilityFilter(e.target.value)}
                >
                  <option value="">全部可见性</option>
                  <option value="publicly_visible">公开</option>
                  <option value="restricted">受限</option>
                  <option value="privately_visible">私有</option>
                </select>
                <button 
                  className="btn btn-primary"
                  onClick={handleSearch}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  搜索
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={handleReset}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重置
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 权限说明 */}
        <div className="card mb-8">
          <div className="card-body">
            <h3 className="font-semibold mb-4 text-gray-900">文章权限说明</h3>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="badge badge-success">公开</span>
                <span className="text-gray-600">所有人可阅读</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-warning">部分公开</span>
                <span className="text-gray-600">需要答案验证</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-danger">不公开</span>
                <span className="text-gray-600">仅作者可见</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 文章统计 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">所有文章</h2>
          <span className="text-sm text-gray-500">共 {articles.length} 篇文章</span>
        </div>
        
        {articles.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无文章</h3>
              <p className="text-gray-500">还没有发布任何文章</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {articles.map((article) => {
              const getVisibilityInfo = (visibility: string) => {
                switch (visibility) {
                  case 'public':
                    return { text: '公开', class: 'badge-success' };
                  case 'restricted':
                    return { text: '部分公开', class: 'badge-warning' };
                  case 'private':
                    return { text: '不公开', class: 'badge-danger' };
                  default:
                    return { text: '未知', class: 'badge-info' };
                }
              };
              
              const visibilityInfo = getVisibilityInfo(article.visibility);
              
              return (
                <div key={article.id} className="card group cursor-pointer"
                     onClick={() => handleArticleClick(article)}>
                  <div className="card-header">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <span className={`badge ml-2 flex-shrink-0 ${visibilityInfo.class}`}>
                        {visibilityInfo.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.body.length > 150 
                        ? `${article.body.substring(0, 150)}...` 
                        : article.body}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        {article.updated_at !== article.created_at && (
                          <span className="flex items-center text-orange-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            已更新
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <button className="btn btn-outline w-full group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700">
                      {article.visibility === 'private' 
                        ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            私有文章
                          </>
                        )
                        : article.visibility === 'restricted'
                        ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.586l4.707-4.707C10.923 3.663 11.596 4 12.414 4.414z" />
                            </svg>
                            验证后阅读
                          </>
                        )
                        : (
                          <>
                            查看详情
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="card">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  显示第 {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, articles.length)} 条，共 {articles.length} 条记录
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    上一页
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page 
                              ? 'bg-blue-500 text-white border-blue-500' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 答案验证功能已移至文章详情页面 */}
        
        {/* 发布文章模态框 */}
        <PublishArticleModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          onSuccess={() => {
            fetchArticles(); // 重新获取文章列表
          }}
        />
      </div>
    </div>
  );
}
