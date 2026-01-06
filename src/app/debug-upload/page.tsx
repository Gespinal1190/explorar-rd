"use client";

import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function DebugUploadPage() {
    const [status, setStatus] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState("");

    const addLog = (msg: string) => {
        setStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
        console.log(msg);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus([]);
        setProgress(0);
        setUrl("");
        addLog(`Selected file: ${file.name} (${file.size} bytes)`);

        try {
            const filename = `debug/${Date.now()}_${file.name}`;
            addLog(`Creating ref for: ${filename}`);
            const storageRef = ref(storage, filename);

            addLog("Starting upload task...");
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                    addLog(`Progress: ${progress.toFixed(2)}% (${snapshot.bytesTransferred}/${snapshot.totalBytes})`);

                    switch (snapshot.state) {
                        case 'paused': addLog('Upload is paused'); break;
                        case 'running': break; // Too noisy
                    }
                },
                (error) => {
                    addLog(`ERROR: ${error.code} - ${error.message}`);
                    console.error(error);
                },
                async () => {
                    addLog("Upload complete. Getting URL...");
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setUrl(downloadURL);
                        addLog(`Success! URL: ${downloadURL}`);
                    } catch (err: any) {
                        addLog(`Error getting URL: ${err.message}`);
                    }
                }
            );

        } catch (err: any) {
            addLog(`CRITICAL ERROR: ${err.message}`);
        }
    };

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-5">Debug Upload Isolation</h1>

            <div className="mb-5 p-4 border rounded bg-gray-50">
                <input
                    type="file"
                    onChange={handleUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {progress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {url && (
                <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded text-green-700 break-all">
                    <strong>Uploaded URL:</strong> <br />
                    <a href={url} target="_blank" rel="noopener noreferrer" className="underline">{url}</a>
                </div>
            )}

            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-64 overflow-y-auto">
                {status.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
                {status.length === 0 && <div className="text-gray-500">Ready to test...</div>}
            </div>
        </div>
    );
}
