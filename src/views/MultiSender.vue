<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <h1>{{ t('multiSender.title') }}</h1>
      <p class="subtitle">
        {{ t('multiSender.subtitle') }}
      </p>
    </div>

    <!-- Main Card -->
    <div class="tool-card">
      <!-- Wallet Connect Section -->
      <div class="section wallet-connect-section">
        <div v-if="!isConnected">
          <button
            class="primary-button large"
            @click="connectWallet"
          >
            🔗 {{ t('multiSender.connectWallet') }}
          </button>
          <div class="connect-hint">
            {{ t('multiSender.connectHint') }}
          </div>
        </div>
        <div
          v-else
          class="connected-wallet"
        >
          <div class="wallet-info">
            <span class="wallet-icon">✅</span>
            <span class="wallet-address">{{ formatAddress(address) }}</span>
          </div>
          <button
            class="secondary-button"
            @click="disconnectWallet"
          >
            {{ t('common.disconnect') }}
          </button>
        </div>
      </div>

      <!-- Token Type Selection -->
      <div class="section">
        <label class="section-label">{{ t('multiSender.selectToken') }}</label>
        <div class="token-type-selector">
          <button
            class="token-type-btn"
            :class="{ active: tokenType === 'BNB' }"
            @click="selectTokenType('BNB')"
          >
            💰 BNB
          </button>
          <button
            class="token-type-btn"
            :class="{ active: tokenType === 'ERC20' }"
            @click="selectTokenType('ERC20')"
          >
            🪙 ERC20
          </button>
        </div>
      </div>

      <!-- ERC20 Token Address -->
      <div
        v-if="tokenType === 'ERC20'"
        class="section"
      >
        <label class="section-label">{{ t('multiSender.tokenAddress') }}</label>
        <div class="input-with-button">
          <input
            v-model="tokenAddress"
            type="text"
            :placeholder="t('multiSender.tokenPlaceholder')"
            class="text-input"
            @blur="validateTokenIfNeeded"
          >
          <button
            class="secondary-button"
            :disabled="!tokenAddress || loadingToken"
            @click="validateToken"
          >
            {{ loadingToken ? t('multiSender.validating') : t('multiSender.validate') }}
          </button>
        </div>

        <!-- Token Info Display -->
        <div
          v-if="tokenInfo"
          class="token-info-box"
        >
          <div class="info-row">
            <span class="label">{{ t('multiSender.tokenName') }}:</span>
            <span class="value">{{ tokenInfo.name }} ({{ tokenInfo.symbol }})</span>
          </div>
          <div class="info-row">
            <span class="label">{{ t('multiSender.decimals') }}:</span>
            <span class="value">{{ tokenInfo.decimals }}</span>
          </div>
          <div
            v-if="isConnected"
            class="info-row"
          >
            <span class="label">{{ t('multiSender.yourBalance') }}:</span>
            <span class="value">{{ tokenInfo.balance }} {{ tokenInfo.symbol }}</span>
          </div>
        </div>
      </div>

      <!-- Recipients Input -->
      <div class="section">
        <div class="section-header">
          <label class="section-label">{{ t('multiSender.recipientsList') }}</label>
          <div class="action-buttons">
            <button
              class="link-button"
              @click="downloadTemplate"
            >
              📥 {{ t('multiSender.downloadTemplate') }}
            </button>
            <button
              class="link-button"
              @click="handleFileUpload"
            >
              📤 {{ t('multiSender.uploadCSV') }}
            </button>
            <button
              class="link-button"
              @click="loadSampleData"
            >
              📝 {{ t('multiSender.sampleData') }}
            </button>
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              class="file-input-hidden"
              @change="onFileSelected"
            >
            <button
              v-if="recipients.length > 0"
              class="link-button"
              @click="clearAll"
            >
              🗑️ {{ t('common.clear') }}
            </button>
          </div>
        </div>

        <textarea
          v-model="recipientsText"
          :placeholder="t('multiSender.inputPlaceholder')"
          class="recipients-textarea"
          rows="12"
          @input="handleTextInput"
        />

        <div class="input-hint">
          {{ t('multiSender.inputHint') }}
        </div>
      </div>

      <!-- Validation Results -->
      <div
        v-if="validationSummary && recipients.length > 0"
        class="section"
      >
        <div class="validation-summary">
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">{{ t('multiSender.total') }}:</span>
              <span class="stat-value">{{ validationSummary.total }}</span>
            </div>
            <div class="stat-item success">
              <span class="stat-label">{{ t('multiSender.valid') }}:</span>
              <span class="stat-value">{{ validationSummary.valid }} ✅</span>
            </div>
            <div
              v-if="validationSummary.invalid > 0"
              class="stat-item error"
            >
              <span class="stat-label">{{ t('multiSender.invalid') }}:</span>
              <span class="stat-value">{{ validationSummary.invalid }} ❌</span>
            </div>
            <div
              v-if="validationSummary.duplicates > 0"
              class="stat-item warning"
            >
              <span class="stat-label">{{ t('multiSender.duplicates') }}:</span>
              <span class="stat-value">{{ validationSummary.duplicates }} ⚠️</span>
            </div>
          </div>

          <!-- Error Details -->
          <div
            v-if="validationSummary.invalid > 0 || validationSummary.duplicates > 0"
            class="validation-errors"
          >
            <button
              class="link-button"
              @click="showErrors = !showErrors"
            >
              {{ showErrors ? '▼' : '▶' }} {{ t('multiSender.viewErrors') }}
            </button>
            <div
              v-if="showErrors"
              class="error-list"
            >
              <div
                v-for="(recipient, index) in invalidRecipients"
                :key="index"
                class="error-item"
              >
                Line {{ recipient.index }}: {{ recipient.address || 'empty' }} - {{ recipient.validation.errors.join(', ') }}
              </div>
            </div>
          </div>

          <button
            v-if="validationSummary.invalid > 0"
            class="danger-button"
            @click="removeInvalid"
          >
            {{ t('multiSender.removeInvalid') }}
          </button>
        </div>
      </div>

      <!-- Batch Edit -->
      <div
        v-if="validRecipients.length > 0"
        class="section"
      >
        <label class="section-label">{{ t('multiSender.batchEdit') }}</label>
        <div class="batch-edit-list">
          <!-- Uniform Amount -->
          <div class="batch-edit-row">
            <input
              v-model="uniformAmount"
              type="number"
              step="0.000001"
              :placeholder="t('multiSender.uniformAmount')"
              class="text-input"
            >
            <button
              class="secondary-button"
              :disabled="!uniformAmount || uniformAmount <= 0"
              @click="applyUniformAmount"
            >
              {{ t('multiSender.setAll') }}
            </button>
          </div>

          <!-- Multiply Factor -->
          <div class="batch-edit-row">
            <input
              v-model="multiplyFactor"
              type="number"
              step="0.1"
              :placeholder="t('multiSender.multiplyFactor')"
              class="text-input"
            >
            <button
              class="secondary-button"
              :disabled="!multiplyFactor || multiplyFactor <= 0"
              @click="applyMultiply"
            >
              {{ t('multiSender.multiply') }}
            </button>
          </div>

          <!-- Add/Subtract Offset -->
          <div class="batch-edit-row">
            <input
              v-model="offsetAmount"
              type="number"
              step="0.000001"
              :placeholder="t('multiSender.addSubtract')"
              class="text-input"
            >
            <button
              class="secondary-button"
              :disabled="!offsetAmount || offsetAmount === 0"
              @click="applyOffset"
            >
              {{ t('common.apply') }}
            </button>
          </div>

          <!-- Random Amount -->
          <div class="batch-edit-row random-row">
            <input
              v-model="randomMin"
              type="number"
              step="0.000001"
              :placeholder="t('multiSender.minAmount')"
              class="text-input"
            >
            <input
              v-model="randomMax"
              type="number"
              step="0.000001"
              :placeholder="t('multiSender.maxAmount')"
              class="text-input"
            >
            <input
              v-model="randomDecimals"
              type="number"
              min="0"
              max="18"
              :placeholder="t('multiSender.decimals')"
              class="text-input decimals-input"
            >
            <button
              class="secondary-button"
              :disabled="!randomMin || !randomMax || parseFloat(randomMin) >= parseFloat(randomMax)"
              @click="applyRandomAmount"
            >
              {{ t('multiSender.randomize') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Recipients Table (Editable) -->
      <div
        v-if="validRecipients.length > 0"
        class="section"
      >
        <div class="section-header">
          <label class="section-label">{{ t('multiSender.editableList') }} ({{ validRecipients.length }})</label>
          <button
            class="link-button"
            @click="exportData"
          >
            📥 {{ t('multiSender.export') }}
          </button>
        </div>

        <div class="table-container">
          <table class="recipients-table">
            <thead>
              <tr>
                <th style="width: 60px">
                  #
                </th>
                <th>{{ t('multiSender.address') }}</th>
                <th style="width: 180px">
                  {{ t('multiSender.amount') }}
                </th>
                <th style="width: 80px">
                  {{ t('multiSender.actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="recipient in paginatedRecipients"
                :key="recipient.id"
              >
                <td>{{ recipient.index }}</td>
                <td class="address-cell">
                  <span class="address-mono">{{ recipient.address }}</span>
                </td>
                <td>
                  <input
                    v-model="recipient.amount"
                    type="number"
                    step="0.000001"
                    class="amount-input"
                    @input="onAmountChange(recipient)"
                  >
                </td>
                <td class="actions-cell">
                  <button
                    class="icon-button"
                    :title="t('common.delete')"
                    @click="removeRecipient(recipient.id)"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="pagination"
        >
          <button
            class="pagination-button"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            ‹
          </button>
          <span class="pagination-info">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            class="pagination-button"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            ›
          </button>
        </div>
      </div>

      <!-- Send Summary -->
      <div
        v-if="validRecipients.length > 0"
        class="section send-section"
      >
        <div class="send-summary">
          <div class="summary-row">
            <span class="label">{{ t('multiSender.recipients') }}:</span>
            <span class="value">{{ validRecipients.length }}</span>
          </div>
          <div class="summary-row">
            <span class="label">{{ t('multiSender.totalAmount') }}:</span>
            <span class="value">{{ totalAmount }} {{ currentTokenSymbol }}</span>
          </div>
          <div class="summary-row">
            <span class="label">{{ t('multiSender.estimatedGas') }}:</span>
            <span class="value">~{{ estimatedGas }} BNB</span>
          </div>
          <div class="summary-row total">
            <span class="label">{{ t('multiSender.grandTotal') }}:</span>
            <span class="value">{{ grandTotal }} {{ tokenType === 'BNB' ? 'BNB' : currentTokenSymbol }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="send-actions">
          <!-- Not Connected: Show Connect Button -->
          <button
            v-if="!isConnected"
            class="primary-button large"
            @click="connectWallet"
          >
            🔗 {{ t('multiSender.connectToSend') }}
          </button>

          <!-- Connected: BNB (Native) - Direct Send -->
          <template v-else-if="tokenType === 'BNB'">
            <button
              class="primary-button large"
              :disabled="sending || validRecipients.length === 0"
              @click="confirmAndSend"
            >
              {{ sending ? t('multiSender.sending') : '📤 ' + t('multiSender.send') }}
            </button>
          </template>

          <!-- Connected: ERC20 - Need Approval -->
          <template v-else-if="tokenType === 'ERC20' && needsApproval">
            <div class="approval-notice">
              ℹ️ {{ t('multiSender.approvalNeeded') }}
            </div>
            <button
              class="primary-button large"
              :disabled="approving"
              @click="approveToken"
            >
              {{ approving ? t('multiSender.approving') : t('multiSender.approveToken') }}
            </button>
          </template>

          <!-- Connected: ERC20 - Approved, Ready to Send -->
          <template v-else-if="tokenType === 'ERC20' && !needsApproval">
            <button
              class="primary-button large"
              :disabled="sending || validRecipients.length === 0"
              @click="confirmAndSend"
            >
              {{ sending ? t('multiSender.sending') : '📤 ' + t('multiSender.send') }}
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- How It Works -->
    <div class="tool-card info-card">
      <div class="info-icon">
        💡
      </div>
      <div class="info-content">
        <h3>{{ t('multiSender.howItWorks') }}</h3>
        <p>{{ t('multiSender.workingPrinciple') }}</p>
      </div>
    </div>

    <!-- Security Warning -->
    <div class="tool-card warning-card">
      <div class="warning-icon">
        ⚠️
      </div>
      <div class="warning-content">
        <h3>{{ t('multiSender.securityWarning') }}</h3>
        <p>{{ t('multiSender.securityNote') }}</p>
      </div>
    </div>

    <!-- Confirm Dialogs -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      :title="t('common.confirmAction')"
      :message="t('multiSender.confirmSend')"
      :confirm-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      @confirm="executeSend"
    />

    <ConfirmDialog
      v-model="showClearDialog"
      :title="t('common.confirmAction')"
      :message="t('multiSender.confirmClear')"
      :confirm-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      @confirm="executeClear"
    />

    <!-- Toaster -->
    <Toaster
      position="top-right"
      :theme="'light'"
      :duration="3000"
      rich-colors
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from '@wagmi/vue'
import { useI18n } from '../i18n'
import { modal } from '../composables/useWallet'
import { createPublicClient, http, formatUnits, parseUnits } from 'viem'
import { bsc } from 'viem/chains'
import { toast, Toaster } from 'vue-sonner'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { DISPERSE_ADDRESS, DISPERSE_ABI, ERC20_ABI } from '../contracts/disperse'
import {
  parseCSV,
  parseSimpleText,
  validateRecipients,
  calculateTotal,
  downloadCSVTemplate,
  exportToCSV,
  validateRecipient
} from '../utils/csvParser'

const { t } = useI18n()

// Wallet state
const { address, isConnected } = useAccount()
const { disconnect } = useDisconnect()

// Create public client for BSC mainnet
const publicClient = createPublicClient({
  chain: bsc,
  transport: http()
})

// Token selection
const tokenType = ref('BNB')
const tokenAddress = ref('')
const tokenInfo = ref(null)
const loadingToken = ref(false)

// Recipients data
const recipients = ref([])
const recipientsText = ref('')
const validationSummary = ref(null)
const showErrors = ref(false)
const fileInput = ref(null)

// Batch edit
const uniformAmount = ref('')
const multiplyFactor = ref('')
const offsetAmount = ref('')
const randomMin = ref('')
const randomMax = ref('')
const randomDecimals = ref('6')

// Pagination
const currentPage = ref(1)
const pageSize = 20

// Transaction state
const needsApproval = ref(false)
const approving = ref(false)
const sending = ref(false)

// Dialog state
const showConfirmDialog = ref(false)
const showClearDialog = ref(false)

// Computed
const currentTokenSymbol = computed(() => {
  if (tokenType.value === 'BNB') return 'BNB'
  return tokenInfo.value?.symbol || 'TOKEN'
})

const validRecipients = computed(() => {
  return recipients.value.filter(r => r.validation?.valid)
})

const invalidRecipients = computed(() => {
  return recipients.value.filter(r => !r.validation?.valid)
})

const totalAmount = computed(() => {
  return calculateTotal(validRecipients.value)
})

const estimatedGas = computed(() => {
  const baseGas = 0.0001
  const perRecipient = 0.00003
  return (baseGas + perRecipient * validRecipients.value.length).toFixed(6)
})

const grandTotal = computed(() => {
  const total = parseFloat(totalAmount.value)
  const gas = parseFloat(estimatedGas.value)
  if (tokenType.value === 'BNB') {
    return (total + gas).toFixed(6)
  }
  return total.toFixed(6)
})

const totalPages = computed(() => {
  return Math.ceil(validRecipients.value.length / pageSize)
})

const paginatedRecipients = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return validRecipients.value.slice(start, end)
})

// Methods
const selectTokenType = (type) => {
  tokenType.value = type
  if (type === 'BNB') {
    tokenAddress.value = ''
    tokenInfo.value = null
    needsApproval.value = false
  } else {
    needsApproval.value = true
  }
}

const validateTokenIfNeeded = () => {
  if (tokenAddress.value && !tokenInfo.value) {
    validateToken()
  }
}

const validateToken = async () => {
  if (!tokenAddress.value) return

  loadingToken.value = true
  try {
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress.value)) {
      throw new Error('Invalid address format')
    }

    const name = await publicClient.readContract({
      address: tokenAddress.value,
      abi: ERC20_ABI,
      functionName: 'name'
    })

    const symbol = await publicClient.readContract({
      address: tokenAddress.value,
      abi: ERC20_ABI,
      functionName: 'symbol'
    })

    const decimals = await publicClient.readContract({
      address: tokenAddress.value,
      abi: ERC20_ABI,
      functionName: 'decimals'
    })

    let balance = '0.00'

    if (isConnected.value && address.value) {
      const balanceRaw = await publicClient.readContract({
        address: tokenAddress.value,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address.value]
      })

      balance = formatUnits(balanceRaw, decimals)
    }

    tokenInfo.value = {
      name,
      symbol,
      decimals: Number(decimals),
      balance
    }

    needsApproval.value = true
  } catch (error) {
    console.error('Token validation error:', error)
    toast.error(t('multiSender.invalidToken') + ': ' + error.message)
    tokenInfo.value = null
  } finally {
    loadingToken.value = false
  }
}

const loadSampleData = () => {
  const sampleData = `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,1.0
0x220866B1A2219f40e72f5c628B65D54268cA3A9D,1.5
0x28C6c06298d514Db089934071355E5743bf21d60,2.0`

  recipientsText.value = sampleData
  handleTextInput()
}

const handleTextInput = () => {
  try {
    const parsed = parseSimpleText(recipientsText.value)
    recipients.value = parsed
    validateData()
  } catch (error) {
    console.error('Parse error:', error)
  }
}

const handleFileUpload = () => {
  fileInput.value?.click()
}

const onFileSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const parsed = await parseCSV(file)
    recipients.value = parsed

    recipientsText.value = parsed
      .map(r => `${r.address},${r.amount}`)
      .join('\n')

    validateData()

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    console.error('File upload error:', error)
    toast.error(t('multiSender.parseError') + ': ' + error.message)
  }
}

