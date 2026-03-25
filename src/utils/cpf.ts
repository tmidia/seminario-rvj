export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false

  let chk1 = 0, chk2 = 0
  for (let i = 0; i < 9; i++) {
    chk1 += parseInt(cpf.charAt(i)) * (10 - i)
    chk2 += parseInt(cpf.charAt(i)) * (11 - i)
  }
  chk1 = (chk1 * 10) % 11
  if (chk1 === 10 || chk1 === 11) chk1 = 0
  if (chk1 !== parseInt(cpf.charAt(9))) return false
  
  chk2 += chk1 * 2
  chk2 = (chk2 * 10) % 11
  if (chk2 === 10 || chk2 === 11) chk2 = 0
  if (chk2 !== parseInt(cpf.charAt(10))) return false
  
  return true
}
