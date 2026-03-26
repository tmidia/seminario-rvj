"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { Save, Loader2, Image as ImageIcon } from "lucide-react"

interface Settings {
  id?: string;
  logo_url?: string;
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
    signature_1_url: initialSettings.signature_1_url || "",
    signature_2_url: initialSettings.signature_2_url || "",
    bg_image_url: initialSettings.bg_image_url || "",
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Settings) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${field}_${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, [field]: publicUrl }))
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
      const { error } = await supabase
        .from('certificate_settings')
        .update({
          signature_1_name: formData.signature_1_name,
          signature_1_role: formData.signature_1_role,
          signature_2_name: formData.signature_2_name,
          signature_2_role: formData.signature_2_role,
          layout_scale: formData.layout_scale,
          margin_top: formData.margin_top,
          logo_url: formData.logo_url,
          signature_1_url: formData.signature_1_url,
          signature_2_url: formData.signature_2_url,
          bg_image_url: formData.bg_image_url,
        })
        .eq('id', '00000000-0000-0000-0000-000000000000')

      if (error) throw error
      alert("Configurações salvas com sucesso!")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar configurações no banco.")
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
                {formData.logo_url ? <img src={formData.logo_url} className="w-full object-contain" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'logo_url')} disabled={loading} />
            </div>
            {formData.logo_url && <Button variant="link" className="text-xs text-red-500 p-0" onClick={() => setFormData(p => ({...p, logo_url: ''}))}>Remover Logo</Button>}
          </div>

          <div className="space-y-2">
            <Label>Assinatura 1 (Esquerda)</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-12 bg-slate-100 border rounded flex items-center justify-center overflow-hidden shrink-0">
                {formData.signature_1_url ? <img src={formData.signature_1_url} className="w-full object-contain" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'signature_1_url')} disabled={loading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assinatura 2 (Direita)</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-12 bg-slate-100 border rounded flex items-center justify-center overflow-hidden shrink-0">
                {formData.signature_2_url ? <img src={formData.signature_2_url} className="w-full object-contain" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'signature_2_url')} disabled={loading} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Imagem de Fundo - Marca D&apos;água (Opcional)</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 border rounded flex items-center justify-center overflow-hidden shrink-0">
                {formData.bg_image_url ? <img src={formData.bg_image_url} className="w-full object-contain" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'bg_image_url')} disabled={loading} />
            </div>
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
