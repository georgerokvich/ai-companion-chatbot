# Running AI Companion Chatbot Locally

This guide will help your friend set up and run the AI Companion Chatbot on their local machine.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Git (optional, for cloning the repository)

## Option 1: Running from a ZIP File

If you've shared the project as a ZIP file:

1. **Extract the ZIP file** to a folder of your choice

2. **Open a command prompt or terminal**:
   - Navigate to the extracted folder:
   ```bash
   cd path/to/ai-companion-chatbot
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up the local database**:
   ```bash
   npx prisma db push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open in browser**:
   - Visit [http://localhost:3000](http://localhost:3000) in your web browser

## Option 2: Cloning from GitHub

If the project is available on GitHub:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/USERNAME/ai-companion-chatbot.git
   cd ai-companion-chatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the local database**:
   ```bash
   npx prisma db push
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   - Visit [http://localhost:3000](http://localhost:3000) in your web browser

## Demo Credentials

For testing purposes, you can use the following login:
- Email: demo@example.com
- Password: demopassword

## Common Issues and Solutions

### Port 3000 is Already in Use

If port 3000 is already being used by another application, Next.js will automatically try to use another port (like 3001). Check the terminal output for the correct URL.

### Node Version Issues

If you see errors related to Node.js versions:
1. Check your Node.js version:
   ```bash
   node --version
   ```
2. If it's below v18, install a newer version from [nodejs.org](https://nodejs.org/)

### Database Initialization Problems

If you encounter database issues:
1. Delete the `prisma/dev.db` file if it exists
2. Run the database setup command again:
   ```bash
   npx prisma db push
   ```

### Module Not Found Errors

If you see "module not found" errors:
1. Make sure you've run `npm install` successfully
2. Try deleting the `node_modules` folder and running `npm install` again

### Images Not Displaying

The placeholder images are loaded from external URLs. If they don't appear:
1. Check your internet connection
2. If behind a corporate firewall, some image URLs might be blocked

## Exploring the Application

1. **Home Page**: The landing page showcasing AI companions
2. **Login/Register**: Authentication screens
3. **Dashboard**: View your created companions
4. **Character Creation**: Design your own AI companion
5. **Chat Interface**: Talk with your AI companions

## Modifying the Project (For Developers)

- **Frontend Code**: Located in `src/app`
- **Components**: Found in `src/components`
- **API Routes**: Located in `src/app/api`
- **Database Schema**: Defined in `prisma/schema.prisma`

## Need Help?

If you encounter any issues not covered here, please contact the project creator for assistance.
