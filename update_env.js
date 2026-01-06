const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const newDbUrl = 'postgresql://neondb_owner:npg_qj3PDTRNKUc6@ep-billowing-frost-a4vjx0vo-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

let content = '';
if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
}

if (content.match(/^DATABASE_URL=/m)) {
    content = content.replace(/^DATABASE_URL=.*/m, `DATABASE_URL="${newDbUrl}"`);
} else {
    content += `\nDATABASE_URL="${newDbUrl}"`;
}

// Ensure AUTH_SECRET exists if not present
if (!content.match(/^AUTH_SECRET=/m)) {
    content += `\nAUTH_SECRET="complex_secret_${Math.random().toString(36).slice(2)}"`;
}

fs.writeFileSync(envPath, content);
console.log('Successfully updated .env with new DATABASE_URL');
