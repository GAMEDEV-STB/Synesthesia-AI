import { LRUCache } from "lru-cache";

type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

export const rateLimit = (options?: Options) => {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    return {
        check: (limit: number, token: string) => {
            const tokenCount = (tokenCache.get(token) as number[]) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, [1]);
            } else {
                tokenCount[0] += 1;
                tokenCache.set(token, tokenCount);
            }
            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage > limit;
            return {
                isRateLimited,
                limit,
                remaining: isRateLimited ? 0 : limit - currentUsage,
            };
        },
    };
};

// Singleton instance for the app
export const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second unique
});
