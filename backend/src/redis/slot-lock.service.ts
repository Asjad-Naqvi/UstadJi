import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

interface MemoryLock {
  key: string;
  expiresAt: number;
}

@Injectable()
export class SlotLockService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SlotLockService.name);
  private redisClient: Redis | null = null;
  private memoryLocks = new Map<string, MemoryLock>();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isRedisConnected = false;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    try {
      this.redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // Don't hang indefinitely if Redis is not running
        lazyConnect: true,
      });

      await this.redisClient.connect();
      this.isRedisConnected = true;
      this.logger.log(`✅ Connected to Redis for slot locks at ${redisUrl}`);
    } catch (err) {
      this.isRedisConnected = false;
      this.logger.warn(
        `⚠️ Redis not available (${(err as Error).message}). Using in-memory atomic TTL slot lock manager.`
      );
    }

    // Cleanup expired in-memory locks every 15 seconds
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, lock] of this.memoryLocks.entries()) {
        if (lock.expiresAt <= now) {
          this.memoryLocks.delete(key);
        }
      }
    }, 15000);
  }

  onModuleDestroy() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    if (this.redisClient) this.redisClient.disconnect();
  }

  getLockKey(providerId: string, date: string, startTime: string): string {
    return `lock:slot:${providerId}:${date}:${startTime}`;
  }

  /**
   * Attempts to atomically acquire a temporary time-slot lock.
   * Returns true if lock acquired, false if slot is already reserved.
   */
  async acquireSlotLock(
    providerId: string,
    date: string,
    startTime: string,
    ttlSeconds = 300 // 5 minutes default
  ): Promise<{ success: boolean; lockKey: string }> {
    const lockKey = this.getLockKey(providerId, date, startTime);

    if (this.isRedisConnected && this.redisClient) {
      try {
        const result = await this.redisClient.set(lockKey, "LOCKED", "EX", ttlSeconds, "NX");
        const success = result === "OK";
        if (success) {
          this.logger.log(`🔒 Acquired Redis slot lock: ${lockKey} (TTL: ${ttlSeconds}s)`);
        } else {
          this.logger.warn(`⛔ Slot lock conflict in Redis: ${lockKey}`);
        }
        return { success, lockKey };
      } catch (err) {
        this.logger.error(`Redis error during acquireLock, falling back to memory: ${(err as Error).message}`);
      }
    }

    // Fallback: In-memory atomic lock
    const now = Date.now();
    const existing = this.memoryLocks.get(lockKey);

    if (existing && existing.expiresAt > now) {
      this.logger.warn(`⛔ Slot lock conflict (in-memory): ${lockKey}`);
      return { success: false, lockKey };
    }

    this.memoryLocks.set(lockKey, {
      key: lockKey,
      expiresAt: now + ttlSeconds * 1000,
    });

    this.logger.log(`🔒 Acquired in-memory slot lock: ${lockKey} (TTL: ${ttlSeconds}s)`);
    return { success: true, lockKey };
  }

  /**
   * Releases a temporary time-slot lock
   */
  async releaseSlotLock(lockKey: string): Promise<boolean> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.del(lockKey);
        this.logger.log(`🔓 Released Redis slot lock: ${lockKey}`);
        return true;
      } catch (err) {
        this.logger.error(`Redis error during releaseLock: ${(err as Error).message}`);
      }
    }

    this.memoryLocks.delete(lockKey);
    this.logger.log(`🔓 Released in-memory slot lock: ${lockKey}`);
    return true;
  }

  /**
   * Checks if a time slot is currently locked
   */
  async isSlotLocked(providerId: string, date: string, startTime: string): Promise<boolean> {
    const lockKey = this.getLockKey(providerId, date, startTime);

    if (this.isRedisConnected && this.redisClient) {
      try {
        const exists = await this.redisClient.exists(lockKey);
        return exists === 1;
      } catch (err) {
        this.logger.error(`Redis error during isSlotLocked: ${(err as Error).message}`);
      }
    }

    const lock = this.memoryLocks.get(lockKey);
    return !!lock && lock.expiresAt > Date.now();
  }
}
