import LRU from "lru-cache";
import { NextApiResponse } from "next";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRU({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 1000 * 60 * 5,
  });

  return {
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get("token") as number[]) || [0];

        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }

        tokenCount[0] += 1;

        const current = tokenCount[0];
        const isMeetLimit = current >= limit;

        res.setHeader("X-RateLimit-Limit", limit);
        res.setHeader(
          "X-RateLimit-Remaining",
          isMeetLimit ? 0 : limit - current
        );

        return isMeetLimit ? reject() : resolve();
      }),
  };
}
