import { NextResponse } from 'next/server';
import { mockUserPreferences } from '@/lib/mock-data/user-preferences';

export async function POST(req: Request) {
  try {
    const { input, character, userPreferences } = await req.json();

    // In a real implementation, this would call an AI API
    // For MVP, we'll return a placeholder response
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000); // Simulate API delay
    
    // Get user preferences from the request or use mock data
    const preferences = userPreferences || {
      displayName: mockUserPreferences.displayName,
      gender: mockUserPreferences.gender
    };

    // Generate a personalized greeting based on user preferences
    let greeting = '';
    if (preferences.displayName) {
      greeting = `${preferences.displayName}, `;
    }
    
    // Adjust responses based on user gender if specified
    let genderAdjustedResponse = '';
    if (preferences.gender === 'male') {
      genderAdjustedResponse = ' I appreciate having a gentleman to chat with!';
    } else if (preferences.gender === 'female') {
      genderAdjustedResponse = ' It\'s lovely to chat with a lady like you!';
    }

    let reply = `As ${character.name}, I'm responding to: "${input}"`;
    
    if (character.personality) {
      // Incorporate character personality into the response
      if (character.personality.toLowerCase().includes('flirty')) {
        reply = `*winks* Hey ${greeting ? greeting : 'there'}! ${reply} And can I just say, I love our conversations!${genderAdjustedResponse} What else is on your mind? 😉`;
      } else if (character.personality.toLowerCase().includes('sassy')) {
        reply = `Well, well, well... ${greeting ? greeting : ''} ${reply} I mean, what did you expect me to say?${genderAdjustedResponse} 💁`;
      } else if (character.personality.toLowerCase().includes('caring')) {
        reply = `*smiles warmly* ${greeting ? greeting : ''} ${reply} I'm here for you, always.${genderAdjustedResponse} How are you feeling today? 💕`;
      } else {
        reply = `${greeting ? greeting : ''} ${reply}${genderAdjustedResponse} How can I help you today?`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
