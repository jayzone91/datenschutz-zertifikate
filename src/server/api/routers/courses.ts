import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const courseRouter = createTRPCRouter({
  getUncompleted: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany({
      where: {
        NOT: {
          Certificate: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
      include: {
        modules: {
          include: {
            questions: true,
          },
        },
      },
    });
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.course.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany({
      include: {
        modules: true,
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.course.findUnique({
        where: {
          id: input.id,
        },
        include: {
          modules: true,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.course.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), description: z.string().optional() })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.course.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
});
