// This script ensures Prisma is properly set up during deployment
const { execSync } = require('child_process');

console.log('🔄 Setting up Prisma...');

try {
  // Generate Prisma client
  console.log('📝 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Create an initial SQLite database (optional, can be removed for production)
  try {
    console.log('🗄️ Creating initial database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database schema pushed successfully.');
  } catch (dbError) {
    console.warn('⚠️ Warning: Could not push database schema. This is expected in readonly environments like Vercel.');
    console.warn('⚠️ The app will still work with proper database connection strings in production.');
  }

  console.log('✅ Prisma setup completed.');
} catch (error) {
  console.error('❌ Error setting up Prisma:', error);
  process.exit(1);
}
