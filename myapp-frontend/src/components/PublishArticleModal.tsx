import React, { useState } from 'react';
import { articleApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface PublishArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PublishArticleModal: React.FC<PublishArticleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visibility, setVisibility] = useState<'publicly_visible' | 'restricted' | 'privately_visible'>('publicly_visible');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    if (!user) {
      setError('请先登录');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const articleData = {
        article: {
          title: title.trim(),
          body: body.trim(),
          visibility,
          author_id: user.id,
        }
      };
      
      console.log('发送的文章数据:', articleData);
      console.log('当前用户信息:', user);
      
      await articleApi.createArticle(articleData);
      
      // 重置表单
      setTitle('');
      setBody('');
      setVisibility('publicly_visible');
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('发布文章失败:', error);
      console.error('错误详情:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        user: user
      });
      
      if (error.response?.status === 401) {
        setError('请先登录后再发布文章');
      } else if (error.response?.status === 422) {
        const errorMsg = error.response?.data?.errors ? 
          Object.values(error.response.data.errors).flat().join(', ') :
          error.response?.data?.error || '数据验证失败';
        setError(`发布失败: ${errorMsg}`);
      } else {
        setError(error.response?.data?.error || '发布失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setBody('');
      setVisibility('publicly_visible');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">发布新文章</h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="card-body space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                文章标题 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入文章标题"
                className="input w-full"
                disabled={loading}
                maxLength={200}
              />
            </div>
            
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                可见性设置
              </label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'publicly_visible' | 'restricted' | 'privately_visible')}
                className="input w-full"
                disabled={loading}
              >
                <option value="publicly_visible">公开 - 所有人可见</option>
                <option value="restricted">受限 - 需要验证访问</option>
                <option value="privately_visible">私有 - 仅自己可见</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                文章内容 *
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="请输入文章内容"
                rows={12}
                className="input w-full resize-none"
                disabled={loading}
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>* 发布文章后，您将自动成为作者用户</p>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="btn btn-outline"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !body.trim()}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    发布中...
                  </>
                ) : (
                  '发布文章'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishArticleModal;