# AI Companion Chatbot

A modern AI companion platform that allows users to create, customize, and chat with AI characters. Features include character creation, messaging, image generation, and a beautiful user interface.

![AI Companion Chatbot Screenshot](screenshot.png)

## Features

- **User Authentication**: Email + password login using Supabase Auth
- **Curated Character Library**: Browse and chat with pre-designed AI companions
- **Chat Interface**: Chat with your characters with persistent messages
- **Image Generation**: Generate images based on chat context
- **Modern UI**: Responsive design with animations and transitions
- **Mobile Friendly**: Fully responsive on all devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **UI/Animations**: TailwindCSS + Framer Motion
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **ORM**: Prisma
- **State Management**: React hooks
- **Hosting**: Deploy to Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ai-companion-chatbot.git
   cd ai-companion-chatbot
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Supabase (replace with your own keys in production)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Database (for local development, SQLite is used)
   DATABASE_URL="file:./dev.db"
   ```

4. Set up the database
   ```bash
   npx prisma db push
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Mode

For demonstration purposes, you can use the following credentials:
- Email: demo@example.com
- Password: demopassword

## Deployment

### Deploy to Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add the environment variables
4. Deploy

## Future Enhancements

- Voice chat capabilities
- More character customization options
- User preferences and settings
- Subscription tiers
- Admin dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by platforms like Character.AI and Candy.AI
- Built with modern web technologies
