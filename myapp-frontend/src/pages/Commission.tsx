import { useState, useEffect, useReducer, useMemo, useCallback } from 'react';
import { commissionApi, authApi } from '../lib/api';
import type { Commission as CommissionType, User } from '../lib/api';
import {
  CommissionList,
  CommissionForm,
  CommissionDetail,
  EmailVerificationModal,
  ServiceIntro
} from '../components/commission';

// 通用错误处理函数
const handleApiError = (error: any, defaultMessage: string = '操作失败，请稍后再试'): string => {
  console.error('API错误:', error);
  
  // 网络错误
  if (error.request && !error.response) {
    return '网络连接失败，请检查网络连接后重试';
  }
  
  // 服务器响应错误
  if (error.response) {
    const { status, data } = error.response;
    
    // 处理特定状态码
    switch (status) {
      case 400:
        return data.error || '请求参数错误';
      case 401:
        return data.error || '身份验证失败';
      case 403:
        return data.error || '权限不足';
      case 404:
        return data.error || '请求的资源不存在';
      case 422:
        // 验证错误
        if (data.errors) {
          if (Array.isArray(data.errors)) {
            return `验证失败：${data.errors.join(', ')}`;
          } else {
            const errors = Object.values(data.errors).flat() as string[];
            return `验证失败：${errors.join(', ')}`;
          }
        }
        return data.error || '数据验证失败';
      case 500:
        let serverError = data.error || '服务器内部错误，请稍后再试';
        if (data.message) {
          serverError += `\n详细信息：${data.message}`;
        }
        return serverError;
      default:
        // 其他HTTP错误
        if (data.error) {
          let errorMsg = data.error;
          if (data.errors && Array.isArray(data.errors)) {
            errorMsg += `\n详细错误：${data.errors.join(', ')}`;
          }
          return errorMsg;
        }
        if (data.message) {
          return data.message;
        }
        return `请求失败 (${status})`;
    }
  }
  
  // 其他错误（如代码错误）
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};

// 显示错误消息的通用函数
const showError = (error: any, defaultMessage?: string) => {
  const errorMessage = handleApiError(error, defaultMessage);
  alert(errorMessage);
};

// 显示成功消息的通用函数
const showSuccess = (message: string) => {
  alert(message);
};

interface NewCommissionForm {
  title: string;
  description: string;
  budget: string;
  estimated_delivery_date: string;
  customer_email: string;
  customer_name: string;
}

// 定义状态类型
interface CommissionState {
  // 数据状态
  commissions: CommissionType[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  
  // UI状态
  showForm: boolean;
  showEmailModal: boolean;
  showDetailModal: boolean;
  isEditing: boolean;
  
  // 操作状态
  submitting: boolean;
  deleting: boolean;
  
  // 分页状态
  currentPage: number;
  itemsPerPage: number;
  
  // 表单数据
  newCommission: NewCommissionForm;
  editingCommission: NewCommissionForm;
  
  // 详情相关
  selectedCommission: CommissionType | null;
  commissionDetail: CommissionType | null;
  emailForDetail: string;
}

// 定义动作类型
type CommissionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COMMISSIONS'; payload: CommissionType[] }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_SHOW_FORM'; payload: boolean }
  | { type: 'SET_SHOW_EMAIL_MODAL'; payload: boolean }
  | { type: 'SET_SHOW_DETAIL_MODAL'; payload: boolean }
  | { type: 'SET_IS_EDITING'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_DELETING'; payload: boolean }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_NEW_COMMISSION'; payload: Partial<NewCommissionForm> }
  | { type: 'RESET_NEW_COMMISSION' }
  | { type: 'SET_EDITING_COMMISSION'; payload: Partial<NewCommissionForm> }
  | { type: 'RESET_EDITING_COMMISSION' }
  | { type: 'SET_SELECTED_COMMISSION'; payload: CommissionType | null }
  | { type: 'SET_COMMISSION_DETAIL'; payload: CommissionType | null }
  | { type: 'SET_EMAIL_FOR_DETAIL'; payload: string }
  | { type: 'UPDATE_COMMISSION_IN_LIST'; payload: { id: number; updates: Partial<CommissionType> } };

// 初始状态
const initialState: CommissionState = {
  commissions: [],
  currentUser: null,
  loading: true,
  error: null,
  showForm: false,
  showEmailModal: false,
  showDetailModal: false,
  isEditing: false,
  submitting: false,
  deleting: false,
  currentPage: 1,
  itemsPerPage: 6,
  newCommission: {
    title: '',
    description: '',
    budget: '',
    estimated_delivery_date: '',
    customer_email: '',
    customer_name: ''
  },
  editingCommission: {
    title: '',
    description: '',
    budget: '',
    estimated_delivery_date: '',
    customer_email: '',
    customer_name: ''
  },
  selectedCommission: null,
  commissionDetail: null,
  emailForDetail: ''
};

