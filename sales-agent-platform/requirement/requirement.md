# Multi-Tenant AI Chatbot SaaS Platform - Complete Development Prompt

Create a multi-tenant AI-powered chatbot SaaS platform with WhatsApp/Telegram integration, company management, AI learning, CRM, and product catalog system.

## TECH STACK
- **Backend**: Express + tRPC + Zod
- **Frontend**: Nuxt (template exists)
- **WhatsApp**: OnSend API
- **Telegram**: Bot API via webhooks
- **AI**: Claude API (Anthropic) for behavior analysis, response generation, learning
- **Storage**: S3/CDN for images and training materials
- **Database**: PostgreSQL with company_id isolation

---

## PLATFORM HIERARCHY & ROLES

### 1. SUPER ADMIN (Platform Owner)
- Manage all companies (create, suspend, delete)
- View platform-wide analytics (all companies aggregated)
- Configure pricing/limits per company
- System-wide settings
- Access to all data (read-only monitoring)

### 2. COMPANY ADMIN (Business Owner)
- **Complete company setup & onboarding**
- **Manage company users** (create, edit, delete sales agents)
- **Assign/reassign conversations to users**
- **Monitor ALL company conversations** (read-only access to everything)
- Set up products/services catalog
- Configure AI training materials
- Create packages & templates
- View company-wide analytics
- Billing management
- Configure brand voice & settings
- **Can see all chats but agents only see assigned ones**

### 3. COMPANY USER (Sales Agent)
- **Only see conversations assigned to them**
- Handle assigned conversations with AI assistance
- Use AI suggestions for responses
- Send products from catalog
- Transfer conversations to other agents (with admin approval)
- Mark sales as completed/lost
- View assigned leads only
- **Cannot see other agents' conversations**

---

## CORE FEATURES

### 1. MULTI-TENANT ARCHITECTURE
- Isolated data per company (strict company_id filtering)
- Custom subdomains: `{company-slug}.yourplatform.com`
- Company-specific webhooks: `/webhook/{company_id}/whatsapp`
- Separate AI context and training per company
- Role-based access control (RBAC) at every layer

### 2. COMPANY ONBOARDING & SETUP

#### A. Basic Info & Localization
- Company name, logo, contact details
- **Country** (e.g., Malaysia, Singapore, Indonesia, etc.)
- **Preferred Language** (e.g., English, Bahasa Malaysia, Mandarin, Tamil, etc.)
- **Additional Languages** (multi-language support for customers)
- Timezone (auto-set based on country, but can be overridden)
- Business hours (with timezone awareness)
- Currency (auto-set based on country: MYR, SGD, IDR, etc.)
- Date format preferences (DD/MM/YYYY, MM/DD/YYYY, etc.)
- Industry category selection

#### B. Industry Category Selection (Critical for AI)
Options:
- E-commerce
- Retailer
- Real Estate  
- Education/Courses
- Healthcare
- Professional Services
- Restaurant/Food & Beverage
- Fitness/Wellness
- Financial Services
- Travel/Tourism
- SaaS/Technology
- Custom (define own)

**Why Categories Matter**: AI uses category-specific prompts, objection handling, and closing techniques.

#### C. Product/Service Catalog
- Product name, description, price
- Image upload (S3/CDN)
- Category tags, SKU
- Stock status, availability
- Product links/URLs
- Custom fields (specs, features)

#### D. Package Templates
- Create product bundles (Basic/Standard/Premium)
- Package builder: drag-drop products
- Template gallery (pre-designed per category)
- Auto-generate package images with branding
- Pricing logic (bundle discounts)

#### E. Integration Credentials & Webhooks (CRITICAL)
**Each company manages their own API credentials and webhook configurations.**

**WhatsApp Integration (OnSend API):**
- **OnSend API Key**: Company's own OnSend API key
- **OnSend API Secret**: Company's own API secret
- **OnSend Phone Number ID**: Company's WhatsApp Business phone number ID
- **Webhook URL**: Auto-generated as `/webhook/{company_id}/whatsapp`
- **Webhook Secret**: Auto-generated unique secret per company (for webhook verification)
- **Test Connection**: Verify credentials work before saving
- **Connection Status**: Show if credentials are valid/active

**Telegram Integration:**
- **Telegram Bot Token**: Company's own Telegram bot token (from @BotFather)
- **Telegram Bot Username**: Bot username for reference
- **Webhook URL**: Auto-generated as `/webhook/{company_id}/telegram`
- **Webhook Secret**: Auto-generated unique secret per company
- **Test Connection**: Verify bot token works
- **Connection Status**: Show if bot is active and receiving messages

**Webhook Configuration:**
- **Webhook Endpoints**: 
  - WhatsApp: `https://yourplatform.com/webhook/{company_id}/whatsapp`
  - Telegram: `https://yourplatform.com/webhook/{company_id}/telegram`
- **Webhook Verification**: Each company has unique secret for signature verification
- **Webhook Status**: Show if webhooks are properly configured at provider side
- **Webhook Test**: Send test webhook to verify endpoint works

**Security Features:**
- **Encrypted Storage**: All credentials encrypted at rest (AES-256)
- **Credential Masking**: Show only last 4 characters in UI (e.g., `****1234`)
- **Audit Log**: Track when credentials are added/updated
- **Credential Rotation**: Support for updating credentials without downtime
- **Access Control**: Only Company Admin can view/edit credentials

**Company Admin Capabilities:**
- Add/update WhatsApp credentials
- Add/update Telegram credentials
- Test connections before saving
- View webhook URLs and secrets
- Configure webhook settings at provider (OnSend/Telegram)
- View connection status and last successful connection
- Revoke/regenerate webhook secrets
- View webhook delivery logs and errors

### 3. AI TRAINING SYSTEM

#### A. Company-Specific Training
- Upload training documents (PDF, TXT, DOCX)
- FAQ builder (Q&A pairs)
- Brand voice settings:
  * Tone: Professional, Friendly, Casual, Formal
  * Style: Concise, Detailed, Persuasive
  * Language preferences
- Sample successful conversations
- Do's and Don'ts guidelines

#### B. Category-Based Templates
- Pre-trained prompts per industry
- Common objection handlers for that category
- Closing techniques specific to industry
- Best practices and compliance notes

#### C. Product Knowledge Integration
- AI automatically ingests product catalog
- Can reference products by name in conversations
- Send product cards with images via WhatsApp/Telegram
- Real-time inventory awareness

#### D. Continuous Learning System
- Store all conversations marked as "Won"
- AI analyzes successful patterns weekly
- Agent feedback loop (rate AI suggestions 1-5 stars)
- A/B testing response variations
- Update knowledge base automatically

#### E. Per-Company AI Model Training & Configuration (CRITICAL)
**Each company has its own trained AI model with unique prompts and behavior.**

**Company Admin Capabilities:**
- **Configure AI System Prompt**: Customize the base AI personality and instructions
- **Train AI Model**: Upload training data, successful conversations, and examples
- **Test AI Model**: Interactive testing interface to test prompts before deploying
- **Monitor AI Performance**: Track AI suggestion quality, usage rates, and effectiveness
- **Version Control**: Save and revert to previous AI model versions
- **A/B Testing**: Test different prompt variations and compare results
- **Language-Specific Training**: Train AI in company's preferred language(s)
- **Cultural Adaptation**: Configure AI to understand local customs, greetings, and communication styles

**AI Model Configuration Options:**
- Base system prompt (fully customizable)
- Response style (formal, casual, friendly, professional)
- Language preferences (primary + secondary languages)
- Cultural context (local customs, holidays, business practices)
- Industry-specific knowledge injection
- Product catalog integration
- FAQ and training material weighting
- Success pattern learning rate
- Temperature and creativity settings
- Max response length
- Auto-response triggers

**AI Model Testing Interface:**
- Test prompt builder with live preview
- Simulate conversations with different customer types
- Test responses in different languages
- Compare multiple prompt versions side-by-side
- Export test results and metrics
- Save test scenarios for future reference

### 4. CONVERSATION ASSIGNMENT & MONITORING

#### Company Admin Powers:
- **View ALL conversations** in company (live monitoring dashboard)
- **Assign new conversations** to specific users
- **Reassign conversations** between users anytime
- **Set assignment rules**: 
  * Round-robin distribution
  * Based on agent expertise/category
  * Based on current workload
  * Manual assignment only
- **Monitor in real-time**: See all agent chats without joining
- **Generate reports**: Per agent, per product, per time period

#### Company User (Agent) Experience:
- **Only see assigned conversations** in their inbox
- Receive notification when new chat assigned
- Can request transfer to another agent (needs admin approval)
- Cannot access unassigned or other agents' chats
- Clear indicator: "Assigned to you by [Admin Name]"

#### Assignment Workflow:
1. New customer message arrives via webhook
2. System checks assignment rules OR waits for manual assignment
3. Company Admin sees in "Unassigned Queue"
4. Admin assigns to specific user
5. User receives notification and chat appears in their inbox
6. Admin can still monitor conversation anytime
7. Admin can reassign if needed

### 5. CHATBOT & AUTOMATION
- Visual flow builder (company-specific)
- AI-powered natural language responses
- Product recommendation engine
- Smart routing based on inquiry type
- Auto-handoff to human when needed
- Trigger-based automation (keywords, time, behavior)

### 6. CRM & LEAD MANAGEMENT

#### AI Behavior Scoring System:
**🟢 Green (Hot Lead - 80-100 points)**
- Asking about pricing, packages, specific products
- Requesting purchase links or payment info
- Saying "I want to buy", "How do I order"
- Fast response time
- Multiple product inquiries

**🟡 Yellow (Warm Lead - 50-79 points)**
- Asking general questions about products
- Comparing options
- Interested but not committed
- Moderate engagement
- Needs nurturing

**🔴 Red (Cold Lead - 0-49 points)**
- Just browsing
- Vague questions
- Slow/no responses
- Not engaging with offers
- Price objections without follow-up

#### Lead Management:
- Contact database per company
- Lead status: New, Contacted, Qualified, Proposal Sent, Negotiation, Won, Lost
- Tags and custom fields
- Conversation history (all messages stored)
- Notes and internal comments
- Activity timeline

#### Conversation Features:
- Transfer between agents (with history)
- Internal notes (not visible to customer)
- Set reminders and follow-ups
- Mark as completed with sale details:
  * Sale amount
  * Products sold
  * Payment method
  * Success notes (for AI learning)

### 7. ANALYTICS & INSIGHTS

#### Company Admin Dashboard:
- **Overall metrics**: Total leads, conversion rate, revenue
- **Per-agent performance**: Conversations handled, conversion rate, avg response time
- **Lead distribution**: Green/Yellow/Red breakdown
- **Product performance**: Best sellers, most discussed
- **AI effectiveness**: Suggestion usage rate, agent ratings
- **Revenue tracking**: Daily/weekly/monthly
- **Customer behavior patterns**: Peak hours, common questions
- **Funnel analysis**: Where leads drop off

#### Agent Dashboard:
- Personal performance metrics
- Assigned leads by score
- Today's tasks and follow-ups
- Recent conversations
- Personal conversion rate

### 8. PRODUCT & TEMPLATE MANAGEMENT

#### Product Catalog:
- Full CRUD operations
- Bulk import (CSV)
- Image gallery management
- Categorization and tagging
- Inventory tracking
- Price history

#### Package Builder:
- Combine multiple products
- Set bundle pricing
- Create tiers (Basic/Pro/Premium)
- Visual package cards

#### Template Library:
- Message templates (greetings, follow-ups, closings)
- Response templates (FAQs, objections)
- Package templates (pre-designed bundles)
- Flow templates (common automation sequences)
- Global templates (by Super Admin) + company-specific

#### Success Case Templates (CRITICAL - AI Priority System)
**Purpose**: Pre-defined successful conversation patterns that AI checks FIRST before generating responses.

**Template Structure**:
Each template contains a conversation flow showing:
1. **Customer Message** (what customer says)
2. **Agent Response** (how to reply - the successful way)
3. **Context** (when to use this template)
4. **Expected Outcome** (what this response achieves)
5. **Follow-up Actions** (next steps)

**Template Types**:
- **Greeting Templates**: First contact scenarios
- **Objection Handling**: Price objections, product concerns, timing issues
- **Product Inquiry**: Questions about specific products
- **Closing Templates**: How to close the sale
- **Follow-up Templates**: Re-engaging cold leads
- **Language-Specific**: Templates in English, Chinese (zh), Bahasa Malaysia (bm)

**Super Admin Capabilities**:
- Create default success case templates (global templates)
- Organize by industry category
- Organize by language (en, zh, bm)
- Mark templates as "recommended" or "best practice"
- Version control for templates
- Analytics on template effectiveness

**Company Admin Capabilities**:
- **View all global templates** (created by Super Admin)
- **Enable/Disable templates** for their company
- **Create company-specific templates** (override or supplement global ones)
- **Select preferred templates** (mark as "use this first")
- **Test templates** with sample conversations
- **View template usage stats** (how often AI used each template)
- **Customize templates** (edit global templates for company use)
- **Organize by language** (select which language templates to use)

