<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <h1>📱 {{ t('qrCode.title') }}</h1>
      <p class="subtitle">
        {{ t('qrCode.subtitle') }}
      </p>
    </div>

    <!-- Main Tool Card -->
    <div class="tool-card">
      <div class="qr-layout">
        <!-- Input Section -->
        <div class="input-col">
          <label class="input-label">
            {{ t('qrCode.inputLabel') }}
            <span class="char-count">({{ inputText.length }})</span>
          </label>
          <textarea
            v-model="inputText"
            :placeholder="t('qrCode.inputPlaceholder')"
            rows="8"
            class="qr-textarea"
            @input="handleInput"
          />

          <!-- Settings (Collapsible) -->
          <div class="settings-section">
            <button
              class="settings-toggle"
              @click="showSettings = !showSettings"
            >
              <span>⚙️ {{ t('qrCode.settings') }}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                :style="{ transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"
              >
                <path d="M8 11L4 6h8z" />
              </svg>
            </button>

            <div
              v-if="showSettings"
              class="settings-content"
            >
              <div class="setting-row">
                <label>{{ t('qrCode.size') }}</label>
                <div class="size-buttons">
                  <button
                    v-for="size in sizeOptions"
                    :key="size.value"
                    class="size-btn"
                    :class="{ active: selectedSize === size.value }"
                    @click="selectedSize = size.value; generateQRCode()"
                  >
                    {{ size.label }}
                  </button>
                </div>
              </div>

              <div class="setting-row">
                <label>{{ t('qrCode.errorCorrection') }}</label>
                <select
                  v-model="errorCorrectionLevel"
                  class="qr-select"
                  @change="generateQRCode"
                >
                  <option value="L">
                    {{ t('qrCode.lowLevel') }}
                  </option>
                  <option value="M">
                    {{ t('qrCode.mediumLevel') }}
                  </option>
                  <option value="Q">
                    {{ t('qrCode.qualityLevel') }}
                  </option>
                  <option value="H">
                    {{ t('qrCode.highLevel') }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="preview-col">
          <div class="preview-card">
            <div
              v-if="inputText.trim()"
              class="qr-preview"
            >
              <canvas
                ref="qrcodeCanvas"
                class="qr-canvas"
              />
              <div
                v-if="generating"
                class="qr-loading"
              >
                ⏳ 生成中...
              </div>
            </div>

            <div
              v-else
              class="qr-empty"
            >
              <div class="empty-icon">
                📱
              </div>
              <p>输入内容后将自动生成二维码</p>
            </div>

            <div
              v-if="qrError"
              class="qr-error"
            >
              ⚠️ {{ qrError }}
            </div>

            <div
              v-if="inputText.trim() && !generating"
              class="download-buttons"
            >
              <button
                class="download-btn primary"
                @click="downloadQRCode('png')"
              >
                ⬇️ PNG
              </button>
              <button
                class="download-btn secondary"
                @click="downloadQRCode('jpg')"
              >
                ⬇️ JPG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="info-cards">
      <!-- Usage Info -->
      <div class="info-card">
        <button
          class="info-header"
          @click="showUsageInfo = !showUsageInfo"
        >
          <span>📖 {{ t('qrCode.usageInfo') }}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            :style="{ transform: showUsageInfo ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"
          >
            <path d="M8 11L4 6h8z" />
          </svg>
        </button>
        <ul
          v-if="showUsageInfo"
          class="info-list"
        >
          <li>{{ t('qrCode.usageInfoDesc1') }}</li>
          <li>{{ t('qrCode.usageInfoDesc2') }}</li>
          <li>{{ t('qrCode.usageInfoDesc3') }}</li>
          <li>{{ t('qrCode.usageInfoDesc4') }}</li>
        </ul>
      </div>

      <!-- Security Warning -->
      <div class="info-card warning">
        <button
          class="info-header"
          @click="showPrivacyInfo = !showPrivacyInfo"
        >
          <span>⚠️ {{ t('qrCode.securityWarning') }}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            :style="{ transform: showPrivacyInfo ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"
          >
            <path d="M8 11L4 6h8z" />
          </svg>
        </button>
        <div
          v-if="showPrivacyInfo"
          class="warning-content"
        >
          {{ t('qrCode.securityNote') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import { useToast } from '@/composables/useToast'
import { useI18n } from '../i18n'
import { useSEO, getPageSEO } from '@/composables/useSEO'

const pageSEO = getPageSEO('qrcode')
useSEO({
  title: pageSEO.title,
  description: pageSEO.description,
  keywords: pageSEO.keywords
})

const toast = useToast()
const { t } = useI18n()

const inputText = ref('')
const selectedSize = ref(256)
const errorCorrectionLevel = ref('M')
const qrcodeCanvas = ref(null)
const generating = ref(false)
const qrError = ref('')

const showSettings = ref(false)
const showUsageInfo = ref(false)
const showPrivacyInfo = ref(false)

const sizeOptions = [
  { label: '小', value: 200 },
  { label: '中', value: 256 },
  { label: '大', value: 400 },
  { label: '超大', value: 512 }
]

let debounceTimer = null

function handleInput() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    generateQRCode()
  }, 300)
}

