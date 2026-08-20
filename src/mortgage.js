// Standard fixed-rate amortized monthly payment (principal + interest only).
// M = P·r(1+r)^n / ((1+r)^n − 1), r = monthly rate, n = months.
export function monthlyPayment(principal, annualRatePct, years) {
  const r = annualRatePct / 100 / 12
  const n = years * 12
  if (principal <= 0 || n <= 0) return 0
  if (r === 0) return principal / n
  return (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1)
}
