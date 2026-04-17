"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { Save, Loader2, Image as ImageIcon } from "lucide-react"
import { uploadCertificateAsset } from "@/app/actions/upload-certificate-asset"
import { updateCertificateSettings } from "@/app/actions/update-certificate-settings"

interface Settings {
  id?: string;
  logo_url?: string;
  seal_url?: string;
  signature_1_url?: string;
  signature_1_name?: string;
  signature_1_role?: string;
  signature_2_url?: string;
  signature_2_name?: string;
  signature_2_role?: string;
  bg_image_url?: string;
  layout_scale?: number;
  margin_top?: number;
}

export function CertificateSettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Settings>({
    signature_1_name: initialSettings.signature_1_name || "Pr. Wagner F. G. da Silva",
    signature_1_role: initialSettings.signature_1_role || "Presidente",
    signature_2_name: initialSettings.signature_2_name || "Pr. Marcelo da Silva Ribeiro",
    signature_2_role: initialSettings.signature_2_role || "Diretor",
    layout_scale: initialSettings.layout_scale || 1.0,
    margin_top: initialSettings.margin_top || 0,
    logo_url: initialSettings.logo_url || "",
    seal_url: initialSettings.seal_url || "",
    signature_1_url: initialSettings.signature_1_url || "",
    signature_2_url: initialSettings.signature_2_url || "",
    bg_image_url: initialSettings.bg_image_url || "",
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Settings) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('field', field)

      const res = await uploadCertificateAsset(uploadFormData)

      if (res.error) {
        throw new Error(res.error)
      }

      setFormData(prev => ({ ...prev, [field]: res.url }))
    } catch (err) {
      console.error(err)
      alert("Erro ao enviar imagem.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await updateCertificateSettings(formData)

      if (res.error) throw new Error(res.error)
      alert("Configurações salvas com sucesso!")
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Erro ao salvar configurações no banco.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens e Assinaturas</CardTitle>
          <CardDescription>Faça upload das imagens (PNG com fundo transparente) para estilizar o documento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Logo do Certificado (Meio-Topo)</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 border rounded flex items-center justify-center overflow-hidden shrink-0">
                {formData.logo_url ? <img src={formData.logo_url} className="w-full object-contain" alt="Logo" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'logo_url')} disabled={loading} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Dica: Use PNG transparente com formato quadrado ou levemente retangular (Ex: 300x300px).</p>
            {formData.logo_url && <Button variant="link" className="text-xs text-red-500 p-0 mt-1" onClick={() => setFormData(p => ({...p, logo_url: ''}))}>Remover Logo</Button>}
          </div>

          <div className="space-y-2">
            <Label>Selo de Autenticidade (Canto Inferior Direito)</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 border rounded flex items-center justify-center overflow-hidden shrink-0">
                {formData.seal_url ? <img src={formData.seal_url} className="w-full object-contain" alt="Selo" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'seal_url')} disabled={loading} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Dica: Use um brasão ou selo dourado em PNG transparente (Ex: 300x300px).</p>
            {formData.seal_url && <Button variant="link" className="text-xs text-red-500 p-0 mt-1" onClick={() => setFormData(p => ({...p, seal_url: ''}))}>Remover Selo</Button>}
          </div>

          <div className="space-y-2">
            <Label>Assinatura 1 (Esquerda)</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-12 bg-slate-100 border rounded flex items-center justify-center overflow-hidden shrink-0">
                {formData.signature_1_url ? <img src={formData.signature_1_url} className="w-full object-contain" alt="Assinatura 1" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'signature_1_url')} disabled={loading} />
            </div>
            <p className="text-xs text-slate-500 mt-1 text-orange-600/80 font-medium">Muito Importante: Recorte a imagem bem rente à assinatura, sem deixar espaços vazios (transparentes) sobrando em volta. Sugestão: 400x150px.</p>
          </div>

          <div className="space-y-2">
            <Label>Assinatura 2 (Direita)</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-12 bg-slate-100 border rounded flex items-center justify-center overflow-hidden shrink-0">
                {formData.signature_2_url ? <img src={formData.signature_2_url} className="w-full object-contain" alt="Assinatura 2" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'signature_2_url')} disabled={loading} />
            </div>
            <p className="text-xs text-slate-500 mt-1 text-orange-600/80 font-medium">Muito Importante: Recorte a imagem bem rente à assinatura, sem deixar espaços vazios (transparentes) sobrando em volta. Sugestão: 400x150px.</p>
          </div>
          
          <div className="space-y-2">
            <Label>Imagem de Fundo - Marca D&apos;água (Opcional)</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 border rounded flex items-center justify-center overflow-hidden shrink-0">
                {formData.bg_image_url ? <img src={formData.bg_image_url} className="w-full object-contain" alt="Imagem de Fundo" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'bg_image_url')} disabled={loading} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Dica: Use uma imagem grande no formato Paisagem/A4 Deitada (Ex: 3508x2480px). A opacidade (transparência) é aplicada automaticamente.</p>
          </div>
        </CardContent>
      </Card>

      {/* Textos e Proporções */}
      <Card>
        <CardHeader>
          <CardTitle>Textos e Proporções</CardTitle>
          <CardDescription>Defina os nomes sob as assinaturas e centralize o certificado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome (Assinatura 1)</Label>
              <Input value={formData.signature_1_name} onChange={e => setFormData(p => ({...p, signature_1_name: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Cargo (Assinatura 1)</Label>
              <Input value={formData.signature_1_role} onChange={e => setFormData(p => ({...p, signature_1_role: e.target.value}))} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome (Assinatura 2)</Label>
              <Input value={formData.signature_2_name} onChange={e => setFormData(p => ({...p, signature_2_name: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Cargo (Assinatura 2)</Label>
              <Input value={formData.signature_2_role} onChange={e => setFormData(p => ({...p, signature_2_role: e.target.value}))} />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Escala do Layout (Zoom Geral)</Label>
            <div className="flex items-center gap-4">
              <Input type="range" min="0.5" max="1.5" step="0.05" value={formData.layout_scale} onChange={e => setFormData(p => ({...p, layout_scale: parseFloat(e.target.value)}))} />
              <span className="w-12 text-sm font-bold">{Math.round((formData.layout_scale || 1) * 100)}%</span>
            </div>
            <p className="text-xs text-slate-500">Se o texto estiver encavalado, diminua a escala (Ex: 95%). Se estiver muito solto, aumente (Ex: 105%).</p>
          </div>

          <div className="space-y-2">
            <Label>Espaçamento Superior (Margem Topo)</Label>
            <div className="flex items-center gap-4">
              <Input type="range" min="-100" max="200" step="5" value={formData.margin_top} onChange={e => setFormData(p => ({...p, margin_top: parseInt(e.target.value)}))} />
              <span className="w-12 text-sm font-bold">{formData.margin_top}px</span>
            </div>
            <p className="text-xs text-slate-500">Deslize para descer ou subir todo o conteúdo em relação à borda superior.</p>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full bg-[#0a3a2a] hover:bg-[#083024] text-[#c29a4b] font-bold mt-4 h-12">
            {loading ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
