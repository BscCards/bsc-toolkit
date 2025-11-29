<template>
  <a
    :href="githubUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="github-star-button"
  >
    <svg
      class="github-icon"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
    <span class="star-text">Star</span>
    <span
      v-if="stars !== null"
      class="star-count"
    >{{ formatStars }}</span>
  </a>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  repo: {
    type: String,
    required: true
  }
})

const stars = ref(null)

const githubUrl = computed(() => `https://github.com/${props.repo}`)

const formatStars = computed(() => {
  if (stars.value === null) return ''
  if (stars.value >= 1000) {
    return (stars.value / 1000).toFixed(1) + 'k'
  }
  return stars.value.toString()
})

onMounted(async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${props.repo}`)
    if (response.ok) {
      const data = await response.json()
      stars.value = data.stargazers_count
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error)
  }
})
</script>

<style scoped>
.github-star-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.github-star-button:hover {
  border-color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.github-icon {
  width: 14px;
  height: 14px;
}

.star-text {
  font-weight: 500;
}

.star-count {
  padding: 2px 6px;
  background: var(--bg-subtle);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
