class ArticlesController < ApplicationController
  # GET /articles
  def index
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 10).to_i
    search_query = params[:search]
    visibility_filter = params[:visibility]
    
    @articles = Article.includes(:author)
    
    # 搜索功能
    if search_query.present?
      @articles = @articles.where(
        "title ILIKE ? OR body ILIKE ?", 
        "%#{search_query}%", "%#{search_query}%"
      )
    end
    
    # 可见性筛选
    if visibility_filter.present?
      @articles = @articles.where(visibility: visibility_filter)
    end
    
    @articles = @articles.order(created_at: :desc)
    
    # 手动实现分页
    total_count = @articles.count
    total_pages = (total_count.to_f / per_page).ceil
    offset = (page - 1) * per_page
    
    @articles = @articles.limit(per_page).offset(offset)
    
    render json: {
      articles: @articles.as_json(include: :author),
      current_page: page,
      total_pages: total_pages,
      total_count: total_count,
      per_page: per_page
    }
  end

  # GET /articles/1
  def show
    @article = Article.find(params[:id])
    render json: @article
  end

  # GET /articles/public
  def public
    # 返回公开和受限文章（不包括私有文章）
    @articles = Article.where(visibility: ['public', 'restricted']).includes(:author)
    render json: @articles, include: :author
  end

  # POST /articles
  def create
    @article = Article.new(article_params)
    
    # 如果用户发布了文章，自动设置为作者
    if @article.save
      author = @article.author
      unless author.is_author?
        author.update!(is_author: true)
      end
      
      render json: @article.as_json(include: :author), status: :created, location: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /articles/1
  def update
    @article = Article.find(params[:id])
    if @article.update(article_params)
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # PUT /articles/1/publish
  def publish
    @article = Article.find(params[:id])
    if @article.update(visibility: 'public')
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # PUT /articles/1/unpublish
  def unpublish
    @article = Article.find(params[:id])
    if @article.update(visibility: 'private')
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # GET /articles/1/challenge
  def challenge
    @article = Article.find(params[:id])
    
    if @article.visibility != 'restricted'
      render json: { error: 'Article does not require challenge verification' }, status: :bad_request
      return
    end
    
    @challenge = @article.article_challenge
    if @challenge&.enabled?
      render json: { 
        prompt: @challenge.prompt
      }
    else
      render json: { error: 'No challenge found for this article' }, status: :not_found
    end
  end

  # POST /articles/1/verify_access
  def verify_access
    @article = Article.find(params[:id])
    answer = params[:answer]
    
    if @article.visibility != 'restricted'
      render json: { error: 'Article does not require answer verification' }, status: :bad_request
      return
    end
    
    if answer.blank?
      render json: { error: 'Answer is required' }, status: :bad_request
      return
    end
    
    @challenge = @article.article_challenge
    if @challenge&.enabled? && @challenge.verify_answer(answer)
      render json: { 
        success: true, 
        message: 'Answer verified successfully',
        article: @article.as_json(include: :author)
      }
    else
      render json: { error: 'Incorrect answer' }, status: :unprocessable_entity
    end
  end

  # DELETE /articles/1
  def destroy
    @article = Article.find(params[:id])
    @article.destroy
  end

  private
    # Only allow a list of trusted parameters through.
    def article_params
      params.require(:article).permit(:title, :body, :visibility, :author_id)
    end
end