const validateData = () => {
  if (recipients.value.length === 0) {
    validationSummary.value = null
    return
  }

  const decimals = tokenType.value === 'BNB' ? 18 : tokenInfo.value?.decimals || 18
  const result = validateRecipients(recipients.value, decimals)
  validationSummary.value = result
  recipients.value = result.results
  currentPage.value = 1
}

const removeInvalid = () => {
  recipients.value = validRecipients.value

  recipientsText.value = recipients.value
    .map(r => `${r.address},${r.amount}`)
    .join('\n')

  validateData()
}

const removeRecipient = (id) => {
  recipients.value = recipients.value.filter(r => r.id !== id)

  recipientsText.value = recipients.value
    .map(r => `${r.address},${r.amount}`)
    .join('\n')

  if (recipients.value.length > 0) {
    validateData()
  } else {
    validationSummary.value = null
  }
}

const onAmountChange = (recipient) => {
  const decimals = tokenType.value === 'BNB' ? 18 : tokenInfo.value?.decimals || 18
  recipient.validation = validateRecipient(recipient, decimals)

  recipientsText.value = recipients.value
    .map(r => `${r.address},${r.amount}`)
    .join('\n')
}

const applyUniformAmount = () => {
  recipients.value.forEach(r => {
    r.amount = uniformAmount.value
  })

  recipientsText.value = recipients.value
    .map(r => `${r.address},${r.amount}`)
    .join('\n')

  validateData()
  uniformAmount.value = ''
}

