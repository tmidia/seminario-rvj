"use client"

import React, { useRef, useState, useEffect } from 'react'
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
  settings?: {
    bg_image_url?: string;
    logo_url?: string;
    seal_url?: string;
    layout_scale?: number;
    margin_top?: number;
    signature_1_url?: string;
    signature_1_name?: string;
    signature_1_role?: string;
    signature_2_url?: string;
    signature_2_name?: string;
    signature_2_role?: string;
  };
}

export function CertificateClient({ studentName, courseTitle, hours, completionDate, subjects, settings }: CertificateProps) {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const availableWidth = window.innerWidth - 32 // 16px padding each side
        if (availableWidth < 1123) {
          setPreviewScale(availableWidth / 1123)
        } else {
          setPreviewScale(1)
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
        const canvasFront = await html2canvas(frontRef.current, { 
          scale: 2, 
          useCORS: true,
          width: 1123,
          height: 794,
          onclone: (doc) => {
            const el = doc.getElementById('certificate-front')
            if (el) {
              el.style.transform = 'none'
              el.style.width = '1123px'
              el.style.height = '794px'
            }
          }
        })
        const imgDataFront = canvasFront.toDataURL('image/png')
        pdf.addImage(imgDataFront, 'PNG', 0, 0, pdfWidth, pdfHeight)
      }

      // Generate Back Page
      if (backRef.current) {
        pdf.addPage()
        const canvasBack = await html2canvas(backRef.current, { 
          scale: 2, 
          useCORS: true,
          width: 1123,
          height: 794,
          onclone: (doc) => {
            const el = doc.getElementById('certificate-back')
            if (el) {
              el.style.transform = 'none'
              el.style.width = '1123px'
              el.style.height = '794px'
            }
          }
        })
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

      <div className="flex flex-col gap-8 text-slate-900 pb-12 items-center w-full">
        {/* --- FRONT PAGE --- */}
        <div 
          className="relative shrink-0 shadow-2xl" 
          style={{ 
            width: `${1123 * previewScale}px`, 
            height: `${794 * previewScale}px`,
            overflow: 'hidden'
          }}
        >
          <div 
            id="certificate-front"
            ref={frontRef} 
            style={{ 
              ...a4Style, 
              transform: `scale(${previewScale})`, 
              transformOrigin: 'top left',
            }} 
            className="bg-white relative flex flex-col justify-start pt-12 items-center border-[16px] border-[#0a3a2a] overflow-hidden"
          >
          {/* Custom Background Image */}
          {settings?.bg_image_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={settings.bg_image_url} alt="Background" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 pointer-events-none" />
          )}
          
          {/* Inner Golden Border */}
          <div className="absolute inset-2 border-[3px] border-[#c29a4b] pointer-events-none z-10"></div>
          
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

          {/* SCALED & MARGINED CONTENT WRAPPER */}
          <div 
            className="flex flex-col items-center justify-center w-full z-20"
            style={{ 
              transform: `scale(${settings?.layout_scale || 1.0})`, 
              transformOrigin: 'center', 
              marginTop: `${settings?.margin_top || 0}px` 
            }}
          >
            {/* Header */}
            <div className="text-center mt-12 mb-6 relative">
              <div className="flex justify-center mb-4">
                 {settings?.logo_url ? (
                   /* eslint-disable-next-line @next/next/no-img-element */
                   <img src={settings.logo_url} className="h-20 object-contain" alt="Logo" crossOrigin="anonymous" />
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                     <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                   </svg>
                 )}
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#0a3a2a] tracking-wider uppercase">Seminário Teológico</h1>
              <p className="text-sm tracking-[0.3em] font-semibold text-slate-500 mt-2">REV. VALDEMAR DE JESUS SILVA</p>
            </div>

            <p className="text-lg font-medium text-slate-700 tracking-wide mt-2">O Seminário Teológico Rev. Valdemar de Jesus Silva, concede a</p>

            {/* Dynamic Student Name */}
            <div className="my-6 text-center w-full px-20">
              <h2 className={`${greatVibes.className} text-[68px] leading-none text-[#0a3a2a] border-b border-slate-300 inline-block px-12 pb-2`}>
                {studentName}
              </h2>
            </div>

            <p className="text-lg font-medium text-slate-700 tracking-wide">o certificado de conclusão do curso</p>
            
            <h3 className="text-4xl font-black text-[#0a3a2a] uppercase tracking-widest mt-6 mb-6">
              {courseTitle}
            </h3>

            <p className="text-lg font-medium text-slate-700 tracking-wide max-w-[700px] text-center leading-relaxed">
              concluído com sucesso em {completionDate} na modalidade de Ensino a Distância (EAD), com carga horária de {hours} horas.
            </p>
          </div>

          {/* Bottom Seal & Footer */}
          <div className="absolute bottom-12 right-12 z-20">
            {settings?.seal_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={settings.seal_url} alt="Selo de Autenticidade" crossOrigin="anonymous" className="w-32 h-32 object-contain drop-shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-[#c29a4b] flex items-center justify-center relative opacity-80 backdrop-blur-sm">
                 {/* Fake Seal Text */}
                 <div className="text-[7px] font-bold text-[#0a3a2a] uppercase text-center w-20">
                   Convenção<br/>Estadual das<br/>Assembleias de Deus<br/>no Acre
                 </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-8 w-full text-center px-24 z-20">
             <p className="text-[10px] text-slate-400">Este certificado é emitido de acordo com o Decreto nº 5.154, de 23 de julho de 2004, que regulamenta a oferta de cursos livres no Brasil.</p>
          </div>
          </div>
        </div>

        {/* --- BACK PAGE --- */}
        <div 
          className="relative shrink-0 shadow-2xl" 
          style={{ 
            width: `${1123 * previewScale}px`, 
            height: `${794 * previewScale}px`,
            overflow: 'hidden'
          }}
        >
          <div 
            id="certificate-back"
            ref={backRef} 
            style={{ 
              ...a4Style, 
              transform: `scale(${previewScale})`, 
              transformOrigin: 'top left',
            }} 
            className="bg-white relative flex flex-col items-center border-[16px] border-[#0a3a2a] overflow-hidden"
          >
          {/* Custom Background Image */}
          {settings?.bg_image_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={settings.bg_image_url} alt="Background" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 pointer-events-none" />
          )}

          {/* Inner Golden Border */}
          <div className="absolute inset-2 border-[3px] border-[#c29a4b] z-10 pointer-events-none"></div>
          
          {/* Corner Flourishes */}
          <svg className="absolute top-4 left-4 w-16 h-16 text-[#c29a4b]" viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" /></svg>
          <svg className="absolute top-4 right-4 w-16 h-16 text-[#c29a4b] rotate-90" viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" /></svg>
          <svg className="absolute bottom-4 left-4 w-16 h-16 text-[#c29a4b] -rotate-90" viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" /></svg>
          <svg className="absolute bottom-4 right-4 w-16 h-16 text-[#c29a4b] rotate-180" viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L50,0 C20,0 0,20 0,50 L0,0 Z" /></svg>

          {/* Subjects Body Container */}
          <div className="mt-12 bg-[#fdfbf6] p-8 w-[80%] flex flex-col items-center rounded-3xl border border-[#c29a4b]/20 shadow-sm relative z-10">
            <h2 className="text-2xl font-black text-[#0a3a2a] tracking-widest mb-6">MATÉRIAS</h2>
            
            <div className="grid grid-cols-2 w-full px-4 gap-y-3 gap-x-12">
              {subjects.map((sub, idx) => (
                <div key={idx} className="text-left text-[17px] font-medium text-slate-800 border-b border-dashed border-slate-200 pb-1">
                  {sub.title}
                </div>
              ))}
            </div>
            
            <p className="mt-8 text-md font-medium text-slate-600">Rio Branco, {completionDate}.</p>
          </div>

          {/* Signatures Container */}
          <div className="absolute bottom-28 w-full px-24 flex justify-between items-end z-20">
            <div className="flex flex-col items-center w-64">
              <div className="w-full border-b border-slate-800 h-24 relative flex justify-center items-end pb-1">
                {settings?.signature_1_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={settings.signature_1_url} className="h-24 object-contain absolute bottom-1 scale-125 origin-bottom" alt="Signature 1" crossOrigin="anonymous" />
                ) : (
                  <span className={`${greatVibes.className} text-4xl text-[#0a3a2a]/60 absolute bottom-1 rotate-[-5deg]`}>{settings?.signature_1_name || 'Pr. Wagner F. G.'}</span>
                )}
              </div>
              <p className="mt-2 text-sm font-bold text-slate-800 uppercase text-center">{settings?.signature_1_name || 'Pr. Wagner F. G. da Silva'}</p>
              <p className="text-xs text-slate-500">{settings?.signature_1_role || 'Presidente'}</p>
            </div>

            <div className="flex flex-col items-center w-64">
              <div className="w-full border-b border-slate-800 h-24 relative flex justify-center items-end pb-1">
                {settings?.signature_2_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={settings.signature_2_url} className="h-24 object-contain absolute bottom-1 scale-125 origin-bottom" alt="Signature 2" crossOrigin="anonymous" />
                ) : (
                  <span className={`${greatVibes.className} text-4xl text-[#0a3a2a]/60 absolute bottom-1 rotate-[-10deg]`}>{settings?.signature_2_name || 'Pr. Marcelo Ribeiro'}</span>
                )}
              </div>
              <p className="mt-2 text-sm font-bold text-slate-800 uppercase text-center">{settings?.signature_2_name || 'Pr. Marcelo da Silva Ribeiro'}</p>
              <p className="text-xs text-slate-500">{settings?.signature_2_role || 'Diretor'}</p>
            </div>

            <div className="flex flex-col items-center w-64">
              <div className="w-full border-b border-slate-800 h-24 relative flex justify-center items-end pb-1">
              </div>
              <p className="mt-2 text-sm font-bold text-slate-800 uppercase text-center">Aluno(a)</p>
            </div>
          </div>

          <div className="absolute bottom-8 w-full text-center px-24">
             <p className="text-[10px] text-slate-400">Este documento é parte integrante do histórico correspondente, emitido em duas vias.</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
