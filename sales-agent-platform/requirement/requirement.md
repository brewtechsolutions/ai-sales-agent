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

#### A. Basic Info
- Company name, logo, contact details
- Timezone, business hours
- Industry category selection

#### B. Industry Category Selection (Critical for AI)
Options:
- E-commerce
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

-- Templates
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

// Shared/Public Routes
webhook.whatsapp(companyId) // POST /webhook/:companyId/whatsapp
webhook.telegram(companyId) // POST /webhook/:companyId/telegram

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

### 1. Context Building Per Company

When generating AI responses, build context:

```javascript
const aiContext = {
  system: `You are an AI sales assistant for ${company.name} in the ${company.category} industry.`,
  
  brandVoice: company.settings.brand_voice, // Professional, Friendly, etc
  tone: company.settings.response_tone,
  
  products: await getCompanyProducts(companyId), // full catalog
  
  training: await getTrainingMaterials(companyId), // FAQs, guidelines
  
  successfulPatterns: await getSuccessfulPatterns(companyId), // past wins
  
  currentConversation: {
    contact: contactInfo,
    history: last10Messages,
    behaviorScore: contact.behavior_score,
    assignedAgent: agentInfo
  }
}

// Send to Claude API
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      { 
        role: "user", 
        content: `${JSON.stringify(aiContext)}\n\nGenerate a helpful response.`
      }
    ]
  })
})
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

### 5. Category-Specific AI Prompts

```javascript
const categoryPrompts = {
  'E-commerce': `Focus on product benefits, create urgency with limited stock or discounts. 
  Common objections: Price, shipping time, return policy.
  Closing: "Shall I send you the payment link?"`,
  
  'Real Estate': `Emphasize location, ROI, and viewing opportunities.
  Common objections: Price, location, timing.
  Closing: "Would you like to schedule a viewing?"`,
  
  'Education': `Highlight outcomes, testimonials, and flexible payment plans.
  Common objections: Time commitment, ROI, prerequisites.
  Closing: "Can I reserve your spot in the next cohort?"`,
  
  // ... more categories
}

