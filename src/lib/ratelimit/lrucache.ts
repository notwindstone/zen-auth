import { LRUCache } from "lru-cache";

export const ConfiguredLRUCacheRateLimit = LRUCacheRateLimit({
    duration: 1,
    limit: 10,
});

export const ConfiguredLoginLRUCacheRateLimit = LRUCacheRateLimit({
    duration: 1,
    limit: 2,
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