import React from 'react';
import type { Commission as CommissionType, User } from '../../lib/api';

interface NewCommissionForm {
  title: string;
  description: string;
  budget: string;
  estimated_delivery_date: string;
  customer_email: string;
  customer_name: string;
}

interface CommissionDetailProps {
  show: boolean;
  commission: CommissionType | null;
  currentUser: User | null;
  isEditing: boolean;
  submitting: boolean;
  deleting: boolean;
  editingData: NewCommissionForm;
  onClose: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  onStatusChange: (commissionId: number, newStatus: string) => void;
  onEditInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// 根据状态返回对应的标签样式和进度
const getStatusInfo = (status: CommissionType['status']) => {
  const statusMap = {
    open: { text: '待接单', bgColor: 'bg-green-100', textColor: 'text-green-800', progress: 0 },
    assigned: { text: '已分配', bgColor: 'bg-blue-100', textColor: 'text-blue-800', progress: 25 },
    in_progress: { text: '进行中', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', progress: 50 },
    completed: { text: '已完成', bgColor: 'bg-gray-100', textColor: 'text-gray-800', progress: 100 },
    cancelled: { text: '已取消', bgColor: 'bg-red-100', textColor: 'text-red-800', progress: 0 }
  };

  return statusMap[status] || { text: status, bgColor: 'bg-gray-100', textColor: 'text-gray-800', progress: 0 };
};

export default function CommissionDetail({
  show,
  commission,
  currentUser,
  isEditing,
  submitting,
  deleting,
  editingData,
  onClose,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onStatusChange,
  onEditInputChange
}: CommissionDetailProps) {
  if (!show || !commission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold">委托详情</h3>
              {/* 编辑和删除按钮 - 只有委托状态为open且非作者用户才显示 */}
              {commission.status === 'open' && (!currentUser || !currentUser.is_author) && (
                <div className="flex space-x-2">
                  <button
                    onClick={onStartEdit}
                    disabled={isEditing || submitting || deleting}
                    className="btn btn-outline btn-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    编辑
                  </button>
                  <button
                    onClick={onDelete}
                    disabled={isEditing || submitting || deleting}
                    className="btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {deleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        删除中...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        删除
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="card-body space-y-6">
          {/* 委托基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">委托信息</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">委托标题</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={editingData.title}
                      onChange={onEditInputChange}
                      className="mt-1 input"
                      placeholder="请输入委托标题"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{commission.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">委托状态</label>
                  {currentUser && currentUser.is_author ? (
                    <div className="mt-1 flex items-center space-x-3">
                      <select
                        value={commission.status}
                        onChange={(e) => onStatusChange(commission.id, e.target.value)}
                        className="input w-auto"
                      >
                        <option value="open">待接受</option>
                        <option value="assigned">已分配</option>
                        <option value="in_progress">进行中</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                      </select>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusInfo(commission.status).bgColor
                      } ${
                        getStatusInfo(commission.status).textColor
                      }`}>
                        {getStatusInfo(commission.status).text}
                      </span>
                    </div>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      getStatusInfo(commission.status).bgColor
                    } ${
                      getStatusInfo(commission.status).textColor
                    }`}>
                      {getStatusInfo(commission.status).text}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">预算</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="budget"
                      value={editingData.budget}
                      onChange={onEditInputChange}
                      className="mt-1 input"
                      placeholder="预算金额（可选）"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {commission.budget ? `¥${commission.budget}` : '面议'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">发布时间</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(commission.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">预计交付时间</label>
                  <p className="mt-1 text-gray-900">
                    {commission.estimated_delivery_date 
                      ? new Date(commission.estimated_delivery_date).toLocaleDateString()
                      : '未设置'
                    }
                  </p>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">预计交付时间由系统自动计算，不可手动修改</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">客户信息</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">客户姓名</label>
                  <p className="mt-1 text-gray-900">{commission.customer?.name || '未提供'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">联系邮箱</label>
                  <p className="mt-1 text-gray-900">{commission.customer?.email || '未提供'}</p>
                </div>
              </div>
              
              {commission.assigned_author && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">负责作者</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">作者姓名</label>
                      <p className="mt-1 text-gray-900">{commission.assigned_author.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">作者邮箱</label>
                      <p className="mt-1 text-gray-900">{commission.assigned_author.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 委托描述 */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">详细描述</h4>
            {isEditing ? (
              <textarea
                name="description"
                value={editingData.description}
                onChange={onEditInputChange}
                rows={4}
                className="input resize-none w-full"
                placeholder="请详细描述您的需求"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {commission.description || '暂无描述'}
                </p>
              </div>
            )}
          </div>
          
          {/* 进度信息 */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">进度信息</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>完成进度</span>
                <span className="font-medium">{getStatusInfo(commission.status).progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getStatusInfo(commission.status).progress === 100 ? 'bg-green-500' : 
                    getStatusInfo(commission.status).progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${getStatusInfo(commission.status).progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-footer">
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={onCancelEdit}
                  disabled={submitting}
                  className="btn btn-outline"
                >
                  取消编辑
                </button>
                <button
                  onClick={onSaveEdit}
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      保存中...
                    </>
                  ) : (
                    '保存修改'
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="btn btn-outline"
              >
                关闭
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}