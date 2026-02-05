#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const os = require('os');
const archiver = require('archiver');
const readline = require('readline');
const ANDROID_BUILD_URL = "https://fandroidbuild-jqycakhlxa-uc.a.run.app";
const IOS_BUILD_URL = "https://fiosbuild-jqycakhlxa-uc.a.run.app";
const UPDATE_NETWORK_URL = 'https://updatedevelopernetwork-jqycakhlxa-uc.a.run.app';
const ALEX_ENGINE_URL = "https://generatenativemodule-jqycakhlxa-uc.a.run.app";
const INJECT_DEPS_URL = "https://savegeneratedfile-jqycakhlxa-uc.a.run.app";
const APP_JS_PATH = path.join(process.cwd(), 'src/App.js'); 
const PORT = 3000;
let uplinkProcess = null;
const args = process.argv.slice(2);
const command = args[0];
process.env.DOTENV_SILENT = 'true';
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
    console.error('\x1b[31m%s\x1b[0m', ' Error: Configuration file (.env) not found.');
    process.exit(1);
}
dotenv.config({ path: envPath, quiet: true });
const projectId = process.env.REACT_APP_ENTERPRISE_ID; 
const keyApp = process.env.REACT_KEY_APP; 
const testerEmail = process.env.REACT_APP_TESTER_EMAIL;
const wrapText = (text, maxWidth) => {
    if (!text) return "";
    const rawLines = text.split('\n'); 
    let formattedLines = [];
    rawLines.forEach(line => {
        if (line.trim().length === 0) {
            formattedLines.push("");
            return;
        }
        const isSpecialFormat = /^[\s]*[-*•\d]/.test(line) || line.startsWith("    ");
        if (isSpecialFormat) {
            formattedLines.push(line);
        } else {
            const words = line.split(" ");
            let currentLine = words[0];
            for (let i = 1; i < words.length; i++) {
                if (currentLine.length + 1 + words[i].length <= maxWidth) {
                    currentLine += " " + words[i];
                } else {
                    formattedLines.push(currentLine);
                    currentLine = words[i];
                }
            }
            formattedLines.push(currentLine);
        }
    });
    return formattedLines.join('\n   ');
};
const checkGitSecurity = () => {
    const gitDir = path.join(process.cwd(), '.git');
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitDir)) {
        if (!fs.existsSync(gitignorePath)) {
            console.error('\n\x1b[31m🚨 SECURITY ALERT:\x1b[0m .git detected but no .gitignore found.');
            process.exit(1);
        }
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        if (!gitignoreContent.includes('.env')) {
            console.error('\n\x1b[31m🚨 CRITICAL RISK:\x1b[0m .env is NOT ignored by Git.');
            process.exit(1);
        }
    }
};
if (!projectId) {
    console.error('\n Error: Project ID missing in .env.\n');
    process.exit(1);
}
const injectRouteIntoAppJs = (pageName, subPath = '') => {
    if (!fs.existsSync(APP_JS_PATH)) return false;
    let content = fs.readFileSync(APP_JS_PATH, 'utf8');
    const importAnchor = '// FLEETBO_MORE_IMPORTS';
    const alexRouteAnchor = '{/* FLEETBO_DYNAMIC ROUTES */}';
    if (!content.includes(alexRouteAnchor)) return false;
    // Chemin dynamique selon si c'est une page ou un mock
    const pathPrefix = subPath ? `${subPath}/` : '';
    const importLine = `import ${pageName} from './app/${pathPrefix}${pageName}';`; 
    const routeLine = `<Route path="/${pathPrefix.toLowerCase()}${pageName.toLowerCase()}" element={<${pageName} />} />`;
    let injected = false;
    if (!content.includes(importLine)) {
        content = content.replace(importAnchor, `${importLine}\n${importAnchor}`);
        injected = true;
    }
    if (!content.includes(routeLine)) {
        // Injection précise dans l'ancre Alex
        content = content.replace(alexRouteAnchor, `${routeLine}\n            ${alexRouteAnchor}`);
        injected = true;
    }
    if (injected) fs.writeFileSync(APP_JS_PATH, content);
    return injected;
};
const showEnergyTransfer = async () => {
    const width = 30;
    for (let i = 0; i <= width; i++) {
        const dots = "█".repeat(i); const empty = "░".repeat(width - i);
        process.stdout.write(`\r   \x1b[32m⚡ Alex Energy Sync:\x1b[0m [${dots}${empty}] ${Math.round((i / width) * 100)}%`);
        await new Promise(r => setTimeout(r, 45));
    }
    process.stdout.write('\n');
};
if (command === 'alex') {
    checkGitSecurity();
    const initialPrompt = args.slice(1).join(' ');
    const processAlexRequest = async (prompt) => {
        if (prompt.length > 300) {
            console.log('\n\x1b[31m⛔ [Alex Safety] Request too long (' + prompt.length + '/300 chars).\x1b[0m');
            console.log('\x1b[90mAlex prefers concise instructions. Please summarize.\x1b[0m');
            return;
        }
        process.stdout.write('\x1b[33m🧠 Alex is thinking...\x1b[0m');
        try {
            const result = await axios.post(ALEX_ENGINE_URL, { prompt, projectType: 'android' }, {
                headers: { 'x-project-id': projectId }
            });
            const aiData = result.data;
            process.stdout.write('\r' + ' '.repeat(50) + '\r'); 
            if (aiData.status === 'quota_exceeded') {
                console.log(`\n\x1b[31m⛔ ARCHITECT QUOTA REACHED:\x1b[0m ${aiData.message}`);
                return;
            }
            if (aiData.status === 'success' || aiData.status === 'message' || aiData.status === 'complex_refusal') {
                console.log(''); 
                const rawMsg = aiData.message || "I'm ready.";
                const formattedMsg = wrapText(rawMsg, 85);
                console.log('\x1b[32mAlex ❯\x1b[0m '+formattedMsg);

                if (aiData.remainingConsultations !== undefined) {
                    const remaining = aiData.remainingConsultations;
                    const limit = aiData.consultationLimit || 7; 
                    const tierLabel = aiData.tier === 'pro' ? 'SENIOR' : 'JUNIOR';
                    const percent = Math.round((remaining / limit) * 100);
                    const energyColor = percent > 20 ? '\x1b[32m' : '\x1b[31m';
                    console.log(`\x1b[36m⚡ Architect Fuel:\x1b[0m ${energyColor}${percent}%\x1b[0m (${remaining}/${limit} instructions left) [${tierLabel}]`);
                    console.log('');
                }
            }
            if (aiData.status === 'success' && aiData.moduleData) {
                const { fileName, code, mockFileName, mockCode, moduleName, instructions, config_offload } = aiData.moduleData;
                console.log(`   \x1b[90m  Architecting: ${moduleName}[0m`);
                const writeFile = (dir, name, content) => {
                const fullPath = path.join(process.cwd(), dir);
                const filePath = path.join(fullPath, name);
                if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
                    fs.writeFileSync(filePath, content);
                    console.log(`   [32m[Written][0m ${dir}${name}`);
                };
                if (instructions && Array.isArray(instructions) && instructions.length > 0) {
                    console.log('\n\x1b[33m--- GUIDE (MCI) ---\x1b[0m');
                    instructions.forEach(line => {
                        if (typeof line === 'string') {
                            const formattedLine = line.replace(/ACTION|CAPTURE|PERSPECTIVE/g, '\x1b[1m$&\x1b[0m');
                            console.log(`   ${formattedLine}`);
                        }
                    });
                }
                if (code && fileName) {
                    const folder = fileName.endsWith('.kt') ? 'public/native/android/' : 'src/app/';
                    writeFile(folder, fileName, code);
                    if (fileName.endsWith('.jsx')) injectRouteIntoAppJs(fileName.replace('.jsx', ''));
                }
                if (mockCode && mockFileName) {
                    const pageName = mockFileName.replace('.jsx', '');
                    writeFile('src/app/mocks/', mockFileName, mockCode);
                    const injected = injectRouteIntoAppJs(pageName, 'mocks');
                    if (injected) {
                        console.log(`   \x1b[32m[Routed][0m App.js -> /mocks/${pageName.toLowerCase()}`);
                    }
                }
                if (config_offload && (config_offload.dependencies?.length > 0 || config_offload.permissions?.length > 0)) {
                    process.stdout.write(`   \x1b[33m[Cloud Inject]\x1b[0m Syncing ${config_offload.dependencies.length} libs to Factory...`);
                    try {
                        await axios.post(INJECT_DEPS_URL, {
                            projectId: projectId,
                            fileData: { 
                                path: fileName, 
                                config_offload: config_offload 
                            }
                        });
                        process.stdout.write(` \x1b[32mOK\x1b[0m\n`);
                    } catch (err) {
                        process.stdout.write(` \x1b[31mFAILED\x1b[0m\n`);
                        console.error(`   ⚠️ Config sync failed: ${err.message}`);
                    }
                }
            }
        } catch (error) { 
            process.stdout.write('\r' + ' '.repeat(50) + '\r');
            console.error('\n\x1b[31m Alex Error:\x1b[0m ' + (error.response?.data?.message || error.message)); 
        }
    };
    const startAlexSession = async () => {
        process.stdout.write('\x1b[33m🛡️  Alex is checking runtime state...\x1b[0m\r');
        let attempts = 0;
        const maxAttempts = 5;
        let isReady = false;
        let dynamicUsername = 'Pilot';
        while (attempts < maxAttempts && !isReady) {
            try {
                const validation = await axios.post(ALEX_ENGINE_URL, { 
                    prompt: "ping", validateProject: true, checkNetwork: true, projectKey: keyApp
                }, { headers: { 'x-project-id': projectId }, timeout: 5000 });

                if (validation.data?.isRunning) { isReady = true; dynamicUsername = validation.data.username || 'Pilot'; break; }
                attempts++;
                if (attempts < maxAttempts) await new Promise(r => setTimeout(r, 2000));
            } catch (error) {
                attempts++;
                await new Promise(r => setTimeout(r, 2000));
            }
        }
        if (!isReady) {
            console.error('\n\x1b[31m⚠️  ENGINE OFFLINE:\x1b[0m Start Fleetbo runtime first: "npm run fleetbo" ');
            console.error(`\x1b[90m(Ensure you are running the runtime for project: ${keyApp})\x1b[0m`);
            process.exit(1);
        }
        process.stdout.write(' '.repeat(60) + '\r'); 
        console.log('\n\x1b[32m🤖 Alex is now online.\x1b[0m');
        console.log('\x1b[32mAlex ❯\x1b[0m Infrastructure online. I am ready to forge. What module are we architecting today, Pilot?');
        console.log(''); 
        const rl = readline.createInterface({ 
            input: process.stdin, 
            output: process.stdout,
            prompt: `\x1b[34m${dynamicUsername} ❯ \x1b[0m` 
        });
        process.stdout.write('\n\x1b[F');
        rl.prompt();
        rl.on('line', async (line) => {
            if (['exit', 'quit'].includes(line.trim().toLowerCase())) { 
                console.log('\n\x1b[90m Alex session closed.\x1b[0m');
                rl.close(); 
                return; 
            }
            if (line.trim()) {
                await processAlexRequest(line.trim());
                console.log(''); 
            }
            process.stdout.write('\n\x1b[F');
            rl.prompt();
        }).on('close', () => {
            process.exit(0);
        });
    };

    if (!initialPrompt || initialPrompt === '?') startAlexSession();
    else processAlexRequest(initialPrompt);
    return;
}
if (command === 'android' || command === 'ios') {
    checkGitSecurity();
    const platform = command;
    const nativeDir = platform === 'android' ? 'public/native/android/' : 'public/native/ios/'; //
    const extension = platform === 'android' ? '.kt' : '.swift';
    const fullPath = path.join(process.cwd(), nativeDir);
    let hasNativeFiles = false;
    if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        hasNativeFiles = files.some(file => file.endsWith(extension));
    }
   if (!hasNativeFiles) {
        console.log(`\n\x1b[31m⚠️  ENGINE INCOMPLETE:\x1b[0m No native blueprints detected for \x1b[1m${platform.toUpperCase()}\x1b[0m.`);
        console.log(`\x1b[90mAlex must architect at least one ${extension} module before deployment.\x1b[0m\n`);
        process.exit(1);
    }
    const targetUrl = platform === 'android' ? ANDROID_BUILD_URL : IOS_BUILD_URL;
    (async () => {
        console.log(`\n\x1b[36m⚡ FLEETBO ${platform.toUpperCase()} UPLINK\x1b[0m`);
        try {
            execSync('npm run build', { stdio: 'inherit' });
            let buildDir = fs.existsSync(path.join(process.cwd(), 'dist')) ? 'dist' : 'build';
            const zipBuffer = await new Promise((resolve, reject) => {
                const chunks = []; const archive = archiver('zip', { zlib: { level: 9 } });
                archive.on('data', chunk => chunks.push(chunk));
                archive.on('end', () => resolve(Buffer.concat(chunks)));
                archive.directory(path.join(process.cwd(), buildDir), false);
                archive.finalize();
            });
            console.log(`\n\x1b[33mSyncing ${platform} logic bundle...\x1b[0m`);
            await showEnergyTransfer();
            
            const res = await axios.post(targetUrl, zipBuffer, { 
                headers: { 'Content-Type': 'application/zip', 'x-project-id': projectId } 
            });
            
            if (res.data.success) {
                console.log(`\n\x1b[1m${platform.toUpperCase()} DEPLOYED\x1b[0m | \x1b[32mAlex ❯\x1b[0m Runtime updated.`);
            }
        } catch (error) { 
            console.error(`\n\x1b[31m Build Error:\x1b[0m ${error.response?.data?.error || error.message}`);
            process.exit(1); 
        }
    })();
    return;
}
const GENERATOR_COMMANDS = ['page', 'g', 'generate', 'android', 'ios'];
if (GENERATOR_COMMANDS.includes(command)) {
    try { require('./page.js'); } catch (e) { console.error(e.message); process.exit(1); }
    return; 
}
const NULL_DEV = process.platform === 'win32' ? '>nul 2>&1' : '2>/dev/null';
function killProcessOnPort(port) {
    try {
        if (process.platform !== 'win32') {
            const pid = execSync(`lsof -ti:${port} ${NULL_DEV}`).toString().trim();
            if (pid) execSync(`kill -9 ${pid.split('\n').join(' ')} ${NULL_DEV}`);
        }
    } catch (e) {}
}
const killNetworkService = () => {
    if (uplinkProcess) {
        try {
            uplinkProcess.kill('SIGINT'); 
            console.log('[Fleetbo] Engine closed.');
        } catch (e) {
            console.error('[Fleetbo] Error closing tunnel:', e.message);
        }
    }
};
let isExiting = false;
async function cleanupAndExit(code = 0) {
    if (isExiting) return;
    isExiting = true;
    console.log('\n\x1b[33m[Fleetbo] 🛑 Stopping environment & Cleaning Uplink...\x1b[0m');
    try {
        await axios.post(UPDATE_NETWORK_URL, { keyApp, networkUrl: '', tester: testerEmail });
        console.log('\x1b[32m[Fleetbo]  Network status reset to offline.\x1b[0m');
    } catch (e) {
        console.error('[Fleetbo] Network cleanup warning:', e.message);
    }
    killNetworkService();
    killProcessOnPort(PORT);
    console.log('[Fleetbo] Bye.');
    process.exit(code);
}
process.on('SIGINT', () => cleanupAndExit(0));
process.on('SIGTERM', () => cleanupAndExit(0));
async function syncFirebase(keyApp, networkUrl, testerEmail) {
    try {
        await axios.post(UPDATE_NETWORK_URL, { keyApp, networkUrl, tester: testerEmail });  
        console.log(`\n\x1b[32m[Fleetbo]\x1b[0m -------------------------------------------------------------`);
        console.log('\x1b[32m[Fleetbo]  GO GO GO ! FLEETBO STUDIO IS READY \x1b[0m');
        console.log('\x1b[32m[Fleetbo]  You can now start coding and previewing in Studio. 🚀\x1b[0m');
        console.log(`\x1b[32m[Fleetbo]\x1b[0m -------------------------------------------------------------`);
    } catch (err) {
        console.error(`[Fleetbo] Sync Error: ${err.message}`);
    }
}
async function runDevEnvironment() {
    console.log(`[Fleetbo] 🛡️  Initializing Dev Environment...`);
    killNetworkService();
    killProcessOnPort(PORT);
    
    if (!testerEmail) { console.error('Error: REACT_APP_TESTER_EMAIL missing'); process.exit(1); }
    
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const devServer = spawn(npmCmd, ['start'], {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
        env: { 
            ...process.env, 
            BROWSER: 'none', 
            PORT: PORT.toString(),
            DANGEROUSLY_DISABLE_HOST_CHECK: 'true',
            HOST: '0.0.0.0',      
            WDS_SOCKET_HOST: 'localhost',
            WDS_SOCKET_PORT: PORT.toString()
        }
    });

    devServer.stdout.pipe(process.stdout);
    devServer.stderr.pipe(process.stderr);

    let connectionStarted = false;
    devServer.stdout.on('data', (data) => {
        const output = data.toString();
        
        if (!connectionStarted && (output.includes('Local:') || output.includes('Compiled successfully'))) {
            connectionStarted = true;

            console.log('\n[Fleetbo] ---------------------------------------------------');
            console.log(`[Fleetbo] 🔗 Establishing Secure Uplink...`);
            console.log(`[Fleetbo] ⏳ Please wait for the green message...`);
            console.log('[Fleetbo] ---------------------------------------------------');

            const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
            uplinkProcess = spawn(npxCmd, [
                'cloudflared', 
                'tunnel', 
                '--url', `http://127.0.0.1:${PORT}`,
                '--http-host-header', `127.0.0.1:${PORT}` 
            ], { shell: true });

            uplinkProcess.stderr.on('data', (chunk) => {
                 const text = chunk.toString();
                 const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
                 if (match) syncFirebase(process.env.REACT_KEY_APP, match[0], process.env.REACT_APP_TESTER_EMAIL);
            });
        }
    });
}

runDevEnvironment();