**AI Priority System**:
When generating a response, AI checks in this order:
1. **First**: Check if customer message matches any enabled success case template
2. **If match found**: Use template response (with personalization)
3. **If no match**: Fall back to trained AI model generation
4. **Template matching**: Based on:
   - Customer message keywords/intent
   - Conversation context
   - Customer behavior score
   - Language detected

**Template Example Structure**:
```json
{
  "id": "template_001",
  "name": "Price Objection - E-commerce",
  "category": "objection_handling",
  "industry": "E-commerce",
  "language": "en",
  "is_global": true,
  "is_enabled": true,
  "priority": 1,
  "scenarios": [
    {
      "customer_message_pattern": ["expensive", "too much", "cheaper", "discount"],
      "customer_message_examples": [
        "This is too expensive",
        "Can you give me a discount?",
        "Is there a cheaper option?"
      ],
      "agent_response": "I understand price is important. Let me show you the value you're getting...",
      "context": "When customer objects to price",
      "expected_outcome": "Overcome price objection, highlight value",
      "follow_up": "Offer payment plan or bundle discount if available"
    }
  ],
  "localized_versions": {
    "zh": {
      "customer_message_examples": ["太贵了", "可以便宜点吗", "有折扣吗"],
      "agent_response": "我理解价格很重要。让我向您展示您将获得的价值..."
    },
    "bm": {
      "customer_message_examples": ["mahal sangat", "boleh murah sikit", "ada diskaun tak"],
      "agent_response": "Saya faham harga penting. Biar saya tunjukkan nilai yang anda dapat..."
    }
  },
  "usage_count": 0,
  "success_rate": 0.0,
  "created_by": "super_admin",
  "created_at": "2024-01-01"
}
```

---

## MALAYSIA-SPECIFIC CONSIDERATIONS

Since the platform is designed for Malaysia (and expandable to other countries), special attention should be paid to:

### Language Support
- **Primary Languages**: English, Bahasa Malaysia (Malay), Mandarin Chinese, Tamil
- **Language Detection**: Auto-detect customer's preferred language from messages
- **Code-Switching**: Many Malaysians mix languages (e.g., "Boleh saya tengok the product?"). AI should understand and respond appropriately
- **Formal vs Informal**: Use appropriate formality based on context

