import 'dotenv/config';

console.log('=== NextAuth v5 Environment Variables Check ===\n');

const requiredVars = {
    'AUTH_SECRET': process.env.AUTH_SECRET,
    'AUTH_GOOGLE_ID': process.env.AUTH_GOOGLE_ID,
    'AUTH_GOOGLE_SECRET': process.env.AUTH_GOOGLE_SECRET,
    'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
};

let allPresent = true;

for (const [key, value] of Object.entries(requiredVars)) {
    if (value) {
        console.log(`✅ ${key}: ${value.substring(0, 10)}... (${value.length} chars)`);
    } else {
        console.log(`❌ ${key}: MISSING`);
        allPresent = false;
    }
}

console.log('\n=== Diagnosis ===');
if (allPresent) {
    console.log('✅ All required variables are present');
    console.log('\nIf Google Auth still fails with "Configuration" error:');
    console.log('1. Make sure AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET are from Google Cloud Console');
    console.log('2. Verify redirect URI in Google Console includes: http://localhost:3000/api/auth/callback/google');
    console.log('3. Check that the Google OAuth consent screen is configured');
} else {
    console.log('❌ Missing required variables. Add them to .env file:');
    console.log('\nAUTH_SECRET=your-secret-here');
    console.log('AUTH_GOOGLE_ID=your-google-client-id');
    console.log('AUTH_GOOGLE_SECRET=your-google-client-secret');
    console.log('NEXTAUTH_URL=http://localhost:3000');
}
