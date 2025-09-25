import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  MalaysianCulturalContext, 
  Language, 
  CulturalResponse,
  ConversationStage 
} from './interfaces/conversation.interface';
import * as moment from 'moment-timezone';

@Injectable()
export class CulturalContextService {
  private readonly logger = new Logger(CulturalContextService.name);
  private readonly malaysiaTimezone = 'Asia/Kuala_Lumpur';

  constructor(private configService: ConfigService) {}

  /**
   * Get current Malaysian cultural context
   */
  getCurrentCulturalContext(): MalaysianCulturalContext {
    const now = moment().tz(this.malaysiaTimezone);
    
    return {
      currentFestivalSeason: this.getCurrentFestivalSeason(now),
      weatherContext: this.getWeatherContext(now),
      regionalPreferences: this.getRegionalPreferences(),
      paymentMethodPreferences: this.getPaymentMethodPreferences(),
      deliveryLocationContext: this.getDeliveryLocationContext(),
      businessHours: {
        start: '09:00',
        end: '18:00',
        timezone: this.malaysiaTimezone,
      },
      localHolidays: this.getUpcomingHolidays(now),
      culturalNotes: this.getCulturalNotes(),
    };
  }

  /**
   * Generate culturally appropriate response based on context
   */
  generateCulturalResponse(
    language: Language,
    stage: ConversationStage,
    culturalContext: MalaysianCulturalContext,
  ): CulturalResponse {
    const responses = this.getCulturalResponses(language, stage, culturalContext);
    
    return {
      greeting: responses.greeting,
      closing: responses.closing,
      politenessLevel: this.determinePolitenessLevel(language, stage),
      culturalReferences: responses.culturalReferences,
      localContext: responses.localContext,
    };
  }

  /**
   * Check if current time is within Malaysian business hours
   */
  isWithinBusinessHours(): boolean {
    const now = moment().tz(this.malaysiaTimezone);
    const hour = now.hour();
    const day = now.day(); // 0 = Sunday, 6 = Saturday
    
    // Business hours: Monday-Friday 9 AM - 6 PM
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  }

  /**
   * Get appropriate greeting based on time and language
   */
  getTimeBasedGreeting(language: Language): string {
    const now = moment().tz(this.malaysiaTimezone);
    const hour = now.hour();

    const greetings = {
      [Language.EN]: {
        morning: 'Good morning!',
        afternoon: 'Good afternoon!',
        evening: 'Good evening!',
        night: 'Good evening!',
      },
      [Language.MS]: {
        morning: 'Selamat pagi!',
        afternoon: 'Selamat tengah hari!',
        evening: 'Selamat petang!',
        night: 'Selamat malam!',
      },
      [Language.ZH]: {
        morning: '早上好！',
        afternoon: '下午好！',
        evening: '晚上好！',
        night: '晚上好！',
      },
    };

    let timeOfDay: keyof typeof greetings[Language.EN];
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    return greetings[language][timeOfDay];
  }

  private getCurrentFestivalSeason(now: moment.Moment): string | undefined {
    const month = now.month() + 1; // moment months are 0-indexed
    const day = now.date();

    // Chinese New Year (January/February)
    if ((month === 1 && day >= 20) || (month === 2 && day <= 20)) {
      return 'Chinese New Year';
    }

    // Hari Raya Puasa (Ramadan - varies by year)
    if (month === 3 || month === 4) {
      return 'Hari Raya Puasa';
    }

    // Wesak Day (May)
    if (month === 5) {
      return 'Wesak Day';
    }

    // Hari Raya Haji (July)
    if (month === 7) {
      return 'Hari Raya Haji';
    }

    // National Day (August)
    if (month === 8 && day === 31) {
      return 'National Day';
    }

    // Deepavali (October/November)
    if (month === 10 || month === 11) {
      return 'Deepavali';
    }

    // Christmas (December)
    if (month === 12) {
      return 'Christmas';
    }

    return undefined;
  }

  private getWeatherContext(now: moment.Moment): string {
    const month = now.month() + 1;
    
    // Malaysia has tropical climate with wet and dry seasons
    if (month >= 10 || month <= 3) {
      return 'northeast monsoon season (wetter weather)';
    } else if (month >= 4 && month <= 9) {
      return 'southwest monsoon season (drier weather)';
    }
    
    return 'tropical climate';
  }

  private getRegionalPreferences(): string {
    return 'KL, Selangor, Penang, Johor, Sabah, Sarawak';
  }

  private getPaymentMethodPreferences(): string[] {
    return [
      'FPX Online Banking',
      'Credit/Debit Card',
      'Grab Pay',
      'Touch \'n Go eWallet',
      'Boost',
      'ShopeePay',
      'Maybank2u',
      'CIMB Clicks',
    ];
  }

  private getDeliveryLocationContext(): string {
    return 'West Malaysia, East Malaysia, Singapore, Brunei';
  }

  private getUpcomingHolidays(now: moment.Moment): string[] {
    const holidays = [];
    const currentYear = now.year();
    
    // Add major Malaysian holidays for the year
    holidays.push(`${currentYear}-01-01: New Year's Day`);
    holidays.push(`${currentYear}-02-01: Federal Territory Day`);
    holidays.push(`${currentYear}-05-01: Labour Day`);
    holidays.push(`${currentYear}-05-31: Hari Raya Puasa (estimated)`);
    holidays.push(`${currentYear}-08-31: National Day`);
    holidays.push(`${currentYear}-12-25: Christmas Day`);
    
    return holidays;
  }

  private getCulturalNotes(): string[] {
    return [
      'Respectful communication is highly valued',
      'Family and relationships are important',
      'Punctuality is appreciated but flexibility is understood',
      'Gift-giving during festivals is common',
      'Multi-generational decision making in families',
    ];
  }

  private getCulturalResponses(
    language: Language,
    stage: ConversationStage,
    culturalContext: MalaysianCulturalContext,
  ): {
    greeting: string;
    closing: string;
    culturalReferences: string[];
    localContext: string[];
  } {
    const responses = {
      [Language.EN]: {
        greeting: 'Hello! How can I help you today?',
        closing: 'Thank you for your time. Have a great day!',
        culturalReferences: ['Malaysian hospitality', 'local business practices'],
        localContext: ['KL traffic', 'Malaysian weather', 'local festivals'],
      },
      [Language.MS]: {
        greeting: 'Selamat datang! Bagaimana saya boleh membantu anda hari ini?',
        closing: 'Terima kasih atas masa anda. Semoga hari anda cemerlang!',
        culturalReferences: ['budaya Malaysia', 'amalan perniagaan tempatan'],
        localContext: ['kesesakan KL', 'cuaca Malaysia', 'perayaan tempatan'],
      },
      [Language.ZH]: {
        greeting: '您好！今天我可以如何帮助您？',
        closing: '谢谢您的时间。祝您有美好的一天！',
        culturalReferences: ['马来西亚的待客之道', '本地商业惯例'],
        localContext: ['吉隆坡交通', '马来西亚天气', '本地节日'],
      },
    };

    return responses[language];
  }

  private determinePolitenessLevel(language: Language, stage: ConversationStage): 'formal' | 'casual' | 'friendly' {
    // Adjust politeness based on conversation stage and language
    if (stage === ConversationStage.INTRODUCTION) {
      return 'formal';
    } else if (stage === ConversationStage.STORY_SHARING || stage === ConversationStage.FRIENDLY_CLOSE) {
      return 'friendly';
    } else {
      return 'casual';
    }
  }
}