### Cultural Context
- **Greetings**: 
  - "Selamat pagi" (Good morning), "Selamat petang" (Good afternoon)
  - "Terima kasih" (Thank you), "Sama-sama" (You're welcome)
- **Respect**: Always be polite and respectful (important in Malaysian culture)
- **Multi-ethnic Awareness**: Understand different cultural backgrounds (Malay, Chinese, Indian, etc.)
- **Sensitive Topics**: Avoid religion and politics

### Business Practices
- **Business Hours**: Typically 9am-6pm, but varies by industry
- **Public Holidays**: Account for Malaysian public holidays (Hari Raya, Chinese New Year, Deepavali, etc.)
- **Payment Methods**: 
  - FPX (Financial Process Exchange)
  - GrabPay, Touch 'n Go eWallet
  - Bank transfers (Maybank, CIMB, Public Bank, etc.)
  - Credit cards (Visa, Mastercard)
- **Shipping**: 
  - Pos Laju (national postal service)
  - J&T Express, Shopee Express, Lazada Express
  - Local courier services
- **Currency**: Malaysian Ringgit (MYR), format: RM 100.00

### Real Estate Specific (Malaysia)
- **Property Types**: 
  - Freehold vs Leasehold (important distinction)
  - Bumi lot vs Non-Bumi lot
  - Service apartments, condominiums, landed properties
- **Location Importance**: 
  - Near LRT/MRT stations
  - Good schools (especially international schools)
  - Shopping malls (KLCC, Pavilion, etc.)
  - Accessibility to highways

### Education Specific (Malaysia)
- **Accreditations**: MQA (Malaysian Qualifications Agency)
- **Student Loans**: PTPTN (Perbadanan Tabung Pendidikan Tinggi Nasional)
- **Qualifications**: SPM, STPM, A-Levels, Foundation, Diploma, Degree
- **Institutions**: Public universities, private universities, colleges

### E-commerce Specific (Malaysia)
- **Popular Platforms**: Shopee, Lazada, Zalora
- **Delivery Expectations**: Fast delivery (1-3 days) is expected
- **Return Policies**: Clear return/refund policies important
- **Customer Service**: 24/7 support appreciated

---

## DATABASE SCHEMA

```sql
-- Multi-tenant core
companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(100) UNIQUE,
  logo_url TEXT,
  industry_category VARCHAR(50),
  webhook_secret VARCHAR(255),
  subscription_plan VARCHAR(50),
  status VARCHAR(20), -- active, suspended, trial
  -- Localization fields
  country VARCHAR(100), -- Malaysia, Singapore, etc.
  preferred_language VARCHAR(50), -- en, ms, zh, ta, etc.
  additional_languages JSONB, -- ["en", "ms"] for multi-language support
  currency VARCHAR(3), -- MYR, SGD, IDR, etc.
  timezone VARCHAR(50), -- Asia/Kuala_Lumpur, etc.
  date_format VARCHAR(20), -- DD/MM/YYYY, MM/DD/YYYY, etc.
  settings JSONB, -- ai_settings, business_hours, etc
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

users (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50), -- super_admin, company_admin, company_user
  status VARCHAR(20), -- active, inactive
  avatar_url TEXT,
  metadata JSONB, -- expertise, departments, etc
  created_at TIMESTAMP,
  last_login TIMESTAMP
)

-- Company configuration
company_settings (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  brand_voice TEXT,
  response_tone VARCHAR(50),
  ai_temperature DECIMAL(2,1),
  auto_assign_enabled BOOLEAN,
  assignment_strategy VARCHAR(50), -- round_robin, manual, workload
  business_hours JSONB,
  created_at TIMESTAMP
)

-- Integration Credentials (Per Company - Encrypted)
company_integrations (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id) UNIQUE, -- one integration config per company
  -- WhatsApp/OnSend credentials (encrypted)
  onsend_api_key_encrypted TEXT, -- AES-256 encrypted
  onsend_api_secret_encrypted TEXT, -- AES-256 encrypted
  onsend_phone_number_id VARCHAR(100),
  onsend_webhook_secret VARCHAR(255), -- for webhook signature verification
  onsend_connection_status VARCHAR(20), -- connected, disconnected, error
  onsend_last_connected_at TIMESTAMP,
  onsend_last_error TEXT,
  -- Telegram credentials (encrypted)
  telegram_bot_token_encrypted TEXT, -- AES-256 encrypted
  telegram_bot_username VARCHAR(100),
  telegram_webhook_secret VARCHAR(255), -- for webhook signature verification
  telegram_connection_status VARCHAR(20), -- connected, disconnected, error
  telegram_last_connected_at TIMESTAMP,
  telegram_last_error TEXT,
  -- Webhook URLs (auto-generated, read-only)
  whatsapp_webhook_url TEXT, -- /webhook/{company_id}/whatsapp
  telegram_webhook_url TEXT, -- /webhook/{company_id}/telegram
  -- Metadata
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Integration Credential Audit Log
integration_credential_logs (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  integration_type VARCHAR(20), -- whatsapp, telegram
  action VARCHAR(50), -- added, updated, tested, revoked
  changed_by UUID REFERENCES users(id),
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB, -- additional context
  created_at TIMESTAMP
)

-- AI Model Configuration & Training (Per Company)
ai_model_configs (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  version VARCHAR(50), -- v1.0, v1.1, etc.
  is_active BOOLEAN DEFAULT false, -- only one active per company
  system_prompt TEXT, -- base AI personality and instructions
  response_style VARCHAR(50), -- formal, casual, friendly, professional
  language_config JSONB, -- {primary: "en", secondary: ["ms"], cultural_context: {...}}
  temperature DECIMAL(2,1) DEFAULT 0.7,
  max_tokens INT DEFAULT 1000,
  training_data_ids JSONB, -- references to training_materials used
  success_patterns_weight DECIMAL(3,2) DEFAULT 0.3, -- how much to weight successful patterns
  product_catalog_weight DECIMAL(3,2) DEFAULT 0.2,
  faq_weight DECIMAL(3,2) DEFAULT 0.2,
  training_materials_weight DECIMAL(3,2) DEFAULT 0.3,
  auto_response_enabled BOOLEAN DEFAULT false,
  auto_response_triggers JSONB, -- conditions for auto-response
  test_results JSONB, -- stored test scenarios and results
  performance_metrics JSONB, -- usage_rate, avg_rating, effectiveness_score
  created_by UUID REFERENCES users(id), -- which admin created this version
  created_at TIMESTAMP,
  deployed_at TIMESTAMP, -- when this version was activated
  notes TEXT -- admin notes about this version
)

-- AI Model Test Scenarios
ai_model_tests (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  model_config_id UUID REFERENCES ai_model_configs(id),
  test_name VARCHAR(255),
  scenario_description TEXT,
  customer_message TEXT,
  expected_response_type VARCHAR(100), -- should_mention_product, should_be_friendly, etc.
  actual_response TEXT, -- AI generated response
  test_result VARCHAR(20), -- passed, failed, needs_review
  test_metrics JSONB, -- response_time, relevance_score, language_match, etc.
  admin_feedback TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP
)

industry_categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  default_ai_prompt TEXT,
  common_objections JSONB,
  category_tips TEXT
)

-- Products & Services
products (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  currency VARCHAR(3),
  image_url TEXT,
  category VARCHAR(100),
  stock_status VARCHAR(20), -- in_stock, out_of_stock, limited
  sku VARCHAR(100),
  metadata JSONB, -- specs, links, custom_fields
  is_active BOOLEAN,
  created_at TIMESTAMP
)

packages (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255),
  tier VARCHAR(50), -- basic, standard, premium
  product_ids JSONB, -- [product_id1, product_id2, ...]
  total_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2),
  image_url TEXT,
  description TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP
)

-- AI Training
training_materials (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  type VARCHAR(50), -- document, faq, sample_conversation, guideline
  title VARCHAR(255),
  content TEXT,
  file_url TEXT,
  status VARCHAR(20), -- uploaded, processing, processed, failed
  processed_at TIMESTAMP,
  created_at TIMESTAMP
)

faqs (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  question TEXT,
  answer TEXT,
  category VARCHAR(100),
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP
)

ai_knowledge_base (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  topic VARCHAR(255),
  content TEXT,
  source VARCHAR(100), -- product, training, successful_conversation
  relevance_score DECIMAL(3,2),
  last_updated TIMESTAMP
)

-- CRM & Contacts
contacts (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  platform VARCHAR(20), -- whatsapp, telegram
  platform_id VARCHAR(255), -- WhatsApp ID or Telegram chat_id
  behavior_score INT, -- 0-100
  score_color VARCHAR(10), -- green, yellow, red
  tags JSONB, -- [tag1, tag2, ...]
  last_interaction TIMESTAMP,
  total_messages INT DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP
)

-- Conversations & Assignment
conversations (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  contact_id UUID REFERENCES contacts(id),
  assigned_to UUID REFERENCES users(id), -- CRITICAL: only this user sees it
  assigned_by UUID REFERENCES users(id), -- which admin assigned it
  status VARCHAR(50), -- new, in_progress, waiting, completed, lost
  sale_amount DECIMAL(10,2),
  products_sold JSONB, -- [{product_id, quantity, price}, ...]
  is_success BOOLEAN,
  completed_at TIMESTAMP,
  ai_effectiveness_rating INT, -- 1-5 stars from agent
  notes TEXT, -- internal notes
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Assignment history for monitoring
conversation_assignments (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMP
)

messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  content TEXT,
  sender_type VARCHAR(20), -- contact, agent, ai_bot
  sender_id UUID, -- user_id if agent
  suggested_by_ai BOOLEAN,
  agent_used_suggestion BOOLEAN,
  media_url TEXT,
  media_type VARCHAR(50),
  timestamp TIMESTAMP,
  read_at TIMESTAMP
)

-- AI Learning
successful_patterns (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  conversation_id UUID REFERENCES conversations(id),
  category VARCHAR(100),
  pattern_summary TEXT,
  key_messages JSONB, -- important messages that led to success
  outcome_data JSONB, -- sale_amount, products, timeline
  used_for_training BOOLEAN,
  effectiveness_score DECIMAL(3,2),
  created_at TIMESTAMP
)

ai_suggestions (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  suggested_message TEXT,
  was_used BOOLEAN,
  agent_rating INT, -- 1-5 stars
  modified_version TEXT, -- if agent edited before sending
  created_at TIMESTAMP
)

-- Success Case Templates (AI Priority System)
success_case_templates (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id), -- NULL for global templates (created by super admin)
  name VARCHAR(255),
  description TEXT,
  category VARCHAR(100), -- greeting, objection_handling, product_inquiry, closing, follow_up
  industry_category VARCHAR(50), -- E-commerce, Real Estate, etc. (NULL for all industries)
  language VARCHAR(10), -- en, zh, bm
  is_global BOOLEAN DEFAULT false, -- created by super admin
  is_recommended BOOLEAN DEFAULT false, -- marked as best practice by super admin
  priority INT DEFAULT 0, -- higher number = checked first
  -- Template structure
  customer_message_patterns JSONB, -- ["expensive", "too much", "cheaper"]
  customer_message_examples JSONB, -- ["This is too expensive", "Can you give me discount?"]
  agent_response TEXT, -- The successful response template
  agent_response_variations JSONB, -- Alternative responses
  context_description TEXT, -- When to use this template
  expected_outcome TEXT, -- What this response achieves
  follow_up_actions TEXT, -- Next steps after this response
  -- Localized versions (for en, zh, bm)
  localized_versions JSONB, -- {zh: {...}, bm: {...}}
  -- Metadata
  usage_count INT DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.0, -- percentage of successful outcomes
  effectiveness_score DECIMAL(3,2) DEFAULT 0.0, -- 0.0 to 1.0
  created_by UUID REFERENCES users(id), -- super_admin or company_admin
  version INT DEFAULT 1, -- template version number
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Company Template Selections (which templates each company uses)
company_template_selections (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  template_id UUID REFERENCES success_case_templates(id),
  is_enabled BOOLEAN DEFAULT true, -- company can enable/disable templates
  is_preferred BOOLEAN DEFAULT false, -- mark as "use this first"
  priority INT DEFAULT 0, -- company-specific priority override
  custom_modifications JSONB, -- company can customize template response
  usage_count INT DEFAULT 0, -- how many times this company used this template
  last_used_at TIMESTAMP,
  created_at TIMESTAMP,
  UNIQUE(company_id, template_id)
)

-- Legacy Templates (for backward compatibility)
templates (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id), -- NULL for global templates
  type VARCHAR(50), -- message, flow, package
  name VARCHAR(255),
  content TEXT,
  category VARCHAR(100),
  is_global BOOLEAN, -- created by super admin
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP
)

-- Analytics tracking
analytics_events (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(100), -- conversation_assigned, message_sent, sale_completed, etc
  conversation_id UUID,
  metadata JSONB,
  created_at TIMESTAMP
)

-- Indexes for performance
CREATE INDEX idx_conversations_assigned_to ON conversations(assigned_to);
CREATE INDEX idx_conversations_company_id ON conversations(company_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_behavior_score ON contacts(behavior_score);
CREATE INDEX idx_ai_model_configs_company_active ON ai_model_configs(company_id, is_active);
CREATE INDEX idx_ai_model_tests_company_model ON ai_model_tests(company_id, model_config_id);
CREATE INDEX idx_companies_country ON companies(country);
CREATE INDEX idx_success_case_templates_language ON success_case_templates(language);
CREATE INDEX idx_success_case_templates_industry ON success_case_templates(industry_category);
CREATE INDEX idx_success_case_templates_global_active ON success_case_templates(is_global, is_active);
CREATE INDEX idx_company_template_selections_enabled ON company_template_selections(company_id, is_enabled);
CREATE INDEX idx_company_template_selections_preferred ON company_template_selections(company_id, is_preferred, priority);
CREATE INDEX idx_company_integrations_company ON company_integrations(company_id);
CREATE INDEX idx_integration_credential_logs_company ON integration_credential_logs(company_id, created_at);
```

---

## BACKEND tRPC ROUTES

```typescript
// Super Admin Routes
superAdmin.companies.list()
superAdmin.companies.create(data)
superAdmin.companies.suspend(companyId)
superAdmin.companies.delete(companyId)
superAdmin.analytics.platformWide()
superAdmin.analytics.byCompany(companyId)

// Company Admin Routes
company.setup.complete(onboardingData) // onboarding wizard
company.setup.updateCategory(category)
company.setup.updateBrandVoice(settings)

company.users.list() // list all agents
company.users.create(userData)
company.users.update(userId, data)
company.users.delete(userId)
company.users.getPerformance(userId)

company.products.list()
company.products.create(productData)
company.products.update(productId, data)
company.products.delete(productId)
company.products.bulkImport(csvData)

company.packages.list()
company.packages.create(packageData)
company.packages.update(packageId, data)
company.packages.delete(packageId)

company.training.uploadDocument(file)
company.training.createFAQ(faqData)
company.training.listMaterials()
company.training.updateKnowledgeBase()

// AI Model Configuration & Training (Company Admin)
company.ai.getActiveModel() // get current active AI model config
company.ai.listModelVersions() // list all model versions
company.ai.createModelVersion(configData) // create new model version
company.ai.updateModelVersion(versionId, updates) // update model config
company.ai.activateModelVersion(versionId) // deploy/activate a version
company.ai.revertToVersion(versionId) // revert to previous version
company.ai.deleteModelVersion(versionId) // delete unused version
company.ai.testModel(versionId, testScenario) // test AI model with scenario
company.ai.listTestResults(versionId?) // get test results for model
company.ai.getModelPerformance(versionId?) // get performance metrics
company.ai.exportModelConfig(versionId) // export model config as JSON
company.ai.importModelConfig(configJson) // import model config

// Success Case Templates (Super Admin)
superAdmin.templates.list() // list all global templates
superAdmin.templates.create(templateData) // create global template
superAdmin.templates.update(templateId, data) // update global template
superAdmin.templates.delete(templateId) // delete global template
superAdmin.templates.markRecommended(templateId) // mark as best practice
superAdmin.templates.getAnalytics(templateId?) // template usage analytics

// Success Case Templates (Company Admin)
company.templates.listGlobal() // view all global templates (from super admin)
company.templates.listCompany() // list company-specific templates
company.templates.listEnabled() // list enabled templates for this company
company.templates.enable(templateId) // enable a global template for company
company.templates.disable(templateId) // disable a template
company.templates.setPreferred(templateId, isPreferred) // mark as preferred
company.templates.setPriority(templateId, priority) // set company-specific priority
company.templates.createCompany(templateData) // create company-specific template
company.templates.updateCompany(templateId, data) // update company template
company.templates.customize(templateId, modifications) // customize global template for company
company.templates.test(templateId, customerMessage) // test template with sample message
company.templates.getUsageStats(templateId?) // get template usage statistics

// Legacy Templates (backward compatibility)
company.templates.list(type?)
company.templates.create(templateData)
company.templates.update(templateId, data)

// CRITICAL: Conversation Assignment (Company Admin)
company.conversations.listAll() // admin sees ALL conversations
company.conversations.listUnassigned() // unassigned queue
company.conversations.assign(conversationId, userId) // assign to agent
company.conversations.reassign(conversationId, newUserId, reason)
company.conversations.getAssignmentHistory(conversationId)
company.conversations.monitor(conversationId) // read-only monitoring

company.analytics.overview()
company.analytics.byAgent(userId)
company.analytics.byProduct(productId)
company.analytics.revenue(dateRange)
company.analytics.leadDistribution()

// Company User (Agent) Routes - FILTERED BY ASSIGNMENT
agent.conversations.list() // ONLY assigned to this user
agent.conversations.get(conversationId) // only if assigned to them
agent.conversations.sendMessage(conversationId, message)
agent.conversations.requestTransfer(conversationId, reason)
agent.conversations.markComplete(conversationId, saleData)
agent.conversations.addNote(conversationId, note)

agent.contacts.list() // only contacts from assigned conversations
agent.contacts.view(contactId)
agent.contacts.export(filters)

agent.ai.getSuggestion(conversationId)
agent.ai.rateSuggestion(suggestionId, rating)
agent.ai.sendWithAI(conversationId, context)

agent.products.search(query) // search company catalog
agent.products.sendCard(conversationId, productId)

agent.dashboard.myStats()
agent.dashboard.myTasks()

// Integration Credentials Management (Company Admin)
company.integrations.get() // get current integration credentials (masked)
company.integrations.updateWhatsApp(credentials) // update OnSend/WhatsApp credentials
company.integrations.updateTelegram(credentials) // update Telegram bot credentials
company.integrations.testWhatsApp() // test OnSend connection
company.integrations.testTelegram() // test Telegram bot connection
company.integrations.getWebhookUrls() // get webhook URLs for configuration
company.integrations.regenerateWebhookSecret(platform) // regenerate webhook secret (whatsapp/telegram)
company.integrations.getConnectionStatus() // get connection status for both platforms
company.integrations.getAuditLog() // get credential change history

// Shared/Public Routes
webhook.whatsapp(companyId) // POST /webhook/:companyId/whatsapp (uses company's OnSend credentials)
webhook.telegram(companyId) // POST /webhook/:companyId/telegram (uses company's Telegram credentials)

ai.analyzeConversation(conversationId)
ai.scoreContact(contactId)
ai.generateResponse(conversationId, context)
ai.recommendProducts(conversationId)

// Middleware on all routes
- Authentication (JWT)
- Company isolation (check company_id)
- Role-based access (check user role)
- Rate limiting per company
```

---

## AI INTEGRATION STRATEGY

### 1. Context Building Per Company (With Localization & Custom Model)

When generating AI responses, build context using company's trained model:

```javascript
// Get active AI model configuration for company
const aiModel = await db.ai_model_configs.findFirst({
  where: {
    company_id: companyId,
    is_active: true
  }
})

// Build localized context
const aiContext = {
  // Use company's custom system prompt (trained model)
  system: aiModel.system_prompt || `You are an AI sales assistant for ${company.name} in the ${company.category} industry.`,
  
  // Localization
  country: company.country, // Malaysia, Singapore, etc.
  language: company.preferred_language, // en, ms, zh, ta
  additionalLanguages: company.additional_languages, // ["ms", "zh"]
  currency: company.currency, // MYR, SGD, etc.
  timezone: company.timezone,
  culturalContext: aiModel.language_config?.cultural_context || {}, // local customs, greetings
  
  // Company settings
  brandVoice: company.settings.brand_voice,
  tone: company.settings.response_tone,
  responseStyle: aiModel.response_style, // from model config
  
  // Weighted training data
  products: await getCompanyProducts(companyId), // weighted by product_catalog_weight
  training: await getTrainingMaterials(companyId), // weighted by training_materials_weight
  faqs: await getCompanyFAQs(companyId), // weighted by faq_weight
  successfulPatterns: await getSuccessfulPatterns(companyId), // weighted by success_patterns_weight
  
  // AI Model settings
  temperature: aiModel.temperature,
  maxTokens: aiModel.max_tokens,
  
  // Current conversation
  currentConversation: {
    contact: contactInfo,
    history: last10Messages,
    behaviorScore: contact.behavior_score,
    assignedAgent: agentInfo,
    detectedLanguage: detectLanguage(last10Messages) // auto-detect customer language
  }
}

// Build localized prompt with cultural context
const localizedPrompt = buildLocalizedPrompt(aiContext, company, aiModel)

// Send to Claude API with company's trained model context
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "x-api-key": process.env.CLAUDE_API_KEY
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: aiModel.max_tokens,
    temperature: aiModel.temperature,
    messages: [
      { 
        role: "system",
        content: aiModel.system_prompt
      },
      { 
        role: "user", 
        content: localizedPrompt
      }
    ]
  })
})

function buildLocalizedPrompt(context, company, aiModel) {
  // Detect customer's language preference
  const customerLanguage = detectCustomerLanguage(context.currentConversation.history)
  
  // Build language-specific instructions
  let languageInstructions = `Respond in ${company.preferred_language}`
  if (customerLanguage && customerLanguage !== company.preferred_language) {
    languageInstructions += `, but the customer is using ${customerLanguage}, so adapt accordingly.`
  }
  
  // Add cultural context for Malaysia
  let culturalContext = ''
  if (company.country === 'Malaysia') {
    culturalContext = `
CULTURAL CONTEXT (Malaysia):
- Use appropriate greetings: "Selamat pagi" (morning), "Terima kasih" (thank you)
- Be respectful and polite (important in Malaysian culture)
- Understand local business hours (9am-6pm typically)
- Currency: ${company.currency} (Ringgit)
- Common phrases: "Boleh" (can), "Tak apa" (no problem), "Betul" (correct)
- Be aware of multi-ethnic context (Malay, Chinese, Indian, etc.)
- Avoid sensitive topics (religion, politics)
`
  }
  
  return `
${languageInstructions}

${culturalContext}

COMPANY: ${company.name}
INDUSTRY: ${company.industry_category}
BRAND VOICE: ${context.brandVoice}
RESPONSE STYLE: ${aiModel.response_style}

AVAILABLE PRODUCTS:
${context.products.map(p => `- ${p.name}: ${p.description} (${context.currency} ${p.price})`).join('\n')}

TRAINING MATERIALS:
${context.training.slice(0, 5).map(t => t.content).join('\n\n')}

SUCCESSFUL PATTERNS (learn from these):
${context.successfulPatterns.map(p => p.pattern_summary).join('\n\n')}

CONVERSATION HISTORY:
${context.currentConversation.history.map(m => 
  `${m.sender_type === 'contact' ? 'Customer' : 'Agent'}: ${m.content}`
).join('\n')}

CUSTOMER BEHAVIOR SCORE: ${context.currentConversation.behaviorScore}/100

Generate a helpful, natural response that:
1. Addresses the customer's last message directly
2. Uses appropriate language and cultural context
3. Suggests relevant products if appropriate
4. Uses the brand voice and response style specified
5. Applies successful patterns learned from past conversations
6. Moves the conversation toward a sale if customer seems ready (green score)

Response:`
}
```

### 2. Behavior Scoring Algorithm

```javascript
function calculateBehaviorScore(contact, recentMessages) {
  let score = 0
  
  // Purchase intent keywords (+20 points each)
  const highIntentKeywords = ['buy', 'purchase', 'order', 'price', 'cost', 'payment']
  highIntentKeywords.forEach(keyword => {
    if (recentMessages.some(m => m.content.toLowerCase().includes(keyword))) {
      score += 20
    }
  })
  
  // Response speed (+15 points if fast)
  const avgResponseTime = calculateAvgResponseTime(recentMessages)
  if (avgResponseTime < 300) score += 15 // under 5 minutes
  
  // Engagement level (+10 points)
  const messageCount = recentMessages.length
  if (messageCount > 10) score += 10
  
  // Asking specific product questions (+15)
  if (mentionsSpecificProducts(recentMessages)) score += 15
  
  // Positive sentiment (+10)
  if (hasPositiveSentiment(recentMessages)) score += 10
  
  // Negative signals
  if (hasObjections(recentMessages)) score -= 10
  if (avgResponseTime > 3600) score -= 15 // over 1 hour
  
  // Clamp between 0-100
  return Math.max(0, Math.min(100, score))
}

function getScoreColor(score) {
  if (score >= 80) return 'green'
  if (score >= 50) return 'yellow'
  return 'red'
}

// Update after every 3 messages
async function updateContactScore(contactId) {
  const recentMessages = await getRecentMessages(contactId, 10)
  const score = calculateBehaviorScore(contact, recentMessages)
  const color = getScoreColor(score)
  
  await db.contacts.update({
    where: { id: contactId },
    data: { behavior_score: score, score_color: color }
  })
  
  // Notify admin if score changes to green
  if (color === 'green' && previousColor !== 'green') {
    notifyCompanyAdmin(contact.company_id, `Hot lead: ${contact.name}`)
  }
}
```

### 3. AI Response Generation

```javascript
async function generateAIResponse(conversationId, userId) {
  const conversation = await db.conversations.findUnique({
    where: { id: conversationId },
    include: { 
      contact: true, 
      messages: { take: 10, orderBy: { timestamp: 'desc' } }
    }
  })
  
  // Check if user is assigned
  if (conversation.assigned_to !== userId) {
    throw new Error('Not assigned to you')
  }
  
  const company = await db.companies.findUnique({
    where: { id: conversation.company_id },
    include: { 
      settings: true,
      products: { where: { is_active: true } },
      training_materials: { where: { status: 'processed' } }
    }
  })
  
  const context = buildAIContext(company, conversation)
  
  const response = await callClaudeAPI(context)
  
  // Store suggestion for tracking
  const suggestion = await db.ai_suggestions.create({
    data: {
      conversation_id: conversationId,
      suggested_message: response,
      was_used: false
    }
  })
  
  return { suggestionId: suggestion.id, message: response }
}
```

### 4. Learning Loop (Batch Process)

```javascript
// Run weekly or after every 10 successful sales
async function learnFromSuccesses(companyId) {
  const successfulConvos = await db.conversations.findMany({
    where: {
      company_id: companyId,
      is_success: true,
      completed_at: { gte: lastLearningDate }
    },
    include: { messages: true }
  })
  
  // Extract patterns
  for (const convo of successfulConvos) {
    const pattern = await analyzeConversationPattern(convo)
    
    await db.successful_patterns.create({
      data: {
        company_id: companyId,
        conversation_id: convo.id,
        category: convo.contact.category,
        pattern_summary: pattern.summary,
        key_messages: pattern.keyMessages,
        outcome_data: {
          sale_amount: convo.sale_amount,
          products: convo.products_sold,
          time_to_close: pattern.timeToClose
        },
        used_for_training: true
      }
    })
  }
  
  // Update knowledge base
  await updateCompanyKnowledgeBase(companyId, successfulConvos)
}

async function analyzeConversationPattern(conversation) {
  // Send to Claude for analysis
  const analysis = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Analyze this successful sales conversation and identify:
        1. Key messages that led to the sale
        2. Objection handling techniques used
        3. Closing approach
        4. Products mentioned
        
        Conversation: ${JSON.stringify(conversation.messages)}`
      }]
    })
  })
  
  return analysis
}
```

### 5. AI Model Testing & Monitoring

```typescript
// Test AI model with a scenario
async function testAIModel(companyId: string, modelVersionId: string, testScenario: {
  customerMessage: string,
  expectedBehavior: string,
  language?: string
}) {
  const company = await db.companies.findUnique({
    where: { id: companyId },
    include: { settings: true }
  })
  
  const modelConfig = await db.ai_model_configs.findUnique({
    where: { id: modelVersionId }
  })
  
  // Build test context
  const testContext = buildAIContext(company, modelConfig, {
    messages: [{ content: testScenario.customerMessage, sender_type: 'contact' }]
  })
  
  // Generate response
  const startTime = Date.now()
  const response = await generateAIResponse(testContext, modelConfig)
  const responseTime = Date.now() - startTime
  
  // Analyze response quality
  const analysis = await analyzeResponseQuality(response, testScenario)
  
  // Store test result
  const testResult = await db.ai_model_tests.create({
    data: {
      company_id: companyId,
      model_config_id: modelVersionId,
      test_name: `Test ${new Date().toISOString()}`,
      scenario_description: testScenario.expectedBehavior,
      customer_message: testScenario.customerMessage,
      actual_response: response,
      test_result: analysis.passed ? 'passed' : 'failed',
      test_metrics: {
        response_time: responseTime,
        relevance_score: analysis.relevanceScore,
        language_match: analysis.languageMatch,
        cultural_appropriateness: analysis.culturalScore,
        tone_match: analysis.toneMatch
      }
    }
  })
  
  return testResult
}

