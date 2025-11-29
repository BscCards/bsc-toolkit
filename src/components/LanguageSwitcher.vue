<template>
  <div class="lang-switcher">
    <button
      :class="['lang-btn', { active: currentLocale === 'en' }]"
      @click="switchLang('en')"
    >
      EN
    </button>
    <button
      :class="['lang-btn', { active: currentLocale === 'zh' }]"
      @click="switchLang('zh')"
    >
      中文
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n'

const { setLocale, locale } = useI18n()

const currentLocale = computed(() => locale.value || 'en')

function switchLang(lang) {
  setLocale(lang)
}
</script>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 4px;
  padding: 2px;
  background: var(--bg-subtle);
  border-radius: 6px;
}

.lang-btn {
  flex: 1;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 50px;
}

.lang-btn:hover {
  color: var(--text-primary);
}

.lang-btn.active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 600;
}
</style>
