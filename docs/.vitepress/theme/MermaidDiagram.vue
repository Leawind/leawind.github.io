<script setup lang="ts">
import type { MermaidConfig } from 'mermaid'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  graph: string
  id: string
}>()

const svg = ref('')
let observer: MutationObserver | undefined
let renderVersion = 0

async function render(): Promise<void> {
  const version = ++renderVersion
  const mermaid = (await import('mermaid')).default
  const config: MermaidConfig = {
    securityLevel: 'loose',
    startOnLoad: false,
    theme: document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'default',
  }
  mermaid.initialize(config)
  const result = await mermaid.render(props.id, decodeURIComponent(props.graph))
  if (version === renderVersion) {
    svg.value = result.svg
  }
}

onMounted(async () => {
  observer = new MutationObserver(() => void render())
  observer.observe(document.documentElement, {
    attributeFilter: ['class'],
    attributes: true,
  })
  await render()
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="mermaid" v-html="svg" />
</template>
