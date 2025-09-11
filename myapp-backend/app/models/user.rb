class User < ApplicationRecord
  # Authentication
  has_secure_password
  
  # Associations
  has_many :articles, foreign_key: :author_id, dependent: :destroy
  has_many :commissions_as_customer, class_name: 'Commission', foreign_key: :customer_id, dependent: :destroy
  has_many :commissions_as_author, class_name: 'Commission', foreign_key: :assigned_author_id, dependent: :nullify
  
  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :email, presence: true, uniqueness: { case_sensitive: false }, 
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  validates :bio, length: { maximum: 1000 }, allow_blank: true
  
  # Callbacks
  before_save { self.email = email.downcase }
  
  # Scopes
  scope :authors, -> { where(is_author: true) }
  scope :clients, -> { where(is_client: true) }
  
  # Instance methods
  def full_name
    name
  end
  
  def author?
    is_author
  end
  
  def client?
    is_client
  end
end
