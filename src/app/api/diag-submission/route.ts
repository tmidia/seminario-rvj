import { NextResponse } from 'next/server';
import { submitExamAttempt } from '@/app/actions/engine';

export async function GET() {
  try {
    console.log("--- Iniciando Diagnóstico de Submissão ---");
    // Testamos com um ID inexistente apenas para ver se o motor "arranca" ou morre antes
    // Se ele der console.error("Tentativa não encontrada"), sabemos que as credenciais admin estão OK.
    // Se ele der Throw ("Missing Key"), matamos a charada.
    await submitExamAttempt("999999", 3, {});
    
    return NextResponse.json({ status: "ok", message: "Motor de submissão acessível e funcional." });
  } catch (error: any) {
    console.error("DIAGNOSTICO FALHOU:", error.message);
    return NextResponse.json({ 
      status: "error", 
      message: error.message,
      stack: error.stack 
    });
  }
}
