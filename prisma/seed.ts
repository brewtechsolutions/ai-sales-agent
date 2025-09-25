import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@aisalesagent.com' },
    update: {},
    create: {
      email: 'admin@aisalesagent.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        email: 'john.doe@example.com',
        phone: '+60123456789',
        name: 'John Doe',
        preferredLanguage: 'EN',
        timezone: 'Asia/Kuala_Lumpur',
        culturalContext: {
          currentFestivalSeason: 'Chinese New Year',
          weatherContext: 'tropical climate',
          regionalPreferences: 'KL, Selangor',
          paymentMethodPreferences: ['FPX Online Banking', 'Credit Card'],
          deliveryLocationContext: 'West Malaysia',
        },
      },
    }),
    prisma.customer.upsert({
      where: { email: 'ahmad.rahman@example.com' },
      update: {},
      create: {
        email: 'ahmad.rahman@example.com',
        phone: '+60198765432',
        name: 'Ahmad Rahman',
        preferredLanguage: 'MS',
        timezone: 'Asia/Kuala_Lumpur',
        culturalContext: {
          currentFestivalSeason: 'Hari Raya Puasa',
          weatherContext: 'northeast monsoon season',
          regionalPreferences: 'Johor, Melaka',
          paymentMethodPreferences: ['FPX Online Banking', 'GrabPay'],
          deliveryLocationContext: 'West Malaysia',
        },
      },
    }),
    prisma.customer.upsert({
      where: { email: 'li.wei@example.com' },
      update: {},
      create: {
        email: 'li.wei@example.com',
        phone: '+60187654321',
        name: 'Li Wei',
        preferredLanguage: 'ZH',
        timezone: 'Asia/Kuala_Lumpur',
        culturalContext: {
          currentFestivalSeason: 'Chinese New Year',
          weatherContext: 'tropical climate',
          regionalPreferences: 'Penang, KL',
          paymentMethodPreferences: ['FPX Online Banking', 'Touch \'n Go eWallet'],
          deliveryLocationContext: 'West Malaysia',
        },
      },
    }),
  ]);
  console.log('✅ Created customers:', customers.length);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod-1' },
      update: {},
      create: {
        id: 'prod-1',
        name: 'Premium Business Consultation Package',
        description: 'Comprehensive business consultation including strategy planning, market analysis, and implementation guidance. Perfect for Malaysian SMEs looking to scale their operations.',
        category: 'Business Services',
        price: 2500.00,
        currency: 'MYR',
        stockQuantity: 10,
        isActive: true,
        metadata: {
          duration: '3 months',
          includes: ['Strategy Planning', 'Market Analysis', 'Implementation Support'],
          targetAudience: 'SMEs',
          language: ['EN', 'MS', 'ZH'],
        },
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-2' },
      update: {},
      create: {
        id: 'prod-2',
        name: 'Digital Marketing Mastery Course',
        description: 'Complete digital marketing course tailored for Malaysian businesses. Learn Facebook Ads, Google Ads, and social media marketing strategies.',
        category: 'Education',
        price: 899.00,
        currency: 'MYR',
        stockQuantity: 25,
        isActive: true,
        metadata: {
          duration: '6 weeks',
          includes: ['Video Lessons', 'Live Sessions', 'Certification'],
          targetAudience: 'Marketing Professionals',
          language: ['EN', 'MS'],
        },
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-3' },
      update: {},
      create: {
        id: 'prod-3',
        name: 'E-commerce Setup Service',
        description: 'Complete e-commerce website setup with payment gateway integration (FPX, GrabPay, Boost). Includes mobile optimization and SEO setup.',
        category: 'Technology',
        price: 1500.00,
        currency: 'MYR',
        stockQuantity: 15,
        isActive: true,
        metadata: {
          duration: '2 weeks',
          includes: ['Website Design', 'Payment Integration', 'Mobile Optimization', 'SEO Setup'],
          targetAudience: 'Online Sellers',
          language: ['EN', 'MS', 'ZH'],
        },
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-4' },
      update: {},
      create: {
        id: 'prod-4',
        name: 'Financial Planning Consultation',
        description: 'Personalized financial planning consultation for Malaysian individuals and families. Includes investment advice, tax planning, and retirement planning.',
        category: 'Financial Services',
        price: 500.00,
        currency: 'MYR',
        stockQuantity: 20,
        isActive: true,
        metadata: {
          duration: '2 hours',
          includes: ['Financial Assessment', 'Investment Advice', 'Tax Planning'],
          targetAudience: 'Individuals',
          language: ['EN', 'MS', 'ZH'],
        },
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-5' },
      update: {},
      create: {
        id: 'prod-5',
        name: 'Legal Document Review Service',
        description: 'Professional legal document review for contracts, agreements, and business documents. Specialized in Malaysian business law.',
        category: 'Legal Services',
        price: 300.00,
        currency: 'MYR',
        stockQuantity: 30,
        isActive: true,
        metadata: {
          duration: '1 week',
          includes: ['Document Review', 'Legal Advice', 'Revision Suggestions'],
          targetAudience: 'Business Owners',
          language: ['EN', 'MS'],
        },
      },
    }),
  ]);
  console.log('✅ Created products:', products.length);

  // Create sales persona configurations
  const salesPersonas = await Promise.all([
    prisma.salesPersonaConfig.upsert({
      where: { name: 'default' },
      update: {},
      create: {
        name: 'default',
        salespersonName: 'Sarah',
        companyName: 'Malaysian Business Solutions',
        businessDescription: 'We help Malaysian businesses grow through expert consultation, digital marketing, and technology solutions.',
        companyValues: 'Trust, Quality, Customer Success, Innovation',
        productCategory: 'Business Services',
        currentPromotionDetails: 'Special Chinese New Year promotion - 20% off all consultation packages!',
        targetDemographic: 'Malaysian SMEs and entrepreneurs',
        priceRange: 'RM 300 - RM 2,500',
      },
    }),
    prisma.salesPersonaConfig.upsert({
      where: { name: 'tech-focused' },
      update: {},
      create: {
        name: 'tech-focused',
        salespersonName: 'Ahmad',
        companyName: 'Tech Solutions Malaysia',
        businessDescription: 'Leading technology solutions provider specializing in e-commerce, digital transformation, and software development for Malaysian businesses.',
        companyValues: 'Innovation, Reliability, Customer-Centric, Excellence',
        productCategory: 'Technology',
        currentPromotionDetails: 'Free consultation for new e-commerce projects!',
        targetDemographic: 'Tech-savvy business owners and startups',
        priceRange: 'RM 500 - RM 5,000',
      },
    }),
  ]);
  console.log('✅ Created sales personas:', salesPersonas.length);

  // Create sample conversations
  const conversations = await Promise.all([
    prisma.conversation.upsert({
      where: { sessionId: 'demo-session-1' },
      update: {},
      create: {
        sessionId: 'demo-session-1',
        customerId: customers[0].id,
        language: 'EN',
        detectedLanguage: 'EN',
        currentIntent: 'product_inquiry',
        conversationStage: 'SOLUTION_RECOMMENDATION',
        culturalContext: {
          currentFestivalSeason: 'Chinese New Year',
          weatherContext: 'tropical climate',
          regionalPreferences: 'KL, Selangor',
        },
        salesPersonaConfig: salesPersonas[0],
        isActive: true,
      },
    }),
    prisma.conversation.upsert({
      where: { sessionId: 'demo-session-2' },
      update: {},
      create: {
        sessionId: 'demo-session-2',
        customerId: customers[1].id,
        language: 'MS',
        detectedLanguage: 'MS',
        currentIntent: 'consultation_booking',
        conversationStage: 'NEEDS_UNDERSTANDING',
        culturalContext: {
          currentFestivalSeason: 'Hari Raya Puasa',
          weatherContext: 'northeast monsoon season',
          regionalPreferences: 'Johor, Melaka',
        },
        salesPersonaConfig: salesPersonas[0],
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created conversations:', conversations.length);

  // Create sample messages
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        conversationId: conversations[0].sessionId,
        role: 'user',
        content: 'Hello, I am looking for business consultation services for my company.',
        metadata: { platform: 'web' },
      },
    }),
    prisma.message.create({
      data: {
        conversationId: conversations[0].sessionId,
        role: 'assistant',
        content: 'Hello! I\'d be happy to help you with business consultation services. We offer comprehensive packages that include strategy planning, market analysis, and implementation guidance. Could you tell me more about your company and what specific areas you\'d like to focus on?',
        metadata: { provider: 'openai', confidence: 0.9 },
      },
    }),
    prisma.message.create({
      data: {
        conversationId: conversations[1].sessionId,
        role: 'user',
        content: 'Selamat pagi, saya perlukan bantuan dengan perniagaan saya.',
        metadata: { platform: 'whatsapp' },
      },
    }),
    prisma.message.create({
      data: {
        conversationId: conversations[1].sessionId,
        role: 'assistant',
        content: 'Selamat pagi! Saya gembira dapat membantu anda dengan perniagaan anda. Kami menawarkan pelbagai perkhidmatan perundingan perniagaan yang sesuai untuk syarikat Malaysia. Boleh ceritakan lebih lanjut tentang perniagaan anda?',
        metadata: { provider: 'openai', confidence: 0.9 },
      },
    }),
  ]);
  console.log('✅ Created messages:', messages.length);

  // Create sample consultations
  const consultations = await Promise.all([
    prisma.consultation.create({
      data: {
        customerId: customers[0].id,
        productId: products[0].id,
        expertName: 'Dr. Sarah Lim',
        expertEmail: 'sarah.lim@businesssolutions.com',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        duration: 60,
        status: 'SCHEDULED',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Initial consultation for business strategy planning',
      },
    }),
    prisma.consultation.create({
      data: {
        customerId: customers[1].id,
        productId: products[2].id,
        expertName: 'Ahmad Tech Expert',
        expertEmail: 'ahmad@techsolutions.com',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 90,
        status: 'CONFIRMED',
        meetingLink: 'https://zoom.us/j/123456789',
        notes: 'E-commerce setup consultation',
      },
    }),
  ]);
  console.log('✅ Created consultations:', consultations.length);

  // Create sample payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        customerId: customers[0].id,
        amount: 2500.00,
        currency: 'MYR',
        status: 'COMPLETED',
        paymentMethod: 'FPX Online Banking',
        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
        metadata: {
          productId: products[0].id,
          paymentGateway: 'curlec',
        },
      },
    }),
    prisma.payment.create({
      data: {
        customerId: customers[1].id,
        amount: 1500.00,
        currency: 'MYR',
        status: 'PENDING',
        paymentMethod: 'GrabPay',
        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
        metadata: {
          productId: products[2].id,
          paymentGateway: 'curlec',
        },
      },
    }),
  ]);
  console.log('✅ Created payments:', payments.length);

  // Create product recommendations
  const recommendations = await Promise.all([
    prisma.productRecommendation.create({
      data: {
        conversationId: conversations[0].sessionId,
        productId: products[0].id,
        confidence: 0.9,
        reason: 'Customer expressed interest in business consultation services',
      },
    }),
    prisma.productRecommendation.create({
      data: {
        conversationId: conversations[0].sessionId,
        productId: products[1].id,
        confidence: 0.7,
        reason: 'Customer mentioned digital marketing needs',
      },
    }),
  ]);
  console.log('✅ Created product recommendations:', recommendations.length);

  // Create analytics data
  await prisma.conversationAnalytics.create({
    data: {
      conversationId: conversations[0].sessionId,
      totalMessages: 2,
      avgResponseTime: 1.5,
      customerSatisfaction: 5,
      conversionRate: 0.8,
      languageUsed: 'EN',
      stageCompleted: 'SOLUTION_RECOMMENDATION',
    },
  });

  await prisma.customerAnalytics.create({
    data: {
      customerId: customers[0].id,
      totalConversations: 1,
      totalConsultations: 1,
      totalSpent: 2500.00,
      preferredLanguage: 'EN',
      lastActivityAt: new Date(),
    },
  });

  console.log('✅ Created analytics data');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Admin users: 1`);
  console.log(`- Customers: ${customers.length}`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Sales personas: ${salesPersonas.length}`);
  console.log(`- Conversations: ${conversations.length}`);
  console.log(`- Messages: ${messages.length}`);
  console.log(`- Consultations: ${consultations.length}`);
  console.log(`- Payments: ${payments.length}`);
  console.log(`- Product recommendations: ${recommendations.length}`);
  
  console.log('\n🔑 Admin Login:');
  console.log('Email: admin@aisalesagent.com');
  console.log('Password: admin123');
  
  console.log('\n🧪 Test Sessions:');
  console.log('- demo-session-1 (English customer)');
  console.log('- demo-session-2 (Malay customer)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
