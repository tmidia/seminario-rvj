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
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("DIAGNOSTICO FALHOU:", errorMsg);
    return NextResponse.json({ 
      status: "error", 
      message: errorMsg,
      stack: errorStack 
    });
  }
}
