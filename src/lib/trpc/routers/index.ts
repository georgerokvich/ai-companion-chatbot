import { router } from '../server';
import { characterRouter } from './character';
import { chatRouter } from './chat';

export const appRouter = router({
  character: characterRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
