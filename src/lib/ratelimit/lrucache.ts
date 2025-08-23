import { LRUCache } from "lru-cache";

export const ConfiguredLRUCacheRateLimit = LRUCacheRateLimit({
    duration: 1,
    limit: 25,
});

export const ConfiguredVerificationCodeLRUCacheRateLimit = LRUCacheRateLimit({
    duration: 20,
    limit: 5,
});

export const ConfiguredLoginLRUCacheRateLimit = LRUCacheRateLimit({
    duration: 1,
    limit: 2,
});

export const DashboardLRUCacheRateLimit = LRUCacheRateLimit({
    duration: 4,
    limit: 10,
});

export const EmailLRUCacheRateLimit = AdvancedLRUCacheRateLimit({
    duration: 120,
    limit: 1,
});

export const ResetLRUCacheRateLimit = AdvancedLRUCacheRateLimit({
    duration: 120,
    limit: 1,
});

export function LRUCacheRateLimit({
    duration,
    limit,
}: {
    duration: number;
    limit: number;
}): (token: string) => boolean {
    const tokenCache = new LRUCache({
        max: 500,
        ttl: duration * 1000,
    });

    return (token: string) => {
        const tokensCount = (tokenCache.get(token)) as (number[]) ?? [0];

        if (tokensCount[0] === 0) {
            tokenCache.set(token, tokensCount);
        }

        tokensCount[0] += 1;

        const currentUsage = tokensCount[0];

        return currentUsage > limit;
    };
}

export function AdvancedLRUCacheRateLimit({
    duration,
    limit,
}: {
    duration: number;
    limit: number;
}): {
    decrement: (token: string) => void;
    increment: (token: string) => boolean;
} {
    const tokenCache = new LRUCache({
        max: 500,
        ttl: duration * 1000,
    });

    return {
        decrement: (token: string) => {
            const tokensCount = (tokenCache.get(token)) as (number[]) ?? [0];

            if (tokensCount[0] <= 0) {
                return;
            }

            tokensCount[0] -= 1;
        },
        increment: (token: string) => {
            const tokensCount = (tokenCache.get(token)) as (number[]) ?? [0];

            if (tokensCount[0] === 0) {
                tokenCache.set(token, tokensCount);
            }

            tokensCount[0] += 1;

            const currentUsage = tokensCount[0];

            return currentUsage > limit;
        },
    };
}