const applyMultiply = () => {
  recipients.value.forEach(r => {
    if (r.amount) {
      r.amount = (parseFloat(r.amount) * parseFloat(multiplyFactor.value)).toString()
    }
  })

  recipientsText.value = recipients.value
    .map(r => `${r.address},${r.amount}`)
    .join('\n')

  validateData()
  multiplyFactor.value = ''
}

const applyOffset = () => {
  recipients.value.forEach(r => {
    if (r.amount) {
      const newAmount = parseFloat(r.amount) + parseFloat(offsetAmount.value)
      r.amount = newAmount > 0 ? newAmount.toString() : '0'
    }
  })

  recipientsText.value = recipients.value
    .map(r => `${r.address},${r.amount}`)
    .join('\n')

  validateData()
  offsetAmount.value = ''
}

const applyRandomAmount = () => {
  const min = parseFloat(randomMin.value)
  const max = parseFloat(randomMax.value)
  const decimals = parseInt(randomDecimals.value) || 6

  recipients.value.forEach(r => {
    const randomAmount = (Math.random() * (max - min) + min).toFixed(decimals)
    r.amount = randomAmount
  })

  recipientsText.value = recipients.value
    .map(r => `${r.address},${r.amount}`)
    .join('\n')

  validateData()
  randomMin.value = ''
  randomMax.value = ''
  randomDecimals.value = '6'
}

