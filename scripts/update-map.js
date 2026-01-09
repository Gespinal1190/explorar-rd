
const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://raw.githubusercontent.com/ahuseyn/interactive-svg-maps/master/maps/DO.svg';
const outputPath = path.join(process.cwd(), 'src', 'components', 'destinations', 'dr-map-paths.ts');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        // Simple regex parse because we don't want to rely on heavy xml libs if not installed
        // Looking for <path ... d="..." name="..." ... />
        const pathRegex = /<path[^>]*d="([^"]+)"[^>]*name="([^"]+)"/g;
        const paths = [];
        let match;

        while ((match = pathRegex.exec(data)) !== null) {
            paths.push({
                name: match[2],
                d: match[1].replace(/\r?\n|\r/g, ' ') // Clean newlines in path data
            });
        }

        const fileContent = `// Auto-generated detailed map paths
export const DRPaths = ${JSON.stringify(paths, null, 4)};

// Combined outline for background (simplified)
export const DR_OUTLINE = DRPaths.map(p => p.d).join(" ");
export const DR_SOLID_BG = DR_OUTLINE; // Alias for compatibility
`;

        fs.writeFileSync(outputPath, fileContent);
        console.log(`Successfully wrote ${paths.length} province paths to ${outputPath}`);
    });
}).on('error', (err) => {
    console.error('Error downloading map data:', err);
    process.exit(1);
});
