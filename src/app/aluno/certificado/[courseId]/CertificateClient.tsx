"use client"

import React, { useRef, useState } from 'react'
import { Great_Vibes } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { Download, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] })

interface Subject {
  title: string;
}

interface CertificateProps {
  studentName: string;
  courseTitle: string;
  hours: number;
  completionDate: string;
  subjects: Subject[];
}

export function CertificateClient({ studentName, courseTitle, hours, completionDate, subjects }: CertificateProps) {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadPDF = async () => {
    try {
      setIsGenerating(true)
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Generate Front Page
      if (frontRef.current) {
        const canvasFront = await html2canvas(frontRef.current, { scale: 2, useCORS: true })
        const imgDataFront = canvasFront.toDataURL('image/png')
        pdf.addImage(imgDataFront, 'PNG', 0, 0, pdfWidth, pdfHeight)
      }

      // Generate Back Page
      if (backRef.current) {
        pdf.addPage()
        const canvasBack = await html2canvas(backRef.current, { scale: 2, useCORS: true })
        const imgDataBack = canvasBack.toDataURL('image/png')
        pdf.addImage(imgDataBack, 'PNG', 0, 0, pdfWidth, pdfHeight)
      }

      pdf.save(`Certificado_${studentName.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error("Erro ao gerar PDF", error)
      alert("Ocorreu um erro ao gerar o certificado.")
    } finally {
      setIsGenerating(false)
    }
  }

  // A4 Landscape fixed absolute sizes for perfect HTML2Canvas scaling
  const a4Style = { width: '1123px', height: '794px' }

  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4 flex flex-col items-center">
      {/* Toolbar */}
      <div className="w-full max-w-[1123px] flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
        <Link href="/aluno/historico">
          <Button variant="outline" className="flex gap-2">
            <ChevronLeft size={16} /> Voltar ao Histórico
          </Button>
        </Link>
        <Button 
          onClick={downloadPDF} 
          disabled={isGenerating} 
          className="bg-[#c29a4b] hover:bg-[#a6823c] text-slate-900 font-bold flex gap-2"
        >
          <Download size={18} />
          {isGenerating ? "Gerando PDF de Alta Resolução..." : "Baixar PDF Oficial"}
        </Button>
      </div>

      <div className="flex flex-col gap-12 text-slate-900 overflow-x-auto pb-12 items-center w-full">
        {/* --- FRONT PAGE --- */}
        <div ref={frontRef} style={a4Style} className="bg-white relative shadow-2xl flex flex-col justify-center items-center shrink-0 border-[16px] border-[#0a3a2a]">
          {/* Inner Golden Border */}
          <div className="absolute inset-2 border-[3px] border-[#c29a4b]"></div>
          
          {/* Corner Flourishes (Simulated via SVG) */}
          <svg className="absolute top-4 left-4 w-16 h-16 text-[#c29a4b]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" />
          </svg>
          <svg className="absolute top-4 right-4 w-16 h-16 text-[#c29a4b] rotate-90" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" />
          </svg>
          <svg className="absolute bottom-4 left-4 w-16 h-16 text-[#c29a4b] -rotate-90" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" />
          </svg>
          <svg className="absolute bottom-4 right-4 w-16 h-16 text-[#c29a4b] rotate-180" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" />
          </svg>

          {/* Header */}
          <div className="text-center mt-8 mb-10 relative z-10">
            <div className="flex justify-center mb-4">
               {/* Graduation Cap Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#0a3a2a] tracking-wider uppercase">Seminário Teológico</h1>
            <p className="text-sm tracking-[0.3em] font-semibold text-slate-500 mt-2">REV. VALDEMAR DE JESUS SILVA</p>
          </div>

          <p className="text-xl font-medium text-slate-700 tracking-wide mt-2">O Seminário Teológico Rev. Valdemar de Jesus Silva, concede a</p>

          {/* Dynamic Student Name */}
          <div className="my-10 text-center w-full px-20">
            <h2 className={`${greatVibes.className} text-[80px] leading-none text-[#0a3a2a] border-b border-slate-300 inline-block px-12 pb-2`}>
              {studentName}
            </h2>
          </div>

          <p className="text-xl font-medium text-slate-700 tracking-wide">o certificado de conclusão do curso</p>
          
          <h3 className="text-4xl font-black text-[#0a3a2a] uppercase tracking-widest mt-6 mb-8">
            {courseTitle} Em Teologia
          </h3>

          <p className="text-xl font-medium text-slate-700 tracking-wide max-w-[800px] text-center leading-relaxed">
            concluído com sucesso em {completionDate} na modalidade de Ensino a Distância (EAD),<br/>com carga horária de {hours} horas.
          </p>

          {/* Bottom Seal & Footer */}
          <div className="absolute bottom-16 w-full flex justify-center items-center px-24">
            <div className="w-32 h-32 rounded-full border-4 border-[#c29a4b] flex items-center justify-center relative">
               {/* Fake Seal Text */}
               <div className="text-[8px] font-bold text-[#0a3a2a] uppercase text-center w-24">
                 Convenção Estadual<br/>das Assembleias de Deus<br/>no Acre
               </div>
            </div>
          </div>

          <div className="absolute bottom-6 w-full text-center px-24">
             <p className="text-[10px] text-slate-400">Este certificado é emitido de acordo com o Decreto nº 5.154, de 23 de julho de 2004, que regulamenta a oferta de cursos livres no Brasil.</p>
          </div>
        </div>


        {/* --- BACK PAGE --- */}
        <div ref={backRef} style={a4Style} className="bg-white relative shadow-2xl flex flex-col items-center shrink-0 border-[16px] border-[#0a3a2a]">
          {/* Inner Golden Border */}
          <div className="absolute inset-2 border-[3px] border-[#c29a4b]"></div>
          
          {/* Corner Flourishes */}
          <svg className="absolute top-4 left-4 w-16 h-16 text-[#c29a4b]" viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" /></svg>
          <svg className="absolute top-4 right-4 w-16 h-16 text-[#c29a4b] rotate-90" viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" /></svg>
          <svg className="absolute bottom-4 left-4 w-16 h-16 text-[#c29a4b] -rotate-90" viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" /></svg>
          <svg className="absolute bottom-4 right-4 w-16 h-16 text-[#c29a4b] rotate-180" viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" /></svg>

          {/* Subjects Body Container */}
          <div className="mt-16 bg-[#fdfbf6] p-12 w-[60%] flex flex-col items-center rounded-3xl border border-[#c29a4b]/20 shadow-sm relative z-10">
            <h2 className="text-3xl font-black text-[#0a3a2a] tracking-widest mb-8">MATÉRIAS</h2>
            
            <div className="flex flex-col w-full px-8 gap-3">
              {subjects.map((sub, idx) => (
                <div key={idx} className="text-center text-xl font-medium text-slate-800">
                  {sub.title}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-12 text-lg font-medium text-slate-700">Rio Branco, {completionDate}.</p>

          {/* Signatures Container */}
          <div className="absolute bottom-32 w-full px-32 flex justify-between items-end">
            <div className="flex flex-col items-center w-64">
              <div className="w-full border-b border-slate-800 h-16 relative flex justify-center items-end pb-1">
                {/* Simulated Signature */}
                <span className={`${greatVibes.className} text-4xl text-[#0a3a2a]/60 absolute bottom-1 rotate-[-5deg]`}>Pr. Wagner F. G.</span>
              </div>
              <p className="mt-2 text-sm font-bold text-slate-800 uppercase text-center">Pr. Wagner F. G. da Silva</p>
              <p className="text-xs text-slate-500">Presidente</p>
            </div>

            <div className="flex flex-col items-center w-64">
              <div className="w-full border-b border-slate-800 h-16 relative flex justify-center items-end pb-1">
                {/* Simulated Signature */}
                <span className={`${greatVibes.className} text-4xl text-[#0a3a2a]/60 absolute bottom-1 rotate-[-10deg]`}>Pr. Marcelo Ribeiro</span>
              </div>
              <p className="mt-2 text-sm font-bold text-slate-800 uppercase text-center">Pr. Marcelo da Silva Ribeiro</p>
              <p className="text-xs text-slate-500">Diretor</p>
            </div>

            <div className="flex flex-col items-center w-64">
              <div className="w-full border-b border-slate-800 h-16 relative flex justify-center items-end pb-1">
                <span className={`${greatVibes.className} text-3xl text-slate-400 absolute bottom-1`}>Assinatura</span>
              </div>
              <p className="mt-2 text-sm font-bold text-slate-800 uppercase text-center">Aluno(a)</p>
            </div>
          </div>

          <div className="absolute bottom-6 w-full text-center px-24">
             <p className="text-[10px] text-slate-400">Este certificado é emitido de acordo com o Decreto nº 5.154, de 23 de julho de 2004, que regulamenta a oferta de cursos livres no Brasil.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
