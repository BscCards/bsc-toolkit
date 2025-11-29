<template>
  <!-- Mobile Menu Button -->
  <button
    class="mobile-menu-button"
    @click="toggleMobile"
  >
    <svg
      v-if="!mobileOpen"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg
      v-else
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Sidebar -->
  <aside
    class="sidebar"
    :class="{ 'mobile-open': mobileOpen }"
  >
    <!-- Mobile Overlay -->
    <div
      v-if="mobileOpen"
      class="mobile-overlay"
      @click="toggleMobile"
    />

    <div class="sidebar-content">
      <!-- Logo and Title -->
      <div class="sidebar-header">
        <img
          src="/apple-touch-icon.png"
          alt="BSC Cards Tools"
          class="logo-icon"
        >
        <div class="logo-text">
          <h1 class="logo-title">
            BSC Cards
          </h1>
          <p class="logo-subtitle">
            Tools
          </p>
        </div>
      </div>

      <!-- Project Info -->
      <div class="project-info">
        <div class="project-badge">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span>{{ t('sidebar.projectTitle') }}</span>
        </div>
        <p class="project-desc">
          {{ t('sidebar.projectDesc') }}
        </p>
      </div>

      <!-- Tools Navigation -->
      <nav class="tools-nav">
        <h2 class="nav-section-title">
          Tools
        </h2>
        <RouterLink
          v-for="tool in tools"
          :key="tool.path"
          :to="tool.path"
          class="tool-link"
          @click="closeMobile"
        >
          <span class="tool-icon">{{ tool.icon }}</span>
          <span class="tool-name">{{ tool.name }}</span>
        </RouterLink>
      </nav>

      <!-- GitHub Section -->
      <div class="github-section">
        <h2 class="nav-section-title">
          {{ t('sidebar.openSource') }}
        </h2>
        <a
          href="https://github.com/BscCards/bsc-toolkit"
          class="github-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span>{{ t('sidebar.viewOnGitHub') }}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z" />
          </svg>
        </a>
      </div>

      <!-- Footer Section -->
      <div class="sidebar-footer">
        <LanguageSwitcher />
        <a
          href="https://bsc.cards"
          class="main-site-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M7.5 9L4.5 6L7.5 3" />
          </svg>
          <span>{{ t('sidebar.mainSite') }}</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { useI18n } from '../i18n'

const { t } = useI18n()
const mobileOpen = ref(false)

const tools = computed(() => [
  {
    path: '/batch-wallet',
    name: t('nav.batchWallet'),
    icon: '📦'
  },
  {
    path: '/vanity-wallet',
    name: t('nav.vanityWallet'),
    icon: '✨'
  },
  {
    path: '/contract-vanity',
    name: t('nav.contractVanity'),
    icon: '🏭'
  },
  {
    path: '/qrcode',
    name: t('nav.qrCode'),
    icon: '📱'
  },
  {
    path: '/multi-sender',
    name: t('nav.multiSender'),
    icon: '📤'
  }
])

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}

const closeMobile = () => {
  mobileOpen.value = false
}
</script>

<style scoped>
/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  width: 44px;
  height: 44px;
  padding: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.mobile-menu-button:hover {
  border-color: var(--text-primary);
}

.mobile-menu-button:active {
  transform: scale(0.95);
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
}

/* Sidebar */
.sidebar {
  width: 260px;
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  z-index: 100;
  flex-shrink: 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 16px;
}

/* Header - Vercel Style */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  margin-bottom: 32px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.logo-subtitle {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.3;
}

/* Project Info - Vercel Style */
.project-info {
  padding: 12px;
  margin-bottom: 24px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
}

.project-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
}

.project-badge svg {
  flex-shrink: 0;
}

.project-desc {
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
}

/* Tools Navigation - Vercel Style */
.tools-nav {
  flex: 1;
  margin-bottom: 24px;
}

.nav-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 12px;
}

.tool-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin-bottom: 2px;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  font-size: 14px;
  font-weight: 500;
}

.tool-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.tool-link.router-link-active {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-weight: 600;
}

.tool-icon {
  font-size: 18px;
  line-height: 1;
}

.tool-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* GitHub Section - Vercel Style */
.github-section {
  margin-bottom: 20px;
  padding: 16px 12px 16px 12px;
  border-top: 1px solid var(--border-primary);
}

.github-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.github-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--text-primary);
}

.github-link svg:first-child {
  flex-shrink: 0;
}

.github-link svg:last-child {
  flex-shrink: 0;
  margin-left: auto;
  opacity: 0.5;
}

.github-link:hover svg:last-child {
  opacity: 1;
  transform: translateX(2px);
}

/* Footer - Vercel Style */
.sidebar-footer {
  padding-top: 16px;
  border-top: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.main-site-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}

.main-site-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--text-primary);
}

.main-site-link svg {
  flex-shrink: 0;
}

/* Scrollbar styling - Vercel Style */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--border-primary);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .mobile-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-content {
    padding: 20px 16px;
  }

  .sidebar-header {
    margin-bottom: 24px;
  }
}

@media (max-width: 900px) and (min-width: 769px) {
  .sidebar {
    width: 240px;
  }

  .sidebar-content {
    padding: 20px 14px;
  }

  .tool-link {
    font-size: 13px;
    padding: 7px 10px;
  }
}
</style>
