// Simple test client for AI Sales Agent
// This script demonstrates how to interact with the AI agent API

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test the AI agent with different messages
async function testAIAgent() {
    console.log('🤖 Testing AI Sales Agent...\n');

    const testMessages = [
        {
            sessionId: 'test-session-1',
            message: 'Hello, I am looking for a product',
            language: 'EN'
        },
        {
            sessionId: 'test-session-1',
            message: 'I need help with choosing the right product for my business',
            language: 'EN'
        },
        {
            sessionId: 'test-session-2',
            message: 'Selamat pagi, saya perlukan bantuan',
            language: 'MS'
        },
        {
            sessionId: 'test-session-3',
            message: '你好，我想了解一下你们的产品',
            language: 'ZH'
        }
    ];

    for (const testMessage of testMessages) {
        try {
            console.log(`📤 Sending: "${testMessage.message}" (${testMessage.language})`);
            
            const response = await axios.post(`${API_BASE_URL}/ai-agent/chat/message`, testMessage);
            
            console.log(`📥 Response: "${response.data.message}"`);
            console.log(`🎯 Stage: ${response.data.conversationStage}`);
            console.log(`🔍 Intent: ${response.data.intent || 'N/A'}`);
            console.log(`📊 Confidence: ${response.data.confidence}`);
            console.log('---\n');
            
            // Wait a bit between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`❌ Error testing message: ${error.message}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
                console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
            }
            console.log('---\n');
        }
    }
}

// Test health endpoint
async function testHealth() {
    try {
        console.log('🏥 Testing health endpoint...');
        const response = await axios.get(`${API_BASE_URL}/health`);
        console.log(`✅ Health Status: ${response.data.status}`);
        console.log(`📊 Services: ${JSON.stringify(response.data.services, null, 2)}\n`);
    } catch (error) {
        console.error(`❌ Health check failed: ${error.message}\n`);
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting AI Sales Agent Tests\n');
    
    // Test health first
    await testHealth();
    
    // Test AI agent
    await testAIAgent();
    
    console.log('✅ Tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testAIAgent, testHealth, runTests };
