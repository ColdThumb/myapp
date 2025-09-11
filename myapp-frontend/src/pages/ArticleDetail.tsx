import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleApi } from '../lib/api';
import type { Article } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerForAccess, setAnswerForAccess] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [challengePrompt, setChallengePrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editVisibility, setEditVisibility] = useState<'publicly_visible' | 'restricted' | 'privately_visible'>('publicly_visible');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await articleApi.getArticle(parseInt(id));
      const articleData = response.data;
      setArticle(articleData);
      // 初始化编辑表单数据
      setEditTitle(articleData.title);
      setEditBody(articleData.body);
      setEditVisibility(articleData.visibility as 'publicly_visible' | 'restricted' | 'privately_visible');
    } catch (error: any) {
      console.error('获取文章详情失败:', error);
      if (error.response?.status === 404) {
        setError('文章不存在');
      } else {
        setError('获取文章详情失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestrictedAccess = async () => {
    if (!article) return;
    
    try {
      const challengeResponse = await articleApi.getChallenge(article.id);
      setChallengePrompt(challengeResponse.data.prompt);
      setShowAnswerModal(true);
    } catch (error) {
      console.error('获取验证问题失败:', error);
      setError('获取验证问题失败');
    }
  };

  const handleAnswerVerification = async () => {
    if (!article || !answerForAccess.trim()) {
      setAnswerError('请输入答案');
      return;
    }

    try {
      const response = await articleApi.verifyAnswer(article.id, answerForAccess);
      if (response.data.success) {
        setShowAnswerModal(false);
        setAnswerForAccess('');
        setAnswerError('');
        setChallengePrompt('');
        // 重新获取文章内容
        fetchArticle();
      } else {
        setAnswerError('答案错误，请重试');
      }
    } catch (error) {
      console.error('验证答案失败:', error);
      setAnswerError('验证失败，请重试');
    }
  };

  const getVisibilityInfo = (visibility: string) => {
    switch (visibility) {
      case 'publicly_visible':
        return { text: '公开', class: 'badge-success' };
      case 'restricted':
        return { text: '受限', class: 'badge-warning' };
      case 'privately_visible':
        return { text: '私有', class: 'badge-danger' };
      default:
        return { text: '未知', class: 'badge-info' };
    }
  };

  const canViewContent = () => {
    if (!article) return false;
    if (article.visibility === 'publicly_visible') return true;
    if (article.visibility === 'privately_visible' && user?.id === article.author_id) return true;
    // 对于受限文章，这里简化处理，实际应该检查是否已验证
    return article.visibility === 'restricted';
  };

  const canEditArticle = () => {
    return article && user && user.id === article.author_id;
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!article) return;
    setIsEditing(false);
    // 重置编辑表单数据
    setEditTitle(article.title);
    setEditBody(article.body);
    setEditVisibility(article.visibility as 'publicly_visible' | 'restricted' | 'privately_visible');
  };

  const handleSaveEdit = async () => {
    if (!article || !id) return;
    
    if (!editTitle.trim() || !editBody.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    try {
      setSaving(true);
      const response = await articleApi.updateArticle(article.id, {
        article: {
          title: editTitle.trim(),
          body: editBody.trim(),
          visibility: editVisibility,
          author_id: article.author_id
        }
      });
      
      // 更新文章数据
      const updatedArticle = response.data;
      setArticle(updatedArticle);
      setIsEditing(false);
      setError('');
    } catch (error: any) {
      console.error('更新文章失败:', error);
      setError('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
          <button
            onClick={() => navigate('/articles')}
            className="btn btn-primary"
          >
            返回文章列表
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const visibilityInfo = getVisibilityInfo(article.visibility);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/articles')}
            className="btn btn-outline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回文章列表
          </button>
        </div>

        {/* 文章内容 */}
        <article className="card">
          <div className="card-header">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
                  {canEditArticle() && !isEditing && (
                    <button
                      onClick={handleStartEdit}
                      className="btn btn-outline ml-4"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      编辑文章
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <button
                      onClick={() => navigate('/')}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {article.author?.name || '未知作者'}
                    </button>
                  </span>
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
              <span className={`badge ml-4 ${visibilityInfo.class}`}>
                {visibilityInfo.text}
              </span>
            </div>
          </div>

          <div className="card-body">
            {isEditing ? (
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                    文章标题 *
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input w-full"
                    disabled={saving}
                    maxLength={200}
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-visibility" className="block text-sm font-medium text-gray-700 mb-2">
                    可见性设置
                  </label>
                  <select
                    id="edit-visibility"
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value as 'publicly_visible' | 'restricted' | 'privately_visible')}
                    className="input w-full"
                    disabled={saving}
                  >
                    <option value="publicly_visible">公开 - 所有人可见</option>
                    <option value="restricted">受限 - 需要验证访问</option>
                    <option value="privately_visible">私有 - 仅自己可见</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-body" className="block text-sm font-medium text-gray-700 mb-2">
                    文章内容 *
                  </label>
                  <textarea
                    id="edit-body"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={15}
                    className="input w-full resize-none"
                    disabled={saving}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="btn btn-outline"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving || !editTitle.trim() || !editBody.trim()}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        保存中...
                      </>
                    ) : (
                      '保存更改'
                    )}
                  </button>
                </div>
              </div>
            ) : canViewContent() ? (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {article.body}
                </div>
              </div>
            ) : article.visibility === 'restricted' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">需要验证访问权限</h3>
                <p className="text-gray-600 mb-6">这篇文章需要回答问题才能查看完整内容</p>
                <button
                  onClick={handleRestrictedAccess}
                  className="btn btn-primary"
                >
                  验证访问权限
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">无法访问</h3>
                <p className="text-gray-600">这是一篇私有文章，仅作者可见</p>
              </div>
            )}
          </div>
        </article>

        {/* 答案验证模态框 */}
        {showAnswerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card w-96 max-w-md mx-4">
              <div className="card-header">
                <h3 className="text-lg font-semibold">验证访问权限</h3>
              </div>
              <div className="card-body">
                <p className="text-gray-600 mb-4">
                  文章《{article.title}》需要验证访问权限
                </p>
                {challengePrompt && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 font-medium mb-1">验证问题：</p>
                    <p className="text-blue-700">{challengePrompt}</p>
                  </div>
                )}
                <input
                  type="text"
                  value={answerForAccess}
                  onChange={(e) => {
                    setAnswerForAccess(e.target.value);
                    setAnswerError('');
                  }}
                  placeholder="请输入答案"
                  className="input w-full mb-2"
                />
                {answerError && (
                  <p className="text-red-500 text-sm mb-4">{answerError}</p>
                )}
              </div>
              <div className="card-footer">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowAnswerModal(false);
                      setAnswerForAccess('');
                      setAnswerError('');
                      setChallengePrompt('');
                    }}
                    className="btn btn-outline"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAnswerVerification}
                    className="btn btn-primary"
                  >
                    验证
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}