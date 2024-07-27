import ElementPlus, {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY
} from 'element-plus'
import 'prismjs'
import 'prismjs/components/prism-typescript'
import 'element-plus/dist/index.css'
import '@lib/styles/theme.scss'
import '../src/prism-tomorrow-night.css'

export { onCreateApp }

const onCreateApp = (pageContext) => {
  const { app } = pageContext
  app.provide(ID_INJECTION_KEY, {
    prefix: 1024,
    current: 0
  })
  app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
  app.use(ElementPlus)
}