const downloadTemplate = () => {
  downloadCSVTemplate()
}

const exportData = () => {
  exportToCSV(validRecipients.value, currentTokenSymbol.value)
}

const clearAll = () => {
  showClearDialog.value = true
}

const executeClear = () => {
  recipients.value = []
  recipientsText.value = ''
  validationSummary.value = null
  currentPage.value = 1
}

const formatAddress = (addr) => {
  if (!addr) return ''
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const connectWallet = () => {
  modal.open()
}

const disconnectWallet = () => {
  disconnect()
}

const approveToken = async () => {
  if (!tokenAddress.value || !address.value) return

  approving.value = true
  try {
    const decimals = tokenInfo.value?.decimals || 18
    const totalAmount = validRecipients.value.reduce((sum, r) => {
      return sum + parseUnits(r.amount.toString(), decimals)
    }, 0n)

    const { writeContractAsync } = useWriteContract()
    const hash = await writeContractAsync({
      address: tokenAddress.value,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [DISPERSE_ADDRESS, totalAmount]
    })

    const { waitForTransactionReceipt } = useWaitForTransactionReceipt()
    await waitForTransactionReceipt({ hash })

    needsApproval.value = false
    toast.success(t('multiSender.approvalSuccess'))
  } catch (error) {
    console.error('Approval error:', error)
    toast.error(t('multiSender.approvalFailed') + ': ' + (error.shortMessage || error.message))
  } finally {
    approving.value = false
  }
}

const confirmAndSend = () => {
  showConfirmDialog.value = true
}

const executeSend = async () => {
  sending.value = true
  try {
    const { writeContractAsync } = useWriteContract()
    const recipientAddresses = validRecipients.value.map(r => r.address)
    const decimals = tokenType.value === 'BNB' ? 18 : tokenInfo.value?.decimals || 18

    const amounts = validRecipients.value.map(r =>
      parseUnits(r.amount.toString(), decimals)
    )

    let hash

    if (tokenType.value === 'BNB') {
      const totalValue = amounts.reduce((a, b) => a + b, 0n)
      hash = await writeContractAsync({
        address: DISPERSE_ADDRESS,
        abi: DISPERSE_ABI,
        functionName: 'disperseEther',
        args: [recipientAddresses, amounts],
        value: totalValue
      })
    } else {
      hash = await writeContractAsync({
        address: DISPERSE_ADDRESS,
        abi: DISPERSE_ABI,
        functionName: 'disperseToken',
        args: [tokenAddress.value, recipientAddresses, amounts]
      })
    }

    const { waitForTransactionReceipt } = useWaitForTransactionReceipt()
    const receipt = await waitForTransactionReceipt({ hash })

    if (receipt.status === 'success') {
      toast.success(t('multiSender.sendSuccess'))
    } else {
      throw new Error('Transaction failed')
    }
  } catch (error) {
    console.error('Send error:', error)
    toast.error(t('multiSender.sendFailed') + ': ' + (error.shortMessage || error.message))
  } finally {
    sending.value = false
  }
}

// Watch token type change
watch(tokenType, (newType) => {
  tokenAddress.value = ''
  tokenInfo.value = null
  needsApproval.value = newType === 'ERC20'
})
</script>

<style scoped>
.page-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Wallet Connect Section */
.wallet-connect-section {
  padding: 20px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-primary);
}

