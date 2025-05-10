import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import { prisma } from '../../prisma/client';
import { mockUserPreferences, updateMockUserPreferences } from '../../mock-data/user-preferences';

export const userRouter = router({
  // Get user preferences
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    // For demo mode, use mock user preferences
    return {
      displayName: mockUserPreferences.displayName,
      gender: mockUserPreferences.gender,
      hasCompletedOnboarding: mockUserPreferences.hasCompletedOnboarding,
    };
    
    // In a real app, this would fetch from the database
    // return prisma.user.findUnique({
    //   where: {
    //     id: ctx.userId,
    //   },
    //   select: {
    //     displayName: true,
    //     gender: true,
    //     hasCompletedOnboarding: true,
    //   },
    // });
  }),
  
  // Update user preferences
  updatePreferences: protectedProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
        gender: z.enum(['male', 'female', 'other', 'unspecified']).optional(),
        hasCompletedOnboarding: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // For demo mode, update mock user preferences
      return updateMockUserPreferences(input);
      
      // In a real app, this would update the database
      // return prisma.user.update({
      //   where: {
      //     id: ctx.userId,
      //   },
      //   data: input,
      // });
    }),
});
