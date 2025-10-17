#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const os = require('os');
const path = require('path');

let geminiApiKey = process.env.GEMINI_API_KEY;

// Try to read API key from ~/.gemini/settings.json if not set in environment
if (!geminiApiKey) {
    const settingsPath = path.join(os.homedir(), '.gemini', 'settings.json');
    try {
        const settingsContent = fs.readFileSync(settingsPath, 'utf8');
        const settings = JSON.parse(settingsContent);
        geminiApiKey = settings.geminiApiKey;
    } catch (err) {
        // Ignore if file not found or parsing error, will fall through to final error check
    }
}

if (!geminiApiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not set, and could not be read from ~/.gemini/settings.json.');
    process.exit(1);
}

// 1. Get git log
// Using a format that gives hash, subject, and author.
exec('git log --pretty=format:"%h - %s (%an)"', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error getting git log: ${error.message}`);
        process.exit(1);
    }
    if (stderr) {
        // git log can sometimes write to stderr for warnings, so just log it.
        console.warn(`Git log stderr: ${stderr}`);
    }

    const gitLog = stdout;

    if (!gitLog.trim()) {
        console.log('No git commits to generate a changelog from.');
        process.exit(0);
    }

    // 2. Use Gemini to generate changelog
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
    Based on the following git log, create a changelog in Markdown format.
    The changelog should be suitable for a CHANGELOG.md file.
    Group changes by type (e.g., "Features", "Bug Fixes", "Refactoring", "Documentation").
    Each item should be a bullet point with the commit message.

    Git Log:
    ---
    ${gitLog}
    ---
    `;

    console.log('Generating changelog with Gemini...');

    model.generateContent(prompt).then(result => {
        if (result.response && result.response.text) {
            const changelogContent = result.response.text();

            // 3. Write to CHANGELOG.md
            fs.writeFile('CHANGELOG.md', changelogContent, (err) => {
                if (err) {
                    console.error('Error writing to CHANGELOG.md:', err);
                    process.exit(1);
                } else {
                    console.log('CHANGELOG.md generated successfully.');
                }
            });
        } else {
            console.error('Error: Gemini API did not return valid content.');
            console.error('Full API Response:', JSON.stringify(result, null, 2));
            process.exit(1);
        }
    }).catch(err => {
        console.error('Error generating changelog from Gemini:', err);
        process.exit(1);
    });
});
