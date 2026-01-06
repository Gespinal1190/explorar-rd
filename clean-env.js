const fs = require('fs');

try {
    const content = fs.readFileSync('.env', 'utf8');
    const lines = content.split('\n');
    const cleanLines = [];

    // We will preserve only valid looking keys and the ones we know
    const knownKeys = ['DATABASE_URL', 'AUTH_GOOGLE_ID', 'AUTH_GOOGLE_SECRET', 'AUTH_SECRET', 'AUTH_URL', 'AUTH_TRUST_HOST', 'NEXTAUTH_SECRET'];

    const envMap = {};

    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            let key = match[1].trim();
            let val = match[2].trim();
            // Remove wrapping quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            if (knownKeys.includes(key) && val) {
                envMap[key] = val;
            }
        }
    });

    // Hardcode corrections if needed
    if (!envMap['AUTH_URL']) envMap['AUTH_URL'] = 'http://localhost:3000';
    if (!envMap['AUTH_TRUST_HOST']) envMap['AUTH_TRUST_HOST'] = 'true';
    // Ensure we have a good secret
    if (!envMap['AUTH_SECRET']) envMap['AUTH_SECRET'] = 'your-secure-random-secret-key-123';
    // Sync NEXTAUTH_SECRET with AUTH_SECRET for legacy support if needed
    envMap['NEXTAUTH_SECRET'] = envMap['AUTH_SECRET'];

    let newContent = '';
    for (const [k, v] of Object.entries(envMap)) {
        newContent += `${k}="${v}"\n`;
    }

    fs.writeFileSync('.env', newContent);
    console.log('Cleaned .env file.');
    console.log('Keys retained:', Object.keys(envMap).join(', '));

} catch (e) {
    console.error('Error cleaning .env:', e);
}