// Monitor AI model performance
async function getModelPerformance(companyId: string, modelVersionId?: string) {
  const whereClause: any = { company_id: companyId }
  if (modelVersionId) {
    whereClause.model_config_id = modelVersionId
  }
  
  // Get all suggestions for this model
  const suggestions = await db.ai_suggestions.findMany({
    where: {
      conversation: {
        company_id: companyId
      },
      created_at: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // last 30 days
      }
    },
    include: {
      conversation: true
    }
  })
  
  // Calculate metrics
  const totalSuggestions = suggestions.length
  const usedSuggestions = suggestions.filter(s => s.was_used).length
  const usageRate = totalSuggestions > 0 ? (usedSuggestions / totalSuggestions) * 100 : 0
  
  const ratedSuggestions = suggestions.filter(s => s.agent_rating !== null)
  const avgRating = ratedSuggestions.length > 0
    ? ratedSuggestions.reduce((sum, s) => sum + (s.agent_rating || 0), 0) / ratedSuggestions.length
    : 0
  
  // Update model performance metrics
  if (modelVersionId) {
    await db.ai_model_configs.update({
      where: { id: modelVersionId },
      data: {
        performance_metrics: {
          usage_rate: usageRate,
          avg_rating: avgRating,
          total_suggestions: totalSuggestions,
          used_suggestions: usedSuggestions,
          last_updated: new Date()
        }
      }
    })
  }
  
  return {
    usageRate,
    avgRating,
    totalSuggestions,
    usedSuggestions,
    ratedSuggestions: ratedSuggestions.length
  }
}
```

### 6. Category-Specific AI Prompts (With Localization)

```javascript
const categoryPrompts = {
  'E-commerce': {
    default: `Focus on product benefits, create urgency with limited stock or discounts. 
    Common objections: Price, shipping time, return policy.
    Closing: "Shall I send you the payment link?"`,
    malaysia: `Focus on product benefits, create urgency with limited stock or discounts.
    Common objections: Price, shipping time, return policy.
    Closing: "Boleh saya hantar link pembayaran?" (Can I send you the payment link?)
    Use local payment methods: FPX, GrabPay, Touch 'n Go, etc.
    Shipping: Mention Pos Laju, J&T, Shopee Express for local delivery.`
  },
  
  'Real Estate': {
    default: `Emphasize location, ROI, and viewing opportunities.
    Common objections: Price, location, timing.
    Closing: "Would you like to schedule a viewing?"`,
    malaysia: `Emphasize location, ROI, and viewing opportunities.
    Common objections: Price, location, timing.
    Closing: "Boleh kita buat appointment untuk tengok property?" (Can we schedule a viewing?)
    Mention: Near LRT/MRT, good schools, shopping malls (important in Malaysia).
    Understand: Freehold vs Leasehold, Bumi lot considerations.`
  },
  
  'Education': {
    default: `Highlight outcomes, testimonials, and flexible payment plans.
    Common objections: Time commitment, ROI, prerequisites.
    Closing: "Can I reserve your spot in the next cohort?"`,
    malaysia: `Highlight outcomes, testimonials, and flexible payment plans.
    Common objections: Time commitment, ROI, prerequisites.
    Closing: "Boleh saya reserve tempat untuk cohort seterusnya?" (Can I reserve your spot?)
    Mention: MQA accreditation, PTPTN loan eligibility (if applicable).
    Understand: Local education system, SPM/STPM qualifications.`
  },
  
  // ... more categories
}

function getCategoryPrompt(category, country = 'default') {
  const prompts = categoryPrompts[category]
  if (!prompts) return categoryPrompts['default']?.default || ''
  
  return prompts[country.toLowerCase()] || prompts.default
}
```

---

## FRONTEND STRUCTURE

### Super Admin Portal (`/admin`)
```
/admin/dashboard - Platform overview
/admin/companies - Company list, create, manage
  /admin/companies/:id - Company details
/admin/analytics - Platform-wide metrics
/admin/settings - System configuration

/admin/templates ← GLOBAL SUCCESS CASE TEMPLATES
  - Template Library
    * Create new global templates
    * Edit existing templates
    * Delete templates
    * Duplicate templates
    * Version control
  
  - Template Builder
    * Template name and description
    * Category selection (greeting, objection, closing, etc.)
    * Industry category (or "All Industries")
    * Language selection (en, zh, bm)
    * Customer message patterns (keywords to match)
    * Customer message examples
    * Agent response template
    * Agent response variations
    * Context description
    * Expected outcome
    * Follow-up actions
    * Localized versions (zh, bm translations)
  
  - Template Management
    * Mark as "Recommended" (best practice)
    * Set priority levels
    * Organize by industry
    * Organize by language
    * Template analytics (usage across all companies)
    * Effectiveness tracking
  
  - Template Testing
    * Test templates with sample messages
    * Preview responses in all languages
    * Validate template matching logic
```

### Company Admin Portal (`/company`)
```
/company/dashboard 
  - Quick stats (leads, conversions, revenue)
  - Unassigned conversations queue ← KEY FEATURE
  - Agent workload distribution
  - Today's activity

/company/setup - Onboarding wizard
  Step 1: Basic info (name, logo, category)
  Step 2: Product catalog setup
  Step 3: AI training materials
  Step 4: Team setup
  Step 5: Configuration

/company/conversations ← MONITORING CENTER
  - ALL conversations (regardless of assignment)
  - Filters: Assigned to, Status, Score, Date
  - Live chat monitoring (read-only)
  - Assign/Reassign buttons
  - Assignment history modal

/company/conversations/unassigned
  - Queue of new/unassigned chats
  - Quick assign interface
  - Preview conversation before assigning
  - Bulk assignment options

/company/users - Agent management
  - List with performance stats
  - Create/edit/deactivate agents
  - Set expertise/departments
  - View assigned conversations per agent
  - Workload balancing view

/company/products
  - Product catalog (grid/list view)
  - Create/edit/delete products
  - Bulk import CSV
  - Category management
  - Image upload

/company/packages
  - Package builder UI
  - Combine products into bundles
  - Pricing calculator
  - Template gallery

/company/training
  - Upload documents tab
  - FAQ builder tab
  - Brand voice configurator
  - Sample conversations
  - Knowledge base status