// Reducer函数
function commissionReducer(state: CommissionState, action: CommissionAction): CommissionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_COMMISSIONS':
      return { ...state, commissions: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_SHOW_FORM':
      return { ...state, showForm: action.payload };
    case 'SET_SHOW_EMAIL_MODAL':
      return { ...state, showEmailModal: action.payload };
    case 'SET_SHOW_DETAIL_MODAL':
      return { ...state, showDetailModal: action.payload };
    case 'SET_IS_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, submitting: action.payload };
    case 'SET_DELETING':
      return { ...state, deleting: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_NEW_COMMISSION':
      return {
        ...state,
        newCommission: { ...state.newCommission, ...action.payload }
      };
    case 'RESET_NEW_COMMISSION':
      return {
        ...state,
        newCommission: initialState.newCommission
      };
    case 'SET_EDITING_COMMISSION':
      return {
        ...state,
        editingCommission: { ...state.editingCommission, ...action.payload }
      };
    case 'RESET_EDITING_COMMISSION':
      return {
        ...state,
        editingCommission: initialState.editingCommission
      };
    case 'SET_SELECTED_COMMISSION':
      return { ...state, selectedCommission: action.payload };
    case 'SET_COMMISSION_DETAIL':
      return { ...state, commissionDetail: action.payload };
    case 'SET_EMAIL_FOR_DETAIL':
      return { ...state, emailForDetail: action.payload };
    case 'UPDATE_COMMISSION_IN_LIST':
      return {
        ...state,
        commissions: state.commissions.map(commission =>
          commission.id === action.payload.id
            ? { ...commission, ...action.payload.updates }
            : commission
        )
      };
    default:
      return state;
  }
}

