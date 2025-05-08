import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { input, character } = await req.json();

    // In a real implementation, this would call an AI API
    // For MVP, we'll return a placeholder response
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000); // Simulate API delay

    let reply = `As ${character.name}, I'm responding to: "${input}"`;
    
    if (character.personality) {
      // Incorporate character personality into the response
      if (character.personality.toLowerCase().includes('flirty')) {
        reply = `*winks* Hey there! ${reply} And can I just say, I love our conversations! What else is on your mind? 😉`;
      } else if (character.personality.toLowerCase().includes('sassy')) {
        reply = `Well, well, well... ${reply} I mean, what did you expect me to say? 💁`;
      } else if (character.personality.toLowerCase().includes('caring')) {
        reply = `*smiles warmly* ${reply} I'm here for you, always. How are you feeling today? 💕`;
      } else {
        reply = `${reply} How can I help you today?`;
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