/company/ai-model ← AI MODEL CONFIGURATION & TRAINING
  - Active Model Overview
    * Current version info
    * Performance metrics dashboard
    * Quick stats (usage rate, avg rating, effectiveness)
  
  - Model Configuration
    * System prompt editor (rich text with preview)
    * Response style selector
    * Language settings (primary + secondary)
    * Cultural context configurator
    * Temperature and creativity sliders
    * Training data weighting controls
    * Auto-response trigger settings
  
  - Model Versions
    * List all versions (active highlighted)
    * Version comparison view
    * Create new version from current
    * Duplicate existing version
    * Activate/deploy version
    * Revert to previous version
    * Delete unused versions
  
  - Test & Monitor
    * Interactive test interface
      - Test prompt builder
      - Simulate customer messages
      - Live AI response preview
      - Test in multiple languages
      - Compare versions side-by-side
    * Test scenario library
      - Save common test scenarios
      - Run batch tests
      - View test history
    * Performance monitoring
      - AI suggestion usage rate
      - Agent ratings (1-5 stars)
      - Response quality metrics
      - Language accuracy
      - Cultural appropriateness score
      - Conversion impact analysis
    * A/B Testing
      - Create test variants
      - Deploy to percentage of conversations
      - Compare results
      - Statistical significance analysis

/company/templates ← SUCCESS CASE TEMPLATES (AI Priority System)
  - Global Templates Library
    * View all templates created by Super Admin
    * Filter by: Industry, Language (en/zh/bm), Category
    * Search templates
    * Preview template structure
    * See template effectiveness stats
  
  - Enabled Templates
    * List of templates enabled for this company
    * Enable/Disable toggle for each template
    * Set priority (which templates checked first)
    * Mark as "Preferred" (use this first)
    * View usage statistics per template
  
  - Template Configuration
    * Customize global templates for company use
    * Create company-specific templates
    * Edit template responses
    * Add company-specific variations
    * Test templates with sample messages
  
  - Template Testing
    * Test interface: Enter customer message
    * See which template matches (if any)
    * Preview template response
    * Test in different languages (en, zh, bm)
    * Compare multiple template responses
  
  - Template Analytics
    * Usage count per template
    * Success rate (conversion when template used)
    * Effectiveness score
    * Most used templates
    * Templates by language breakdown
  
  - Legacy Templates (backward compatibility)
    * Message templates
    * Flow templates
    * Package templates
    * Category organization

/company/analytics
  - Company overview
  - Per-agent performance
  - Product performance
  - Revenue reports
  - Lead funnel
  - AI effectiveness

/company/settings
  - Company profile
  - Assignment rules
  - Business hours
  - Billing

/company/integrations ← INTEGRATION CREDENTIALS MANAGEMENT
  - WhatsApp/OnSend Integration
    * API Key input (masked display: ****1234)
    * API Secret input (masked)
    * Phone Number ID input
    * Test Connection button
    * Connection Status indicator (connected/disconnected/error)
    * Last Connected timestamp
    * Error messages display
    * Webhook URL display (read-only): /webhook/{company_id}/whatsapp
    * Webhook Secret display (with regenerate button)
    * Instructions: "Configure this webhook URL in your OnSend dashboard"
  
  - Telegram Integration
    * Bot Token input (masked display: ****1234)
    * Bot Username display (auto-filled after test)
    * Test Connection button
    * Connection Status indicator
    * Last Connected timestamp
    * Error messages display
    * Webhook URL display (read-only): /webhook/{company_id}/telegram
    * Webhook Secret display (with regenerate button)
    * Instructions: "Configure this webhook URL in your Telegram Bot settings"
  
  - Credential Management
    * Save credentials (encrypted)
    * Update credentials
    * Delete/Revoke credentials
    * Credential audit log (who changed what, when)
    * Security notice: "Credentials are encrypted and only accessible by Company Admins"
  
  - Connection Testing
    * Test WhatsApp connection
    * Test Telegram connection
    * View connection logs
    * Troubleshooting guide
```

### Agent Portal (`/agent`)
```
/agent/dashboard
  - My assigned leads (green/yellow/red)
  - Today's tasks & follow-ups
  - My performance stats
  - Quick actions

/agent/conversations ← ONLY ASSIGNED
  - Inbox (only conversations assigned to them)
  - Chat interface with:
    * AI suggestion panel (real-time)
    * Product catalog sidebar (quick-send)
    * Customer info panel (score, history, notes)
    * Action buttons (transfer request, complete, add note)
  
/agent/conversations/:id
  - Full chat view
  - Message history
  - AI-powered response suggestions
  - Send product cards
  - Internal notes
  - Transfer request modal
  - Mark as completed form

/agent/contacts
  - Only contacts from assigned conversations
  - Filter by score
  - Export assigned contacts

/agent/products
  - Browse company catalog
  - Search products
  - Quick product card generator

/agent/profile
  - Personal settings
  - Performance history
  - Training materials
```

### Shared Components

#### Chat Interface Component
```vue
<ChatInterface>
  <MessageThread />
  <AISuggestionPanel />
  <ProductQuickSend />
  <CustomerInfoSidebar>
    - Name, phone, platform
    - Behavior score (colored badge)
    - Tags
    - Last interaction
    - Message count
    - Assignment info
  </CustomerInfoSidebar>
  <ActionBar>
    - Send message
    - Attach media
    - Send product
    - Add note
    - Transfer (if agent)
    - Reassign (if admin)
    - Mark complete
  </ActionBar>
</ChatInterface>
```

#### Assignment Modal (Company Admin)
```vue
<AssignmentModal>
  - Conversation preview
  - Customer info & score
  - Agent dropdown (with current workload)
  - Assignment reason (optional)
  - Confirm button
  - Shows: "Will notify [Agent Name]"
</AssignmentModal>
```

---

## IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] Multi-tenant database setup with company_id isolation
- [ ] User authentication & JWT system
- [ ] Role-based middleware (super_admin, company_admin, company_user)
- [ ] Company CRUD operations
- [ ] User management (create, list, delete agents)
- [ ] Basic dashboard shells

### Phase 2: Company Setup & Localization (Week 2-3)
- [ ] Onboarding wizard UI
- [ ] **Localization setup** (country, language, currency, timezone)
- [ ] **Country-specific defaults** (Malaysia, Singapore, etc.)
- [ ] Category selection system
- [ ] Product catalog CRUD
- [ ] Image upload to S3/CDN
- [ ] Package builder UI
- [ ] Template system
- [ ] **Integration Credentials Management**
  - [ ] Database schema for company_integrations
  - [ ] Credential encryption/decryption service (AES-256)
  - [ ] Integration settings UI
  - [ ] Credential input forms (masked display)
  - [ ] Connection testing functionality
  - [ ] Webhook URL generation
  - [ ] Webhook secret generation
  - [ ] Credential audit logging

### Phase 3: Webhooks & Messaging with Company Credentials (Week 3-4)
- [ ] **WhatsApp webhook receiver** (uses company's OnSend credentials)
  - [ ] Load company's integration credentials
  - [ ] Verify webhook signature using company's webhook secret
  - [ ] Process incoming messages
- [ ] **Telegram webhook receiver** (uses company's bot token)
  - [ ] Load company's integration credentials
  - [ ] Verify webhook signature using company's webhook secret
  - [ ] Process incoming messages
- [ ] Message storage in database
- [ ] Contact creation/update logic
- [ ] Webhook routing by company_id
- [ ] **Message sending using company credentials**
  - [ ] Send WhatsApp messages via OnSend (using company's API key)
  - [ ] Send Telegram messages (using company's bot token)
  - [ ] Connection status tracking
  - [ ] Error handling and retry logic

### Phase 4: Conversation Assignment System (Week 4-5) ← CRITICAL
- [ ] Conversation assignment table
- [ ] Assignment middleware (filter by assigned_to)
- [ ] Company Admin: View all conversations endpoint
- [ ] Company Admin: Assign conversation to user
- [ ] Company Admin: Reassign conversation
- [ ] Company Admin: Unassigned queue view
- [ ] Assignment notification system
- [ ] Agent: Only see assigned conversations filter
- [ ] Transfer request workflow
- [ ] Assignment history tracking

### Phase 5: AI Training System & Model Configuration (Week 5-6)
- [ ] Document upload (PDF, TXT, DOCX parsing)
- [ ] FAQ builder interface
- [ ] Brand voice configurator
- [ ] Knowledge base processing
- [ ] Category-based prompt templates (with country-specific variants)
- [ ] Training material status tracking
- [ ] **Success Case Templates System (CRITICAL - AI Priority)**
  - [ ] Database schema for success_case_templates and company_template_selections
  - [ ] Super Admin: Template builder interface
  - [ ] Super Admin: Create global templates (en, zh, bm)
  - [ ] Super Admin: Template management (edit, delete, mark recommended)
  - [ ] Company Admin: View global templates library
  - [ ] Company Admin: Enable/disable templates for company
  - [ ] Company Admin: Set template priority and preferences
  - [ ] Company Admin: Customize templates for company use
  - [ ] Company Admin: Create company-specific templates
  - [ ] Template testing interface (test with sample messages)
  - [ ] Template matching algorithm (pattern and keyword matching)
  - [ ] Template personalization system
  - [ ] Template usage tracking and analytics
- [ ] **AI Model Configuration System**
  - [ ] Model version management (create, update, activate, revert)
  - [ ] System prompt editor with preview
  - [ ] Training data weighting controls
  - [ ] Language and cultural context configurator
  - [ ] Model performance tracking
- [ ] **AI Model Testing Interface**
  - [ ] Interactive test scenario builder
  - [ ] Live response preview
  - [ ] Multi-language testing (en, zh, bm)
  - [ ] Test result storage and comparison
  - [ ] A/B testing framework

### Phase 6: AI Integration with Trained Models (Week 6-8)
- [ ] Claude API integration setup
- [ ] **AI Response Generation with Template Priority System**
  - [ ] **STEP 1: Check success case templates first**
    - [ ] Template matching algorithm (pattern + keyword matching)
    - [ ] Language-aware template selection (en, zh, bm)
    - [ ] Industry-specific template filtering
    - [ ] Priority-based template selection (preferred > priority > default)
    - [ ] Template response personalization
    - [ ] Template usage tracking
  - [ ] **STEP 2: Fall back to trained AI model if no template match**
    - [ ] Context builder using trained AI model (company's custom prompt)
    - [ ] Localization integration (language detection, cultural context)
    - [ ] Weighted training data (according to model config)
    - [ ] Model version tracking (which version generated each suggestion)
- [ ] Behavior scoring algorithm (with language-aware keywords for en, zh, bm)
- [ ] Real-time score calculation (after every 3 messages)
- [ ] AI response suggestion engine (templates first, then trained model)
- [ ] Product recommendation system
- [ ] Suggestion rating system (1-5 stars)
- [ ] AI effectiveness tracking (per model version and per template)

### Phase 7: CRM & Lead Management (Week 8-9)
- [ ] Contact management interface
- [ ] Conversation status workflow
- [ ] Lead scoring dashboard
- [ ] Green/Yellow/Red visual indicators
- [ ] Internal notes system
- [ ] Tags and custom fields
- [ ] Activity timeline
- [ ] Mark as completed form with sale details

### Phase 8: AI Learning Loop (Week 9-10)
- [ ] Store successful conversation patterns
- [ ] Weekly batch analysis job
- [ ] Pattern extraction with Claude
- [ ] Knowledge base auto-update
- [ ] Effectiveness scoring
- [ ] Agent feedback collection
- [ ] A/B testing framework setup

### Phase 9: Analytics & Reporting (Week 10-11)
- [ ] Company admin dashboard
- [ ] Agent performance metrics
- [ ] Revenue tracking
- [ ] Lead distribution charts (green/yellow/red)
- [ ] Product performance reports
- [ ] AI effectiveness metrics
- [ ] Conversion funnel analysis
- [ ] Export functionality (CSV/Excel)

### Phase 10: Polish & Optimization (Week 11-12)
- [ ] Real-time notifications (WebSocket/SSE)
- [ ] Message delivery status tracking
- [ ] Media handling (images, videos, documents)
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Security audit
- [ ] Rate limiting per company
- [ ] Backup and recovery system

---

## CRITICAL IMPLEMENTATION DETAILS

### 1. Conversation Assignment Middleware

```typescript
// tRPC middleware for agent routes
const agentMiddleware = t.middleware(async ({ ctx, next }) => {
  if (ctx.user.role !== 'company_user') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next()
})

// Agent conversation list - ONLY assigned
agent.conversations.list = t.procedure
  .use(agentMiddleware)
  .query(async ({ ctx }) => {
    return await db.conversations.findMany({
      where: {
        company_id: ctx.user.company_id,
        assigned_to: ctx.user.id // CRITICAL FILTER
      },
      include: {
        contact: true,
        messages: { take: 1, orderBy: { timestamp: 'desc' } }
      },
      orderBy: { updated_at: 'desc' }
    })
  })

// Company Admin - see ALL conversations
company.conversations.listAll = t.procedure
  .use(companyAdminMiddleware)
  .query(async ({ ctx }) => {
    return await db.conversations.findMany({
      where: {
        company_id: ctx.user.company_id
        // NO assigned_to filter - admin sees all
      },
      include: {
        contact: true,
        assigned_user: true, // who it's assigned to
        messages: { take: 1, orderBy: { timestamp: 'desc' } }
      }
    })
  })

