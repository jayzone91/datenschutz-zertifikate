import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.question.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.question.findMany({
      include: {
        answers: true,
        Module: {
          include: {
            Course: true,
          },
        },
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.question.findUnique({
        where: {
          id: input.id,
        },
        include: {
          answers: true,
          Module: {
            include: {
              Course: true,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        moduleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.question.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.name,
          description: input.description,
          moduleId: input.moduleId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        moduleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.question.create({
        data: {
          title: input.name,
          description: input.description,
          moduleId: input.moduleId,
        },
      });
    }),
});
