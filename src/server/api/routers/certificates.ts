import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const certificateRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.is_admin) return null;

    return ctx.db.certificate.findMany({
      include: {
        user: true,
        course: true,
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) return null;
      return ctx.db.certificate.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
          course: true,
        },
      });
    }),
  getUserCertificates: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.certificate.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        course: true,
      },
    });
  }),
  // create: protectedProcedure
  //   .input(
  //     z.object({
  //       text: z.string().min(1),
  //       correct: z.boolean(),
  //       questionId: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.answer.create({
  //       data: {
  //         text: input.text,
  //         correct: input.correct,
  //         questionId: input.questionId,
  //       },
  //     });
  //   }),
});
