import React from 'react';

interface NewCommissionForm {
  title: string;
  description: string;
  budget: string;
  estimated_delivery_date: string;
  customer_email: string;
  customer_name: string;
}

interface CommissionFormProps {
  show: boolean;
  submitting: boolean;
  formData: NewCommissionForm;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CommissionForm({
  show,
  submitting,
  formData,
  onClose,
  onSubmit,
  onInputChange
}: CommissionFormProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="card-header">
          <h3 className="text-xl font-semibold">提交约稿需求</h3>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">您的姓名 *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={onInputChange}
                  required
                  disabled={submitting}
                  className="input"
                  placeholder="请输入您的姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系邮箱 *</label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={onInputChange}
                  required
                  disabled={submitting}
                  className="input"
                  placeholder="请输入您的邮箱"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">委托标题 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                required
                disabled={submitting}
                className="input"
                placeholder="请简要描述您的需求"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">详细描述 *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                required
                disabled={submitting}
                rows={4}
                className="input resize-none"
                placeholder="请详细描述您的需求，包括内容类型、字数要求、风格偏好等"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预算</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={onInputChange}
                  disabled={submitting}
                  className="input"
                  placeholder="预算金额（可选）"
                />
              </div>
              {/* 预计交付日期由系统自动计算，不再由用户填写 */}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="btn btn-outline"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在提交并发送邮件...
                  </>
                ) : (
                  '提交委托'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}