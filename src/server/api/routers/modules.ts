import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const moduleRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.module.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.module.findMany({
      include: {
        questions: true,
        Course: true,
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.module.findUnique({
        where: {
          id: input.id,
        },
        include: {
          questions: true,
          Course: true,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        courseId: z.string(),
        type: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.module.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          courseId: input.courseId,
          type: input.type,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        type: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.module.create({
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
          courseId: input.id,
        },
      });
    }),
});
