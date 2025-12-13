/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRefreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRefreshToken" DROP CONSTRAINT "UserRefreshToken_userId_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserRefreshToken";

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "industry_category" TEXT,
    "webhook_secret" TEXT,
    "subscription_plan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'trial',
    "country" TEXT,
    "preferred_language" TEXT,
    "additional_languages" JSONB,
    "currency" TEXT,
    "timezone" TEXT,
    "date_format" TEXT,
    "settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "auth0_id" TEXT,
    "provider" TEXT,
    "firebase_uid" TEXT,
    "phone_number" TEXT,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "avatar_url" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "access_token" TEXT,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_settings" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "brand_voice" TEXT,
    "response_tone" TEXT,
    "ai_temperature" DECIMAL(2,1),
    "auto_assign_enabled" BOOLEAN DEFAULT false,
    "assignment_strategy" TEXT,
    "business_hours" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "default_ai_prompt" TEXT,
    "common_objections" JSONB,
    "category_tips" TEXT,

    CONSTRAINT "industry_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_integrations" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "onsend_api_key_encrypted" TEXT,
    "onsend_api_secret_encrypted" TEXT,
    "onsend_phone_number_id" TEXT,
    "onsend_webhook_secret" TEXT,
    "onsend_connection_status" TEXT,
    "onsend_last_connected_at" TIMESTAMP(3),
    "onsend_last_error" TEXT,
    "telegram_bot_token_encrypted" TEXT,
    "telegram_bot_username" TEXT,
    "telegram_webhook_secret" TEXT,
    "telegram_connection_status" TEXT,
    "telegram_last_connected_at" TIMESTAMP(3),
    "telegram_last_error" TEXT,
    "whatsapp_webhook_url" TEXT,
    "telegram_webhook_url" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_credential_logs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "integration_id" TEXT,
    "integration_type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changed_by" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_credential_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT DEFAULT 'MYR',
    "image_url" TEXT,
    "category" TEXT,
    "stock_status" TEXT,
    "sku" TEXT,
    "metadata" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT,
    "product_ids" JSONB,
    "total_price" DECIMAL(10,2),
    "discount_percentage" DECIMAL(5,2),
    "image_url" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_materials" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "file_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_knowledge_base" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT,
    "relevance_score" DECIMAL(3,2),
    "last_updated" TIMESTAMP(3),

    CONSTRAINT "ai_knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_configs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "system_prompt" TEXT,
    "response_style" TEXT,
    "language_config" JSONB,
    "temperature" DECIMAL(2,1) NOT NULL DEFAULT 0.7,
    "max_tokens" INTEGER NOT NULL DEFAULT 1000,
    "training_data_ids" JSONB,
    "success_patterns_weight" DECIMAL(3,2) NOT NULL DEFAULT 0.3,
    "product_catalog_weight" DECIMAL(3,2) NOT NULL DEFAULT 0.2,
    "faq_weight" DECIMAL(3,2) NOT NULL DEFAULT 0.2,
    "training_materials_weight" DECIMAL(3,2) NOT NULL DEFAULT 0.3,
    "auto_response_enabled" BOOLEAN NOT NULL DEFAULT false,
    "auto_response_triggers" JSONB,
    "test_results" JSONB,
    "performance_metrics" JSONB,
    "rlhf_enabled" BOOLEAN NOT NULL DEFAULT true,
    "rlhf_human_likeness_target" DECIMAL(3,2) NOT NULL DEFAULT 0.85,
    "rlhf_learning_rate" DECIMAL(3,2) NOT NULL DEFAULT 0.1,
    "rlhf_style_matching" TEXT DEFAULT 'top_agent',
    "rlhf_robotic_phrase_detection" BOOLEAN NOT NULL DEFAULT true,
    "rlhf_natural_flow_enabled" BOOLEAN NOT NULL DEFAULT true,
    "rlhf_metrics" JSONB,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deployed_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "ai_model_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_tests" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "model_config_id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "scenario_description" TEXT,
    "customer_message" TEXT NOT NULL,
    "expected_response_type" TEXT,
    "actual_response" TEXT,
    "test_result" TEXT,
    "test_metrics" JSONB,
    "admin_feedback" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_model_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "success_case_templates" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "industry_category" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "customer_message_patterns" JSONB,
    "customer_message_examples" JSONB,
    "agent_response" TEXT,
    "agent_response_variations" JSONB,
    "context_description" TEXT,
    "expected_outcome" TEXT,
    "follow_up_actions" TEXT,
    "localized_versions" JSONB,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "success_rate" DECIMAL(5,2),
    "effectiveness_score" DECIMAL(3,2) DEFAULT 0.0,
    "created_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "success_case_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_template_selections" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_preferred" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "custom_modifications" JSONB,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_template_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "platform" TEXT NOT NULL,
    "platform_id" TEXT,
    "behavior_score" INTEGER NOT NULL DEFAULT 50,
    "score_color" TEXT,
    "tags" JSONB,
    "last_interaction" TIMESTAMP(3),
    "total_messages" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "assigned_to" TEXT,
    "assigned_by" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "sale_amount" DECIMAL(10,2),
    "products_sold" JSONB,
    "is_success" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "ai_effectiveness_rating" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_assignments" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "from_user_id" TEXT,
    "to_user_id" TEXT NOT NULL,
    "assigned_by" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sender_type" TEXT NOT NULL,
    "sender_id" TEXT,
    "suggested_by_ai" BOOLEAN NOT NULL DEFAULT false,
    "agent_used_suggestion" BOOLEAN NOT NULL DEFAULT false,
    "media_url" TEXT,
    "media_type" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "successful_patterns" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "category" TEXT,
    "pattern_summary" TEXT,
    "key_messages" JSONB,
    "outcome_data" JSONB,
    "used_for_training" BOOLEAN NOT NULL DEFAULT false,
    "effectiveness_score" DECIMAL(3,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "successful_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_suggestions" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "suggested_message" TEXT NOT NULL,
    "was_used" BOOLEAN NOT NULL DEFAULT false,
    "agent_rating" INTEGER,
    "modified_version" TEXT,
    "agent_actual_response" TEXT,
    "edit_distance" INTEGER,
    "was_manual_override" BOOLEAN NOT NULL DEFAULT false,
    "customer_response_quality" TEXT,
    "human_likeness_score" DECIMAL(3,2),
    "robotic_phrases_detected" JSONB,
    "natural_language_score" DECIMAL(3,2),
    "used_for_rlhf_training" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rlhf_training_data" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "model_config_id" TEXT,
    "agent_response" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "conversation_context" TEXT,
    "customer_message" TEXT,
    "ai_suggestion_id" TEXT,
    "ai_suggested_message" TEXT,
    "feedback_type" TEXT,
    "edit_details" JSONB,
    "agent_rating" INTEGER,
    "customer_engagement_score" DECIMAL(3,2),
    "human_likeness_score" DECIMAL(3,2),
    "natural_language_score" DECIMAL(3,2),
    "style_match_score" DECIMAL(3,2),
    "conversation_outcome" TEXT,
    "sale_amount" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_in_training" BOOLEAN NOT NULL DEFAULT false,
    "training_batch_id" TEXT,

    CONSTRAINT "rlhf_training_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT,
    "event_type" TEXT NOT NULL,
    "conversation_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "companies_country_idx" ON "companies"("country");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0_id_key" ON "users"("auth0_id");

-- CreateIndex
CREATE INDEX "users_company_id_idx" ON "users"("company_id");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "user_refresh_tokens_token_key" ON "user_refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "company_settings_company_id_key" ON "company_settings"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_integrations_company_id_key" ON "company_integrations"("company_id");

-- CreateIndex
CREATE INDEX "company_integrations_company_id_idx" ON "company_integrations"("company_id");

-- CreateIndex
CREATE INDEX "integration_credential_logs_company_id_created_at_idx" ON "integration_credential_logs"("company_id", "created_at");

-- CreateIndex
CREATE INDEX "products_company_id_idx" ON "products"("company_id");

-- CreateIndex
CREATE INDEX "packages_company_id_idx" ON "packages"("company_id");

-- CreateIndex
CREATE INDEX "training_materials_company_id_status_idx" ON "training_materials"("company_id", "status");

-- CreateIndex
CREATE INDEX "faqs_company_id_idx" ON "faqs"("company_id");

-- CreateIndex
CREATE INDEX "ai_knowledge_base_company_id_idx" ON "ai_knowledge_base"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_knowledge_base_company_id_topic_key" ON "ai_knowledge_base"("company_id", "topic");

-- CreateIndex
CREATE INDEX "ai_model_configs_company_id_is_active_idx" ON "ai_model_configs"("company_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_configs_company_id_version_key" ON "ai_model_configs"("company_id", "version");

-- CreateIndex
CREATE INDEX "ai_model_tests_company_id_model_config_id_idx" ON "ai_model_tests"("company_id", "model_config_id");

-- CreateIndex
CREATE INDEX "success_case_templates_language_idx" ON "success_case_templates"("language");

-- CreateIndex
CREATE INDEX "success_case_templates_industry_category_idx" ON "success_case_templates"("industry_category");

-- CreateIndex
CREATE INDEX "success_case_templates_is_global_is_active_idx" ON "success_case_templates"("is_global", "is_active");

-- CreateIndex
CREATE INDEX "company_template_selections_company_id_is_enabled_idx" ON "company_template_selections"("company_id", "is_enabled");

-- CreateIndex
CREATE INDEX "company_template_selections_company_id_is_preferred_priorit_idx" ON "company_template_selections"("company_id", "is_preferred", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "company_template_selections_company_id_template_id_key" ON "company_template_selections"("company_id", "template_id");

-- CreateIndex
CREATE INDEX "contacts_company_id_idx" ON "contacts"("company_id");

-- CreateIndex
CREATE INDEX "contacts_behavior_score_idx" ON "contacts"("behavior_score");

-- CreateIndex
CREATE INDEX "conversations_assigned_to_idx" ON "conversations"("assigned_to");

-- CreateIndex
CREATE INDEX "conversations_company_id_idx" ON "conversations"("company_id");

-- CreateIndex
CREATE INDEX "conversation_assignments_conversation_id_idx" ON "conversation_assignments"("conversation_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "successful_patterns_company_id_idx" ON "successful_patterns"("company_id");

-- CreateIndex
CREATE INDEX "ai_suggestions_conversation_id_idx" ON "ai_suggestions"("conversation_id");

-- CreateIndex
CREATE INDEX "rlhf_training_data_company_id_model_config_id_idx" ON "rlhf_training_data"("company_id", "model_config_id");

-- CreateIndex
CREATE INDEX "rlhf_training_data_used_in_training_idx" ON "rlhf_training_data"("used_in_training");

-- CreateIndex
CREATE INDEX "analytics_events_company_id_created_at_idx" ON "analytics_events"("company_id", "created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_refresh_tokens" ADD CONSTRAINT "user_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_integrations" ADD CONSTRAINT "company_integrations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_integrations" ADD CONSTRAINT "company_integrations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_integrations" ADD CONSTRAINT "company_integrations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_credential_logs" ADD CONSTRAINT "integration_credential_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_credential_logs" ADD CONSTRAINT "integration_credential_logs_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "company_integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_credential_logs" ADD CONSTRAINT "integration_credential_logs_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_materials" ADD CONSTRAINT "training_materials_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_knowledge_base" ADD CONSTRAINT "ai_knowledge_base_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_configs" ADD CONSTRAINT "ai_model_configs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_configs" ADD CONSTRAINT "ai_model_configs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_tests" ADD CONSTRAINT "ai_model_tests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_tests" ADD CONSTRAINT "ai_model_tests_model_config_id_fkey" FOREIGN KEY ("model_config_id") REFERENCES "ai_model_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_tests" ADD CONSTRAINT "ai_model_tests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "success_case_templates" ADD CONSTRAINT "success_case_templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "success_case_templates" ADD CONSTRAINT "success_case_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_template_selections" ADD CONSTRAINT "company_template_selections_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_template_selections" ADD CONSTRAINT "company_template_selections_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "success_case_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_assignments" ADD CONSTRAINT "conversation_assignments_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_assignments" ADD CONSTRAINT "conversation_assignments_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_assignments" ADD CONSTRAINT "conversation_assignments_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_assignments" ADD CONSTRAINT "conversation_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "successful_patterns" ADD CONSTRAINT "successful_patterns_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "successful_patterns" ADD CONSTRAINT "successful_patterns_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "ai_suggestions_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlhf_training_data" ADD CONSTRAINT "rlhf_training_data_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlhf_training_data" ADD CONSTRAINT "rlhf_training_data_model_config_id_fkey" FOREIGN KEY ("model_config_id") REFERENCES "ai_model_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlhf_training_data" ADD CONSTRAINT "rlhf_training_data_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlhf_training_data" ADD CONSTRAINT "rlhf_training_data_ai_suggestion_id_fkey" FOREIGN KEY ("ai_suggestion_id") REFERENCES "ai_suggestions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
