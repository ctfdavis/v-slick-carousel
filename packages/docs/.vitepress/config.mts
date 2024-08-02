import { defineConfig } from 'vitepress'
import examples from '../src/examples'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue 3 Slick Carousel',
  description: 'Documentation for Vue 3 Slick Carousel',
  base: '/vue-3-slick-carousel/',
  head: [['link', { rel: 'icon', href: '/vue-3-slick-carousel/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guide',
        link: '/guide/why-vue-3-slick-carousel',
        activeMatch: '/guide/'
      },
      {
        text: 'Examples',
        link: '/examples/one-slide-group-finite',
        activeMatch: '/examples/'
      }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Why Vue 3 Slick Carousel',
            link: '/guide/why-vue-3-slick-carousel'
          },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Basic Usage', link: '/guide/basic-usage' },
          { text: 'Concept', link: '/guide/concept' },
          { text: 'Settings', link: '/guide/settings' },
          { text: 'Styling', link: '/guide/styling' },
          { text: 'Advanced Usage', link: '/guide/advanced-usage' }
        ]
      },
      {
        text: 'Examples',
        items: Object.entries(examples)
          .sort(([_, v]) => v.order)
          .map(([k, v]) => ({
            text: v.name,
            link: `/examples/${k}`
          }))
      }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ctfdavis/vue-3-slick-carousel'
      }
    ],
    footer: {
      message:
        'Released under the <a href="https://github.com/ctfdavis/vue-3-slick-carousel/blob/main/LICENSE">MIT License</a>.',
      copyright:
        'Copyright © 2024-present <a href="https://github.com/ctfdavis">Davis Chan</a>'
    }
  }
})
