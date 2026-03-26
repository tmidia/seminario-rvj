const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function extractHeadings() {
    const dir = '../apostilas/Curso Básico';
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));
    
    let summary = '';
    
    for(const file of files) {
        const filePath = path.join(dir, file);
        const dataBuffer = fs.readFileSync(filePath);
        try {
            const data = await pdf(dataBuffer);
            // Get just the first 3000 characters to capture the Index/Sumário
            const text = data.text.substring(0, 3000).replace(/\n\s*\n/g, '\n');
            summary += `\n\n=== MODULE: ${file} ===\n${text}\n`;
            console.log("Processed " + file);
        } catch(e) {
            console.error("Failed on " + file);
        }
    }
    
    fs.writeFileSync('indexes.txt', summary);
    console.log("Written to indexes.txt");
}

extractHeadings();
