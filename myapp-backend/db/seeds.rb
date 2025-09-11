# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# 清除现有数据
puts "清除现有数据..."
Commission.destroy_all
Article.destroy_all
User.destroy_all

# 创建用户
puts "创建用户..."

# 作者
authors = [
  { name: "张文学", email: "zhang@example.com", password: "password123", password_confirmation: "password123", is_author: true, is_client: false, bio: "专注于科技和商业写作的资深作者，有超过5年的内容创作经验。" },
  { name: "李小诗", email: "li@example.com", password: "password123", password_confirmation: "password123", is_author: true, is_client: true, bio: "诗歌和散文作家，同时也是一位摄影爱好者。" },
  { name: "王大牛", email: "wang@example.com", password: "password123", password_confirmation: "password123", is_author: true, is_client: false, bio: "技术文档专家，擅长将复杂概念简单化。" },
  { name: "站长", email: "admin@myapp.com", password: "admin123456", password_confirmation: "admin123456", is_author: true, is_client: true, bio: "网站创始人和主要作者，专注于创作平台的运营和内容创作。拥有丰富的写作经验和平台管理经验。" }
]

author_records = authors.map do |author_data|
  User.create!(author_data)
end

# 客户
clients = [
  { name: "科技前沿公司", email: "tech@example.com", password: "client123", password_confirmation: "client123", is_author: false, is_client: true, bio: "致力于最新科技资讯报道的媒体公司。" },
  { name: "教育资源平台", email: "edu@example.com", password: "client123", password_confirmation: "client123", is_author: false, is_client: true, bio: "提供高质量教育内容的在线平台。" },
  { name: "健康生活杂志", email: "health@example.com", password: "client123", password_confirmation: "client123", is_author: false, is_client: true, bio: "关注健康生活方式的月刊。" },
  { name: "旅游探索网", email: "travel@example.com", password: "client123", password_confirmation: "client123", is_author: false, is_client: true, bio: "分享全球旅游体验和攻略的网站。" }
]

client_records = clients.map do |client_data|
  User.create!(client_data)
end

# 创建文章
puts "创建文章..."
articles = [
  { title: "人工智能的未来发展趋势", body: "人工智能技术正在以前所未有的速度发展...", visibility: "public", author: author_records[0] },
  { title: "如何提高写作效率", body: "高效写作需要良好的习惯和正确的工具...", visibility: "public", author: author_records[1] },
  { title: "远程工作的挑战与机遇", body: "随着远程工作的普及，我们面临着新的挑战和机遇...", visibility: "public", author: author_records[2] },
  { title: "写作技巧分享", body: "本文将分享一些实用的写作技巧，帮助你提升文章质量...", visibility: "private", author: author_records[0] },
  { title: "内容创作的未来", body: "随着技术的发展，内容创作正在经历深刻的变革...", visibility: "public", author: author_records[1] },
  { title: "我的创作心得", body: "作为网站的创始人，我想分享一些关于内容创作和平台运营的心得体会...", visibility: "public", author: author_records[3] }
]

article_records = articles.map do |article_data|
  Article.create!(article_data)
end

# 创建委托
puts "创建委托..."
commissions = [
  { 
    title: "科技趋势分析报告", 
    description: "需要一份关于2023年科技发展趋势的深度分析报告，包括AI、区块链和量子计算等领域。", 
    budget: 2000.00, 
    status: :open, 
    customer: client_records[0], 
    estimated_delivery_date: Date.current + 14.days 
  },
  { 
    title: "教育内容系列文章", 
    description: "为教育平台创作5篇关于现代教育方法的文章，每篇约2000字。", 
    budget: 1500.00, 
    status: :assigned, 
    customer: client_records[1], 
    assigned_author: author_records[1], 
    estimated_delivery_date: Date.current + 10.days 
  },
  { 
    title: "健康生活方式指南", 
    description: "撰写一份全面的健康生活指南，包括饮食、运动和心理健康等方面。", 
    budget: 1200.00, 
    status: :in_progress, 
    customer: client_records[2], 
    assigned_author: author_records[2], 
    estimated_delivery_date: Date.current + 7.days 
  },
  { 
    title: "旅游目的地介绍", 
    description: "为旅游网站撰写10个热门旅游目的地的详细介绍，包括景点、美食和文化等。", 
    budget: 3000.00, 
    status: :completed, 
    customer: client_records[3], 
    assigned_author: author_records[0], 
    estimated_delivery_date: Date.current + 25.days 
  },
  { 
    title: "产品说明书翻译", 
    description: "将一份技术产品说明书从英文翻译成中文，约5000字。", 
    budget: 800.00, 
    status: :cancelled, 
    customer: client_records[0], 
    assigned_author: author_records[2], 
    estimated_delivery_date: Date.current + 20.days 
  }
]

commission_records = commissions.map do |commission_data|
  Commission.create!(commission_data)
end

puts "种子数据创建完成！"
puts "创建了 #{User.count} 个用户 (#{User.authors.count} 作者, #{User.clients.count} 客户)"
puts "创建了 #{Article.count} 篇文章 (#{Article.public_articles.count} 公开, #{Article.private_articles.count} 私有)"
puts "创建了 #{Commission.count} 个委托"
