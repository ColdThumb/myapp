class CommissionMailer < ApplicationMailer
  default from: 'towtyechan@gmail.com'

  def commission_submitted(commission)
    @commission = commission
    @customer_name = commission.customer_name
    @commission_title = commission.title
    @commission_description = commission.description
    @commission_budget = commission.budget
    @estimated_delivery_date = commission.estimated_delivery_date
    
    mail(
      to: commission.customer_email,
      subject: "委托提交成功确认 - #{@commission_title}"
    )
  end

  def commission_status_updated(commission)
    @commission = commission
    @customer_name = commission.customer_name
    @commission_title = commission.title
    @status_text = case commission.status
                   when 'assigned'
                     '已分配给作者'
                   when 'in_progress'
                     '进行中'
                   when 'completed'
                     '已完成'
                   when 'cancelled'
                     '已取消'
                   else
                     commission.status
                   end
    
    mail(
      to: commission.customer_email,
      subject: "委托状态更新 - #{@commission_title}"
    )
  end
end