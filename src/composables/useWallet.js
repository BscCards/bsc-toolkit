import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc, bscTestnet } from '@reown/appkit/networks'

// Get free Project ID from https://cloud.reown.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// Supported networks
const networks = [bsc, bscTestnet]

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// Project metadata
const metadata = {
  name: 'BSC Cards Tools',
  description: 'Free blockchain utilities for BNB Chain',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://tools.bsc.cards',
  icons: ['https://tools.bsc.cards/apple-touch-icon.png']
}

// Create AppKit instance
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#000000',
    '--w3m-border-radius-master': '8px',
    '--w3m-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  features: {
    analytics: false,
    onramp: false,
    swaps: false,
    email: false,
    socials: false
  },
  allowUnsupportedChain: false
})