// Assign conversation
company.conversations.assign = t.procedure
  .use(companyAdminMiddleware)
  .input(z.object({
    conversationId: z.string().uuid(),
    userId: z.string().uuid(),
    reason: z.string().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    // Update conversation
    const updated = await db.conversations.update({
      where: { 
        id: input.conversationId,
        company_id: ctx.user.company_id // security check
      },
      data: {
        assigned_to: input.userId,
        assigned_by: ctx.user.id,
        status: 'in_progress',
        updated_at: new Date()
      }
    })
    
    // Log assignment history
    await db.conversation_assignments.create({
      data: {
        conversation_id: input.conversationId,
        to_user_id: input.userId,
        assigned_by: ctx.user.id,
        reason: input.reason
      }
    })
    
    // Notify the agent
    await notifyAgent(input.userId, {
      type: 'conversation_assigned',
      conversationId: input.conversationId
    })
    
    return updated
  })
```

### 2. Webhook Processing with Auto-Assignment

```typescript
// Webhook handler - Uses company's own credentials
app.post('/webhook/:companyId/whatsapp', async (req, res) => {
  const { companyId } = req.params
  const { from, body, timestamp } = req.body
  
  // Get company and integration credentials
  const company = await db.companies.findUnique({
    where: { id: companyId },
    include: { 
      settings: true,
      integrations: true // Get company's integration credentials
    }
  })
  
  if (!company) {
    return res.status(404).json({ error: 'Company not found' })
  }
  
  if (!company.integrations) {
    return res.status(400).json({ error: 'WhatsApp integration not configured' })
  }
  
  // Verify webhook signature using company's webhook secret
  const webhookSecret = company.integrations.onsend_webhook_secret
  if (!verifyWebhookSignature(req, webhookSecret)) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  // Find or create contact
  let contact = await db.contacts.findFirst({
    where: { 
      company_id: companyId,
      phone: from,
      platform: 'whatsapp'
    }
  })
  
  if (!contact) {
    contact = await db.contacts.create({
      data: {
        company_id: companyId,
        phone: from,
        platform: 'whatsapp',
        platform_id: from,
        behavior_score: 50, // neutral start
        score_color: 'yellow'
      }
    })
  }
  
  // Find or create conversation
  let conversation = await db.conversations.findFirst({
    where: {
      contact_id: contact.id,
      status: { in: ['new', 'in_progress', 'waiting'] }
    }
  })
  
  if (!conversation) {
    // New conversation - check assignment strategy
    const assignTo = await determineAssignment(companyId, company.settings)
    
    conversation = await db.conversations.create({
      data: {
        company_id: companyId,
        contact_id: contact.id,
        assigned_to: assignTo, // might be null for manual assignment
        status: assignTo ? 'in_progress' : 'new'
      }
    })
    
    if (assignTo) {
      await notifyAgent(assignTo, {
        type: 'new_conversation',
        conversationId: conversation.id
      })
    } else {
      // Notify admin of unassigned conversation
      await notifyCompanyAdmins(companyId, {
        type: 'unassigned_conversation',
        conversationId: conversation.id
      })
    }
  }
  
  // Store message
  await db.messages.create({
    data: {
      conversation_id: conversation.id,
      content: body,
      sender_type: 'contact',
      timestamp: new Date(timestamp)
    }
  })
  
  // Update contact stats
  await db.contacts.update({
    where: { id: contact.id },
    data: {
      last_interaction: new Date(),
      total_messages: { increment: 1 }
    }
  })
  
  // Trigger behavior score update (every 3 messages)
  if (contact.total_messages % 3 === 0) {
    await updateBehaviorScore(contact.id)
  }
  
  // Check if AI should respond (if no agent assigned or bot mode)
  if (!conversation.assigned_to || company.settings.ai_auto_reply) {
    await generateAndSendAIResponse(conversation.id)
  }
  
  res.status(200).json({ success: true })
})

async function determineAssignment(companyId, settings) {
  if (!settings.auto_assign_enabled) {
    return null // manual assignment
  }
  
  const strategy = settings.assignment_strategy
  
  if (strategy === 'round_robin') {
    // Find agent with least assigned conversations
    const agents = await db.users.findMany({
      where: {
        company_id: companyId,
        role: 'company_user',
        status: 'active'
      }
    })
    
    const workloads = await Promise.all(
      agents.map(async agent => ({
        userId: agent.id,
        count: await db.conversations.count({
          where: {
            assigned_to: agent.id,
            status: { in: ['in_progress', 'waiting'] }
          }
        })
      }))
    )
    
    workloads.sort((a, b) => a.count - b.count)
    return workloads[0]?.userId || null
  }
  
  if (strategy === 'manual') {
    return null
  }
  
  // Add more strategies as needed
  return null
}
```

### 2.5. Sending Messages Using Company Credentials

```typescript
// Send message via WhatsApp using company's OnSend credentials
async function sendWhatsAppMessage(
  companyId: string,
  to: string,
  message: string
) {
  // Get company's integration credentials
  const integration = await db.company_integrations.findUnique({
    where: { company_id: companyId }
  })
  
  if (!integration || !integration.onsend_api_key_encrypted) {
    throw new Error('WhatsApp integration not configured for this company')
  }
  
  // Decrypt credentials (use your encryption service)
  const apiKey = decrypt(integration.onsend_api_key_encrypted)
  const apiSecret = decrypt(integration.onsend_api_secret_encrypted)
  const phoneNumberId = integration.onsend_phone_number_id
  
  // Send message via OnSend API using company's credentials
  const response = await fetch('https://api.onsend.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'X-API-Secret': apiSecret,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone_number_id: phoneNumberId,
      to: to,
      message: message
    })
  })
  
  if (!response.ok) {
    // Update connection status on error
    await db.company_integrations.update({
      where: { company_id: companyId },
      data: {
        onsend_connection_status: 'error',
        onsend_last_error: await response.text()
      }
    })
    throw new Error('Failed to send WhatsApp message')
  }
  
  // Update connection status on success
  await db.company_integrations.update({
    where: { company_id: companyId },
    data: {
      onsend_connection_status: 'connected',
      onsend_last_connected_at: new Date(),
      onsend_last_error: null
    }
  })
  
  return await response.json()
}

// Send message via Telegram using company's bot token
async function sendTelegramMessage(
  companyId: string,
  chatId: string,
  message: string
) {
  // Get company's integration credentials
  const integration = await db.company_integrations.findUnique({
    where: { company_id: companyId }
  })
  
  if (!integration || !integration.telegram_bot_token_encrypted) {
    throw new Error('Telegram integration not configured for this company')
  }
  
  // Decrypt bot token
  const botToken = decrypt(integration.telegram_bot_token_encrypted)
  
  // Send message via Telegram Bot API using company's bot token
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  })
  
  if (!response.ok) {
    // Update connection status on error
    await db.company_integrations.update({
      where: { company_id: companyId },
      data: {
        telegram_connection_status: 'error',
        telegram_last_error: await response.text()
      }
    })
    throw new Error('Failed to send Telegram message')
  }
  
  // Update connection status on success
  await db.company_integrations.update({
    where: { company_id: companyId },
    data: {
      telegram_connection_status: 'connected',
      telegram_last_connected_at: new Date(),
      telegram_last_error: null
    }
  })
  
  return await response.json()
}

// Unified function to send messages (determines platform from contact)
async function sendMessageToPlatform(
  conversation: any,
  message: string
) {
  const contact = await db.contacts.findUnique({
    where: { id: conversation.contact_id }
  })
  
  if (contact.platform === 'whatsapp') {
    return await sendWhatsAppMessage(
      conversation.company_id,
      contact.phone,
      message
    )
  } else if (contact.platform === 'telegram') {
    return await sendTelegramMessage(
      conversation.company_id,
      contact.platform_id, // Telegram chat_id
      message
    )
  } else {
    throw new Error(`Unsupported platform: ${contact.platform}`)
  }
}

// Test connection function
async function testWhatsAppConnection(companyId: string) {
  const integration = await db.company_integrations.findUnique({
    where: { company_id: companyId }
  })
  
  if (!integration) {
    throw new Error('Integration not configured')
  }
  
  const apiKey = decrypt(integration.onsend_api_key_encrypted)
  const apiSecret = decrypt(integration.onsend_api_secret_encrypted)
  
  // Test API call
  const response = await fetch('https://api.onsend.com/v1/account/status', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'X-API-Secret': apiSecret
    }
  })
  
  const isConnected = response.ok
  
  await db.company_integrations.update({
    where: { company_id: companyId },
    data: {
      onsend_connection_status: isConnected ? 'connected' : 'error',
      onsend_last_connected_at: isConnected ? new Date() : null,
      onsend_last_error: isConnected ? null : await response.text()
    }
  })
  
  return { connected: isConnected }
}

async function testTelegramConnection(companyId: string) {
  const integration = await db.company_integrations.findUnique({
    where: { company_id: companyId }
  })
  
  if (!integration) {
    throw new Error('Integration not configured')
  }
  
  const botToken = decrypt(integration.telegram_bot_token_encrypted)
  
  // Test API call (getMe endpoint)
  const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
  
  const data = await response.json()
  const isConnected = data.ok === true
  
  await db.company_integrations.update({
    where: { company_id: companyId },
    data: {
      telegram_connection_status: isConnected ? 'connected' : 'error',
      telegram_last_connected_at: isConnected ? new Date() : null,
      telegram_last_error: isConnected ? null : JSON.stringify(data),
      telegram_bot_username: isConnected ? data.result?.username : null
    }
  })
  
  return { connected: isConnected, botInfo: data.result }
}
```

### 3. Behavior Scoring with Notifications

```typescript
async function updateBehaviorScore(contactId: string) {
  const contact = await db.contacts.findUnique({
    where: { id: contactId },
    include: {
      conversations: {
        include: {
          messages: {
            take: 10,
            orderBy: { timestamp: 'desc' }
          }
        }
      }
    }
  })
  
  const recentMessages = contact.conversations
    .flatMap(c => c.messages)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
  
  const previousColor = contact.score_color
  const score = calculateBehaviorScore(contact, recentMessages)
  const color = getScoreColor(score)
  
  await db.contacts.update({
    where: { id: contactId },
    data: {
      behavior_score: score,
      score_color: color
    }
  })
  
  // Notify if became hot lead
  if (color === 'green' && previousColor !== 'green') {
    const activeConvo = await db.conversations.findFirst({
      where: {
        contact_id: contactId,
        status: { in: ['new', 'in_progress', 'waiting'] }
      }
    })
    
    if (activeConvo?.assigned_to) {
      await notifyAgent(activeConvo.assigned_to, {
        type: 'hot_lead',
        contactId,
        conversationId: activeConvo.id,
        message: `${contact.name || contact.phone} is now a hot lead! 🔥`
      })
    }
    
    // Also notify company admins
    await notifyCompanyAdmins(contact.company_id, {
      type: 'hot_lead',
      contactId,
      message: `New hot lead: ${contact.name || contact.phone}`
    })
  }
  
  return { score, color }
}

function calculateBehaviorScore(contact: any, messages: any[]) {
  let score = 50 // start neutral
  
  const recentContent = messages.map(m => m.content.toLowerCase()).join(' ')
  
  // High intent keywords (+20 each, max 40)
  const highIntent = ['buy', 'purchase', 'order', 'payment', 'checkout']
  const intentMatches = highIntent.filter(k => recentContent.includes(k)).length
  score += Math.min(intentMatches * 20, 40)
  
  // Price inquiries (+15)
  if (recentContent.includes('price') || recentContent.includes('cost') || recentContent.includes('how much')) {
    score += 15
  }
  
  // Product-specific questions (+15)
  if (recentContent.match(/what.*about|tell.*more|details|specifications/)) {
    score += 15
  }
  
  // Fast response time (+10)
  const avgResponseTime = calculateAvgResponseTime(messages)
  if (avgResponseTime < 300) score += 10 // under 5 min
  
  // High engagement (+10)
  if (messages.length >= 8) score += 10
  
  // Positive sentiment (+10)
  const positive = ['great', 'excellent', 'perfect', 'yes', 'interested', 'love']
  if (positive.some(w => recentContent.includes(w))) score += 10
  
  // Negative signals
  const objections = ['expensive', 'too much', 'not interested', 'maybe later']
  if (objections.some(w => recentContent.includes(w))) score -= 15
  
  // Slow response (-10)
  if (avgResponseTime > 3600) score -= 10 // over 1 hour
  
  return Math.max(0, Math.min(100, score))
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'green'
  if (score >= 50) return 'yellow'
  return 'red'
}

