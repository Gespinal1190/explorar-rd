import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'; // Need to install dotenv if not present, but next includes it.
// Or just read file raw.

const envPath = path.join(process.cwd(), '.env');
try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log("--- START .env ---");
    console.log(content);
    console.log("--- END .env ---");
} catch (e) {
    console.error("Error reading .env:", e);
}
