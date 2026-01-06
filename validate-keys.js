const fs = require('fs');
const dotenv = require('dotenv');

const config = dotenv.parse(fs.readFileSync('.env'));

console.log('--- VALIDATION REPORT ---');

const id = config.AUTH_GOOGLE_ID || '';
const secret = config.AUTH_GOOGLE_SECRET || '';

console.log('ID length:', id.length);
console.log('ID ends with .apps.googleusercontent.com?', id.endsWith('.apps.googleusercontent.com'));
if (!id.endsWith('.apps.googleusercontent.com')) {
    console.log('WARNING: ID does not look like a standard Google Client ID.');
    console.log('ID suffix (last 10 chars):', id.slice(-10));
}

console.log('Secret starts with GOCSPX-?', secret.startsWith('GOCSPX-'));
console.log('Secret length:', secret.length);

if (id.includes(secret) && secret.length > 5) {
    console.log('CRITICAL: ID seems to contain the Secret!');
}

console.log('--- END REPORT ---');
