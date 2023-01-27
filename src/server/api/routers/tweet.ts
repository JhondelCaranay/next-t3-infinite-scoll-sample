import { z } from "zod";
import { tweetSchema } from "../../../components/CreateTweet";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(tweetSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const userId = session.user.id;

      return await prisma.tweet.create({
        data: {
          text: input.text,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  timeline: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { cursor, limit } = input;

      const tweets = await prisma.tweet.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (tweets.length > limit) {
        const nextItem = tweets.pop() as (typeof tweets)[number];
        nextCursor = nextItem.id;
      }

      return {
        tweets,
        nextCursor,
      };
    }),
});