async function generateQRCode() {
  if (!inputText.value.trim()) {
    qrError.value = ''
    return
  }

  if (!qrcodeCanvas.value) {
    return
  }

  try {
    generating.value = true
    qrError.value = ''

    await QRCode.toCanvas(qrcodeCanvas.value, inputText.value, {
      width: selectedSize.value,
      errorCorrectionLevel: errorCorrectionLevel.value,
      margin: 1
    })

    generating.value = false
  } catch (error) {
    qrError.value = error.message || '生成失败'
    generating.value = false
  }
}

async function downloadQRCode(format) {
  if (!qrcodeCanvas.value) return

  try {
    const dataUrl = qrcodeCanvas.value.toDataURL(`image/${format}`)
    const link = document.createElement('a')
    link.download = `qrcode.${format}`
    link.href = dataUrl
    link.click()

    toast.success(`已下载二维码 (${format.toUpperCase()})`)
  } catch (error) {
    toast.error('下载失败')
  }
}

watch([selectedSize, errorCorrectionLevel], () => {
  if (inputText.value.trim()) {
    generateQRCode()
  }
})
</script>

<style scoped>
.qr-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.char-count {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 400;
}

.qr-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.15s ease;
}

.qr-textarea:focus {
  outline: none;
  border-color: var(--text-primary);
}

/* Settings */
.settings-section {
  border-top: 1px solid var(--border-primary);
  padding-top: 16px;
}

.settings-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.15s ease;
}

.settings-toggle:hover {
  color: var(--accent-hover);
}

.settings-content {
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-row label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.size-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.size-btn {
  padding: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.size-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.size-btn.active {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--bg-secondary);
}

.qr-select {
  padding: 8px 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.qr-select:focus {
  outline: none;
  border-color: var(--text-primary);
}

/* Preview */
.preview-col {
  display: flex;
  flex-direction: column;
}

.preview-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 400px;
  justify-content: center;
}

.qr-preview {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-canvas {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}

.qr-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-secondary);
}

.qr-empty {
  text-align: center;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.qr-empty p {
  font-size: 14px;
  margin: 0;
}

.qr-error {
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  color: #dc2626;
  font-size: 13px;
  text-align: center;
}

.download-buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}

.download-btn {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.download-btn.primary {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--bg-secondary);
}

.download-btn.primary:hover {
  background: var(--accent-secondary);
  border-color: var(--accent-secondary);
}

.download-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.download-btn.secondary:hover {
  border-color: var(--text-primary);
}

/* Info Cards */
.info-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.info-card.warning {
  border-color: #fbbf24;
  background: #fffbeb;
}

.info-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
}

.info-header:hover {
  background: var(--bg-hover);
}

.info-list {
  padding: 0 20px 16px 40px;
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.info-list li {
  margin-bottom: 8px;
}

.warning-content {
  padding: 0 20px 16px 20px;
  font-size: 13px;
  line-height: 1.6;
  color: #92400e;
  white-space: pre-line;
}

/* Responsive */
@media (max-width: 900px) {
  .qr-layout {
    grid-template-columns: 1fr;
  }

  .preview-card {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .size-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
