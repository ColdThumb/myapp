import React from 'react';

interface EmailVerificationModalProps {
  show: boolean;
  email: string;
  onClose: () => void;
  onEmailChange: (email: string) => void;
  onVerify: () => void;
}

export default function EmailVerificationModal({
  show,
  email,
  onClose,
  onEmailChange,
  onVerify
}: EmailVerificationModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-96 max-w-md mx-4">
        <div className="card-header">
          <h3 className="text-lg font-semibold">验证身份</h3>
        </div>
        <div className="card-body">
          <p className="text-gray-600 mb-4">请输入您提交委托时使用的邮箱地址以查看详情：</p>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="请输入邮箱地址"
            className="input mb-4"
          />
        </div>
        <div className="card-footer">
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              取消
            </button>
            <button
              onClick={onVerify}
              className="btn btn-primary"
            >
              验证
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}