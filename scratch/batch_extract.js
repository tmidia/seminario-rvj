const cp = require('child_process');
const path = require('path');

const files = [
    '05 - HOMILÉTICA.pdf',
    '06 - SEITAS E HERESIAS.pdf',
    '07 - TEOLOGIA SISTEMÁTICA I.pdf',
    '08 - TEOLOGIA SISTEMÁTICA II.pdf',
    '09 - TEOLOGIA DA LIDERANÇA.pdf',
    '10 - BIBLIOLOGIA.pdf',
    '11 - Teologia do AT.pdf',
    '12 - Teologia do NT.pdf'
];

const basePath = 'C:/Projetos/Provas-Seminario/Apostilas/Curso Básico/';

files.forEach(f => {
    const fullPath = path.join(basePath, f);
    console.log(`Iniciando extração: ${f}`);
    try {
        // Execute the single extraction script
        cp.execSync(`node scratch/extract_pdf.js "${fullPath}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Falha ao processar ${f}`);
    }
});

console.log("Processo concluído.");
