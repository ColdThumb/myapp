import React, { useMemo } from 'react';
import type { Commission as CommissionType } from '../../lib/api';

interface CommissionListProps {
  commissions: CommissionType[];
  currentPage: number;
  itemsPerPage: number;
  onViewDetail: (commission: CommissionType) => void;
  onPageChange: (page: number) => void;
  onShowForm: () => void;
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

export default function CommissionList({
  commissions,
  currentPage,
  itemsPerPage,
  onViewDetail,
  onPageChange,
  onShowForm
}: CommissionListProps) {
  // 分页计算 - 使用useMemo优化
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(commissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCommissions = commissions.slice(startIndex, endIndex);
    
    return {
      totalPages,
      currentCommissions
    };
  }, [commissions, currentPage, itemsPerPage]);
  
  const { totalPages, currentCommissions } = paginationData;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">当前委托进度</h2>
        <span className="text-sm text-gray-500">
          共 {commissions.length} 个委托
          {totalPages > 1 && (
            <span className="ml-2">第 {currentPage} / {totalPages} 页</span>
          )}
        </span>
      </div>
      
      {commissions.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无委托</h3>
            <p className="text-gray-500 mb-6">还没有任何委托，点击下方按钮提交您的第一个约稿需求</p>
            <button 
              onClick={onShowForm}
              className="btn btn-primary"
            >
              提交约稿
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCommissions.map((commission) => {
              const statusInfo = getStatusInfo(commission.status);
              return (
                <div key={commission.id} className="card cursor-pointer group"
                     onClick={() => onViewDetail(commission)}>
                  <div className="card-header">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {commission.title}
                      </h4>
                      <span className={`badge ml-2 flex-shrink-0 ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    {/* 进度条 */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>完成进度</span>
                        <span className="font-medium">{statusInfo.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            statusInfo.progress === 100 ? 'bg-green-500' : 
                            statusInfo.progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${statusInfo.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* 委托信息 */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>预算:</span>
                        <span className="font-medium text-gray-900">
                          {commission.budget ? `¥${commission.budget}` : '面议'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>发布时间:</span>
                        <span>{new Date(commission.created_at).toLocaleDateString()}</span>
                      </div>
                      {commission.estimated_delivery_date && (
                        <div className="flex justify-between">
                          <span>预计交付:</span>
                          <span>{new Date(commission.estimated_delivery_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <button className="btn btn-outline w-full group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700">
                      查看详情
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 分页组件 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                {/* 上一页按钮 */}
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                
                {/* 页码按钮 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isCurrentPage = page === currentPage;
                  const shouldShow = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!shouldShow) {
                    // 显示省略号
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-3 py-2 text-sm font-medium text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {/* 下一页按钮 */}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </nav>
            </div>
          )}
        </>
      )}
      
      {/* 我要约稿按钮 */}
      {commissions.length > 0 && (
        <div className="text-center mt-8">
          <button 
            onClick={onShowForm}
            className="btn btn-primary px-8 py-3 text-lg font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            我要约稿
          </button>
        </div>
      )}
    </div>
  );
}