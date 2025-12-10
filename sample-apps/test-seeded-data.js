// Test script for seeded data
// This script tests the AI agent with the seeded sample data

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test messages using seeded sessions
const seededTestMessages = [
    {
        sessionId: 'demo-session-1',
        message: 'I need help with my business strategy',
        language: 'EN',
        description: 'English customer asking for business help'
    },
    {
        sessionId: 'demo-session-1',
        message: 'What products do you recommend for my company?',
        language: 'EN',
        description: 'English customer asking for product recommendations'
    },
    {
        sessionId: 'demo-session-2',
        message: 'Saya perlukan bantuan dengan perniagaan online saya',
        language: 'MS',
        description: 'Malay customer asking for online business help'
    },
    {
        sessionId: 'demo-session-2',
        message: 'Berapa kos untuk setup e-commerce?',
        language: 'MS',
        description: 'Malay customer asking about e-commerce costs'
    },
    {
        sessionId: 'new-session-zh',
        message: '你好，我想了解你们的服务',
        language: 'ZH',
        description: 'Chinese customer asking about services'
    }
];

// Test the AI agent with seeded data
async function testSeededData() {
    console.log('🌱 Testing AI Sales Agent with seeded data...\n');

    for (const testMessage of seededTestMessages) {
        try {
            console.log(`📤 [${testMessage.description}]`);
            console.log(`   Sending: "${testMessage.message}" (${testMessage.language})`);
            
            const response = await axios.post(`${API_BASE_URL}/ai-agent/chat/message`, {
                sessionId: testMessage.sessionId,
                message: testMessage.message,
                language: testMessage.language
            });
            
            console.log(`📥 Response: "${response.data.message}"`);
            console.log(`🎯 Stage: ${response.data.conversationStage}`);
            console.log(`🔍 Intent: ${response.data.intent || 'N/A'}`);
            console.log(`📊 Confidence: ${response.data.confidence}`);
            if (response.data.suggestions && response.data.suggestions.length > 0) {
                console.log(`💡 Suggestions: ${response.data.suggestions.join(', ')}`);
            }
            console.log('---\n');
            
            // Wait between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ Error testing message: ${error.message}`);
            if (error.response) {
                console.error(`   Status: ${error.response.status}`);
                console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
            }
            console.log('---\n');
        }
    }
}

// Test product recommendations
async function testProductRecommendations() {
    console.log('🛍️  Testing product recommendations...\n');

    try {
        // Get products
        const productsResponse = await axios.get(`${API_BASE_URL}/products`);
        console.log(`📦 Found ${productsResponse.data.data.length} products:`);
        productsResponse.data.data.forEach(product => {
            console.log(`   - ${product.name}: RM ${product.price} (${product.category})`);
        });
        console.log('');

        // Test recommendations for demo session
        const recommendationsResponse = await axios.get(`${API_BASE_URL}/products/recommendations/demo-session-1`);
        console.log(`🎯 Product recommendations for demo-session-1:`);
        recommendationsResponse.data.forEach(rec => {
            console.log(`   - ${rec.name}: RM ${rec.price} (${rec.recommendationType})`);
        });
        console.log('');

    } catch (error) {
        console.error(`❌ Error testing product recommendations: ${error.message}`);
    }
}

// Test conversation analytics
async function testAnalytics() {
    console.log('📊 Testing analytics...\n');

    try {
        // Get conversation analytics
        const convAnalytics = await axios.get(`${API_BASE_URL}/analytics/conversations`);
        console.log('📈 Conversation Analytics:');
        console.log(`   Total conversations: ${convAnalytics.data.totalConversations}`);
        console.log(`   Active conversations: ${convAnalytics.data.activeConversations}`);
        console.log(`   Completion rate: ${convAnalytics.data.completionRate}%`);
        console.log(`   Average response time: ${convAnalytics.data.averageResponseTime}s`);
        console.log('');

        // Get sales analytics
        const salesAnalytics = await axios.get(`${API_BASE_URL}/analytics/sales`);
        console.log('💰 Sales Analytics:');
        console.log(`   Total revenue: RM ${salesAnalytics.data.totalRevenue}`);
        console.log(`   Total orders: ${salesAnalytics.data.totalOrders}`);
        console.log(`   Average order value: RM ${salesAnalytics.data.averageOrderValue}`);
        console.log(`   Conversion rate: ${salesAnalytics.data.conversionRate}%`);
        console.log('');

    } catch (error) {
        console.error(`❌ Error testing analytics: ${error.message}`);
    }
}

// Test customer data
async function testCustomerData() {
    console.log('👥 Testing customer data...\n');

    try {
        // Get customers
        const customersResponse = await axios.get(`${API_BASE_URL}/customers`);
        console.log(`👤 Found ${customersResponse.data.data.length} customers:`);
        customersResponse.data.data.forEach(customer => {
            console.log(`   - ${customer.name} (${customer.email}) - ${customer.preferredLanguage}`);
        });
        console.log('');

        // Get specific customer
        const customerResponse = await axios.get(`${API_BASE_URL}/customers/${customersResponse.data.data[0].id}`);
        console.log(`👤 Customer details for ${customerResponse.data.name}:`);
        console.log(`   Email: ${customerResponse.data.email}`);
        console.log(`   Phone: ${customerResponse.data.phone}`);
        console.log(`   Language: ${customerResponse.data.preferredLanguage}`);
        console.log(`   Conversations: ${customerResponse.data.conversations.length}`);
        console.log(`   Consultations: ${customerResponse.data.consultations.length}`);
        console.log(`   Payments: ${customerResponse.data.payments.length}`);
        console.log('');

    } catch (error) {
        console.error(`❌ Error testing customer data: ${error.message}`);
    }
}

// Main test function
async function runSeededTests() {
    console.log('🧪 Starting AI Sales Agent Tests with Seeded Data\n');
    
    // Test health first
    try {
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log(`🏥 Health Status: ${healthResponse.data.status}\n`);
    } catch (error) {
        console.error(`❌ Health check failed: ${error.message}\n`);
        return;
    }
    
    // Run all tests
    await testSeededData();
    await testProductRecommendations();
    await testCustomerData();
    await testAnalytics();
    
    console.log('✅ All seeded data tests completed!');
    console.log('\n🎉 The AI Sales Agent is working with realistic sample data!');
    console.log('\n📝 Next steps:');
    console.log('1. Try different conversation flows');
    console.log('2. Test different languages (EN, MS, ZH)');
    console.log('3. Explore the admin dashboard');
    console.log('4. Check the API documentation at /api/docs');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runSeededTests().catch(console.error);
}

module.exports = { testSeededData, testProductRecommendations, testAnalytics, testCustomerData, runSeededTests };
