import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import AutolangRedirect from './AutolangRedirect.vue'
import MermaidDiagram from './MermaidDiagram.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MermaidDiagram', MermaidDiagram)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(AutolangRedirect),
    })
  },
} satisfies Theme
