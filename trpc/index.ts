
import {  router } from "./trpc";                                                                                     
import { projectRouter } from "@/app/api/routers/project";


export const appRouter = router({
    project : projectRouter,
});

export type AppRouter = typeof appRouter;