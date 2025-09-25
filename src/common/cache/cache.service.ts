import { Injectable, Inject, Optional, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private memoryCache = new Map<string, { value: any; expires: number }>();
  private readonly isRedisEnabled: boolean;

  constructor(
    @Optional() @Inject('REDIS_CLIENT') private redisClient: RedisClientType | null,
    private configService: ConfigService,
  ) {
    this.isRedisEnabled = this.configService.get<boolean>('redis.enabled', false);
    
    // Clean up expired memory cache entries every 5 minutes
    if (!this.isRedisEnabled) {
      setInterval(() => this.cleanupExpiredMemoryCache(), 5 * 60 * 1000);
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      if (this.isRedisEnabled && this.redisClient) {
        await this.redisClient.setEx(key, ttl, JSON.stringify(value));
        this.logger.debug(`Cached key: ${key} in Redis`);
      } else {
        // Fallback to memory cache
        this.memoryCache.set(key, {
          value,
          expires: Date.now() + ttl * 1000,
        });
        this.logger.debug(`Cached key: ${key} in memory`);
      }
    } catch (error) {
      this.logger.error(`Failed to cache key: ${key}`, error);
      // Fallback to memory cache on Redis error
      this.memoryCache.set(key, {
        value,
        expires: Date.now() + ttl * 1000,
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isRedisEnabled && this.redisClient) {
        const result = await this.redisClient.get(key);
        if (result) {
          this.logger.debug(`Retrieved key: ${key} from Redis`);
          return JSON.parse(result);
        }
        return null;
      } else {
        // Fallback to memory cache
        const cached = this.memoryCache.get(key);
        if (cached && cached.expires > Date.now()) {
          this.logger.debug(`Retrieved key: ${key} from memory`);
          return cached.value;
        }
        if (cached) {
          this.memoryCache.delete(key);
        }
        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to retrieve key: ${key}`, error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.isRedisEnabled && this.redisClient) {
        await this.redisClient.del(key);
        this.logger.debug(`Deleted key: ${key} from Redis`);
      } else {
        this.memoryCache.delete(key);
        this.logger.debug(`Deleted key: ${key} from memory`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete key: ${key}`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (this.isRedisEnabled && this.redisClient) {
        const result = await this.redisClient.exists(key);
        return result === 1;
      } else {
        const cached = this.memoryCache.get(key);
        return cached ? cached.expires > Date.now() : false;
      }
    } catch (error) {
      this.logger.error(`Failed to check existence of key: ${key}`, error);
      return false;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      if (this.isRedisEnabled && this.redisClient) {
        return await this.redisClient.keys(pattern);
      } else {
        // Fallup to memory cache - simple pattern matching
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return Array.from(this.memoryCache.keys()).filter(key => regex.test(key));
      }
    } catch (error) {
      this.logger.error(`Failed to get keys with pattern: ${pattern}`, error);
      return [];
    }
  }

  async flush(): Promise<void> {
    try {
      if (this.isRedisEnabled && this.redisClient) {
        await this.redisClient.flushAll();
        this.logger.debug('Flushed Redis cache');
      } else {
        this.memoryCache.clear();
        this.logger.debug('Flushed memory cache');
      }
    } catch (error) {
      this.logger.error('Failed to flush cache', error);
    }
  }

  private cleanupExpiredMemoryCache(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, cached] of this.memoryCache.entries()) {
      if (cached.expires <= now) {
        this.memoryCache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired memory cache entries`);
    }
  }

  // Helper method for caching with automatic key generation
  async cacheWithKey<T>(
    keyGenerator: () => string,
    valueFactory: () => Promise<T>,
    ttl: number = 3600,
  ): Promise<T> {
    const key = keyGenerator();
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const value = await valueFactory();
    await this.set(key, value, ttl);
    return value;
  }
}
