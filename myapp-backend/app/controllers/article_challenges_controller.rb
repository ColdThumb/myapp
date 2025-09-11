class ArticleChallengesController < ApplicationController
  before_action :set_article
  before_action :set_article_challenge, only: [:show, :update, :destroy, :verify_answer]

  # GET /articles/:article_id/challenges
  def index
    @article_challenges = @article.article_challenges
    render json: @article_challenges
  end

  # GET /articles/:article_id/challenges/:id
  def show
    render json: @article_challenge.as_json(except: [:answer_hash])
  end

  # POST /articles/:article_id/challenges
  def create
    @article_challenge = @article.article_challenges.new(article_challenge_params)

    if @article_challenge.save
      render json: @article_challenge.as_json(except: [:answer_hash]), status: :created
    else
      render json: @article_challenge.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /articles/:article_id/challenges/:id
  def update
    if @article_challenge.update(article_challenge_params)
      render json: @article_challenge.as_json(except: [:answer_hash])
    else
      render json: @article_challenge.errors, status: :unprocessable_entity
    end
  end

  # DELETE /articles/:article_id/challenges/:id
  def destroy
    @article_challenge.destroy
    head :no_content
  end

  # POST /articles/:article_id/challenges/:id/verify
  def verify_answer
    answer = params[:answer]
    
    if answer.blank?
      render json: { error: "Answer cannot be blank" }, status: :bad_request
      return
    end

    result = @article_challenge.verify_answer(answer)
    render json: { correct: result }
  end

  private
    def set_article
      @article = Article.find(params[:article_id])
    end

    def set_article_challenge
      @article_challenge = @article.article_challenges.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def article_challenge_params
      # 如果提供了明文答案，则生成哈希值
      if params[:article_challenge][:answer].present?
        answer = params[:article_challenge][:answer]
        params[:article_challenge][:answer_hash] = BCrypt::Password.create(answer)
        params[:article_challenge].delete(:answer)
      end

      params.require(:article_challenge).permit(
        :prompt, :answer_hash, :normalize_rule, :hint, :enabled
      )
    end
end