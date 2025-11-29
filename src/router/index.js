import { createRouter, createWebHistory } from 'vue-router'

const BatchWalletGenerator = () => import('../views/BatchWalletGenerator.vue')
const VanityWalletGenerator = () => import('../views/VanityWalletGenerator.vue')
const ContractVanityGenerator = () => import('../views/ContractVanityGenerator.vue')
const QRCodeGenerator = () => import('../views/QRCodeGenerator.vue')
const MultiSender = () => import('../views/MultiSender.vue')

const routes = [
  {
    path: '/',
    redirect: '/batch-wallet'
  },
  {
    path: '/batch-wallet',
    name: 'BatchWalletGenerator',
    component: BatchWalletGenerator
  },
  {
    path: '/vanity-wallet',
    name: 'VanityWalletGenerator',
    component: VanityWalletGenerator
  },
  {
    path: '/contract-vanity',
    name: 'ContractVanityGenerator',
    component: ContractVanityGenerator
  },
  {
    path: '/qrcode',
    name: 'QRCodeGenerator',
    component: QRCodeGenerator
  },
  {
    path: '/multi-sender',
    name: 'MultiSender',
    component: MultiSender
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