export default function Commission() {
  const [state, dispatch] = useReducer(commissionReducer, initialState);
  
  // 解构状态以便使用
  const {
    commissions,
    currentUser,
    loading,
    error,
    showForm,
    showEmailModal,
    showDetailModal,
    isEditing,
    submitting,
    deleting,
    currentPage,
    itemsPerPage,
    newCommission,
    editingCommission,
    selectedCommission,
    commissionDetail,
    emailForDetail
  } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // 获取当前用户信息
        try {
          const userResponse = await authApi.getCurrentUser();
          dispatch({ type: 'SET_CURRENT_USER', payload: userResponse.data.user });
        } catch (error) {
          // 用户未登录，设为null
          dispatch({ type: 'SET_CURRENT_USER', payload: null });
        }
        
        // 获取所有委托，不仅仅是可用的
        const response = await commissionApi.getCommissions();
        dispatch({ type: 'SET_COMMISSIONS', payload: response.data });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (err) {
        const errorMessage = handleApiError(err, '获取委托列表时出错，请稍后再试');
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, []);

  // 处理页面变化
  const handlePageChange = useCallback((page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 重置到第一页（当委托列表更新时）
  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
  }, [commissions.length]);

  // 处理查看委托详情
  const handleViewDetail = useCallback(async (commission: CommissionType) => {
    dispatch({ type: 'SET_SELECTED_COMMISSION', payload: commission });
    
    // 如果用户已登录且是作者，直接获取委托详情
    if (currentUser && currentUser.is_author) {
      try {
        const response = await commissionApi.getCommission(commission.id);
        dispatch({ type: 'SET_COMMISSION_DETAIL', payload: response.data });
        dispatch({ type: 'SET_SHOW_DETAIL_MODAL', payload: true });
      } catch (error) {
        showError(error, '获取委托详情失败，请稍后重试');
      }
    } else {
      // 非作者用户需要邮箱验证
      dispatch({ type: 'SET_SHOW_EMAIL_MODAL', payload: true });
    }
  }, [currentUser]);

  // 处理状态更新
  const handleStatusChange = useCallback(async (commissionId: number, newStatus: string) => {
    try {
      const response = await commissionApi.updateCommissionStatus(commissionId, newStatus);
      
      // 更新委托详情
      dispatch({ type: 'SET_COMMISSION_DETAIL', payload: response.data });
      
      // 更新委托列表中的对应项
      dispatch({ 
        type: 'UPDATE_COMMISSION_IN_LIST', 
        payload: { id: commissionId, updates: { status: newStatus as any } }
      });
      
      showSuccess('委托状态更新成功！');
    } catch (error: any) {
      showError(error, '状态更新失败，请稍后重试');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, []);

  // 验证邮箱并显示详情
  const handleEmailVerification = useCallback(async () => {
    if (!emailForDetail.trim()) {
      alert('请输入邮箱地址');
      return;
    }
    
    if (!selectedCommission) {
      alert('未选择委托');
      return;
    }
    
    try {
      const response = await commissionApi.verifyEmailAndGetDetail(selectedCommission.id, emailForDetail);
      
      if (response.data.success) {
         // 邮箱验证成功，显示委托详情
         // 确保customer信息被正确设置
         const commission = response.data.commission;
         if (!commission.customer && selectedCommission.customer) {
           commission.customer = selectedCommission.customer;
         }
         // 如果仍然没有customer信息，手动设置
         if (!commission.customer) {
           commission.customer = {
             email: emailForDetail,
             // 其他必要的customer字段可能需要从后端获取
           };
         }
         dispatch({ type: 'SET_COMMISSION_DETAIL', payload: commission });
         dispatch({ type: 'SET_SHOW_EMAIL_MODAL', payload: false });
         dispatch({ type: 'SET_SHOW_DETAIL_MODAL', payload: true });
         dispatch({ type: 'SET_EMAIL_FOR_DETAIL', payload: '' });
       } else {
        alert(response.data.error || '邮箱验证失败');
      }
    } catch (err: any) {
      showError(err, '验证失败，请稍后再试');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [emailForDetail, selectedCommission]);

  // 处理新委托表单提交
  const handleSubmitCommission = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 防止重复提交
    if (submitting) return;
    
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    
    try {
      // 准备提交数据
      const commissionData = {
        title: newCommission.title,
        description: newCommission.description,
        budget: newCommission.budget ? parseFloat(newCommission.budget) : null,
        // 预计交付日期由系统自动计算，不再由用户提交
        customer_email: newCommission.customer_email,
        customer_name: newCommission.customer_name,
        status: 'open'
      };
      
      // 调用API创建委托（后端会自动发送邮件）
      const createResponse = await commissionApi.createCommission(commissionData);
      
      showSuccess('委托提交成功！确认邮件已发送到您的邮箱，我会在24小时内回复您。');
      
      dispatch({ type: 'SET_SHOW_FORM', payload: false });
      
      // 重置表单
      dispatch({ type: 'RESET_NEW_COMMISSION' });
      
      // 重新获取委托列表以显示新提交的委托
      const response = await commissionApi.getCommissions();
      dispatch({ type: 'SET_COMMISSIONS', payload: response.data });
      
    } catch (err: any) {
      showError(err, '提交失败，请稍后再试');
    }
  }, [submitting, newCommission]);

  // 处理表单输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_NEW_COMMISSION', payload: { [name]: value } });
  }, []);

  // 处理编辑表单输入变化
  const handleEditInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_EDITING_COMMISSION', payload: { [name]: value } });
  }, []);

  // 开始编辑委托
  const handleStartEdit = useCallback(() => {
    if (commissionDetail) {
      // 确保有客户邮箱信息
      const customerEmail = commissionDetail.customer?.email || emailForDetail || '';
      const customerName = commissionDetail.customer?.name || '';
      
      dispatch({ 
        type: 'SET_EDITING_COMMISSION', 
        payload: {
          title: commissionDetail.title,
          description: commissionDetail.description || '',
          budget: commissionDetail.budget ? commissionDetail.budget.toString() : '',
          estimated_delivery_date: commissionDetail.estimated_delivery_date 
            ? new Date(commissionDetail.estimated_delivery_date).toISOString().split('T')[0] 
            : '',
          customer_email: customerEmail,
          customer_name: customerName
        }
      });
      dispatch({ type: 'SET_IS_EDITING', payload: true });
    }
  }, [commissionDetail, emailForDetail]);

  // 取消编辑
  const handleCancelEdit = useCallback(() => {
    dispatch({ type: 'SET_IS_EDITING', payload: false });
    dispatch({ type: 'RESET_EDITING_COMMISSION' });
  }, []);

  // 保存编辑
  const handleSaveEdit = useCallback(async () => {
    if (!commissionDetail) return;
    
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      // 确保有邮箱信息
      if (!editingCommission.customer_email) {
        editingCommission.customer_email = emailForDetail;
      }
      
      const updateData = {
        title: editingCommission.title,
        description: editingCommission.description,
        budget: editingCommission.budget ? parseFloat(editingCommission.budget) : null,
        // 预计交付日期由系统自动计算，不再由用户修改
        customer_name: editingCommission.customer_name,
        customer_email: editingCommission.customer_email,
        // 传递验证邮箱，确保后端可以验证身份
        email: editingCommission.customer_email || emailForDetail
      };
      
      const response = await commissionApi.updateCommission(commissionDetail.id, updateData);
      
      // 确保customer信息被正确设置
      const updatedCommission = response.data;
      if (!updatedCommission.customer && updateData.customer_email) {
        updatedCommission.customer = {
          email: updateData.customer_email,
          name: updateData.customer_name
        };
      }
      
      dispatch({ type: 'SET_COMMISSION_DETAIL', payload: updatedCommission });
      
      // 更新委托列表
      const listResponse = await commissionApi.getCommissions();
      dispatch({ type: 'SET_COMMISSIONS', payload: listResponse.data });
      
      dispatch({ type: 'SET_IS_EDITING', payload: false });
      showSuccess('委托信息更新成功！');
    } catch (error: any) {
      showError(error, '更新失败，请稍后再试');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [commissionDetail, editingCommission, emailForDetail]);

  // 删除委托
  const handleDeleteCommission = useCallback(async () => {
    if (!commissionDetail) return;
    
    if (!confirm('确定要删除这个委托吗？此操作不可撤销。')) {
      return;
    }
    
    dispatch({ type: 'SET_DELETING', payload: true });
    try {
      // 如果是作者用户，直接删除；否则传递邮箱参数
      if (currentUser && currentUser.is_author) {
        await commissionApi.deleteCommission(commissionDetail.id);
      } else {
        // 确保有邮箱信息
        const email = commissionDetail.customer?.email || emailForDetail;
        if (!email) {
          throw new Error('缺少邮箱信息，无法验证身份');
        }
        await commissionApi.deleteCommission(commissionDetail.id, email);
      }
      
      // 更新委托列表
      const response = await commissionApi.getCommissions();
      dispatch({ type: 'SET_COMMISSIONS', payload: response.data });
      
      // 关闭详情模态框
      dispatch({ type: 'SET_SHOW_DETAIL_MODAL', payload: false });
      dispatch({ type: 'SET_COMMISSION_DETAIL', payload: null });
      
      showSuccess('委托删除成功！');
    } catch (error: any) {
      showError(error, '删除失败，请稍后再试');
    } finally {
      dispatch({ type: 'SET_DELETING', payload: false });
    }
  }, [commissionDetail, currentUser, emailForDetail]);

  // 使用useCallback优化内联回调函数
  const handleShowForm = useCallback(() => {
    dispatch({ type: 'SET_SHOW_FORM', payload: true });
  }, []);

  const handleCloseEmailModal = useCallback(() => {
    dispatch({ type: 'SET_SHOW_EMAIL_MODAL', payload: false });
    dispatch({ type: 'SET_EMAIL_FOR_DETAIL', payload: '' });
  }, []);

  const handleEmailChange = useCallback((email: string) => {
    dispatch({ type: 'SET_EMAIL_FOR_DETAIL', payload: email });
  }, []);

  const handleCloseForm = useCallback(() => {
    dispatch({ type: 'SET_SHOW_FORM', payload: false });
  }, []);

  const handleCloseDetail = useCallback(() => {
    dispatch({ type: 'SET_SHOW_DETAIL_MODAL', payload: false });
    dispatch({ type: 'SET_COMMISSION_DETAIL', payload: null });
    dispatch({ type: 'SET_IS_EDITING', payload: false });
  }, []);

  if (loading) return <div className="p-4">加载中...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ServiceIntro />
        
        <CommissionList
          commissions={commissions}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onViewDetail={handleViewDetail}
          onPageChange={handlePageChange}
          onShowForm={handleShowForm}
        />
        
        <EmailVerificationModal
          show={showEmailModal}
          email={emailForDetail}
          onClose={handleCloseEmailModal}
          onEmailChange={handleEmailChange}
          onVerify={handleEmailVerification}
        />
        
        <CommissionForm
          show={showForm}
          submitting={submitting}
          formData={newCommission}
          onClose={handleCloseForm}
          onSubmit={handleSubmitCommission}
          onInputChange={handleInputChange}
        />
        
        <CommissionDetail
          show={showDetailModal}
          commission={commissionDetail}
          currentUser={currentUser}
          isEditing={isEditing}
          submitting={submitting}
          deleting={deleting}
          editingData={editingCommission}
          onClose={handleCloseDetail}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDeleteCommission}
          onStatusChange={handleStatusChange}
          onEditInputChange={handleEditInputChange}
        />
      </div>
    </div>
  );
}