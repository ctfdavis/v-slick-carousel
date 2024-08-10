import { defineConfig } from 'vitepress'
import examples from '../src/examples'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'V Slick Carousel',
  description: 'Documentation for V Slick Carousel',
  base: '/v-slick-carousel/',
  head: [['link', { rel: 'icon', href: '/v-slick-carousel/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guide',
        link: '/guide/why-v-slick-carousel',
        activeMatch: '/guide/'
      },
      {
        text: 'Examples',
        link: '/examples/one-slide-group-finite',
        activeMatch: '/examples/'
      },
      {
        text: 'Playground',
        link: 'https://stackblitz.com/fork/github/ctfdavis/v-slick-carousel/tree/main/packages/v-slick-carousel?file=src/app.vue'
      }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Why V Slick Carousel',
            link: '/guide/why-v-slick-carousel'
          },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Basic Usage', link: '/guide/basic-usage' },
          { text: 'Concept', link: '/guide/concept' },
          { text: 'Settings', link: '/guide/settings' },
          { text: 'Styling', link: '/guide/styling' },
          { text: 'Advanced Usage', link: '/guide/advanced-usage' },
          { text: 'FAQ', link: '/guide/faq' }
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
        link: 'https://github.com/ctfdavis/v-slick-carousel'
      }
    ],
    footer: {
      message:
        'Released under the <a href="https://github.com/ctfdavis/v-slick-carousel/blob/main/LICENSE">MIT License</a>.',
      copyright:
        'Copyright © 2024-present <a href="https://github.com/ctfdavis">Davis Chan</a>'
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    editLink: {
      pattern:
        'https://github.com/ctfdavis/v-slick-carousel/edit/main/packages/docs/:path',
      text: 'Edit this page on GitHub'
    },
    search: {
      provider: 'local'
    }
  }
})