function calculateAvgResponseTime(messages: any[]): number {
  const customerMessages = messages.filter(m => m.sender_type === 'contact')
  if (customerMessages.length < 2) return 600
  
  let totalTime = 0
  for (let i = 1; i < customerMessages.length; i++) {
    const diff = customerMessages[i-1].timestamp - customerMessages[i].timestamp
    totalTime += Math.abs(diff) / 1000 // seconds
  }
  
  return totalTime / (customerMessages.length - 1)
}
```

### 4. AI Model Configuration & Training (Company Admin)

```typescript
// Create new AI model version
company.ai.createModelVersion = t.procedure
  .use(companyAdminMiddleware)
  .input(z.object({
    systemPrompt: z.string().min(100),
    responseStyle: z.enum(['formal', 'casual', 'friendly', 'professional']),
    temperature: z.number().min(0).max(1).default(0.7),
    maxTokens: z.number().min(100).max(4000).default(1000),
    languageConfig: z.object({
      primary: z.string(),
      secondary: z.array(z.string()).optional(),
      culturalContext: z.record(z.any()).optional()
    }),
    trainingWeights: z.object({
      successPatterns: z.number().min(0).max(1),
      productCatalog: z.number().min(0).max(1),
      faq: z.number().min(0).max(1),
      trainingMaterials: z.number().min(0).max(1)
    }).optional(),
    notes: z.string().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    // Deactivate current active model
    await db.ai_model_configs.updateMany({
      where: {
        company_id: ctx.user.company_id,
        is_active: true
      },
      data: { is_active: false }
    })
    
    // Get next version number
    const existingVersions = await db.ai_model_configs.findMany({
      where: { company_id: ctx.user.company_id },
      orderBy: { created_at: 'desc' },
      take: 1
    })
    
    const nextVersion = existingVersions.length > 0
      ? incrementVersion(existingVersions[0].version)
      : 'v1.0'
    
    // Create new model version
    const newModel = await db.ai_model_configs.create({
      data: {
        company_id: ctx.user.company_id,
        version: nextVersion,
        is_active: true,
        system_prompt: input.systemPrompt,
        response_style: input.responseStyle,
        temperature: input.temperature,
        max_tokens: input.maxTokens,
        language_config: input.languageConfig,
        success_patterns_weight: input.trainingWeights?.successPatterns || 0.3,
        product_catalog_weight: input.trainingWeights?.productCatalog || 0.2,
        faq_weight: input.trainingWeights?.faq || 0.2,
        training_materials_weight: input.trainingWeights?.trainingMaterials || 0.3,
        created_by: ctx.user.id,
        deployed_at: new Date(),
        notes: input.notes
      }
    })
    
    return newModel
  })

// Test AI model
company.ai.testModel = t.procedure
  .use(companyAdminMiddleware)
  .input(z.object({
    modelVersionId: z.string().uuid(),
    customerMessage: z.string(),
    expectedBehavior: z.string().optional(),
    language: z.string().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    const modelConfig = await db.ai_model_configs.findFirst({
      where: {
        id: input.modelVersionId,
        company_id: ctx.user.company_id
      }
    })
    
    if (!modelConfig) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Model version not found' })
    }
    
    // Generate test response
    const testResult = await testAIModel(
      ctx.user.company_id,
      input.modelVersionId,
      {
        customerMessage: input.customerMessage,
        expectedBehavior: input.expectedBehavior || '',
        language: input.language
      }
    )
    
    return testResult
  })

// Activate model version
company.ai.activateModelVersion = t.procedure
  .use(companyAdminMiddleware)
  .input(z.object({
    versionId: z.string().uuid()
  }))
  .mutation(async ({ ctx, input }) => {
    // Verify model belongs to company
    const model = await db.ai_model_configs.findFirst({
      where: {
        id: input.versionId,
        company_id: ctx.user.company_id
      }
    })
    
    if (!model) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    
    // Deactivate current active
    await db.ai_model_configs.updateMany({
      where: {
        company_id: ctx.user.company_id,
        is_active: true
      },
      data: { is_active: false }
    })
    
    // Activate new version
    const activated = await db.ai_model_configs.update({
      where: { id: input.versionId },
      data: {
        is_active: true,
        deployed_at: new Date()
      }
    })
    
    return activated
  })
```

### 5. AI Response Generation with Company Context (Using Trained Model)

```typescript
async function generateAIResponse(conversationId: string) {
  const conversation = await db.conversations.findUnique({
    where: { id: conversationId },
    include: {
      contact: true,
      messages: {
        take: 10,
        orderBy: { timestamp: 'desc' }
      }
    }
  })
  
  const company = await db.companies.findUnique({
    where: { id: conversation.company_id },
    include: {
      settings: true,
      products: { where: { is_active: true }, take: 50 },
      training_materials: { where: { status: 'processed' } }
    }
  })
  
  // STEP 1: CHECK SUCCESS CASE TEMPLATES FIRST (AI Priority System)
  const lastCustomerMessage = conversation.messages
    .filter(m => m.sender_type === 'contact')
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
  
  if (lastCustomerMessage) {
    const customerLanguage = detectCustomerLanguage(conversation.messages)
    const matchedTemplate = await findMatchingTemplate(
      company.id,
      lastCustomerMessage.content,
      customerLanguage,
      company.industry_category
    )
    
    if (matchedTemplate) {
      // Use template response (with personalization)
      const templateResponse = personalizeTemplateResponse(
        matchedTemplate,
        conversation,
        company
      )
      
      // Track template usage
      await db.company_template_selections.update({
        where: {
          company_id_template_id: {
            company_id: company.id,
            template_id: matchedTemplate.id
          }
        },
        data: {
          usage_count: { increment: 1 },
          last_used_at: new Date()
        }
      })
      
      await db.success_case_templates.update({
        where: { id: matchedTemplate.id },
        data: { usage_count: { increment: 1 } }
      })
      
      // Store AI suggestion with template reference
      const suggestion = await db.ai_suggestions.create({
        data: {
          conversation_id: conversationId,
          suggested_message: templateResponse,
          was_used: false,
          metadata: {
            source: 'success_case_template',
            template_id: matchedTemplate.id,
            template_name: matchedTemplate.name
          }
        }
      })
      
      return { suggestionId: suggestion.id, message: templateResponse, source: 'template' }
    }
  }
  
  // STEP 2: NO TEMPLATE MATCH - FALL BACK TO TRAINED AI MODEL
  // Get active AI model configuration (trained model)
  const aiModel = await db.ai_model_configs.findFirst({
    where: {
      company_id: company.id,
      is_active: true
    }
  })
  
  if (!aiModel) {
    throw new Error('No active AI model found for company')
  }
  
  // Build comprehensive context with localization
  const categoryPrompt = getCategoryPrompt(company.industry_category, company.country)
  
  // Weight training data according to model config
  const productsContext = company.products
    .slice(0, Math.floor(50 * aiModel.product_catalog_weight))
    .map(p => `- ${p.name}: ${p.description} (${company.currency} ${p.price})`)
    .join('\n')
  
  const trainingContext = company.training_materials
    .slice(0, Math.floor(10 * aiModel.training_materials_weight))
    .map(t => t.content)
    .join('\n\n')
  
  const faqs = await db.faqs.findMany({
    where: { company_id: company.id },
    take: Math.floor(20 * aiModel.faq_weight),
    orderBy: { usage_count: 'desc' }
  })
  
  const faqContext = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
  
  const conversationHistory = conversation.messages
    .reverse()
    .map(m => `${m.sender_type === 'contact' ? 'Customer' : 'Agent'}: ${m.content}`)
    .join('\n')
  
  // Get successful patterns (weighted by model config)
  const successPatterns = await db.successful_patterns.findMany({
    where: { company_id: company.id },
    take: Math.floor(10 * aiModel.success_patterns_weight),
    orderBy: { effectiveness_score: 'desc' }
  })
  
  const patternsContext = successPatterns
    .map(p => p.pattern_summary)
    .join('\n\n')
  
  // Detect customer language
  const customerLanguage = detectCustomerLanguage(conversation.messages)
  
  // Build localized prompt
  const localizedPrompt = buildLocalizedPrompt({
    company,
    aiModel,
    categoryPrompt,
    productsContext,
    trainingContext,
    faqContext,
    patternsContext,
    conversationHistory,
    conversation,
    customerLanguage
  })
  
  // Call Claude API with company's trained model
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: aiModel.max_tokens,
      temperature: aiModel.temperature,
      messages: [
        {
          role: 'system',
          content: aiModel.system_prompt // Use company's custom trained prompt
        },
        {
          role: 'user',
          content: localizedPrompt
        }
      ]
    })
  })
  
  const data = await response.json()
  const aiMessage = data.content[0].text
  
  // Store AI suggestion with model version tracking
  const suggestion = await db.ai_suggestions.create({
    data: {
      conversation_id: conversationId,
      suggested_message: aiMessage,
      was_used: false,
      metadata: {
        model_version: aiModel.version,
        model_config_id: aiModel.id
      }
    }
  })
  
  return { suggestionId: suggestion.id, message: aiMessage }
}

// Template Matching Function (AI Priority System)
async function findMatchingTemplate(
  companyId: string,
  customerMessage: string,
  customerLanguage: string,
  industryCategory?: string
) {
  // Get enabled templates for this company (ordered by priority)
  const enabledTemplates = await db.company_template_selections.findMany({
    where: {
      company_id: companyId,
      is_enabled: true
    },
    include: {
      template: {
        where: {
          is_active: true,
          language: customerLanguage, // Match customer's language
          OR: [
            { industry_category: industryCategory },
            { industry_category: null } // Global templates
          ]
        }
      }
    },
    orderBy: [
      { is_preferred: 'desc' }, // Preferred templates first
      { priority: 'desc' } // Then by priority
    ]
  })
  
  const customerMessageLower = customerMessage.toLowerCase()
  
  // Check each template for matches
  for (const selection of enabledTemplates) {
    const template = selection.template
    if (!template) continue
    
    // Check if customer message matches template patterns
    const patterns = template.customer_message_patterns as string[] || []
    const examples = template.customer_message_examples as string[] || []
    
    // Check pattern matches
    const patternMatch = patterns.some(pattern => 
      customerMessageLower.includes(pattern.toLowerCase())
    )
    
    // Check example matches (fuzzy matching)
    const exampleMatch = examples.some(example => {
      const exampleLower = example.toLowerCase()
      // Simple keyword matching (can be enhanced with NLP)
      const exampleKeywords = exampleLower.split(/\s+/)
      return exampleKeywords.some(keyword => 
        keyword.length > 3 && customerMessageLower.includes(keyword)
      )
    })
    
    if (patternMatch || exampleMatch) {
      return template
    }
  }
  
  return null
}

// Personalize template response
function personalizeTemplateResponse(
  template: any,
  conversation: any,
  company: any
): string {
  let response = template.agent_response
  
  // Get localized version if available
  const customerLanguage = detectCustomerLanguage(conversation.messages)
  if (template.localized_versions && template.localized_versions[customerLanguage]) {
    response = template.localized_versions[customerLanguage].agent_response || response
  }
  
  // Apply company customizations if any
  const companySelection = conversation.company?.template_selections?.find(
    (s: any) => s.template_id === template.id
  )
  if (companySelection?.custom_modifications) {
    response = applyCustomizations(response, companySelection.custom_modifications)
  }
  
  // Personalize with customer name if available
  if (conversation.contact?.name) {
    response = response.replace(/\{customer_name\}/g, conversation.contact.name)
  }
  
  // Personalize with product names if mentioned
  if (conversation.messages.some((m: any) => m.content.match(/product|item|product_id/))) {
    // Extract product mentions and personalize
    // This can be enhanced with product catalog lookup
  }
  
  return response
}

function applyCustomizations(response: string, customizations: any): string {
  // Apply company-specific customizations to template
  // For example: replace certain phrases, add company name, etc.
  let customized = response
  
  if (customizations.replacements) {
    customizations.replacements.forEach((replacement: any) => {
      customized = customized.replace(
        new RegExp(replacement.find, 'gi'),
        replacement.replace
      )
    })
  }
  
  if (customizations.prefix) {
    customized = customizations.prefix + ' ' + customized
  }
  
  if (customizations.suffix) {
    customized = customized + ' ' + customizations.suffix
  }
  
  return customized
}

function detectCustomerLanguage(messages: any[]): string {
  // Enhanced language detection for en, zh, bm
  const recentMessages = messages.slice(-5).map(m => m.content.toLowerCase()).join(' ')
  
  // Bahasa Malaysia detection
  if (recentMessages.match(/terima kasih|boleh|tak|betul|selamat|saya|awak|macam mana|berapa|murah|mahal|diskaun|boleh|tak|ya|tidak|ok|baik/)) {
    return 'bm' // Bahasa Malaysia
  }
  
  // Chinese (Mandarin) detection
  if (recentMessages.match(/谢谢|你好|可以|多少钱|太贵|便宜|折扣|好的|是的|不是|多少钱|怎么|什么|哪里|什么时候/)) {
    return 'zh' // Mandarin
  }
  
  // Tamil detection (optional)
  if (recentMessages.match(/நன்றி|ஆம்|இல்லை|எவ்வளவு|விலை/)) {
    return 'ta' // Tamil
  }
  
  return 'en' // Default to English
}

