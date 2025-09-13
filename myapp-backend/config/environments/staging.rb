require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance and memory savings (ignored by Rake tasks).
  config.eager_load = true

  # Show full error reports for debugging in staging.
  config.consider_all_requests_local = false

  # Enable server timing for performance monitoring.
  config.server_timing = true

  # Cache assets but with shorter expiry than production.
  config.public_file_server.headers = { "cache-control" => "public, max-age=#{1.hour.to_i}" }

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = "http://assets.example.com"

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't force SSL in staging for easier testing.
  config.force_ssl = false

  # Log to STDOUT with the current request id as a default log tag.
  config.log_tags = [ :request_id ]
  config.logger   = ActiveSupport::TaggedLogging.logger(STDOUT)

  # Use debug level for more detailed logging in staging.
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "debug")

  # Prevent health checks from clogging up the logs.
  config.silence_healthcheck_path = "/up"

  # Log deprecations for debugging.
  config.active_support.report_deprecations = true

  # Use memory store for caching in staging.
  config.cache_store = :memory_store

  # Use the default in-process queuing backend for Active Job in staging.
  config.active_job.queue_adapter = :async

  # Enable delivery error reporting for email testing.
  config.action_mailer.raise_delivery_errors = true

  # Don't cache mailer templates for easier testing.
  config.action_mailer.perform_caching = false

  config.action_mailer.default_url_options = { host: ENV.fetch("APP_HOST", "localhost"), protocol: "https" }
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true

  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address:              Rails.application.credentials.dig(:mail, :smtp_address),
    port:                 Rails.application.credentials.dig(:mail, :smtp_port),
    user_name:            Rails.application.credentials.dig(:mail, :smtp_user),
    password:             Rails.application.credentials.dig(:mail, :smtp_pass),
    authentication:       :plain,
    enable_starttls_auto: true
  }

  # Enable Action Controller caching.
  config.action_controller.perform_caching = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?

  # Compress CSS using a preprocessor.
  # config.assets.css_compressor = :sass

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  # config.assets.compile = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Don't log any deprecations in staging to reduce noise.
  config.active_support.report_deprecations = false

  # Do not dump schema after migrations in staging.
  config.active_record.dump_schema_after_migration = false
end
