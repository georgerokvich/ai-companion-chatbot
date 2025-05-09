import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import { prisma } from '../../prisma/client';
import { mockCharacters } from '../../mock-data/characters';

export const characterRouter = router({
  // Create a new character
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        personality: z.string().min(1, 'Personality is required'),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.character.create({
        data: {
          ...input,
          userId: ctx.userId,
        },
      });
    }),

  // Get all characters
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // For demo mode, always return mock characters
    return mockCharacters;
  }),

  // Get a character by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // For demo mode, return mock character
      const mockCharacter = mockCharacters.find(char => char.id === input.id);
      if (mockCharacter) {
        return mockCharacter;
      }
      // If no matching mock character, return the first one
      return mockCharacters[0];
    }),

  // Update a character
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required').optional(),
        description: z.string().min(1, 'Description is required').optional(),
        personality: z.string().min(1, 'Personality is required').optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return prisma.character.update({
        where: {
          id,
          userId: ctx.userId,
        },
        data: updateData,
      });
    }),

  // Delete a character
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.character.delete({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });
    }),
});