// Agent uses AI suggestion
agent.ai.useAndSend = t.procedure
  .use(agentMiddleware)
  .input(z.object({
    suggestionId: z.string().uuid(),
    modifiedMessage: z.string().optional(),
    rating: z.number().min(1).max(5).optional()
  }))
  .mutation(async ({ ctx, input }) => {
    const suggestion = await db.ai_suggestions.findUnique({
      where: { id: input.suggestionId },
      include: { conversation: true }
    })
    
    // Verify agent is assigned
    if (suggestion.conversation.assigned_to !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }
    
    const messageToSend = input.modifiedMessage || suggestion.suggested_message
    
    // Update suggestion tracking
    await db.ai_suggestions.update({
      where: { id: input.suggestionId },
      data: {
        was_used: true,
        agent_rating: input.rating,
        modified_version: input.modifiedMessage
      }
    })
    
    // Send message
    const message = await db.messages.create({
      data: {
        conversation_id: suggestion.conversation_id,
        content: messageToSend,
        sender_type: 'agent',
        sender_id: ctx.user.id,
        suggested_by_ai: true,
        agent_used_suggestion: true,
        timestamp: new Date()
      }
    })
    
    // Send via WhatsApp/Telegram
    await sendMessageToPlatform(
      suggestion.conversation,
      messageToSend
    )
    
    return message
  })
```

### 5. Learning from Successful Conversations

```typescript
// When agent marks conversation as completed
agent.conversations.markComplete = t.procedure
  .use(agentMiddleware)
  .input(z.object({
    conversationId: z.string().uuid(),
    status: z.enum(['completed', 'lost']),
    saleAmount: z.number().optional(),
    productsSold: z.array(z.object({
      productId: z.string(),
      quantity: z.number(),
      price: z.number()
    })).optional(),
    notes: z.string().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    const conversation = await db.conversations.findUnique({
      where: { id: input.conversationId }
    })
    
    // Verify assignment
    if (conversation.assigned_to !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }
    
    const isSuccess = input.status === 'completed' && input.saleAmount > 0
    
    const updated = await db.conversations.update({
      where: { id: input.conversationId },
      data: {
        status: input.status,
        sale_amount: input.saleAmount,
        products_sold: input.productsSold,
        is_success: isSuccess,
        completed_at: new Date(),
        notes: input.notes
      }
    })
    
    // If successful, trigger learning
    if (isSuccess) {
      await learnFromSuccessfulConversation(input.conversationId)
    }
    
    return updated
  })

async function learnFromSuccessfulConversation(conversationId: string) {
  const conversation = await db.conversations.findUnique({
    where: { id: conversationId },
    include: {
      messages: { orderBy: { timestamp: 'asc' } },
      contact: true
    }
  })
  
  // Analyze with Claude
  const analysis = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Analyze this successful sales conversation and extract learnings:

SALE DETAILS:
- Amount: ${conversation.sale_amount}
- Products: ${JSON.stringify(conversation.products_sold)}
- Duration: ${calculateDuration(conversation)} minutes

CONVERSATION:
${conversation.messages.map(m => 
  `${m.sender_type === 'contact' ? 'Customer' : 'Agent'}: ${m.content}`
).join('\n')}

Extract and return in JSON format:
{
  "summary": "Brief summary of what made this successful",
  "keyMessages": ["Array of critical messages that moved the sale forward"],
  "objectionHandling": "How objections were handled",
  "closingTechnique": "How the sale was closed",
  "productMentions": ["Products that were discussed"],
  "timeToClose": "Estimated minutes from first message to sale",
  "patternType": "Category of pattern (urgency, value, trust, etc)"
}`
      }]
    })
  })
  
  const data = await analysis.json()
  const pattern = JSON.parse(data.content[0].text)
  
  // Store pattern
  await db.successful_patterns.create({
    data: {
      company_id: conversation.company_id,
      conversation_id: conversationId,
      category: pattern.patternType,
      pattern_summary: pattern.summary,
      key_messages: pattern.keyMessages,
      outcome_data: {
        sale_amount: conversation.sale_amount,
        products_sold: conversation.products_sold,
        time_to_close: pattern.timeToClose,
        objection_handling: pattern.objectionHandling,
        closing_technique: pattern.closingTechnique
      },
      effectiveness_score: calculateEffectivenessScore(conversation),
      used_for_training: true
    }
  })
  
  // Update company knowledge base
  await db.ai_knowledge_base.upsert({
    where: {
      company_id_topic: {
        company_id: conversation.company_id,
        topic: pattern.patternType
      }
    },
    update: {
      content: `${pattern.summary}\n\nKey approach: ${pattern.closingTechnique}`,
      last_updated: new Date()
    },
    create: {
      company_id: conversation.company_id,
      topic: pattern.patternType,
      content: pattern.summary,
      source: 'successful_conversation'
    }
  })
}

function calculateEffectivenessScore(conversation: any): number {
  let score = 0.5 // base
  
  // Higher sale amount = higher score
  if (conversation.sale_amount > 1000) score += 0.2
  if (conversation.sale_amount > 5000) score += 0.2
  
  // Faster close = higher score
  const duration = calculateDuration(conversation)
  if (duration < 30) score += 0.2 // under 30 min
  if (duration < 60) score += 0.1 // under 1 hour
  
  // Multiple products = higher score
  if (conversation.products_sold?.length > 1) score += 0.1
  
  return Math.min(1.0, score)
}
```

---

## SECURITY CONSIDERATIONS

### 1. Company Data Isolation
```typescript
// ALWAYS filter by company_id in every query
// Use middleware to inject company_id
const companyIsolation = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user?.company_id && ctx.user.role !== 'super_admin') {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      companyId: ctx.user.company_id
    }
  })
})

// Example usage
const protectedProcedure = t.procedure.use(companyIsolation)
```

### 2. Assignment Access Control
```typescript
// Verify agent can only access assigned conversations
async function verifyConversationAccess(conversationId: string, userId: string, userRole: string) {
  const conversation = await db.conversations.findUnique({
    where: { id: conversationId }
  })
  
  if (!conversation) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
  
  // Super admin can access all
  if (userRole === 'super_admin') return true
  
  // Company admin can access all in their company
  if (userRole === 'company_admin') {
    const user = await db.users.findUnique({ where: { id: userId } })
    return conversation.company_id === user.company_id
  }
  
  // Company user can only access assigned
  if (userRole === 'company_user') {
    return conversation.assigned_to === userId
  }
  
  throw new TRPCError({ code: 'FORBIDDEN' })
}
```

### 3. Webhook Signature Verification
```typescript
function verifyWebhookSignature(req: Request, secret: string): boolean {
  const signature = req.headers['x-webhook-signature']
  const body = JSON.stringify(req.body)
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

### 4. Integration Credentials Encryption & Security
```typescript
import crypto from 'crypto'

// Encryption key (store in environment variable, use key management service in production)
const ENCRYPTION_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY || crypto.randomBytes(32)
const ALGORITHM = 'aes-256-gcm'

// Encrypt credentials before storing
function encryptCredential(plaintext: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Return: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

// Decrypt credentials when needed
function decryptCredential(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':')
  
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// Access control for credentials
const integrationCredentialMiddleware = t.middleware(async ({ ctx, next }) => {
  // Only company admin can access credentials
  if (ctx.user.role !== 'company_admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Only company admins can manage credentials' })
  }
  
  return next()
})

// Audit logging for credential changes
async function logCredentialChange(
  companyId: string,
  integrationType: 'whatsapp' | 'telegram',
  action: string,
  userId: string,
  ipAddress?: string
) {
  await db.integration_credential_logs.create({
    data: {
      company_id: companyId,
      integration_type: integrationType,
      action: action,
      changed_by: userId,
      ip_address: ipAddress,
      metadata: {
        timestamp: new Date().toISOString()
      }
    }
  })
}
```

---

## DEPLOYMENT CHECKLIST

- [ ] Environment variables configured (DATABASE_URL, CLAUDE_API_KEY, S3_CREDENTIALS)
- [ ] **Credential encryption key configured** (CREDENTIAL_ENCRYPTION_KEY - 32 bytes, store securely)
- [ ] Database migrations run
- [ ] Seed data for industry categories
- [ ] **Integration credentials encryption service** (AES-256-GCM)
- [ ] Webhook URLs configured in WhatsApp/Telegram (companies configure their own)
- [ ] CDN/S3 bucket for image uploads
- [ ] Background job queue (for AI learning, score updates)
- [ ] Monitoring and error tracking (Sentry, etc)
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] SSL certificates
- [ ] Backup strategy in place
- [ ] **Credential audit logging** enabled

---

## TESTING PRIORITIES

1. **Multi-tenancy isolation**: Verify company_id filtering works everywhere
2. **Assignment access**: Agents can ONLY see assigned conversations
3. **Admin monitoring**: Company admins can see ALL conversations
4. **Webhook routing**: Messages reach correct company
5. **Behavior scoring**: Score updates correctly after messages (with language-aware keywords for en, zh, bm)
6. **Success case templates (CRITICAL)**: 
   - Templates checked FIRST before AI model
   - Template matching works correctly (pattern + keyword)
   - Language-specific templates (en, zh, bm) match correctly
   - Priority system works (preferred > priority > default)
   - Template personalization applies correctly
   - Template usage tracking accurate
   - Company can enable/disable templates
   - Company can customize templates
7. **AI context**: Each company gets their own trained model, training/products
8. **AI model training**: Admin can create, test, and activate model versions
9. **Localization (en, zh, bm)**: 
   - Language detection works for English, Chinese, Bahasa Malaysia
   - AI responds in correct language
   - Cultural context applied correctly
   - Templates available in all three languages
10. **Model versioning**: Only active model is used, version tracking works
11. **Template fallback**: If no template match, falls back to trained AI model correctly
12. **Assignment workflow**: Assign/reassign works properly
13. **Notification system**: Agents notified of assignments
14. **Learning loop**: Successful patterns stored and used (weighted by model config)
15. **Export functionality**: Data exports respect access control
16. **AI model testing**: Test scenarios work, results stored correctly
17. **Template testing**: Test interface works, template matching validated
18. **Performance monitoring**: Model metrics and template metrics tracked accurately

---

## KEY BUSINESS LOGIC SUMMARY

1. **New message arrives** → Webhook receives at `/webhook/{company_id}/whatsapp` or `/telegram` → Load company's integration credentials (decrypt) → Verify webhook signature using company's webhook secret → Find/create contact → Find/create conversation → Check assignment rules → Assign if auto-enabled OR add to unassigned queue → Store message → Update behavior score (every 3 msgs) → AI responds if no agent assigned

1a. **Company Admin configures credentials** → Add OnSend API key/secret (encrypted) → Add Telegram bot token (encrypted) → Test connections → Webhook URLs auto-generated → Configure webhooks at provider (OnSend/Telegram) → Credentials stored encrypted → Audit log created

2. **Company Admin assigns conversation** → Update assigned_to field → Log assignment history → Notify agent → Agent sees in their inbox

3. **Agent handles conversation** → Can only see assigned → Uses AI suggestions → Sends messages (using company's own credentials - OnSend API or Telegram bot token) → Can request transfer → Marks as completed with sale details

4. **Sale completed** → Store outcome → Analyze conversation with Claude → Extract successful patterns → Update knowledge base → Future AI suggestions improve

5. **Behavior score changes to green** → Notify assigned agent → Notify company admin → Prioritize in lead list

6. **AI generates response (TEMPLATE PRIORITY SYSTEM)** → 
   - **STEP 1: Check success case templates first**
     - Detect customer language (en, zh, bm)
     - Match customer message against enabled templates (pattern + keyword matching)
     - Select best matching template (preferred > priority > default)
     - Personalize template response (customer name, product mentions, company customizations)
     - If template match found: Use template response → Track template usage → Store suggestion with template reference
   - **STEP 2: No template match - Fall back to trained AI model**
     - Load company's active trained AI model
     - Build localized context (country, language, cultural context)
     - Apply weighted training data (products, FAQs, patterns)
     - Use company's custom system prompt
     - Call Claude API with model config
     - Store suggestion with model version
   - Agent can use/modify → Track effectiveness (per template or per model version)

7. **Super Admin creates global templates** → Create success case templates → Set industry category → Add language versions (en, zh, bm) → Define customer message patterns → Write agent response template → Mark as recommended → All companies can see and enable

8. **Company Admin manages templates** → View global templates library → Enable/disable templates → Set priority and preferences → Customize templates for company → Create company-specific templates → Test templates → Monitor template usage and effectiveness

9. **Company Admin trains AI model** → Configure system prompt → Set training data weights → Configure language and cultural context → Test model with scenarios → Activate version → All future AI responses use new model (if no template match) → Monitor performance metrics

10. **Localization in action (en, zh, bm)** → Customer message arrives → Detect customer language (English/Bahasa Malaysia/Chinese) → AI checks templates in detected language first → If template match: Use localized template response → If no template: AI responds in appropriate language → Use cultural context (greetings, customs) → Format currency and dates according to company settings

This prompt should give you everything needed to build the complete platform! 🚀