"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeclarationSettings {
  logo_url?: string | null
  signature_1_url?: string | null
  signature_1_name?: string | null
  signature_1_role?: string | null
  signature_2_url?: string | null
  signature_2_name?: string | null
  signature_2_role?: string | null
}

interface DeclarationClientProps {
  studentName: string
  formattedCpf: string
  courseTitle: string
  issuedAt: string
  isCompleted: boolean
  completionDate: string | null
  settings: DeclarationSettings
}

const DOCUMENT_WIDTH = 794
const DOCUMENT_HEIGHT = 1123

export function DeclarationClient({
  studentName,
  formattedCpf,
  courseTitle,
  issuedAt,
  isCompleted,
  completionDate,
  settings,
}: DeclarationClientProps) {
  const documentRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)

  useEffect(() => {
    const updatePreviewScale = () => {
      const availableWidth = Math.max(window.innerWidth - 48, 280)
      setPreviewScale(Math.min(1, availableWidth / DOCUMENT_WIDTH))
    }

    updatePreviewScale()
    window.addEventListener("resize", updatePreviewScale)

    return () => window.removeEventListener("resize", updatePreviewScale)
  }, [])

  const downloadPdf = async () => {
    if (!documentRef.current) return

    try {
      setIsGenerating(true)
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")
      const canvas = await html2canvas(documentRef.current, {
        backgroundColor: "#ffffff",
        height: DOCUMENT_HEIGHT,
        scale: 2,
        useCORS: true,
        width: DOCUMENT_WIDTH,
      })

      const pdf = new jsPDF({
        compress: true,
        format: "a4",
        orientation: "portrait",
        unit: "mm",
      })

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297)
      pdf.save(`Declaracao_de_Matricula_${studentName.replace(/\s+/g, "_")}.pdf`)
    } catch (error) {
      console.error("Erro ao gerar declaração", error)
      alert("Não foi possível gerar a declaração. Tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="outline" className="w-fit">
          <Link href="/aluno/declaracao">
            <ChevronLeft size={18} className="mr-1" /> Voltar
          </Link>
        </Button>
        <Button
          onClick={downloadPdf}
          disabled={isGenerating}
          className="bg-[#0a3a2a] hover:bg-[#0a3a2a]/90 text-[#c29a4b]"
        >
          <Download size={18} className="mr-2" />
          {isGenerating ? "Gerando PDF..." : "Baixar declaração em PDF"}
        </Button>
      </div>

      <div className="rounded-xl border bg-slate-200/70 p-3 sm:p-6 overflow-hidden">
        <div style={{ height: `${DOCUMENT_HEIGHT * previewScale}px` }}>
          <div
            style={{
              height: DOCUMENT_HEIGHT,
              transform: `scale(${previewScale})`,
              transformOrigin: "top left",
              width: DOCUMENT_WIDTH,
            }}
          >
            <article
              ref={documentRef}
              className="relative flex h-[1123px] w-[794px] flex-col overflow-hidden bg-white px-[76px] py-[68px] text-slate-800"
            >
              <div className="absolute inset-7 border-2 border-[#c29a4b]" />
              <div className="relative flex h-full flex-col">
                <header className="text-center">
                  {settings.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={settings.logo_url} alt="Logo do Seminário RVJ" crossOrigin="anonymous" className="mx-auto mb-5 h-24 max-w-[220px] object-contain" />
                  ) : (
                    <div className="mb-5 flex justify-center text-[#0a3a2a]">
                      <FileText size={54} strokeWidth={1.4} />
                    </div>
                  )}
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0a3a2a]">Seminário Teológico RVJ</p>
                  <h1 className="mt-10 font-serif text-[31px] font-bold uppercase tracking-[0.08em] text-[#0a3a2a]">Declaração de Matrícula</h1>
                  <div className="mx-auto mt-5 h-1 w-24 bg-[#c29a4b]" />
                </header>

                <main className="mt-20 flex-1 text-[20px] leading-[1.9] text-slate-700">
                  <p className="text-justify indent-12">
                    Declaramos, para os devidos fins, que <strong className="font-bold text-[#0a3a2a]">{studentName}</strong>, inscrito(a) no CPF sob o número <strong className="font-bold text-[#0a3a2a]">{formattedCpf}</strong>,{" "}
                    {isCompleted ? (
                      <>
                        esteve devidamente matriculado(a) no <strong className="font-bold text-[#0a3a2a]">{courseTitle}</strong>, tendo concluído todas as matérias{completionDate ? ` em ${completionDate}` : ""}.
                      </>
                    ) : (
                      <>
                        encontra-se devidamente matriculado(a) no <strong className="font-bold text-[#0a3a2a]">{courseTitle}</strong>.
                      </>
                    )}
                  </p>
                  <p className="mt-9 text-justify indent-12">
                    A presente declaração reflete a situação de matrícula do(a) aluno(a) na data de sua emissão e é expedida a seu pedido.
                  </p>
                  <p className="mt-9 text-justify indent-12">Por ser verdade, firmamos a presente declaração.</p>
                  <p className="mt-14 text-right">Emitida em {issuedAt}.</p>
                </main>

                <footer className="mt-12 grid grid-cols-2 gap-16 text-center">
                  <Signature
                    imageUrl={settings.signature_1_url}
                    name={settings.signature_1_name}
                    role={settings.signature_1_role}
                  />
                  <Signature
                    imageUrl={settings.signature_2_url}
                    name={settings.signature_2_name}
                    role={settings.signature_2_role}
                  />
                </footer>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

function Signature({ imageUrl, name, role }: { imageUrl?: string | null; name?: string | null; role?: string | null }) {
  return (
    <div className="flex min-h-[8rem] flex-col justify-end">
      <div className="flex h-16 items-end justify-center">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Assinatura" crossOrigin="anonymous" className="max-h-16 max-w-[190px] object-contain" />
        )}
      </div>
      <div className="border-t border-slate-500 pt-2">
        <p className="text-sm font-bold text-[#0a3a2a]">{name || "Responsável institucional"}</p>
        <p className="mt-1 text-xs text-slate-600">{role || "Seminário Teológico RVJ"}</p>
      </div>
    </div>
  )
}