.wallet-connect-section > div:first-child {
  text-align: center;
}

.connect-hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.connected-wallet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.wallet-icon {
  font-size: 18px;
}

.wallet-address {
  font-family: 'SF Mono', monospace;
  font-weight: 500;
  color: var(--text-primary);
}

/* Sections */
.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Token Type Selector */
.token-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.token-type-btn {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.token-type-btn:hover {
  border-color: var(--text-secondary);
}

.token-type-btn.active {
  border-color: var(--accent-primary);
  background: var(--bg-subtle);
}

/* Input Fields */
.input-with-button {
  display: flex;
  gap: 8px;
}

.text-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: 'SF Mono', monospace;
}

.text-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.text-input.small {
  flex: 1;
  padding: 8px 10px;
  font-size: 13px;
}

.token-info-box {
  margin-top: 12px;
  padding: 12px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.info-row .label {
  color: var(--text-secondary);
}

.info-row .value {
  font-weight: 500;
  color: var(--text-primary);
}

/* Recipients Textarea */
.recipients-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: 'SF Mono', monospace;
  resize: vertical;
  line-height: 1.6;
}

.recipients-textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.input-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.file-input-hidden {
  display: none;
}

/* Validation Summary */
.validation-summary {
  padding: 16px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
}

.summary-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  font-weight: 600;
  color: var(--text-primary);
}

