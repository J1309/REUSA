// Runnable check for the money math: `node src/mortgage.test.mjs`
import assert from 'node:assert/strict'
import { monthlyPayment } from './mortgage.js'

// $100k at 6% over 30y is a well-known ~$599.55/mo.
assert.ok(Math.abs(monthlyPayment(100000, 6, 30) - 599.55) < 0.5)
// 0% interest is just principal spread evenly.
assert.equal(monthlyPayment(120000, 0, 10), 1000)
// No loan, no payment.
assert.equal(monthlyPayment(0, 6, 30), 0)

console.log('mortgage: ok')
