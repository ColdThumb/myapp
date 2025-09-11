class ArticleChallenge < ApplicationRecord
  # Associations
  belongs_to :article
  
  # Validations
  validates :prompt, presence: true
  validates :answer_hash, presence: true
  validates :normalize_rule, presence: true, inclusion: { in: %w[no_normalize trim ci ci_trim] }
  
  # Enums for normalize_rule
  enum :normalize_rule, {
    no_normalize: "none",       # 不做任何处理
    trim: "trim",       # 去除前后空格
    ci: "ci",           # 不区分大小写
    ci_trim: "ci_trim"  # 不区分大小写且去除前后空格
  }, validate: true
  
  # Scopes
  scope :enabled, -> { where(enabled: true) }
  scope :disabled, -> { where(enabled: false) }
  
  # Methods
  def disable!
    update!(enabled: false)
  end
  
  def enable!
    update!(enabled: true)
  end
  
  # 验证答案是否正确
  def verify_answer(answer)
    normalized_answer = normalize_answer(answer)
    BCrypt::Password.new(answer_hash) == normalized_answer
  end
  
  private
  
  # 根据 normalize_rule 对答案进行标准化处理
  def normalize_answer(answer)
    case normalize_rule
    when "none"
      answer
    when "trim"
      answer.strip
    when "ci"
      answer.downcase
    when "ci_trim"
      answer.strip.downcase
    end
  end
end