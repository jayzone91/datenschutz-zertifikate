import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const answerRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.answer.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.answer.findMany({
        where: {
          questionId: input.questionId,
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.answer.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Question: {
            include: {
              Module: {
                include: {
                  Course: true,
                },
              },
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string().min(1),
        correct: z.boolean(),
        questionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.answer.update({
        where: {
          id: input.id,
        },
        data: {
          correct: input.correct,
          text: input.text,
          questionId: input.questionId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        correct: z.boolean(),
        questionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.answer.create({
        data: {
          text: input.text,
          correct: input.correct,
          questionId: input.questionId,
        },
      });
    }),
});
