class Article < ApplicationRecord
  belongs_to :author, class_name: "User"
  has_many :article_challenges, dependent: :destroy

  # 可见性三态
  enum :visibility, {
    publicly_visible: "public",
    restricted:       "restricted",
    privately_visible: "private"
  }, validate: true

  validates :title, presence: true
  validates :body,  presence: true
  validate  :restricted_must_have_challenge, if: -> { visibility == "restricted" }
  # 注释掉 author_must_be_author 验证，因为用户发布文章后才会成为作者
  # validate  :author_must_be_author

  scope :public_articles,    -> { where(visibility: "public") }
  scope :private_articles,   -> { where(visibility: "private") }
  scope :restricted_articles, -> { where(visibility: "restricted") }
  
  # 便捷方法
  def public_visibility?
    visibility == "public"
  end
  
  def restricted_visibility?
    visibility == "restricted"
  end
  
  def private_visibility?
    visibility == "private"
  end

  private
  def author_must_be_author
    errors.add(:author, "must be an author") unless author&.is_author?
  end

  def restricted_must_have_challenge
    if article_challenges.enabled.none?
      errors.add(:base, "restricted article must have at least one enabled challenge")
    end
  end
end
