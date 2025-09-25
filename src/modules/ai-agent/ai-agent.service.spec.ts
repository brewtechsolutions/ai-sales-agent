import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiAgentService } from './ai-agent.service';
import { ConversationService } from './conversation.service';
import { CulturalContextService } from './cultural-context.service';
import { LanguageDetectionService } from './language-detection.service';
import { OpenAIService } from './providers/openai.service';
import { ClaudeService } from './providers/claude.service';

describe('AiAgentService', () => {
  let service: AiAgentService;

  const mockConversationService = {
    processChatMessage: jest.fn(),
    getConversationContext: jest.fn(),
    updateConversationContext: jest.fn(),
  };

  const mockCulturalContextService = {
    getCurrentCulturalContext: jest.fn(),
    generateCulturalResponse: jest.fn(),
  };

  const mockLanguageDetectionService = {
    detectLanguage: jest.fn(),
    shouldMirrorLanguage: jest.fn(),
  };

  const mockOpenAIService = {
    generateResponse: jest.fn(),
    generateProductRecommendations: jest.fn(),
    analyzeSentiment: jest.fn(),
  };

  const mockClaudeService = {
    generateResponse: jest.fn(),
    generateProductRecommendations: jest.fn(),
    analyzeSentiment: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('openai'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiAgentService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
        {
          provide: CulturalContextService,
          useValue: mockCulturalContextService,
        },
        {
          provide: LanguageDetectionService,
          useValue: mockLanguageDetectionService,
        },
        {
          provide: OpenAIService,
          useValue: mockOpenAIService,
        },
        {
          provide: ClaudeService,
          useValue: mockClaudeService,
        },
      ],
    }).compile();

    service = module.get<AiAgentService>(AiAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processMessage', () => {
    it('should process a chat message successfully', async () => {
      const messageDto = {
        sessionId: 'test-session',
        message: 'Hello',
        language: 'EN',
      };

      const mockContext = {
        sessionId: 'test-session',
        language: 'EN',
        conversationStage: 'INTRODUCTION',
        conversationHistory: [],
        culturalContext: {},
        salesPersona: {},
        lastActivityAt: new Date(),
      };

      const mockResponse = {
        message: 'Hello! How can I help you today?',
        language: 'EN',
        conversationStage: 'INTRODUCTION',
        confidence: 0.9,
      };

      mockConversationService.processChatMessage.mockResolvedValue(mockContext);
      mockOpenAIService.generateResponse.mockResolvedValue(mockResponse);

      const result = await service.processMessage(messageDto);

      expect(result).toEqual(mockResponse);
      expect(mockConversationService.processChatMessage).toHaveBeenCalledWith(messageDto);
      expect(mockOpenAIService.generateResponse).toHaveBeenCalledWith(mockContext, messageDto.message);
    });
  });

  describe('generateProductRecommendations', () => {
    it('should generate product recommendations', async () => {
      const sessionId = 'test-session';
      const products = [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
      ];

      const mockRecommendations = ['Product 1 is great for you', 'Product 2 matches your needs'];

      mockOpenAIService.generateProductRecommendations.mockResolvedValue(mockRecommendations);

      const result = await service.generateProductRecommendations(sessionId, products);

      expect(result).toEqual(mockRecommendations);
      expect(mockOpenAIService.generateProductRecommendations).toHaveBeenCalledWith(
        expect.any(Object),
        products,
      );
    });
  });
});
