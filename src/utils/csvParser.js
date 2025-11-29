import Papa from 'papaparse'
import { isAddress } from 'viem'

/**
 * Parse CSV file or text
 * @param {File|string} input - CSV file or text
 * @returns {Promise<Array>} Parsed recipients
 */
export function parseCSV(input) {
  return new Promise((resolve, reject) => {
    const config = {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        try {
          const recipients = results.data.map((row, index) => ({
            id: Date.now() + index,
            index: index + 1,
            address: row.Address?.trim() || row.address?.trim() || '',
            amount: row.Amount?.trim() || row.amount?.trim() || ''
          }))
          resolve(recipients)
        } catch (error) {
          reject(new Error('Failed to parse CSV: ' + error.message))
        }
      },
      error: (error) => {
        reject(new Error('CSV parsing error: ' + error.message))
      }
    }

    if (typeof input === 'string') {
      Papa.parse(input, config)
    } else {
      Papa.parse(input, config)
    }
  })
}

/**
 * Parse simple text format (address,amount per line)
 * @param {string} text - Text input
 * @returns {Array} Parsed recipients
 */
export function parseSimpleText(text) {
  const lines = text.trim().split('\n').filter(line => line.trim())

  return lines.map((line, index) => {
    const parts = line.split(',').map(p => p.trim())
    return {
      id: Date.now() + index,
      index: index + 1,
      address: parts[0] || '',
      amount: parts[1] || ''
    }
  })
}

/**
 * Validate single recipient
 * @param {Object} recipient - Recipient object
 * @param {number} decimals - Token decimals
 * @returns {Object} Validation result
 */
export function validateRecipient(recipient, decimals = 18) {
  const errors = []
  const warnings = []

  // Validate address
  if (!recipient.address) {
    errors.push('Address is required')
  } else if (!isAddress(recipient.address)) {
    errors.push('Invalid address format')
  } else if (recipient.address === '0x0000000000000000000000000000000000000000') {
    warnings.push('Zero address - tokens will be burned')
  }

  // Validate amount
  if (!recipient.amount) {
    errors.push('Amount is required')
  } else {
    const amount = recipient.amount.toString().trim()

    // Check if valid number
    if (!/^\d+(\.\d+)?$/.test(amount)) {
      errors.push('Invalid amount format')
    } else {
      const value = parseFloat(amount)

      if (value <= 0) {
        errors.push('Amount must be greater than 0')
      }

      if (value > 1000000) {
        warnings.push('Very large amount')
      }

      // Check decimals
      const parts = amount.split('.')
      if (parts[1] && parts[1].length > decimals) {
        errors.push(`Max ${decimals} decimals allowed`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate all recipients
 * @param {Array} recipients - Array of recipients
 * @param {number} decimals - Token decimals
 * @returns {Object} Validation summary
 */
export function validateRecipients(recipients, decimals = 18) {
  const results = recipients.map(recipient => ({
    ...recipient,
    validation: validateRecipient(recipient, decimals)
  }))

  const valid = results.filter(r => r.validation.valid)
  const invalid = results.filter(r => !r.validation.valid)
  const withWarnings = results.filter(r => r.validation.warnings.length > 0)

  // Check for duplicates
  const addressMap = new Map()
  results.forEach(r => {
    if (r.address && isAddress(r.address)) {
      const addr = r.address.toLowerCase()
      if (addressMap.has(addr)) {
        addressMap.get(addr).push(r.index)
      } else {
        addressMap.set(addr, [r.index])
      }
    }
  })

  const duplicates = Array.from(addressMap.entries())
    .filter(([_, indices]) => indices.length > 1)
    .map(([address, indices]) => ({ address, rows: indices }))

  return {
    total: recipients.length,
    valid: valid.length,
    invalid: invalid.length,
    withWarnings: withWarnings.length,
    duplicates: duplicates.length,
    results,
    duplicateDetails: duplicates
  }
}

/**
 * Calculate total amount
 * @param {Array} recipients - Array of recipients
 * @returns {string} Total amount
 */
export function calculateTotal(recipients) {
  const total = recipients.reduce((sum, r) => {
    const amount = parseFloat(r.amount || 0)
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)

  return total.toFixed(18).replace(/\.?0+$/, '')
}

/**
 * Generate CSV template
 * @returns {string} CSV template
 */
export function generateCSVTemplate() {
  return `Address,Amount
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,1.0
0x220866B1A2219f40e72f5c628B65D54268cA3A9D,1.5
0x28C6c06298d514Db089934071355E5743bf21d60,2.0`
}

/**
 * Download CSV template
 */
export function downloadCSVTemplate() {
  const csv = generateCSVTemplate()
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', 'multi-sender-template.csv')
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export recipients to CSV
 * @param {Array} recipients - Recipients to export
 * @param {string} tokenSymbol - Token symbol
 */
export function exportToCSV(recipients, tokenSymbol = 'BNB') {
  const headers = ['Address', 'Amount']
  const rows = recipients.map(r => [r.address, r.amount])

  const csv = Papa.unparse({
    fields: headers,
    data: rows
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  const timestamp = new Date().toISOString().split('T')[0]

  link.setAttribute('href', url)
  link.setAttribute('download', `multi-sender-${tokenSymbol}-${timestamp}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
