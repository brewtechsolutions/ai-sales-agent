# 🧪 AI Sales Agent Testing Guide

This guide shows you how to test the AI Sales Agent with just your OpenAI API key and realistic sample data.

## 🚀 Quick Setup (Windows)

1. **Set up your OpenAI API key:**
   ```bash
   copy env.minimal .env
   # Edit .env and replace 'your_openai_api_key_here' with your actual API key
   ```

2. **Run the complete setup with sample data:**
   ```bash
   scripts\setup-with-seed.bat
   ```

## 🚀 Quick Setup (Linux/Mac)

1. **Set up your OpenAI API key:**
   ```bash
   cp env.minimal .env
   # Edit .env and replace 'your_openai_api_key_here' with your actual API key
   ```

2. **Run the complete setup with sample data:**
   ```bash
   chmod +x scripts/setup-with-seed.sh
   ./scripts/setup-with-seed.sh
   ```

## 🌱 What Gets Seeded

The seeding script creates realistic sample data:

### 👥 **Customers (3)**
- **John Doe** (English) - KL business owner
- **Ahmad Rahman** (Malay) - Johor entrepreneur  
- **Li Wei** (Chinese) - Penang tech startup

### 🛍️ **Products (5)**
- Premium Business Consultation Package (RM 2,500)
- Digital Marketing Mastery Course (RM 899)
- E-commerce Setup Service (RM 1,500)
- Financial Planning Consultation (RM 500)
- Legal Document Review Service (RM 300)

### 🤖 **Sales Personas (2)**
- **Sarah** - Malaysian Business Solutions (general business)
- **Ahmad** - Tech Solutions Malaysia (tech-focused)

### 💬 **Sample Conversations (2)**
- `demo-session-1` - English customer conversation
- `demo-session-2` - Malay customer conversation

### 📅 **Consultations (2)**
- Business strategy consultation (scheduled)
- E-commerce setup consultation (confirmed)

### 💰 **Payments (2)**
- Completed payment (RM 2,500)
- Pending payment (RM 1,500)

## 🧪 Testing the AI Agent

### 1. **Test with Seeded Sessions**

```bash
# Test with existing seeded sessions
node test-seeded-data.js
```

### 2. **Test with New Sessions**

```bash
# Test with new sessions
node test-client.js
```

### 3. **Manual API Testing**

**English Test:**
```bash
curl -X POST http://localhost:3000/api/ai-agent/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-1",
    "message": "Hello, I need help with my business strategy",
    "language": "EN"
  }'
```

**Malay Test:**
```bash
curl -X POST http://localhost:3000/api/ai-agent/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-2", 
    "message": "Saya perlukan bantuan dengan perniagaan saya",
    "language": "MS"
  }'
```

**Chinese Test:**
```bash
curl -X POST http://localhost:3000/api/ai-agent/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-3",
    "message": "你好，我想了解你们的服务",
    "language": "ZH"
  }'
```

## 🎯 Expected AI Responses

The AI agent should respond with:

### **English Responses:**
- Warm, professional greetings
- Malaysian business context
- Product recommendations based on conversation
- Cultural awareness (festivals, local references)

### **Malay Responses:**
- Polite, respectful language
- Local business terminology
- Cultural context (Hari Raya, local practices)
- Product suggestions in Malay

### **Chinese Responses:**
- Formal but warm language
- Business-appropriate tone
- Cultural sensitivity
- Product recommendations

## 📊 Test Different Scenarios

### **1. Product Inquiry**
```json
{
  "sessionId": "test-1",
  "message": "What products do you have for small businesses?",
  "language": "EN"
}
```

### **2. Pricing Questions**
```json
{
  "sessionId": "test-2",
  "message": "How much does the consultation cost?",
  "language": "EN"
}
```

### **3. Consultation Booking**
```json
{
  "sessionId": "test-3",
  "message": "I want to book a consultation",
  "language": "EN"
}
```

### **4. Cultural Context**
```json
{
  "sessionId": "test-4",
  "message": "Do you have any Chinese New Year promotions?",
  "language": "EN"
}
```

## 🔍 Monitoring & Debugging

### **Health Check**
```bash
curl http://localhost:3000/api/health
```

### **View Logs**
```bash
# Check application logs
tail -f logs/application-*.log

# Check error logs
tail -f logs/error-*.log
```

### **Database Inspection**
```bash
# Open Prisma Studio
npx prisma studio
```

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ **AI responds in correct language** (EN/MS/ZH)
2. ✅ **Cultural context is included** (Malaysian references)
3. ✅ **Product recommendations are relevant**
4. ✅ **Conversation stages progress naturally**
5. ✅ **Confidence scores are high** (>0.7)
6. ✅ **Suggestions are provided**
7. ✅ **Malaysian business etiquette is followed**

## 🚨 Troubleshooting

### **Common Issues:**

1. **"No response generated"**
   - Check OpenAI API key
   - Verify API credits
   - Check logs for errors

2. **"Database connection failed"**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env
   - Run migrations: `npx prisma migrate dev`

3. **"Invalid session"**
   - Use seeded sessions: `demo-session-1`, `demo-session-2`
   - Or create new sessions with unique IDs

4. **"Language not detected"**
   - Explicitly set language in request
   - Use clear language indicators

## 📈 Next Steps

Once basic testing works:

1. **Customize the sales persona** for your business
2. **Add your actual products** via the products API
3. **Configure payment processing** (Curlec)
4. **Set up calendar integration** (Google Calendar)
5. **Add email/SMS notifications**
6. **Deploy to production**

## 🎯 Test Checklist

- [ ] AI responds in English
- [ ] AI responds in Malay  
- [ ] AI responds in Chinese
- [ ] Cultural context is included
- [ ] Product recommendations work
- [ ] Conversation stages progress
- [ ] Analytics data is generated
- [ ] Admin dashboard accessible
- [ ] API documentation loads
- [ ] Health check passes

Happy testing! 🚀
