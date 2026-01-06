const fs = require('fs');
const content = fs.readFileSync('.env', 'utf8');
const keys = content.split('\n').map(l => l.split('=')[0]);
console.log('Keys present in .env:', keys.join(', '));
if (!keys.includes('AUTH_GOOGLE_ID')) console.log('MISSING: AUTH_GOOGLE_ID');
if (!keys.includes('AUTH_GOOGLE_SECRET')) console.log('MISSING: AUTH_GOOGLE_SECRET');