function getCategoryPrompt(category) {
  return categoryPrompts[category] || categoryPrompts['default']
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

/company/templates
  - Message templates
  - Flow templates
  - Package templates
  - Category organization

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
  - Integrations (WhatsApp, Telegram)
  - Billing
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

### Phase 2: Company Setup (Week 2-3)
- [ ] Onboarding wizard UI
- [ ] Category selection system
- [ ] Product catalog CRUD
- [ ] Image upload to S3/CDN
- [ ] Package builder UI
- [ ] Template system

### Phase 3: Webhooks & Messaging (Week 3-4)
- [ ] WhatsApp webhook receiver (OnSend API)
- [ ] Telegram webhook receiver
- [ ] Message storage in database
- [ ] Contact creation/update logic
- [ ] Webhook routing by company_id
- [ ] Message sending to WhatsApp/Telegram

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

### Phase 5: AI Training System (Week 5-6)
- [ ] Document upload (PDF, TXT, DOCX parsing)
- [ ] FAQ builder interface
- [ ] Brand voice configurator
- [ ] Knowledge base processing
- [ ] Category-based prompt templates
- [ ] Training material status tracking

### Phase 6: AI Integration (Week 6-8)
- [ ] Claude API integration setup
- [ ] Context builder (company + products + training)
- [ ] Behavior scoring algorithm
- [ ] Real-time score calculation (after every 3 messages)
- [ ] AI response suggestion engine
- [ ] Product recommendation system
- [ ] Suggestion rating system (1-5 stars)
- [ ] AI effectiveness tracking

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
// Webhook handler
app.post('/webhook/:companyId/whatsapp', async (req, res) => {
  const { companyId } = req.params
  const { from, body, timestamp } = req.body
  
  // Verify webhook signature
  const company = await db.companies.findUnique({
    where: { id: companyId },
    include: { settings: true }
  })
  
  if (!verifyWebhookSignature(req, company.webhook_secret)) {
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

### 4. AI Response Generation with Company Context

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
  
  // Build comprehensive context
  const categoryPrompt = getCategoryPrompt(company.industry_category)
  
  const productsContext = company.products.map(p => 
    `- ${p.name}: ${p.description} (${p.currency} ${p.price})`
  ).join('\n')
  
  const trainingContext = company.training_materials
    .map(t => t.content)
    .join('\n\n')
  
  const conversationHistory = conversation.messages
    .reverse()
    .map(m => `${m.sender_type === 'contact' ? 'Customer' : 'Agent'}: ${m.content}`)
    .join('\n')
  
  // Get successful patterns for this company
  const successPatterns = await db.successful_patterns.findMany({
    where: { company_id: company.id },
    take: 5,
    orderBy: { effectiveness_score: 'desc' }
  })
  
  const patternsContext = successPatterns
    .map(p => p.pattern_summary)
    .join('\n\n')
  
  // Call Claude API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are an AI sales assistant for ${company.name}, a ${company.industry_category} business.

BRAND VOICE: ${company.settings.brand_voice}
RESPONSE TONE: ${company.settings.response_tone}

CATEGORY GUIDELINES:
${categoryPrompt}

AVAILABLE PRODUCTS:
${productsContext}

TRAINING MATERIALS:
${trainingContext}

SUCCESSFUL PATTERNS (learn from these):
${patternsContext}

CURRENT CONVERSATION:
${conversationHistory}

CUSTOMER BEHAVIOR SCORE: ${conversation.contact.behavior_score}/100 (${conversation.contact.score_color})

Generate a helpful, natural response that:
1. Addresses the customer's last message directly
2. Suggests relevant products if appropriate
3. Uses the brand voice and tone specified
4. Applies successful patterns learned from past conversations
5. Moves the conversation toward a sale if customer seems ready (green score)

Response:`
      }]
    })
  })
  
  const data = await response.json()
  const aiMessage = data.content[0].text
  
  // Store AI suggestion
  const suggestion = await db.ai_suggestions.create({
    data: {
      conversation_id: conversationId,
      suggested_message: aiMessage,
      was_used: false
    }
  })
  
  return { suggestionId: suggestion.id, message: aiMessage }
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

---

## DEPLOYMENT CHECKLIST

- [ ] Environment variables configured (DATABASE_URL, CLAUDE_API_KEY, S3_CREDENTIALS)
- [ ] Database migrations run
- [ ] Seed data for industry categories
- [ ] Webhook URLs configured in WhatsApp/Telegram
- [ ] CDN/S3 bucket for image uploads
- [ ] Background job queue (for AI learning, score updates)
- [ ] Monitoring and error tracking (Sentry, etc)
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] SSL certificates
- [ ] Backup strategy in place

---

## TESTING PRIORITIES

1. **Multi-tenancy isolation**: Verify company_id filtering works everywhere
2. **Assignment access**: Agents can ONLY see assigned conversations
3. **Admin monitoring**: Company admins can see ALL conversations
4. **Webhook routing**: Messages reach correct company
5. **Behavior scoring**: Score updates correctly after messages
6. **AI context**: Each company gets their own training/products
7. **Assignment workflow**: Assign/reassign works properly
8. **Notification system**: Agents notified of assignments
9. **Learning loop**: Successful patterns stored and used
10. **Export functionality**: Data exports respect access control

---

## KEY BUSINESS LOGIC SUMMARY

1. **New message arrives** → Webhook routes to company → Find/create contact → Find/create conversation → Check assignment rules → Assign if auto-enabled OR add to unassigned queue → Store message → Update behavior score (every 3 msgs) → AI responds if no agent assigned

2. **Company Admin assigns conversation** → Update assigned_to field → Log assignment history → Notify agent → Agent sees in their inbox

3. **Agent handles conversation** → Can only see assigned → Uses AI suggestions → Sends messages → Can request transfer → Marks as completed with sale details

4. **Sale completed** → Store outcome → Analyze conversation with Claude → Extract successful patterns → Update knowledge base → Future AI suggestions improve

5. **Behavior score changes to green** → Notify assigned agent → Notify company admin → Prioritize in lead list

6. **AI generates response** → Load company context (category, products, training, successful patterns) → Call Claude API → Store suggestion → Agent can use/modify → Track effectiveness

This prompt should give you everything needed to build the complete platform! 🚀