import React from 'react';

export default function ServiceIntro() {
  return (
    <>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">约稿服务</h1>
        <p className="text-gray-600">专业的内容创作服务，为您提供高质量的文案和文档</p>
      </div>
      
      {/* 服务说明卡片 */}
      <div className="card mb-8 border-l-4 border-l-blue-500">
        <div className="card-body">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">服务介绍</h3>
              <p className="text-gray-700">欢迎约稿！我提供专业的内容创作服务，包括技术文档、产品介绍、创意写作等。请查看下方的委托进度，或提交新的约稿需求。</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 搜索和筛选栏 */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="搜索委托标题或描述..." 
                className="input w-full"
              />
            </div>
            <div className="flex gap-2">
              <select className="input w-auto">
                <option value="">全部状态</option>
                <option value="pending">待处理</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
              <button className="btn btn-outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                筛选
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}