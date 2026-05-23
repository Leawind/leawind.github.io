<script setup lang="ts">
import { onMounted } from 'vue'
import { getRedirectLocale, pathHasLocale } from '../shared/redirect.ts'

onMounted(() => {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  if (!params.has('autolang')) return

  const path = window.location.pathname
  const browserLocale = getRedirectLocale()

  params.delete('autolang')
  const qs = params.toString()
  const qsPart = qs ? '?' + qs : ''

  if (!pathHasLocale(path)) {
    // No locale in path — prepend browser locale.
    const newPath = '/' + browserLocale + (path === '/' ? '/' : path)
    window.location.replace(newPath + qsPart)
    return
  }

  const currentLocale = path.split('/')[1]

  if (browserLocale !== currentLocale) {
    // Replace the first segment (the current locale) safely.
    const rest = path.slice(currentLocale.length + 1) // +1 for the leading '/'
    const newPath = '/' + browserLocale + rest
    window.location.replace(newPath + qsPart)
  } else {
    // Already on the correct locale — just clean the URL.
    window.history.replaceState(null, '', path + qsPart)
  }
})
</script>

<template>
  <div style="display: none" />
</template>
