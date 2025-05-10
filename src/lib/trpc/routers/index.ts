import { router } from '../server';
import { characterRouter } from './character';
import { chatRouter } from './chat';
import { userRouter } from './user';

export const appRouter = router({
  character: characterRouter,
  chat: chatRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
