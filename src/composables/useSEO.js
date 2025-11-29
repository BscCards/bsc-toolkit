import { useHead } from '@vueuse/head'
import { computed } from 'vue'

export const SEO_CONFIG = {
  baseTitle: 'BSC Cards Tools',
  titleSeparator: ' | ',
  defaultDescription: 'Professional blockchain utilities for BNB Chain. Free and open source tools for wallet generation, vanity addresses, and more.',
  defaultKeywords: 'BSC tools, BNB Chain tools, wallet generator, vanity address, blockchain tools, QR code generator, BSC utilities',
  siteName: 'BSC Cards Tools',
  siteUrl: typeof window !== 'undefined' ? window.location.origin : '',
  twitterHandle: '@BNBChain',
  ogImage: '/og-image.png',

  pages: {
    home: {
      title: '',
      description: 'Professional blockchain utilities for BNB Chain. Batch wallet generator, vanity address generator, contract vanity generator, and QR code generator - all free and open source.',
      keywords: 'BSC tools, BNB Chain tools, wallet generator, vanity address, blockchain tools, QR code generator, BSC utilities'
    },
    batchWallet: {
      title: 'Batch Wallet Generator',
      description: 'Generate multiple BNB Chain wallet addresses at once. Free, secure, and client-side wallet creation tool for testing and development.',
      keywords: 'batch wallet generator, BSC Cards, BNB Chain wallet, BSC address generator, crypto wallet tool'
    },
    vanityWallet: {
      title: 'Vanity Address Generator',
      description: 'Create custom BNB Chain vanity addresses with your preferred prefix or suffix. Fast and secure address generation tool.',
      keywords: 'vanity address, custom wallet address, BSC Cards, BNB Chain tools, BSC vanity generator'
    },
    contractVanity: {
      title: 'Contract Vanity Address Generator',
      description: 'Generate custom contract addresses for BNB Chain. Find the perfect vanity address for your smart contract deployment.',
      keywords: 'contract address, vanity contract, smart contract tools, BSC Cards, BNB Chain development'
    },
    qrcode: {
      title: 'QR Code Generator',
      description: 'Create QR codes for BNB Chain addresses, links, and text. Free tool with customizable size and error correction.',
      keywords: 'QR code generator, wallet QR code, BSC Cards, BNB Chain QR, crypto QR code'
    }
  }
}

export function useSEO(options = {}) {
  const {
    title = '',
    description = SEO_CONFIG.defaultDescription,
    keywords = SEO_CONFIG.defaultKeywords,
    ogImage = SEO_CONFIG.ogImage,
    ogType = 'website'
  } = options

  const fullTitle = computed(() => {
    return title ? `${title}${SEO_CONFIG.titleSeparator}${SEO_CONFIG.baseTitle}` : SEO_CONFIG.baseTitle
  })

  const currentUrl = computed(() => {
    return typeof window !== 'undefined' ? window.location.href : SEO_CONFIG.siteUrl
  })

  useHead({
    title: fullTitle,
    meta: [
      {
        name: 'description',
        content: description
      },
      {
        name: 'keywords',
        content: keywords
      },
      {
        name: 'author',
        content: SEO_CONFIG.siteName
      },
      {
        property: 'og:title',
        content: fullTitle
      },
      {
        property: 'og:description',
        content: description
      },
      {
        property: 'og:type',
        content: ogType
      },
      {
        property: 'og:url',
        content: currentUrl
      },
      {
        property: 'og:image',
        content: ogImage
      },
      {
        property: 'og:site_name',
        content: SEO_CONFIG.siteName
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:site',
        content: SEO_CONFIG.twitterHandle
      },
      {
        name: 'twitter:title',
        content: fullTitle
      },
      {
        name: 'twitter:description',
        content: description
      },
      {
        name: 'twitter:image',
        content: ogImage
      },
      {
        name: 'theme-color',
        content: '#f0b90b'
      },
      {
        name: 'application-name',
        content: SEO_CONFIG.siteName
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: currentUrl
      }
    ]
  })
}

export function getPageSEO(pageName) {
  return SEO_CONFIG.pages[pageName] || {
    title: SEO_CONFIG.baseTitle,
    description: SEO_CONFIG.defaultDescription,
    keywords: SEO_CONFIG.defaultKeywords
  }
}
