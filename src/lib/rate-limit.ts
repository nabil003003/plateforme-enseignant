interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory cache for rate limiting
const store = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit: number; // Max allowed requests
  windowSeconds: number; // Time window in seconds
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowSeconds: 60 }
): { success: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const key = `${identifier}`;
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    // New or expired window
    store.set(key, {
      count: 1,
      resetAt: now + options.windowSeconds * 1000,
    });
    return {
      success: true,
      remaining: options.limit - 1,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= options.limit) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: options.limit - record.count,
    retryAfterSeconds: 0,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
