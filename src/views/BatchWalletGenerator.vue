<template>
  <div class="batch-wallet-page">
    <div class="page-container">
      <div class="page-header">
        <h1>📦 {{ t('batchWallet.title') }}</h1>
        <p class="subtitle">
          {{ t('batchWallet.subtitle') }}
        </p>
      </div>

      <div class="generator-card">
        <div class="input-section">
          <div class="form-group">
            <label>{{ t('batchWallet.countLabel') }}</label>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              max="10000"
              :placeholder="t('batchWallet.countLabel')"
              :disabled="generating"
            >
          </div>

          <button
            class="generate-btn"
            :disabled="generating || !quantity || quantity < 1 || quantity > 10000"
            @click="generateWallets"
          >
            <span v-if="!generating">🚀 {{ t('batchWallet.generate') }}</span>
            <span v-else>⏳ {{ t('batchWallet.generating') }} {{ progress }}/{{ quantity }}</span>
          </button>
        </div>

        <div
          v-if="wallets.length > 0"
          class="results-section"
        >
          <div class="results-header">
            <h3>{{ wallets.length }} {{ t('batchWallet.countLabel') }}</h3>
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

          <div class="wallets-list">
            <div
              v-for="(wallet, index) in wallets"
              :key="index"
              class="wallet-item"
            >
              <div class="wallet-number">
                #{{ index + 1 }}
              </div>
              <div class="wallet-info">
                <div class="info-row">
                  <span class="label">{{ t('batchWallet.address') }}:</span>
                  <span class="value address">{{ wallet.address }}</span>
                  <button
                    class="action-btn copy-btn"
                    :title="t('batchWallet.address')"
                    @click="copyToClipboard(wallet.address)"
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
                    @click="showQRCode(wallet.address, t('batchWallet.address'))"
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
                  <span class="value private-key">{{ wallet.privateKey }}</span>
                  <button
                    class="action-btn copy-btn"
                    :title="t('batchWallet.privateKey')"
                    @click="copyToClipboard(wallet.privateKey)"
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
                    @click="showQRCode(wallet.privateKey, t('batchWallet.privateKey'))"
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
          v-if="wallets.length === 0 && !generating"
          class="empty-state"
        >
          <div class="empty-icon">
            💼
          </div>
          <p>{{ t('batchWallet.countLabel') }}</p>
          <p class="empty-hint">
            {{ t('batchWallet.generate') }}
          </p>
        </div>
      </div>

      <div class="warning-section">
        <div class="warning-icon">
          ⚠️
        </div>
        <div class="warning-content">
          <h4>{{ t('batchWallet.securityWarning') }}</h4>
          <p class="warning-text">
            {{ t('batchWallet.securityNote') }}
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
import { ref } from 'vue'
import { ethers } from 'ethers'
import QRCode from 'qrcode'
import { useToast } from '@/composables/useToast'
import { useI18n } from '../i18n'
import { useSEO, getPageSEO } from '@/composables/useSEO'

// SEO Configuration
const pageSEO = getPageSEO('batchWallet')
useSEO({
  title: pageSEO.title,
  description: pageSEO.description,
  keywords: pageSEO.keywords
})

const toast = useToast()
const { t } = useI18n()

const quantity = ref(10)
const wallets = ref([])
const generating = ref(false)
const progress = ref(0)

// QR Code modal state
const showQRModal = ref(false)
const qrModalTitle = ref('')
const qrContent = ref('')
const qrCanvas = ref(null)

async function generateWallets() {
  if (!quantity.value || quantity.value < 1 || quantity.value > 10000) {
    toast.warning(t('toast.warning'))
    return
  }

  try {
    generating.value = true
    progress.value = 0
    wallets.value = []

    // Generate in batches to avoid UI freezing
    const batchSize = 50
    const totalBatches = Math.ceil(quantity.value / batchSize)

    for (let batch = 0; batch < totalBatches; batch++) {
      const currentBatchSize = Math.min(batchSize, quantity.value - batch * batchSize)
      const batchWallets = []

      for (let i = 0; i < currentBatchSize; i++) {
        const wallet = ethers.Wallet.createRandom()
        batchWallets.push({
          address: wallet.address,
          privateKey: wallet.privateKey
        })
        progress.value++
      }

      wallets.value.push(...batchWallets)

      // Give UI time to update
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    toast.success(t('toast.publishSuccess'))
  } catch (error) {
    console.error('生成钱包失败:', error)
    toast.error(t('toast.error') + ': ' + error.message)
  } finally{
    generating.value = false
  }
}

function exportAsJSON() {
  const data = JSON.stringify(wallets.value, null, 2)
  downloadFile(data, `wallets_${Date.now()}.json`, 'application/json')
}

function exportAsCSV() {
  let csv = 'Index,Address,PrivateKey\n'
  wallets.value.forEach((wallet, index) => {
    csv += `${index + 1},${wallet.address},${wallet.privateKey}\n`
  })
  downloadFile(csv, `wallets_${Date.now()}.csv`, 'text/csv')
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

  // Wait for DOM update
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
    link.download = `wallet_qrcode_${Date.now()}.png`
    link.href = qrCanvas.value.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('下载失败:', error)
    toast.error(t('toast.error'))
  }
}
</script>

<style scoped>
.batch-wallet-page {
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
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 24px;
  margin-bottom: 20px;
}

.input-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-end;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.form-group input {
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
}

.generate-btn {
  padding: 12px 32px;
  background: #f0b90b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.generate-btn:hover:not(:disabled) {
  background: #d69e0a;
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.wallets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.wallets-list::-webkit-scrollbar {
  width: 6px;
}

.wallets-list::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 3px;
}

.wallets-list::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.wallets-list::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

.wallet-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.wallet-item:hover {
  border-color: #f0b90b;
  background: #fffbf0;
}

.wallet-number {
  font-weight: 700;
  color: #f0b90b;
  font-size: 14px;
  min-width: 40px;
}

.wallet-info {
  flex: 1;
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
  min-width: 40px;
}

.value {
  flex: 1;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #2c3e50;
  word-break: break-all;
}

.address {
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
  border-color: #c0c0c0;
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

.warning-section {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 12px;
}

.warning-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.warning-content h4 {
  color: #856404;
  margin: 0 0 12px 0;
  font-size: 16px;
}

.warning-text {
  color: #856404;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-line;
  margin: 0;
}

.warning-content ul {
  margin: 0;
  padding-left: 20px;
  color: #856404;
}

.warning-content li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.5;
}

/* QR Code Modal */
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.qr-modal {
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 24px;
  max-width: 450px;
  width: 90%;
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
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-qr-btn:hover {
  background: #d69e0a;
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
  }

  .generate-btn {
    width: 100%;
  }

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

  .info-row {
    flex-wrap: wrap;
  }

  .value {
    width: 100%;
  }

  .qr-modal {
    width: 95%;
    padding: 20px;
  }

  .qr-canvas {
    max-width: 100%;
  }
}
</style>
