<template>
  <div class="contract-vanity-page">
    <div class="page-container">
      <div class="page-header">
        <h1>🏭 {{ t('contractVanity.title') }}</h1>
        <p class="subtitle">
          {{ t('contractVanity.subtitle') }}
        </p>
      </div>

      <div class="generator-card">
        <div class="settings-section">
          <div class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="matchPrefix"
                  type="checkbox"
                  :disabled="generating"
                >
                {{ t('contractVanity.prefixLabel') }}
              </label>
              <input
                v-model="prefixPattern"
                type="text"
                :placeholder="t('contractVanity.prefixPlaceholder')"
                :disabled="!matchPrefix || generating"
                class="pattern-input"
              >
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="matchSuffix"
                  type="checkbox"
                  :disabled="generating"
                >
                {{ t('contractVanity.suffixLabel') }}
              </label>
              <input
                v-model="suffixPattern"
                type="text"
                :placeholder="t('contractVanity.suffixPlaceholder')"
                :disabled="!matchSuffix || generating"
                class="pattern-input"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('contractVanity.nonceLabel') }}</label>
              <input
                v-model.number="nonce"
                type="number"
                min="0"
                max="1000"
                :placeholder="t('contractVanity.noncePlaceholder')"
                :disabled="generating"
              >
              <span class="hint">{{ t('contractVanity.nonceHint') }}</span>
            </div>

            <div class="form-group">
              <label>{{ t('batchWallet.countLabel') }}</label>
              <input
                v-model.number="targetCount"
                type="number"
                min="1"
                max="100"
                :placeholder="t('batchWallet.countLabel')"
                :disabled="generating"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="caseSensitive"
                  type="checkbox"
                  :disabled="generating"
                >
                {{ t('vanityWallet.caseSensitive') }}
              </label>
            </div>
          </div>

          <button
            class="generate-btn"
            :disabled="generating || !canGenerate"
            @click="startGeneration"
          >
            <span v-if="!generating">🚀 {{ t('contractVanity.generate') }}</span>
            <span v-else>⏳ {{ t('contractVanity.generating') }}</span>
          </button>

          <button
            v-if="generating"
            class="stop-btn"
            @click="stopGeneration"
          >
            ⏹️ {{ t('vanityWallet.stop') }}
          </button>
        </div>

        <div
          v-if="generating || stats.attempts > 0"
          class="stats-section"
        >
          <div class="stat-item">
            <div class="stat-label">
              {{ t('vanityWallet.attemptsLabel') }}
            </div>
            <div class="stat-value">
              {{ stats.attempts.toLocaleString() }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">
              {{ t('vanityWallet.foundLabel') }}
            </div>
            <div class="stat-value success">
              {{ results.length }} / {{ targetCount }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">
              {{ t('contractVanity.speed') }}
            </div>
            <div class="stat-value">
              {{ stats.speed.toLocaleString() }}/s
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">
              {{ t('contractVanity.elapsedTime') }}
            </div>
            <div class="stat-value">
              {{ formatTime(stats.elapsedTime) }}
            </div>
          </div>
        </div>

        <div
          v-if="results.length > 0"
          class="results-section"
        >
          <div class="results-header">
            <h3>{{ t('contractVanity.foundResults') }} ({{ results.length }})</h3>
            <div class="export-buttons">
              <button
                class="export-btn"
                @click="exportAsJSON"
              >
                📄 {{ t('batchWallet.downloadJson') }}
              </button>
              <button
                class="export-btn"
                @click="exportAsCSV"
              >
                📊 {{ t('batchWallet.download') }}
              </button>
            </div>
          </div>

          <div class="results-list">
            <div
              v-for="(result, index) in results"
              :key="index"
              class="result-item"
            >
              <div class="result-header">
                <div class="result-number">
                  #{{ index + 1 }}
                </div>
                <div class="result-match">
                  <span
                    v-if="matchPrefix"
                    class="match-badge prefix"
                  >
                    {{ t('contractVanity.prefixLabel') }}: {{ extractMatchedPrefix(result.contractAddress) }}
                  </span>
                  <span
                    v-if="matchSuffix"
                    class="match-badge suffix"
                  >
                    {{ t('contractVanity.suffixLabel') }}: {{ extractMatchedSuffix(result.contractAddress) }}
                  </span>
                  <span class="match-badge nonce">
                    Nonce: {{ result.nonce }}
                  </span>
                </div>
              </div>

              <div class="result-info">
                <div class="info-row">
                  <span class="label">{{ t('contractVanity.contractAddress') }}:</span>
                  <span
                    class="value address"
                    v-html="highlightAddress(result.contractAddress)"
                  />
                  <button
                    class="action-btn copy-btn"
                    :title="t('contractVanity.contractAddress')"
                    @click="copyToClipboard(result.contractAddress)"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                  <button
                    class="action-btn qr-btn"
                    :title="t('qrCode.title')"
                    @click="showQRCode(result.contractAddress, t('contractVanity.contractAddress'))"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                      />
                    </svg>
                  </button>
                </div>
                <div class="info-row">
                  <span class="label">{{ t('contractVanity.walletAddress') }}:</span>
                  <span class="value wallet-address">{{ result.walletAddress }}</span>
                  <button
                    class="action-btn copy-btn"
                    :title="t('contractVanity.walletAddress')"
                    @click="copyToClipboard(result.walletAddress)"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                  <button
                    class="action-btn qr-btn"
                    :title="t('qrCode.title')"
                    @click="showQRCode(result.walletAddress, t('contractVanity.walletAddress'))"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                      />
                    </svg>
                  </button>
                </div>
                <div class="info-row">
                  <span class="label">{{ t('batchWallet.privateKey') }}:</span>
                  <span class="value private-key">{{ result.privateKey }}</span>
                  <button
                    class="action-btn copy-btn"
                    :title="t('batchWallet.privateKey')"
                    @click="copyToClipboard(result.privateKey)"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                  <button
                    class="action-btn qr-btn"
                    :title="t('qrCode.title')"
                    @click="showQRCode(result.privateKey, t('batchWallet.privateKey'))"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="results.length === 0 && !generating"
          class="empty-state"
        >
          <div class="empty-icon">
            🔍
          </div>
          <p>{{ t('contractVanity.noResults') }}</p>
          <p class="empty-hint">
            {{ t('contractVanity.startHint') }}
          </p>
        </div>
      </div>

      <div class="info-section">
        <div class="info-card">
          <h4>💡 {{ t('contractVanity.howItWorks') }}</h4>
          <ul>
            <li>{{ t('contractVanity.howItWorksDesc1') }}</li>
            <li>{{ t('contractVanity.howItWorksDesc2') }}</li>
            <li>{{ t('contractVanity.howItWorksDesc3') }}</li>
          </ul>
        </div>

        <div class="info-card warning">
          <h4>{{ t('contractVanity.securityWarning') }}</h4>
          <p class="warning-text">
            {{ t('contractVanity.securityNote') }}
          </p>
        </div>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div
      v-if="showQRModal"
      class="qr-modal-overlay"
      @click="closeQRModal"
    >
      <div
        class="qr-modal"
        @click.stop
      >
        <div class="qr-modal-header">
          <h3>{{ qrModalTitle }}</h3>
          <button
            class="close-btn"
            @click="closeQRModal"
          >
            ×
          </button>
        </div>
        <div class="qr-modal-body">
          <canvas
            ref="qrCanvas"
            class="qr-canvas"
          />
          <div class="qr-text">
            {{ qrContent }}
          </div>
        </div>
        <div class="qr-modal-footer">
          <button
            class="download-qr-btn"
            @click="downloadQRCode"
          >
            ⬇️ {{ t('qrCode.download') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ethers } from 'ethers'
import QRCode from 'qrcode'
import { useToast } from '@/composables/useToast'
import { useI18n } from '../i18n'
import { useSEO, getPageSEO } from '@/composables/useSEO'

// SEO Configuration
const pageSEO = getPageSEO('contractVanity')
useSEO({
  title: pageSEO.title,
  description: pageSEO.description,
  keywords: pageSEO.keywords
})

const toast = useToast()
const { t } = useI18n()

const matchPrefix = ref(true)
const matchSuffix = ref(false)
const prefixPattern = ref('')
const suffixPattern = ref('')
const nonce = ref(0)
const targetCount = ref(1)
const caseSensitive = ref(false)

const results = ref([])
const generating = ref(false)
const shouldStop = ref(false)

const stats = ref({
  attempts: 0,
  speed: 0,
  elapsedTime: 0
})

// QR Code modal state
const showQRModal = ref(false)
const qrModalTitle = ref('')
const qrContent = ref('')
const qrCanvas = ref(null)

const canGenerate = computed(() => {
  if (!matchPrefix.value && !matchSuffix.value) return false
  if (matchPrefix.value && !prefixPattern.value.trim()) return false
  if (matchSuffix.value && !suffixPattern.value.trim()) return false
  if (!targetCount.value || targetCount.value < 1) return false
  if (nonce.value < 0) return false
  return true
})

function isValidHex(str) {
  return /^[0-9a-fA-F]+$/.test(str)
}

function matchesPattern(contractAddress) {
  const addr = contractAddress.toLowerCase()
  const addrWithoutPrefix = addr.substring(2)

  if (matchPrefix.value) {
    const pattern = caseSensitive.value ? prefixPattern.value : prefixPattern.value.toLowerCase()
    if (!isValidHex(pattern)) return false

    const prefix = caseSensitive.value
      ? contractAddress.substring(2, 2 + pattern.length)
      : addrWithoutPrefix.substring(0, pattern.length)
    if (prefix !== pattern) return false
  }

  if (matchSuffix.value) {
    const pattern = caseSensitive.value ? suffixPattern.value : suffixPattern.value.toLowerCase()
    if (!isValidHex(pattern)) return false

    const suffix = caseSensitive.value
      ? contractAddress.substring(contractAddress.length - pattern.length)
      : addrWithoutPrefix.substring(addrWithoutPrefix.length - pattern.length)
    if (suffix !== pattern) return false
  }

  return true
}

async function startGeneration() {
  if (!canGenerate.value) {
    toast.warning(t('toast.warning'))
    return
  }

  // Validate if input characters are valid hexadecimal
  if (matchPrefix.value && !isValidHex(prefixPattern.value)) {
    toast.warning(t('contractVanity.invalidHex'))
    return
  }
  if (matchSuffix.value && !isValidHex(suffixPattern.value)) {
    toast.warning(t('contractVanity.invalidHex'))
    return
  }

  generating.value = true
  shouldStop.value = false
  results.value = []
  stats.value = { attempts: 0, speed: 0, elapsedTime: 0 }

  const startTime = Date.now()
  let lastStatsUpdate = startTime
  let attemptsAtLastUpdate = 0

  try {
    while (results.value.length < targetCount.value && !shouldStop.value) {
      const batchSize = 1000
      for (let i = 0; i < batchSize; i++) {
        if (shouldStop.value) break

        // Generate random wallet
        const wallet = ethers.Wallet.createRandom()

        // Calculate the Nth contract address for this wallet
        const contractAddress = ethers.getCreateAddress({
          from: wallet.address,
          nonce: nonce.value
        })

        stats.value.attempts++

        if (matchesPattern(contractAddress)) {
          results.value.push({
            walletAddress: wallet.address,
            privateKey: wallet.privateKey,
            contractAddress: contractAddress,
            nonce: nonce.value
          })

          if (results.value.length >= targetCount.value) break
        }
      }

      // Update statistics
      const now = Date.now()
      if (now - lastStatsUpdate >= 1000) {
        stats.value.elapsedTime = Math.floor((now - startTime) / 1000)
        const attemptsInSecond = stats.value.attempts - attemptsAtLastUpdate
        stats.value.speed = Math.floor(attemptsInSecond / ((now - lastStatsUpdate) / 1000))
        lastStatsUpdate = now
        attemptsAtLastUpdate = stats.value.attempts
      }

      await new Promise(resolve => setTimeout(resolve, 0))
    }

    if (results.value.length >= targetCount.value) {
      toast.success(t('toast.publishSuccess'))
    }
  } catch (error) {
    console.error('生成失败:', error)
    toast.error(t('toast.error') + ': ' + error.message)
  } finally {
    generating.value = false
    stats.value.elapsedTime = Math.floor((Date.now() - startTime) / 1000)
  }
}

function stopGeneration() {
  shouldStop.value = true
}

function extractMatchedPrefix(address) {
  if (!matchPrefix.value || !prefixPattern.value) return ''
  const pattern = caseSensitive.value ? prefixPattern.value : prefixPattern.value.toLowerCase()
  return address.substring(2, 2 + pattern.length)
}

function extractMatchedSuffix(address) {
  if (!matchSuffix.value || !suffixPattern.value) return ''
  const pattern = caseSensitive.value ? suffixPattern.value : suffixPattern.value.toLowerCase()
  return address.substring(address.length - pattern.length)
}

function highlightAddress(address) {
  let result = address

  if (matchPrefix.value && prefixPattern.value) {
    const pattern = caseSensitive.value ? prefixPattern.value : prefixPattern.value.toLowerCase()
    const prefix = address.substring(0, 2 + pattern.length)
    const rest = address.substring(2 + pattern.length)
    result = `${prefix.substring(0, 2)}<span class="highlight">${prefix.substring(2)}</span>${rest}`
  }

  if (matchSuffix.value && suffixPattern.value) {
    const pattern = caseSensitive.value ? suffixPattern.value : suffixPattern.value.toLowerCase()
    const suffixStart = address.length - pattern.length

    if (matchPrefix.value && prefixPattern.value) {
      const prefixLen = 2 + (caseSensitive.value ? prefixPattern.value : prefixPattern.value.toLowerCase()).length
      const middle = address.substring(prefixLen, suffixStart)
      const suffix = address.substring(suffixStart)
      result = result.replace(middle + suffix, `${middle}<span class="highlight">${suffix}</span>`)
    } else {
      const before = address.substring(0, suffixStart)
      const suffix = address.substring(suffixStart)
      result = `${before}<span class="highlight">${suffix}</span>`
    }
  }

  return result
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}${t('contractVanity.seconds')}`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes < 60) return `${minutes}${t('contractVanity.minutes')}${secs}${t('contractVanity.seconds')}`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}${t('contractVanity.hours')}${mins}${t('contractVanity.minutes')}${secs}${t('contractVanity.seconds')}`
}

function exportAsJSON() {
  const data = JSON.stringify(results.value, null, 2)
  downloadFile(data, `contract_vanity_${Date.now()}.json`, 'application/json')
}

function exportAsCSV() {
  let csv = 'Index,ContractAddress,WalletAddress,PrivateKey,Nonce\n'
  results.value.forEach((result, index) => {
    csv += `${index + 1},${result.contractAddress},${result.walletAddress},${result.privateKey},${result.nonce}\n`
  })
  downloadFile(csv, `contract_vanity_${Date.now()}.csv`, 'text/csv')
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(t('toast.success'))
  } catch (error) {
    console.error('复制失败:', error)
    toast.error(t('toast.error'))
  }
}

async function showQRCode(content, type) {
  qrContent.value = content
  qrModalTitle.value = `${type} ${t('qrCode.title')}`
  showQRModal.value = true

  await new Promise(resolve => setTimeout(resolve, 100))

  if (qrCanvas.value) {
    try {
      await QRCode.toCanvas(qrCanvas.value, content, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      console.error('生成二维码失败:', error)
      toast.error(t('toast.error'))
    }
  }
}

function closeQRModal() {
  showQRModal.value = false
  qrContent.value = ''
  qrModalTitle.value = ''
}

function downloadQRCode() {
  if (!qrCanvas.value) return

  try {
    const link = document.createElement('a')
    link.download = `contract_vanity_qrcode_${Date.now()}.png`
    link.href = qrCanvas.value.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('下载失败:', error)
    toast.error(t('toast.error'))
  }
}
</script>

<style scoped>
.contract-vanity-page {
  width: 100%;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.generator-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.hint {
  font-size: 12px;
  color: #95a5a6;
  margin-top: -4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-group input[type="text"],
.form-group input[type="number"],
.pattern-input {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #f0b90b;
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.generate-btn,
.stop-btn {
  padding: 12px 32px;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-btn {
  background: #f0b90b;
}

.generate-btn:hover:not(:disabled) {
  background: #d69e0a;
  transform: translateY(-1px);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.stop-btn {
  background: #e74c3c;
  margin-top: 8px;
}

.stop-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.stat-value.success {
  color: #2ecc71;
}

.results-section {
  border-top: 2px solid #f8f9fa;
  padding-top: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.results-header h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.export-buttons {
  display: flex;
  gap: 8px;
}

.export-btn {
  padding: 8px 16px;
  background: white;
  color: #2c3e50;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  border-color: #f0b90b;
  background: #fffbf0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.result-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
}

.result-item:hover {
  border-color: #f0b90b;
  background: #fffbf0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-number {
  font-weight: 700;
  color: #f0b90b;
  font-size: 16px;
}

.result-match {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.match-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Monaco', 'Courier New', monospace;
}

.match-badge.prefix {
  background: #3498db;
  color: white;
}

.match-badge.suffix {
  background: #9b59b6;
  color: white;
}

.match-badge.nonce {
  background: #2ecc71;
  color: white;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  font-weight: 600;
  color: #6c757d;
  font-size: 12px;
  min-width: 60px;
}

.value {
  flex: 1;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #2c3e50;
  word-break: break-all;
}

.value :deep(.highlight) {
  background: #ffe135;
  padding: 2px 0;
  font-weight: 700;
  color: #000;
}

.address {
  color: #e67e22;
  font-weight: 600;
}

.wallet-address {
  color: #3498db;
}

.private-key {
  color: #e74c3c;
}

.action-btn {
  padding: 6px 8px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  flex-shrink: 0;
}

.action-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.copy-btn:hover {
  border-color: #3498db;
  color: #3498db;
  background: #e3f2fd;
}

.qr-btn:hover {
  border-color: #9b59b6;
  color: #9b59b6;
  background: #f3e5f5;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #6c757d;
  font-size: 16px;
  margin: 8px 0;
}

.empty-hint {
  font-size: 14px !important;
  color: #95a5a6 !important;
}

.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card.warning {
  background: #fff3cd;
  border: 2px solid #ffc107;
}

.info-card h4 {
  color: #2c3e50;
  margin: 0 0 12px 0;
  font-size: 16px;
}

.info-card.warning h4 {
  color: #856404;
}

.warning-text {
  color: #856404;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-line;
  margin: 0;
}

.info-card ul {
  margin: 0;
  padding-left: 20px;
  color: #6c757d;
}

.info-card.warning p {
  color: #856404;
  margin: 0;
}

.info-card li {
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 968px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .export-buttons {
    width: 100%;
  }

  .export-btn {
    flex: 1;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }
}

/* QR Code Modal - Reused styles */
.qr-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.qr-modal {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.qr-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.qr-modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #95a5a6;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.qr-modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
}

.qr-canvas {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 12px;
  background: white;
}

.qr-text {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 11px;
  color: #6c757d;
  word-break: break-all;
  text-align: center;
  max-width: 100%;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  max-height: 100px;
  overflow-y: auto;
}

.qr-modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.download-qr-btn {
  padding: 12px 32px;
  background: #f0b90b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-qr-btn:hover {
  background: #d69e0a;
  transform: translateY(-1px);
}
</style>