.stat-item.success .stat-value {
  color: #10b981;
}

.stat-item.error .stat-value {
  color: #ef4444;
}

.stat-item.warning .stat-value {
  color: #f59e0b;
}

.validation-errors {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-primary);
}

.error-list {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.error-item {
  padding: 4px 0;
  font-family: 'SF Mono', monospace;
}

/* Batch Edit */
.batch-edit-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.batch-edit-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.batch-edit-row .text-input {
  flex: 1;
}

.batch-edit-row .secondary-button {
  min-width: 120px;
}

.random-row {
  display: flex;
  gap: 8px;
}

.random-row .text-input {
  flex: 1;
}

.decimals-input {
  max-width: 100px;
  flex: 0 0 100px !important;
}

/* Table */
.table-container {
  overflow-x: auto;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
}

.recipients-table {
  width: 100%;
  border-collapse: collapse;
}

.recipients-table th,
.recipients-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-primary);
  font-size: 13px;
}

.recipients-table th {
  background: var(--bg-subtle);
  font-weight: 600;
  color: var(--text-primary);
}

.recipients-table tr:last-child td {
  border-bottom: none;
}

.address-cell {
  font-family: 'SF Mono', monospace;
  font-size: 12px;
}

.address-mono {
  word-break: break-all;
}

