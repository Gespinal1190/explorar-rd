
const fs = require('fs');
const path = require('path');

const images = [
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Punta_Cana_beach.jpg/640px-Punta_Cana_beach.jpg", name: "punta-cana.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Cayo_Levantado.jpg/800px-Cayo_Levantado.jpg", name: "samana.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Alcazar_de_Col%C3%B3n_-_Santo_Domingo.jpg/640px-Alcazar_de_Col%C3%B3n_-_Santo_Domingo.jpg", name: "santo-domingo.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Fort_San_Felipe_Puerto_Plata.jpg/800px-Fort_San_Felipe_Puerto_Plata.jpg", name: "puerto-plata.jpg" }
];

async function download(url, dest) {
    console.log(`Fetching ${url}...`);
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'NodeDownloader/1.0' } });
        if (!res.ok) {
            console.error(`Failed: ${res.status} ${res.statusText}`);
            return;
        }
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`Saved ${dest} (${buffer.byteLength} bytes)`);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

async function main() {
    const dir = path.join(process.cwd(), 'public', 'images', 'destinations');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    for (const img of images) {
        await download(img.url, path.join(dir, img.name));
    }
}

main();
