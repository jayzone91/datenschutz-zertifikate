import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  adminGetUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  adminGetAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.is_admin) return null;

    return ctx.db.user.findMany();
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        is_admin: z.boolean(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;

      return ctx.db.user.update({
        data: {
          name: input.name,
          is_admin: input.is_admin,
          email: input.email,
        },
        where: {
          id: input.id,
        },
      });
    }),
  updateName: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        data: {
          name: input.name,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
});
