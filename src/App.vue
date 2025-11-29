<template>
  <div id="app">
    <Sidebar />
    <main class="main-content">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Toast from './components/Toast.vue'
import { RouterView } from 'vue-router'
</script>

<style>
:root {
  /* Background Colors - Vercel Style */
  --bg-primary: #fafafa;
  --bg-secondary: #ffffff;

  /* Card Colors */
  --card-bg: #ffffff;
  --card-bg-hover: #fafafa;

  /* Border Colors - Vercel uses subtle borders */
  --border-primary: #eaeaea;
  --border-secondary: #f5f5f5;
  --border-hover: #000000;

  /* Accent Colors - Black & White Theme */
  --accent-primary: #000000;
  --accent-secondary: #666666;
  --accent-hover: #0070f3;

  /* Text Colors */
  --text-primary: #000000;
  --text-secondary: #666666;
  --text-tertiary: #999999;

  /* Subtle Backgrounds */
  --bg-subtle: #f5f5f5;
  --bg-hover: #fafafa;

  /* Shadows - Vercel style subtle shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.12);

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-primary);
  color: var(--text-primary);
}

#app {
  min-height: 100vh;
}

.main-content {
  margin-left: 260px;
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 32px 24px;
  overflow-y: auto;
}

.main-content > * {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .main-content {
    margin-left: 240px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 72px 16px 24px 16px;
  }
}

button {
  font-family: inherit;
}

input, textarea {
  font-family: inherit;
}

/* Page Layout Styles */
.page-container {
  width: 100%;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-header .subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Tool Card - Flat Design */
.tool-card {
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
}

.tool-card-header {
  margin-bottom: 20px;
}

.tool-card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.tool-card-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}
</style>
