const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log("--- START .env ---");
    console.log(content);
    console.log("--- END .env ---");
} catch (e) {
    console.error("Error reading .env:", e);
}
