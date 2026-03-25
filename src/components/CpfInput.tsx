"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function CpfInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [value, setValue] = useState(props.defaultValue || "")
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length > 11) v = v.substring(0, 11)
    
    // format as 000.000.000-00
    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2')
    }
    
    setValue(v)
    if (props.onChange) props.onChange(e)
  }

  return <Input {...props} value={value} onChange={handleChange} maxLength={14} />
}
