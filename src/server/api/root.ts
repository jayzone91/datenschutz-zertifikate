import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { answerRouter } from "./routers/answers";
import { certificateRouter } from "./routers/certificates";
import { courseRouter } from "./routers/courses";
import { moduleRouter } from "./routers/modules";
import { questionRouter } from "./routers/qestions";
import { userRouter } from "./routers/user";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  course: courseRouter,
  module: moduleRouter,
  question: questionRouter,
  answer: answerRouter,
  certificate: certificateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
