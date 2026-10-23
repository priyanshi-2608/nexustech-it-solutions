const fs = require('fs');
const PDFParser = require('pdf2json');

const skillSynonyms = {
    react: ['react', 'reactjs', 'react.js', 'react js'],
    node: ['node', 'nodejs', 'node.js', 'node js'],
    javascript: ['js', 'javascript', 'ecmascript'],
    mongodb: ['mongo', 'mongodb', 'mongo db'],
    express: ['express', 'expressjs', 'express.js'],
    tailwind: ['tailwind', 'tailwindcss', 'tailwind css'],
    python: ['python', 'py'],
    git: ['git', 'github', 'version control'],
};

function normalizeAndExtractSkills(text, requiredSkills = []) {
    if (!text) return new Set();
    const lowerText = text.toLowerCase();
    const foundSkills = new Set();

    requiredSkills.forEach((req) => {
        if (!req) return;
        const cleanReq = req.toLowerCase().trim();

        if (lowerText.includes(cleanReq)) {
            foundSkills.add(cleanReq);
            return;
        }

        let matchedViaAlias = false;
        for (const [key, aliases] of Object.entries(skillSynonyms)) {
            if (cleanReq.includes(key)) {
                const hasAlias = aliases.some((alias) => lowerText.includes(alias));
                if (hasAlias) {
                    matchedViaAlias = true;
                    break;
                }
            }
        }

        if (matchedViaAlias) {
            foundSkills.add(cleanReq);
        }
    });

    return foundSkills;
}

function parsePdfBuffer(buffer) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1); 
        
        pdfParser.on('pdfParser_dataError', (err) => reject(err.parserError));
        pdfParser.on('pdfParser_dataReady', () => {
            try {
                const rawText = pdfParser.getRawTextContent();
                resolve(rawText || '');
            } catch (e) {
                reject(e);
            }
        });

        pdfParser.parseBuffer(buffer);
    });
}

async function calculateATSScore(filePath, jobRequirements = []) {
    try {
        if (!fs.existsSync(filePath)) {
            return 0;
        }

        const dataBuffer = fs.readFileSync(filePath);
        const resumeText = await parsePdfBuffer(dataBuffer);

        if (!jobRequirements || jobRequirements.length === 0) {
            return 50; 
        }

        const matchedSkills = normalizeAndExtractSkills(resumeText, jobRequirements);
        const score = Math.round((matchedSkills.size / jobRequirements.length) * 100);
        return Math.min(score, 100);
    } catch (err) {
        console.error('Error calculating ATS score with pdf2json:', err);
        return 0;
    }
}

module.exports = { calculateATSScore };