.amount-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.actions-cell {
  text-align: center;
}

.icon-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

.icon-button:hover {
  opacity: 0.7;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.pagination-button {
  padding: 6px 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  cursor: pointer;
  font-size: 14px;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Send Section */
.send-section {
  padding-top: 24px;
  border-top: 2px solid var(--border-primary);
}

.send-summary {
  padding: 16px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.summary-row.total {
  border-top: 2px solid var(--border-primary);
  margin-top: 8px;
  padding-top: 12px;
  font-weight: 600;
  font-size: 16px;
}

.send-actions {
  margin-bottom: 12px;
}

.approval-notice {
  padding: 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
  font-size: 13px;
}

/* Info Card */
.info-card {
  display: flex;
  gap: 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.info-icon {
  font-size: 32px;
  line-height: 1;
}

.info-content h3 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #1e40af;
}

.info-content p {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-line;
}

/* Warning Card */
.warning-card {
  display: flex;
  gap: 16px;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.warning-icon {
  font-size: 32px;
  line-height: 1;
}

.warning-content h3 {
  font-size: 14px;
  margin-bottom: 8px;
}

.warning-content p {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-line;
}

/* Buttons */
.primary-button,
.secondary-button,
.danger-button,
.link-button {
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.primary-button {
  background: var(--accent-primary);
  color: white;
}

.primary-button:hover:not(:disabled) {
  background: var(--accent-secondary);
}

.primary-button.large {
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
}

.secondary-button {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.secondary-button:hover:not(:disabled) {
  border-color: var(--text-primary);
}

.secondary-button.small {
  padding: 8px 16px;
  font-size: 13px;
}

.danger-button {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.danger-button:hover:not(:disabled) {
  background: #fee2e2;
}

.link-button {
  background: none;
  color: var(--text-secondary);
  padding: 8px 12px;
  font-size: 13px;
}

.link-button:hover {
  color: var(--text-primary);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .token-type-selector {
    grid-template-columns: 1fr;
  }

  .batch-edit-row {
    flex-direction: column;
    align-items: stretch;
  }

  .batch-edit-row .secondary-button {
    width: 100%;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-buttons {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
