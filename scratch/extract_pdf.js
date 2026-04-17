const fs = require('fs');
const pdf = require('pdf-parse');

async function extractText(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdf(dataBuffer);
        // Clean up the text a bit
        return data.text.replace(/\n\s*\n/g, '\n').trim();
    } catch (error) {
        console.error(`Erro ao ler ${filePath}:`, error);
        return null;
    }
}

const targetFile = process.argv[2];
if (!targetFile) {
    console.log("Usage: node extract_pdf.js <path_to_pdf>");
    process.exit(1);
}

extractText(targetFile).then(text => {
    if (text) {
        // Output to a txt file in the same directory as the script
        const outPath = targetFile.replace('.pdf', '.txt');
        fs.writeFileSync(outPath, text);
        console.log(`Sucesso: ${outPath}`);
    }
});
